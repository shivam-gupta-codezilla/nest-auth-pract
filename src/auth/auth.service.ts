import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { usersService } from 'src/users/users.service';
import { signupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: usersService,
    private readonly jwtService: JwtService
  ) { }

  async signUp(signupDto: signupDto) {
    const existingUser = await this.usersService.findByEmail(signupDto.email)

    if (existingUser) {
      throw new BadRequestException("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(
      signupDto.password,
      10
    );

    return this.usersService.createUser({
      ...signupDto,
      password: hashedPassword
    })
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email)

    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const password = await bcrypt.compare(
      loginDto.password,
      user.password
    )

    if (!password) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const payload = {
      sub: user.id,
      email: user.email,
    }

    const accessToken = this.jwtService.sign(payload)

    return {
      access_token: accessToken,
    }
  }
}

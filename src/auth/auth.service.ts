import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { usersService } from 'src/users/users.service';
import { signupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: usersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(signupDto: signupDto) {
    const existingUser = await this.usersService.findByEmail(signupDto.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    return this.usersService.createUser({
      ...signupDto,
      password: hashedPassword,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const password = await bcrypt.compare(loginDto.password, user.password);

    if (!password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    // const accessToken = this.jwtService.sign(payload);

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: '1m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '15m',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      }) as { sub: number; email: string };

      const accessToken = this.jwtService.sign(
        {
          sub: payload.sub,
          email: payload.email,
        },
        {
          secret: this.configService.getOrThrow('JWT_SECRET'),
          expiresIn: '5m',
        },
      );

      return {
        access_token: accessToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

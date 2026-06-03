import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { usersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JWTAuthGuard)
export class userController {
  constructor(private readonly userservice: usersService) {}

  @Get('profile')
  // @UseGuards(JWTAuthGuard)
  getProfile(@Req() req: { user: { id: number; email: string } }) {
    return req.user;
  }

  @Get()
  getUsers() {
    return this.userservice.getUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userservice.getUserById(id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userservice.createUser(createUserDto);
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { usersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class userController {
  constructor(private readonly userservice: usersService) {}

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

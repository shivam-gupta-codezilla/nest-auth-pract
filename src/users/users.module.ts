import { Module } from '@nestjs/common';
import { userController } from './users.controller';
import { usersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [userController],
  providers: [usersService],
  exports: [usersService],
})
export class UserModule {}

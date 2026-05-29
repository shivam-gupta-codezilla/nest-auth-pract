import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, JwtModule.register({
    secret: "my-secret-key",
    signOptions: {
      expiresIn: "1d"
    }
  })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }

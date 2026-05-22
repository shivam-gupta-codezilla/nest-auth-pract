import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signUp() {
    return {
      message: 'User Registered Sucessfully',
    };
  }
  login() {
    return {
      message: 'User Login Successfully',
    };
  }
}

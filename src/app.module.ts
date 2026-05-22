import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'nestuser',
      password: 'Password@123',
      database: 'nest_learning',

      autoLoadEntities: true,
      synchronize: true,
    }),

    UserModule,
    AuthModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import {JwtModule} from "@nestjs/jwt"
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret:"RenderNUptimeRobot2025",
      signOptions:{expiresIn:'7d'}
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService,TypeOrmModule]
})
export class UserModule {}

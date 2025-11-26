import { Module } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { ApiKeysController } from './api-keys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from './apiKey.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';
@Module({
  imports:[
    TypeOrmModule.forFeature([ApiKey,User]),
    UserModule
  ],
  controllers: [ApiKeysController],
  providers: [ApiKeysService],
  exports:[TypeOrmModule,ApiKeysService]
})
export class ApiKeysModule {}

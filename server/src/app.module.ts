import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { MonitorModule } from './monitor/monitor.module';
import { ConfigModule } from '@nestjs/config';
// import { RenderModule } from './render/render.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { User } from './user/user.entity';
import { ApiKey } from './api-keys/apiKey.entity';
@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal:true,
    envFilePath:'.env'
  }),
  
TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',      // DB host
      port: 5432,
      username: 'postgres',   // Your username
      password: 'T@nM@yJoShI73', // Your password
      database: 'postgres',       // Your database name
      entities: [User, ApiKey],
      autoLoadEntities: true, // Automatically loads entities registered through TypeOrmModule.forFeature()
      synchronize: true,
}),
  // Defining the Database

  
  AuthModule,
  UserModule,
  ApiKeysModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

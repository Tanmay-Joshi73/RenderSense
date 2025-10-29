import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonitorModule } from './monitor/monitor.module';
import { ConfigModule } from '@nestjs/config';
import { RenderModule } from './render/render.module';
@Module({
  imports: [MonitorModule,
  ConfigModule.forRoot({
    isGlobal:true,
    envFilePath:'.env'
  }),
  RenderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

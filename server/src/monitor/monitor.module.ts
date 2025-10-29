import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { RenderModule } from 'src/render/render.module';
@Module({
  imports:[RenderModule],
  controllers: [MonitorController],
  providers: [MonitorService],
})
export class MonitorModule {}

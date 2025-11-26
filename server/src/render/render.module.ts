import { Module } from '@nestjs/common';
import { RenderService } from './render.service';
import { RenderController } from './render.controller';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';
@Module({
  imports:[ApiKeysModule],
  controllers: [RenderController],
  providers: [RenderService],
})
export class RenderModule {}

import { Module } from '@nestjs/common';
import { RenderService } from './render.service';
import { RenderResolver } from './render.resolver';

@Module({
  providers: [RenderResolver, RenderService],
})
export class RenderModule {}

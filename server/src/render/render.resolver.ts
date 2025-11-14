import { Resolver } from '@nestjs/graphql';
import { RenderService } from './render.service';

@Resolver()
export class RenderResolver {
  constructor(private readonly renderService: RenderService) {}
}

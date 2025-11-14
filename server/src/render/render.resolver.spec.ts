import { Test, TestingModule } from '@nestjs/testing';
import { RenderResolver } from './render.resolver';
import { RenderService } from './render.service';

describe('RenderResolver', () => {
  let resolver: RenderResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RenderResolver, RenderService],
    }).compile();

    resolver = module.get<RenderResolver>(RenderResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

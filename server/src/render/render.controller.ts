import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RenderService } from './render.service';
// import { CreateRenderDto } from './dto/create-render.dto';
// import { UpdateRenderDto } from './dto/update-render.dto';
import { log } from 'console';

@Controller('render')
export class RenderController {
  constructor(private readonly renderService: RenderService) {}
   @Get('/Check')
  checkStatus():any{
   console.log('ehy this route got hitted');
   
    return this.renderService.ListAll()
  }
  @Get('/Deploy')
  ListDeploy():any{
    return this.renderService.ListDeployment();
  }
  @Get('/ListEnv')
  ListEnvGroup():any{
    return this.renderService.getEnvGroups();
  }
  @Get("/ListMertices")
  ListMetrices():any{
    return this.renderService.getMetrics()
  }
}

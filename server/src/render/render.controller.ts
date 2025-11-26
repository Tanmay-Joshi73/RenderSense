import { Controller,Get } from '@nestjs/common';
import { RenderService } from './render.service';
import axios from 'axios'
import { Query } from '@nestjs/common';
import { Body } from '@nestjs/common';
@Controller('render')
export class RenderController {
  constructor(private readonly renderService: RenderService) {
    
  }
  @Get()
  async CheckKey(@Body() Data:{
    key:string
  }):Promise<void>{
    // this.renderService.validateApiKey(Data.key)
  }

  
}

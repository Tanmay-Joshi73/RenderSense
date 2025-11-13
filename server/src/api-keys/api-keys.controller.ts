import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { RenderKey } from 'src/DTO/RenderKey.dto';
@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}
    @Post('/set')
    SetKey(@Body() RenderData:RenderKey):void{
    const {apiKey,email}=RenderData
     const Response=this.apiKeysService.InsertKey(apiKey,email)
  }
  @Get()
  random():any{
    return "Random stuff"
  }

}

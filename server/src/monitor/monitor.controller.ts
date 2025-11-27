import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MonitorService } from './monitor.service';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Post('create')
  async create(@Body() body: { name: string; url: string; interval: number }) {
    console.log('this route is just working fine')
    console.log(body)
    
    return this.monitorService.createMonitor(body.name, body.url, body.interval);
  }

  @Post('delete')
  async delete(@Body() body: { id: string }) {
    return this.monitorService.deleteMonitor(body.id);
  }

  @Get()
  async list() {
    const monitors = await this.monitorService.getMonitors();
    return { Status: true, Monitors: monitors };
  }

  @Get(':id')
  async details(@Param('id') id: string) {
    const monitor = await this.monitorService.getMonitorDetails(id);
    return { Status: true, Monitor: monitor };
  }

  @Post('pause')
  async pause(@Body() body: { id: string }) {
    return this.monitorService.pauseMonitor(body.id);
  }

  @Post('restart')
  async restart(@Body() body: { id: string }) {
    return this.monitorService.restartMonitor(body.id);
  }
}

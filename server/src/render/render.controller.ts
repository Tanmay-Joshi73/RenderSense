import { Body, Controller, Post } from '@nestjs/common';
import { RenderService } from './render.service';

@Controller('render')
export class RenderController {
  constructor(private readonly render: RenderService) {}

  @Post('list')
  async list(@Body('key') key: string) {
    if (!key) return { Status: false, Message: 'API key required' };
    return this.render.listServices(key);
  }

  @Post('suspend')
  async suspend(@Body() body: { key: string; serviceId: string }) {
    if (!body?.key || !body?.serviceId) return { Status: false, Message: 'key & serviceId required' };
    return this.render.suspendService(body.key, body.serviceId);
  }

  @Post('resume')
  async resume(@Body() body: { key: string; serviceId: string }) {
    if (!body?.key || !body?.serviceId) return { Status: false, Message: 'key & serviceId required' };
    return this.render.resumeService(body.key, body.serviceId);
  }

  @Post('restart')
  async restart(@Body() body: { key: string; serviceId: string }) {
   
    
    if (!body?.key || !body?.serviceId) return { Status: false, Message: 'key & serviceId required' };
    return this.render.restartService(body.key, body.serviceId);
  }

  @Post('deploy')
  async deploy(@Body() body: { key: string; serviceId: string; commit?: string; skip?: boolean }) {
    if (!body?.key || !body?.serviceId) return { Status: false, Message: 'key & serviceId required' };
    return this.render.createDeploy(body.key, body.serviceId, { commit: body.commit, skip: body.skip });
  }

  @Post('logs')
  async logs(@Body() body: { key: string; serviceId?: string; startTime?: string; endTime?: string; limit?: number; query?: string }) {
    if (!body?.key) return { Status: false, Message: 'API key required' };
    return this.render.getLogs(body.key, { serviceId: body.serviceId, startTime: body.startTime, endTime: body.endTime, limit: body.limit, query: body.query });
  }

  @Post('metrics')
  async metrics(@Body() body: { key: string; metric: 'cpu' | 'memory'; resourceIds?: string | string[]; startTime?: string; endTime?: string; step?: string }) {
    if (!body?.key) return { Status: false, Message: 'API key required' };
    if (!body?.metric) return { Status: false, Message: 'metric required (cpu|memory)' };
    return this.render.getMetrics(body.key, body.metric, { resourceIds: body.resourceIds, startTime: body.startTime, endTime: body.endTime, step: body.step });
  }
}

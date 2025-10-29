import { Controller ,Get,Post} from '@nestjs/common';
import { MonitorService } from './monitor.service';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  
  @Get()

  //This will return the Total no of Monitors assign to the projects;
  async GetMonitor():Promise<any>{
   const result=await this.monitorService.ListMonitor()
   return result;
    
  }
  @Post()
  AddMonitor():any{
    const url='sample'
    const name='sampelName'
    this.monitorService.AddInstance(url,name);
  }
}

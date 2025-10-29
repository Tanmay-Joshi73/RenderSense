import { Injectable } from '@nestjs/common';
// import { Injectable } from '@nestjs/common';
// import { CreateUptimeDto } from './dto/create-uptime.dto';
// import { UpdateUptimeDto } from './dto/update-uptime.dto';
import { RenderService } from 'src/render/render.service';
import qs from 'qs'
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { log } from 'node:console';
@Injectable()
export class MonitorService{
 private readonly baseUrl:string;
  private readonly key:string;
  constructor(private readonly Env:ConfigService,
              private readonly RS:RenderService
  ){
    this.key=this.Env.get<string>('Robot_Key')!
    this.baseUrl=this.Env.get<string>('Monitor_EndPoint')!
  }
 async ListMonitor():Promise<any>{
  // console.log(this.baseUrl)
  const response = await axios.post(
  `${this.baseUrl}/getMonitors`,
  qs.stringify({
    api_key: this.key,
    format: 'json',
    logs: 1,
  }),
  {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
  }
);
// console.log(response)
  return response.data.monitors;
 }

async AddInstance(url: string, name: string) {
  try {
    console.log('this route get hitted');
    const Active=await this.RS.Active();
    let urlLink:string='';
    Active.map((item:any)=>{
      if(item.service.serviceDetails.url==='https://deployment-omhv.onrender.com') {
        urlLink=item.service.serviceDetails.url
      }
    })
    url=urlLink;
   


///// first try to fetch all the details of the Render Service that are avaliable currently


    const response = await axios.post(
      `${this.baseUrl}/newMonitor`,
      qs.stringify({
        api_key: this.key,
        format: 'json',
        type: 1, // 1 = HTTP(s)
        url,
        friendly_name: name,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
        },
      }
    );

    console.log('Monitor Created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating monitor:', error.response?.data || error.message);
    throw error;
  }

}
}

import { Injectable } from '@nestjs/common';
// import { CreateRenderDto } from './dto/create-render.dto';
// import { UpdateRenderDto } from './dto/update-render.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { log } from 'node:console';

const InActive:Array<Object>=[]
const Active:Array<Object>=[]
@Injectable()
export class RenderService {
  private readonly  baseurl:string;
  private readonly  key:string;
  constructor(private readonly Env:ConfigService){
    this.baseurl=this.Env.get<string>('Render_EndPoint')!
    this.key=this.Env.get<string>('Render_Key')!
  }

  async ListAll(): Promise<any> {
  
    
    const response = await axios.get(`${this.baseurl}/services`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.key}`
      }
    });
    const Result=response.data;
    Result.map((item:any)=>{
      
      if(item.service.suspended==='not_suspended'){
        Active.push(item);
      }
      else{
        console.log(`${item.service.name} is suspended`);
        InActive.push(item)
      }
    })
    return response.data
  }

  
  async ListDeployment():Promise<any>{
   try {

      
      const response = await axios.get(`${this.baseurl}/services/`, {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${this.key}`,
        },
      });
      
      
      
      
      return response.data; // array of all your services
    } catch (error) {
      console.error('Error fetching services:', error.response?.data || error.message);
      throw error;
    }
  }
  
  async  getEnvGroups():Promise<any> {
  const url = `${this.baseurl}/env-groups?limit=20`;

  try {
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${this.key}`,
      },
    });

    console.log('Environment Groups:');
    console.log(response.data); // Array of environment groups
  } catch (error) {
    console.error('Error fetching environment groups:', error.response?.data || error.message);
  }
}

///this will return the Currenly Active Render Service
async Active():Promise<Array<Object>>{
  console.log("This active function perfectly works");
  
  const ActiveNow:Array<Object>=[];

  const response = await axios.get(`${this.baseurl}/services`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.key}`
      }
    });
 
  
  
    const Result=response.data;
     Result.map((item:any)=>{
      
      if(item.service.suspended==='not_suspended'){
     
        
        Active.push(item);

      }
      else{
        console.log(`${item.service.name} is suspended`);
        InActive.push(item)
      }
    })
   
    Result.map((item:any)=>{
      
      if(item.service.suspended==='not_suspended'){
        ActiveNow.push(item);
      }
     
    })
    return ActiveNow;

}

//This will return the matrices of the avalible services //this required the paid plan
async  getMetrics():Promise<any> {
  try {
    const response = await axios.get(
      'https://api.render.com/v1/metrics-stream/tea-csprora3esus739p0qu0',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer rnd_c0V4bGW8YXk3GtxfqTyBfc1QPOKN',
        },
      }
    );

    console.log('Metrics Data:', response.data);
  } catch (error) {
    console.error('Error fetching metrics:', error.response?.data || error.message);
  }
}

}

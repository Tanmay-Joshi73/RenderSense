import { Injectable } from '@nestjs/common';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { ApiKey } from './apiKey.entity';
import { User } from '../user/user.entity';
import { log } from 'console';
import { validate } from 'graphql';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ApiKeysService {
  constructor(private readonly user:UserService,private readonly Config:ConfigService,
     @InjectRepository(User)
        private userRepository: Repository<User>,
    @InjectRepository(ApiKey) private apiKeyRepo:Repository<ApiKey>
  ){}


  async validateKey(key:string):Promise<any>{
     try {
      const key=this.Config.get<string>('Render_Key')
      const response = await axios.get(
        'https://api.render.com/v1/services',
        {
          headers: {
            Authorization: `Bearer ${key}`,
          },
        }
      );
      // If API key is correct, we get 200 success
      if(response.status === 200) return true
    } catch (error) {
      // If API key is wrong → 401 Unauthorized
      console.log(error)
      if (error.response && error.response.status === 401) {
        return false;
      }

      // Other errors → rethrow
     
    }

  }
  

    /// This will insert the Render api key into the Db with Relations
  async InsertKey(Key:string,Email:string):Promise<any>{
    try{
       // 1️⃣ Find the user
    const CorrectKey=await this.validateKey(Key);
    if(!CorrectKey){
      return {Status:false,
              Message:"Invalid key"
      }
    }
    const existingUser = await this.userRepository.findOne({
    where: { Email: Email },
    relations: ["ApiKey"],  // Important: load the user's existing key
  });
  console.log(`Exising user is found`,existingUser)
  console.log(Key);
  
  // return;
  if (!existingUser) {
    throw new Error("User not found");
  }

  // 2️⃣ If the user already has an API key → update it
  if (existingUser.ApiKey) {
    console.log('Key is present',existingUser.ApiKey)
    existingUser.ApiKey.Key = Key;
    existingUser.ApiKey.UpdatedAt = new Date();

    const apiKey=await this.apiKeyRepo.save(existingUser.ApiKey);
     return{
          Status:"Suceess",
          Message:"Api key set",
          Success:true
        }
  }

  // 3️⃣ If no API key exists → create a new one
  const newKey = this.apiKeyRepo.create({
    Name: "RenderKey",
    Key: Key,
    User: existingUser,   // the whole object
  });
      
      
  const newuser= await this.apiKeyRepo.save(newKey); // This will save the user
          return{
          Status:"Suceess",
          Message:"Api key set",
          Success:true
        }
      
    }
    catch(err){
      console.log(err)
    }
      return{
          Status:"Failed",
          Message:"err",
          Success:false
        }
 
 }


 async DeleteAllkeys():Promise<string>{ 
 await this.apiKeyRepo.deleteAll();
  return "All Render api keys are deleted"
 }
}

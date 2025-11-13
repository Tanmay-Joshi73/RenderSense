import { Injectable } from '@nestjs/common';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { ApiKey } from './apiKey.entity';
import { User } from 'src/user/user.entity';
@Injectable()
export class ApiKeysService {
  constructor(private readonly user:UserService,
     @InjectRepository(User)
        private userRepository: Repository<User>,
    @InjectRepository(ApiKey) private apiKeyRepo:Repository<ApiKey>
  ){}
  async InsertKey(Key:string,Email:string):Promise<any>{
    try{
       // 1️⃣ Find the user
  const existingUser = await this.userRepository.findOne({
    where: { Email: Email },
    relations: ["ApiKey"],  // Important: load the user's existing key
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  // 2️⃣ If the user already has an API key → update it
  if (existingUser.ApiKey) {
    existingUser.ApiKey.Key = Key;
    existingUser.ApiKey.UpdatedAt = new Date();

    return await this.apiKeyRepo.save(existingUser.ApiKey);
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
}

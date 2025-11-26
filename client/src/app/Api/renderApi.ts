import axios from "axios"
import { error, log } from "node:console";
interface SetApi{
    Status:true,
    Message:string,
    Error?:string;
}
export const Saveapikey=async(Key:string,email:string):Promise<any>=>
{

    
    const BackendUrl='http://localhost:5000/api-keys/set'
    const response=await axios.post(BackendUrl,{
     
            apiKey:Key,
            email:email
    }
)
console.log(response)
return response;
}
export const LisAllServices=async(Key:string):Promise<any>=>{
    try{
            
 const response = await axios.post(
          'http://localhost:5000/render/getservices',
          { key: Key }
        );
        console.log(response)
        return response;
    }
    catch(err){
        console.log(err)
        throw err;
    }
}



// export const Validate=async(Key:string):Promise<any>{
    // const Url:'';
    // const response=await axios.post()

// }
import axios from "axios"
import { log } from "node:console";
interface SetApi{
    Status:true,
    Message:string,
    Error?:string;
}
export const Saveapikey=async(Key:string,email:string):Promise<any>=>
{

    console.log(`email is ${email}`)
    console.log("hey this function has been worked and called ")
    console.log(Key);
    
    const BackendUrl='http://localhost:5000/api-keys/set'
    const response=await axios.post(BackendUrl,{
     
            apiKey:Key,
            email:email
    }
)
console.log(response)
return response;
}

// export const Validate=async(Key:string):Promise<any>{
    // const Url:'';
    // const response=await axios.post()

// }
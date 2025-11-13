import { IsString } from "class-validator";
export class RenderKey{
    @IsString()
    apiKey:string
    @IsString()
    email:string;
    

}
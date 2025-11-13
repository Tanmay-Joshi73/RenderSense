import { IsString } from "class-validator";
export class RenderKey{
    @IsString()
    id:string;
    @IsString()
    Name:string;
    

}
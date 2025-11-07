import { Controller, Get, Post, Body ,Delete,Patch,Put} from '@nestjs/common';
import { UserService } from './user.service';
import { log } from 'console';
import { UserCreationDto } from 'src/DTO/userCreation.dto';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @Post('/create')
  create(@Body() userinfo: UserCreationDto) {
    const { Name, Email, Password } = userinfo;
    return this.userService.createUser(Name, Email, Password);
  }

  @Post('/login')
  login(@Body() body: { Email: string; Password: string }) {
    return this.userService.login(body.Email, body.Password);
  }

  @Post('/change-password')
  changePassword(@Body() body: { Email: string; OldPassword: string; NewPassword: string }) {
    return this.userService.changePassword(body.Email, body.OldPassword, body.NewPassword);
  }

  @Delete('/delete')
  deleteAccount(@Body() body: { Email: string }) {
    return this.userService.deleteAccount(body.Email);
  }

  @Post('/forget-password')
  forgetPassword(@Body() body: { Email: string }) {
    return this.userService.forgetPassword(body.Email);
  }

  @Patch('/update')
  update(@Body() body: { Email: string; NewName?: string; NewEmail?: string }) {
    return this.userService.updateUser(body.Email, body.NewName, body.NewEmail);
  }

  @Post('/profile')
  getProfile(@Body() body: { Email: string }) {
    return this.userService.getProfile(body.Email);
  }
}

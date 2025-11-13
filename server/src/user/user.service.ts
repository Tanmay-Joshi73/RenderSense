import { Injectable } from "@nestjs/common";
import { BadRequestException,NotFoundException,UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import { ResponseResult } from 'src/Interfaces/Response.interface';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

 findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // ✅ Create a new user (hashed password)
  async createUser(Name: string, Email: string, Password: string): Promise<ResponseResult> {
    try{
    const existingUser = await this.userRepository.findOne({ where: { Email } });
    if (existingUser) throw new BadRequestException("User already exists with this email");

    const hashedPassword = await this.hashPassword(Password);
    const newUser = this.userRepository.create({ Name, Email, Password: hashedPassword });
    const user=await this.userRepository.save(newUser);
    return {
      Status:'Success',
      Success:true,
      Message:"Account Created Successfully",
      Result:{
        Email:Email
      }
    }
  }
  catch(err){
    console.log(err)
  }
    return {
      Status:'Failed',
      Success:false,
      Message:"Account is failed to create",
    }
}

  // ✅ Hash password
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
  }

  // ✅ Compare plain password with hash
  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // ✅ Find by email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { Email: email } });
  }

  // ✅ Login user
  async login(email: string, password: string): Promise<ResponseResult> {
    try{
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException("User not found");

    const isMatch = await this.comparePassword(password, user.Password);
    if (!isMatch) throw new UnauthorizedException("Invalid credentials");
     return {
      Status:'Success',
      Success:true,
      Message:"Account is failed to create",
      Result:{
        Data:email
      }
    }
    
    }
    catch(err){
      console.log(err)
    }
     return {
      Status:'Failed',
      Success:false,
      Message:"Account is failed to create",
    }
  }

  // ✅ Change password
  async changePassword(email: string, oldPassword: string, newPassword: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException("User not found");

    const isMatch = await this.comparePassword(oldPassword, user.Password);
    if (!isMatch) throw new UnauthorizedException("Old password is incorrect");

    user.Password = await this.hashPassword(newPassword);
    await this.userRepository.save(user);

    return "Password updated successfully";
  }

  // ✅ Delete account
  async deleteAccount(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException("User not found");

    await this.userRepository.delete({ Email: email });
    return "Account deleted successfully";
  }

  // ✅ Forget password (simulate token)
  async forgetPassword(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException("User not found");

    // Generate a simple reset token (you can store this in DB for real implementation)
    // const resetToken = crypto.randomBytes(20).toString("hex");
    let resetToken=1212;
    // TODO: Send token via email in real setup
    return `Password reset token for ${email}: ${resetToken}`;
  }

  // ✅ Update user name or email
  async updateUser(email: string, newName?: string, newEmail?: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException("User not found");

    if (newName) user.Name = newName;
    if (newEmail) user.Email = newEmail;

    return this.userRepository.save(user);
  }

  // ✅ Get user profile
  async getProfile(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}
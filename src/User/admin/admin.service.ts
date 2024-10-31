import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Admin } from "./entity/admin.entity";
import { OtpService } from "../auth/otp/otp.service";
import { TokenService } from "../auth/token/token.service";
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entity/user.entity";
import { ApiResponses, createResponse } from "@/utils/response.util";
import { AddUserDto } from "./dto/addUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { AddAdminDto } from "./dto/addAdmin.dto";
import { UpdateAdminDto } from "./dto/updateAdmin.dto";



@Injectable()
export class AdminService{
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly otpService: OtpService,
        private readonly tokenService: TokenService,
    ){}

    async login(
        email: string,
        password: string,
        firebaseToken: string,
    ): Promise<any> {

        const isEmail = /\S+@\S+\.\S+/.test(email);

        console.log(email)
        let user;
        if (isEmail) {
            user = await this.adminRepository.findOne({where: {email: email}});
        } else {
            throw new BadRequestException('Invalid email ');
        }

        if (!user) {
            throw new UnauthorizedException('Invalid credentials (user)');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials (pass)');
        }

        user.firebaseToken = firebaseToken;
        await this.adminRepository.save(user);
        const token = await this.tokenService.createToken(user);

        return {
            status: 'success',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                role: user.role,
            },
        };
    }

    async forgotPassword(email_or_username: string): Promise<any> {
        const isEmail = /\S+@\S+\.\S+/.test(email_or_username);
        const isUsername = /^[a-zA-Z0-9_]+$/.test(email_or_username);

        let user;

        if (isEmail) {
            user = await this.adminRepository.findOne({where: {email: email_or_username}});
        } else if (isUsername) {
            user = await this.adminRepository.findOne({where: {username: email_or_username}});
        } else {
            throw new BadRequestException('Invalid email or username');
        }

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const identifier = user.email;

        const isEmail2 = /\S+@\S+\.\S+/.test(identifier);
        // Send OTP to user email
        let otp;
        if (isEmail2) {
            otp = await this.otpService.sendOTPToEmail(identifier);
        }
        return {status: 'success', message: 'Verification code sent', otp,};
    }

    async verifyForgotPasswordCode(
        email_or_username: string,
        verification_code: string
    ): Promise<any> {
        const isEmail = /\S+@\S+\.\S+/.test(email_or_username);
        const isUsername = /^[a-zA-Z0-9_]+$/.test(email_or_username);

        let user;

        if (isEmail) {
            user = await this.adminRepository.findOne({where: {email: email_or_username}});
        } else if (isUsername) {
            user = await this.adminRepository.findOne({where: {username: email_or_username}});
        } else {
            throw new BadRequestException('Invalid email or username');
        }

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isValidOTP = await this.otpService.verifyOTP(email_or_username, verification_code);

        if (!isValidOTP) {
            throw new BadRequestException('Invalid verification code');
        }

        return {status: 'success', message: 'Code verified'};
    }

    async resetPassword(
        password: string,
        confirm_password: string,
        email_or_username: string
    ): Promise<void> {
        if (password !== confirm_password) {
            throw new BadRequestException('Passwords do not match');
        }

        // جستجوی کاربر با یکی از فیلدهای ایمیل، شماره تلفن یا نام کاربری
        const user = await this.adminRepository.findOne({
            where: [
                { email: email_or_username },
                { username: email_or_username }
            ]
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // هش کردن رمز عبور جدید
        user.password = await bcrypt.hash(password, 10);

        await this.adminRepository.save(user);
    }

    async checkAuthentication(
        token: string,
        appName: string,
        packageName: string,
        version: string,
        buildNumber: string,
        firebaseToken: string
    ) {
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }
    
        if (!appName || !packageName || !version || !buildNumber) {
            throw new UnauthorizedException('Invalid app details');
        }
    
        // Updated to retrieve an Admin entity (with role) instead of a generic User
        const admin = await this.tokenService.getByToken(token) as Admin;

        if (!admin) {
            throw new UnauthorizedException('User not found');
        }
    
        await this.adminRepository.save(admin);
    
        return {
            message: 'Authentication successful',
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                username: admin.username,
                role: admin.role,  // Role is now available here
            },
            appName,
            packageName,
            version,
            buildNumber,
        };
    }
    
    async getAllUsers() {

        const users = await this.userRepository.find({
            select: [
                'username', 
                'name', 
                'id', 
                'profilePic', 
                'createdAt'
            ], 
        });

        return {
            statusCode: 200,
            result: users,
        };
    }

    async getAllAdmins() {

        const admins = await this.adminRepository.find({
            select: [
                'username', 
                'name', 
                'id', 
                'profilePic', 
                'createdAt'
            ], 
        });

        return {
            statusCode: 200,
            result: admins,
        };
    }

    async addUser(
        addUserDto: AddUserDto
    ): Promise<ApiResponses<User>> {

        const { 
            name, 
            username, 
            password, 
            email , 
            phone 
        } = addUserDto

        const newUser = {
            name,
            username,
            password,
            email,
            phone
        }

        const savedUser = await this.userRepository.save(newUser);

        return createResponse(201,savedUser)
    }

    async addAdmin(
        addAdminDto: AddAdminDto
    ): Promise<ApiResponses<Admin>> {

        const { 
            name, 
            username, 
            password, 
            email , 
        } = addAdminDto

        const newAdmin = {
            name,
            username,
            password,
            email,
        }

        const savedadmin = await this.adminRepository.save(newAdmin);

        return createResponse(201,savedadmin)
    }

    async updateUser(
        id: number, 
        updateUserDto: UpdateUserDto
    ): Promise<ApiResponses<User>> {

        const user = await this.userRepository.findOneBy({ id });

        if (!user) throw new NotFoundException('User not found');

        const hashedPassword = updateUserDto.password
        ? await bcrypt.hash(updateUserDto.password, 10)
        : user.password;

        Object.assign(user, {
            ...updateUserDto,
            password: hashedPassword,
            updatedAt: new Date(),
          });

          const updateUser = await this.userRepository.save(user);

          return createResponse(200, updateUser);
    }

    async updateAdmin(
        id: number, 
        updateAdminDto: UpdateAdminDto
    ): Promise<ApiResponses<Admin>> {

        const admin = await this.adminRepository.findOneBy({ id });

        if (!admin) throw new NotFoundException('Admin not found');

        const hashedPassword = updateAdminDto.password
        ? await bcrypt.hash(updateAdminDto.password, 10)
        : admin.password;

        Object.assign(admin, {
            ...updateAdminDto,
            password: hashedPassword,
            updatedAt: new Date(),
          });

          const updateAdmin = await this.userRepository.save(admin);

          return createResponse(200, updateAdmin);
    }
    
    async deleteUser(
        id:number
    ):Promise<{ message: string}>{

        const user = await this.userRepository.findOneBy({ id });

        if(!user){
            throw new NotFoundException('User Not Found')
        }

        await this.userRepository.remove(user)
        
        return { message: 'User Deleted Successfully' }
    }

    async deleteAdmin(
        id:number
    ):Promise<{ message: string}>{

        const admin = await this.adminRepository.findOneBy({ id });

        if(!admin){
            throw new NotFoundException('Admin Not Found')
        }

        await this.adminRepository.remove(admin)
        
        return { message: 'Admin Deleted Successfully' }
    }

}
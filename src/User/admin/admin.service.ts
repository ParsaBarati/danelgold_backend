import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Admin } from "./entity/admin.entity";
import { OtpService } from "../auth/otp/otp.service";
import { TokenService } from "../auth/token/token.service";
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from "@nestjs/typeorm";



@Injectable()
export class AdminService{
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,
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
            },
        };
    }

    async checkUserNameAvailability(username: string): Promise<any> {

        const existingUserName = await this.adminRepository.findOne(
            {
                where: {username}
            });

        if (existingUserName !== null) {
            throw new BadRequestException('Username already exists');
        }

        return {
            status: 'success',
            message: 'Username accepted',
        };
    }

    async checkUserExists(email: string): Promise<void> {
        const existingUser = await this.adminRepository.findOne({
            where: [ {email}],
        });
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }
    }

    async sendOTPToEmail(email: string): Promise<any> {
        const isEmail = /\S+@\S+\.\S+/.test(email);

        if (isEmail) {
            await this.checkUserExists(email);
        } else {
            throw new BadRequestException('Invalid email');
        }

        let otp;
        if (isEmail) {
            otp = await this.otpService.sendOTPToEmail(email);
        }

        return {
            status: 'success',
            otp: otp,
            message: 'Verification code sent',
        };
    }

    async verifyCode(
        email: string,
        username: string,
        password: string,
        verification_code: string
    ): Promise<any> {
        const isEmail = /\S+@\S+\.\S+/.test(email);

        const codeAsString = verification_code.toString();
        let user;

        if (isEmail) {
            const isValidOTP = await this.otpService.verifyOTP(email, codeAsString);
            if (!isValidOTP) {
                throw new BadRequestException('Invalid verification code');
            }
            user = await this.adminRepository.findOneBy({email: email});
        } else {
            throw new BadRequestException('Invalid email');
        }

        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = this.adminRepository.create({
                email: isEmail ? email : null,
                username: username,
                password: hashedPassword,
                isVerified: true,
            });
            await this.adminRepository.save(user);
        } else {
            user.isVerified = true;
            await this.adminRepository.save(user);
        }

        return {
            status: 'success',
            message: 'Verification code verified, user created/updated successfully',
        };
    }

    async setPassword(
        email: string,
        password: string,
        confirmPassword: string
    ): Promise<any> {

        if (password !== confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const isEmail = /\S+@\S+\.\S+/.test(email);

        let user;
        if (isEmail) {
            user = await this.adminRepository.findOneBy({email: email});
        } else {
            throw new BadRequestException('Invalid email');
        }

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        await this.adminRepository.save(user);

        return {
            status: 'success',
            message: 'Password set successfully',
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

    async checkAuthentication(token: string, appName: string, packageName: string, version: string, buildNumber: string, firebaseToken: string) {


        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        if (!appName || !packageName || !version || !buildNumber) {
            throw new UnauthorizedException('Invalid app details');
        }
        const user = await this.tokenService.getByToken(token);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        user.firebaseToken = firebaseToken;
        await this.adminRepository.save(user);
        return {
            message: 'Authentication successful',
            user: user,
            appName,
            packageName,
            version,
            buildNumber,
        };
    }


}
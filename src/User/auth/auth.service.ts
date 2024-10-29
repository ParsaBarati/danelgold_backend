import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {OtpService} from './otp/otp.service';
import {TokenService} from './token/token.service';
import {User} from '@/User/user/entity/user.entity';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly otpService: OtpService,
        private readonly tokenService: TokenService,
    ) {
    }

    async login(
        email_or_phone: string,
        password: string,
        firebaseToken: string,
    ): Promise<any> {

        const isPhone = /^[0-9]+$/.test(email_or_phone);
        const isEmail = /\S+@\S+\.\S+/.test(email_or_phone);

        console.log(email_or_phone)
        let user;
        if (isPhone) {
            user = await this.userRepository.findOne({where: {phone: email_or_phone}});
        } else if (isEmail) {
            user = await this.userRepository.findOne({where: {email: email_or_phone}});
        } else {
            throw new BadRequestException('Invalid email or phone number');
        }

        if (!user) {
            throw new UnauthorizedException('Invalid credentials (user)');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials (pass)');
        }

        user.firebaseToken = firebaseToken;
        await this.userRepository.save(user);
        const token = await this.tokenService.createToken(user);

        return {
            status: 'success',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                username: user.username,
            },
        };
    }

    async checkUserNameAvailability(username: string): Promise<any> {

        const existingUserName = await this.userRepository.findOne(
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

    async checkUserExists(phone: string, email: string): Promise<void> {
        const existingUser = await this.userRepository.findOne({
            where: [{phone}, {email}],
        });
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }
    }

    async sendOTPToPhoneOrEmail(email_or_phone: string): Promise<any> {
        const isPhone = /^[0-9]+$/.test(email_or_phone);
        const isEmail = /\S+@\S+\.\S+/.test(email_or_phone);

        if (isPhone) {
            await this.checkUserExists(email_or_phone, '');
        } else if (isEmail) {
            await this.checkUserExists('', email_or_phone);
        } else {
            throw new BadRequestException('Invalid phone number or email');
        }

        let otp;
        if (isPhone) {
            otp = await this.otpService.sendOTP(email_or_phone);
        } else if (isEmail) {
            otp = await this.otpService.sendOTPToEmail(email_or_phone);
        }

        return {
            status: 'success',
            otp: otp,
            message: 'Verification code sent',
        };
    }

    async verifyCode(
        email_or_phone: string,
        username: string,
        password: string,
        verification_code: string
    ): Promise<any> {
        const isPhone = /^[0-9]+$/.test(email_or_phone);
        const isEmail = /\S+@\S+\.\S+/.test(email_or_phone);

        const codeAsString = verification_code.toString();
        let user;

        if (isPhone) {
            const isValidOTP = await this.otpService.verifyOTP(email_or_phone, codeAsString);
            if (!isValidOTP) {
                throw new BadRequestException('Invalid verification code');
            }
            user = await this.userRepository.findOneBy({phone: email_or_phone});
        } else if (isEmail) {
            const isValidOTP = await this.otpService.verifyOTP(email_or_phone, codeAsString);
            if (!isValidOTP) {
                throw new BadRequestException('Invalid verification code');
            }
            user = await this.userRepository.findOneBy({email: email_or_phone});
        } else {
            throw new BadRequestException('Invalid phone number or email');
        }

        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = this.userRepository.create({
                phone: isPhone ? email_or_phone : null,
                email: isEmail ? email_or_phone : null,
                username: username,
                password: hashedPassword,
                isVerified: true,
            });
            await this.userRepository.save(user);
        } else {
            user.isVerified = true;
            await this.userRepository.save(user);
        }

        return {
            status: 'success',
            message: 'Verification code verified, user created/updated successfully',
        };
    }

    async setPassword(
        email_or_phone: string,
        password: string,
        confirmPassword: string
    ): Promise<any> {

        if (password !== confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const isPhone = /^[0-9]+$/.test(email_or_phone);
        const isEmail = /\S+@\S+\.\S+/.test(email_or_phone);

        let user;
        if (isPhone) {
            user = await this.userRepository.findOneBy({phone: email_or_phone});
        } else if (isEmail) {
            user = await this.userRepository.findOneBy({email: email_or_phone});
        } else {
            throw new BadRequestException('Invalid phone number or email');
        }

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        await this.userRepository.save(user);

        return {
            status: 'success',
            message: 'Password set successfully',
        };
    }

    async forgotPassword(email_or_phone_or_username: string): Promise<any> {
        const isPhone = /^[0-9]+$/.test(email_or_phone_or_username);
        const isEmail = /\S+@\S+\.\S+/.test(email_or_phone_or_username);
        const isUsername = /^[a-zA-Z0-9_]+$/.test(email_or_phone_or_username);

        let user;

        if (isPhone) {
            user = await this.userRepository.findOne({where: {phone: email_or_phone_or_username}});
        } else if (isEmail) {
            user = await this.userRepository.findOne({where: {email: email_or_phone_or_username}});
        } else if (isUsername) {
            user = await this.userRepository.findOne({where: {username: email_or_phone_or_username}});
        } else {
            throw new BadRequestException('Invalid email, phone number, or username');
        }

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const identifier = user.phone || user.email;

        const isPhone2 = /^[0-9]+$/.test(identifier);
        const isEmail2 = /\S+@\S+\.\S+/.test(identifier);
        // Send OTP to user email or phone
        let otp;
        if (isPhone2) {
            otp = await this.otpService.sendOTP(identifier);
        } else if (isEmail2) {
            otp = await this.otpService.sendOTPToEmail(identifier);
        }
        return {status: 'success', message: 'Verification code sent', otp,};
    }

    async verifyForgotPasswordCode(
        email_or_phone_or_username: string,
        verification_code: string
    ): Promise<any> {
        const isPhone = /^[0-9]+$/.test(email_or_phone_or_username);
        const isEmail = /\S+@\S+\.\S+/.test(email_or_phone_or_username);
        const isUsername = /^[a-zA-Z0-9_]+$/.test(email_or_phone_or_username);

        let user;

        if (isPhone) {
            user = await this.userRepository.findOne({where: {phone: email_or_phone_or_username}});
        } else if (isEmail) {
            user = await this.userRepository.findOne({where: {email: email_or_phone_or_username}});
        } else if (isUsername) {
            user = await this.userRepository.findOne({where: {username: email_or_phone_or_username}});
        } else {
            throw new BadRequestException('Invalid email, phone number, or username');
        }

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isValidOTP = await this.otpService.verifyOTP(email_or_phone_or_username, verification_code);

        if (!isValidOTP) {
            throw new BadRequestException('Invalid verification code');
        }

        return {status: 'success', message: 'Code verified'};
    }

    async resetPassword(
        password: string,
        confirm_password: string,
        email_or_phone_or_username: string
    ): Promise<void> {
        if (password !== confirm_password) {
            throw new BadRequestException('Passwords do not match');
        }

        // جستجوی کاربر با یکی از فیلدهای ایمیل، شماره تلفن یا نام کاربری
        const user = await this.userRepository.findOne({
            where: [
                { email: email_or_phone_or_username },
                { phone: email_or_phone_or_username },
                { username: email_or_phone_or_username }
            ]
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // هش کردن رمز عبور جدید
        user.password = await bcrypt.hash(password, 10);

        await this.userRepository.save(user);
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
        await this.userRepository.save(user);
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

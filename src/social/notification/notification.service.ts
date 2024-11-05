import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Notification, NotificationAction} from '@/social/notification/entity/notification.entity';
import {lastValueFrom} from "rxjs";
import {HttpService} from '@nestjs/axios';
import * as fs from "fs";
import * as jwt from 'jsonwebtoken';
import {User} from "@/user/user/entity/user.entity";
import * as path from "path";


@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly httpService: HttpService,
    ) {
    }


    async getNotifications(user: User): Promise<any> {

        const notifications = await this.notificationRepository
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.user', 'user')
            .leftJoinAndSelect('notification.recipient', 'recipient')
            .select([
                'notification.id',
                'notification.title',
                'notification.thumb',
                'notification.action',
                'user.id',
                'user.profilePic',
                'user.username',
            ])
            .where('notification.recipientId = :userId', {userId: user.id})
            .orderBy('notification.createdAt', 'DESC')
            .getMany();

        const transformedNotifications = notifications.map((notification) => ({
            id: notification.id,
            title: notification.title,
            thumb: notification.thumb,
            action: notification.action,
            user: {
                id: notification.user.id,
                name: `${notification.user.username}`,
                pic: notification.user.profilePic,
                username: notification.user.username,
            },
        }));

        return {notifications: transformedNotifications};
    }

    async getAccessToken(): Promise<string> {
        const serviceAccountPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH;
        const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(serviceAccountPath), 'utf8'));

        const jwtHeader = {
            alg: 'RS256',
            typ: 'JWT',
        };
        const scope = 'https://www.googleapis.com/auth/firebase.messaging';

        const jwtClaimSet = {
            iss: serviceAccount.client_email,
            scope: scope,
            aud: `https://oauth2.googleapis.com/token`, // Update with your project ID
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
        };

        const token = jwt.sign(jwtClaimSet, serviceAccount.private_key, {
            algorithm: 'RS256',
            header: jwtHeader,
        });

        const response = await lastValueFrom(
            this.httpService.post('https://oauth2.googleapis.com/token', {
                assertion: token,
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            }),
        );

        return response.data.access_token;
        return "";
    }

    async sendPushNotification(user: User, title: string, data: any, body = '', imgUrl = ''): Promise<any> {
        const self = await this.userRepository.findOne({
            where: {id: user.id,}
        })
        if (!self) {
            throw new NotFoundException('User not found');
        }
        const pushId = self.firebaseToken;
        return this.sendPushNotificationToPushId(pushId, title, data, body, imgUrl,);

    }

    async sendPushNotificationToPushId(pushId: string, title: string, data: {}, body = '', imgUrl = ''): Promise<any> {

        if (!pushId) {
            throw new NotFoundException('Token not found');

        }
        const accessToken = await this.getAccessToken();
        console.log(`Push ID: ${pushId}`)
        const notification = {
            title: title,
            body: body,
        };

        const fields = {
            message: {
                token: pushId,
                notification: notification,
                data: data,
            },
        };
        console.log(accessToken)

        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };

        try {

            const response = await lastValueFrom(
                this.httpService.post("https://fcm.googleapis.com/v1/projects/hive-e1b7e/messages:send", fields, {headers}),
            );
            console.log("Response: ", response.data)
            return response.data;

        } catch (e) {
            console.error("Error sending push notification:", e);
            throw new Error("Could not send notification");
        }

    }

    async sendNotification(
        recipientId: number,
        action: NotificationAction,
        title: string,
        thumb: string,
        senderId?: number,
    ): Promise<Notification> {

        const recipient = await this.userRepository.findOne({
            where: {id: recipientId}
        });

        const sender = senderId ? await this.userRepository.findOne({
            where: {id: senderId}
        }) : null;

        if (!recipient) {
            throw new Error('Invalid recipient');
        }

        const notification = this.notificationRepository.create({
            title,
            thumb,
            action,
            user: sender,
            recipient,
        });
        console.log(recipient.firebaseToken, ' = recipient.firebaseToken')
        if (recipient.firebaseToken) {
            this.sendPushNotificationToPushId(recipient.firebaseToken, sender?.username ?? "DanelGold", {
                type: "notification",
                data: JSON.stringify({
                    user: sender ? {
                        id: sender.id,
                        name: sender.name,
                        username: sender.username,
                        profilePic: sender.profilePic,
                    } : null,
                    action: action,
                    thumb: thumb,
                }),
            }, title.replaceAll(sender?.username, ""), thumb);
        }

        return await this.notificationRepository.save(notification);
    }

}

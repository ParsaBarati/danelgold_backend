import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entity/notification.entity';
import { User } from '@/User/user/entity/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async getNotifications(userPhone: string): Promise<any> {

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
        'user.userName',
      ])
      .where('notification.recipientId = :userPhone', { userPhone }) 
      .orderBy('notification.createdAt', 'DESC') 
      .getMany();

    const transformedNotifications = notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      thumb: notification.thumb,
      action: notification.action,
      user: {
        id: notification.user.id,
        name: `${notification.user.userName}`,
        pic: notification.user.profilePic,
        username: notification.user.userName,
      },
    }));

    return { notifications: transformedNotifications };
  }
}

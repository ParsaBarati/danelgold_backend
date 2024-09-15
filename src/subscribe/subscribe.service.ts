import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscribe } from './entity/subscribe.entity';
import { Repository } from 'typeorm';
import { User } from '@/user/entity/user.entity';
import { SubscribeDto } from './dto/Subscription.dto';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { SmsService } from '@/services/sms.service';
import * as webPush from 'web-push';
import { CronJob } from 'cron';
import { configDotenv } from 'dotenv';
import { Auction } from '@/auction/entity/auction.entity';

configDotenv();

@Injectable()
export class SubscribeService implements OnModuleInit, OnModuleDestroy {
  private job: CronJob;

  constructor(
    @InjectRepository(Subscribe)
    private readonly subscribeRepository: Repository<Subscribe>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    private readonly smsService: SmsService,
  ) {
    webPush.setVapidDetails(
      process.env.EMAIL_NOTIFICATION ?? '',
      process.env.PUBLIC_KEY_NOTIFICATION ?? '',
      process.env.PRIMARY_KEY_NOTIFICATION ?? '',
    );
  }

  async subscribeUser(
    userPhone: string,
    subscribeDto: SubscribeDto,
  ): Promise<ApiResponses<Subscribe>> {
    const { subscription } = subscribeDto;
    const existingUser = await this.userRepository.findOne({
      where: { phone: userPhone },
    });

    if (!existingUser) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    console.log(subscription);

    const existingSubscription = await this.subscribeRepository.findOne({
      where: { endpoint: subscription.endpoint },
    });

    console.log(subscription.endpoint);

    if (existingSubscription) {
      throw new BadRequestException('اشتراک این کاربر وجود دارد');
    }

    const newSubscription = this.subscribeRepository.create({
      endpoint: subscription.endpoint,
      auth: subscription.keys.auth,
      p256dh: subscription.keys.p256dh,
      userPhone: existingUser.phone,
      isActive: true,
      user: existingUser,
    });

    await this.subscribeRepository.save(newSubscription);
    return createResponse(201, newSubscription, 'اعلان فعال شد');
  }

  async unsubscribeUser(
    userPhone: string,
  ): Promise<{ message: string; statusCode: number }> {
    const existingUser = await this.userRepository.findOne({
      where: { phone: userPhone },
    });

    if (!existingUser) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const userSubscription = await this.subscribeRepository.findOne({
      where: { userPhone: userPhone },
    });

    if (!userSubscription || userSubscription.endpoint === '') {
      throw new BadRequestException('ساب اسکرایپ یافت نشد');
    }

    await this.subscribeRepository.remove(userSubscription);

    return { message: 'اشتراک با موفقیت حذف شد', statusCode: 200 };
  }

  async SendSMSCron(): Promise<void> {
    const currentTimestamp = new Date();
    const windowStart = new Date(currentTimestamp);
    windowStart.setSeconds(currentTimestamp.getSeconds() - 30);
    const windowEnd = new Date(currentTimestamp);
    windowEnd.setSeconds(currentTimestamp.getSeconds() + 30);

    const auctionPromise = await this.auctionRepository
      .createQueryBuilder('acutions')
      .where('auctions.startTime >= :windowStart', { windowStart })
      .andWhere('auctions.startTime <= :windowEnd', { windowEnd })
      .andWhere('auctions.isSms = :isSms', { isSms: true })
      .getMany();

    const usersPromise = await this.userRepository
      .createQueryBuilder('user')
      .select('user.phone')
      .getMany();

    const [auctions, users] = await Promise.all([
      auctionPromise,
      usersPromise,
    ]);

    if (auctions.length > 0 && users.length > 0) {
      const userPhones: string[] = users.map((user: any) => user.phone);

      for (const acution of auctions) {
        const message = `${acution.title}`;

        console.log('Sending SMS to:', userPhones.join(', '));
        console.log('Message:', message);

        await this.smsService.sendClassTimeSMS(userPhones, message);
      }

      console.log('SMS sent successfully');
    }
  }

  async sendNotif(): Promise<void> {
    const currentTimestamp = new Date();

    const windowStart = new Date(currentTimestamp);
    windowStart.setSeconds(currentTimestamp.getSeconds() - 30);

    const windowEnd = new Date(currentTimestamp);
    windowEnd.setSeconds(currentTimestamp.getSeconds() + 30);

    const currentAuction = await this.auctionRepository
      .createQueryBuilder('auctions')
      .leftJoinAndSelect('auctions.nfts', 'nft')
      .addSelect(['nft.name', 'nft.imageUrl'])
      .where('auctions.start >= :windowStart', { windowStart })
      .andWhere('auctions.start <= :windowEnd', { windowEnd })
      .getOne();

    if (!currentAuction) {
      console.log('No class found at the current timestamp');
      return;
    }

    const subscriptions = await this.subscribeRepository.find();

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No subscriptions found');
      return;
    }

    const payload = {
      title: currentAuction.title,
      body: `${currentAuction.nft.name} در حال برگزاری است`,
      icon: currentAuction.nft.imageURL,
      badge: `https://api.baclassonline.ir/app/uploads/2024/02/192.png`,
    };

    for (const subscription of subscriptions) {
      await webPush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            auth: subscription.auth,
            p256dh: subscription.p256dh,
          },
        },
        JSON.stringify(payload),
      );
    }
    console.log('Notification sent successfully');
  }

  async sendSMSCron(): Promise<void> {
    await this.sendNotif();
  }

  onModuleInit() {
    this.job = new CronJob('* * * * *', async () => {
      await this.sendSMSCron();
      console.log('cron job ran.');
    });
    this.job.start();
  }

  onModuleDestroy() {
    if (this.job) {
      this.job.stop();
    }
  }

  async sendContent(
    title: string,
    content: string,
  ): Promise<{ statusCode: number }> {
    const payload = {
      title: title,
      body: content,
      icon: 'https://api.baclassonline.ir/public/images/2024/07/05.jpg',
      badge:
        'https://api.baclassonline.ir/public/images/2024/08/gholami_offline.jpg',
    };

    console.log(`payload >>> ${JSON.stringify(payload)}\n\n`);

    const subscriptions = await this.subscribeRepository.find();

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No subscriptions found');
      return { statusCode: 404 };
    }

    for (const subscription of subscriptions) {
      try {
        const notif = await webPush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              auth: subscription.auth,
              p256dh: subscription.p256dh,
            },
          },
          JSON.stringify(payload),
        );

        console.log(`notiffffff sent to: ${JSON.stringify(notif)}\n\n`);
        console.log(
          `Notification sent to: ${JSON.stringify(subscription)}\n\n`,
        );
      } catch (error) {
        console.error(
          `Failed to send notification to ${subscription.endpoint}:`,
          error,
        );
      }
    }

    return { statusCode: 200 }; // برگرداندن وضعیت موفقیت‌آمیز
  }
}

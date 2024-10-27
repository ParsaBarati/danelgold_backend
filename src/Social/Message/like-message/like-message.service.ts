import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { likeMessage } from "./entity/like-message.entity";
import { Repository } from "typeorm";
import { User } from "@/User/user/entity/user.entity";
import { NotificationService } from "@/Social/Notification/notification.service";
import { Message } from "../message/entity/message.entity";
import { NotificationAction } from "@/Social/Notification/entity/notification.entity";



@Injectable()
export class LikeMessageService{
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(likeMessage)
        private readonly likeMessageRepository: Repository<likeMessage>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly notificationService: NotificationService
    ){}

    async likeMessage(
        messageId: number,
        user: User,
    ): Promise<{ isLike: number }> {
    
        const likableMessage = await this.messageRepository.findOneBy({ id: messageId });
    
        if (!likableMessage) {
            throw new NotFoundException('Message not found!');
        }
    
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        let existingLike = await this.likeMessageRepository.findOne({
            where: { message: { id: messageId }, user: { id: user.id } },
        });
    
        let isLikeChangedToPositive = false;
    
        if (!existingLike) {
            existingLike = this.likeMessageRepository.create({
                message: likableMessage,
                user,
                isLike: 1,
            });
            likableMessage.likes++;
            isLikeChangedToPositive = true;
        } else {
            if (existingLike.isLike === 1) {
                existingLike.isLike = 0;
                likableMessage.likes--;
            } else if (existingLike.isLike === -1) {
                existingLike.isLike = 1;
                likableMessage.likes++;
                isLikeChangedToPositive = true;
            } else {
                existingLike.isLike = 1;
                likableMessage.likes++;
                isLikeChangedToPositive = true;
            }
        }
    
            await this.likeMessageRepository.save(existingLike);
            await this.messageRepository.save(likableMessage);
        
    
        if (isLikeChangedToPositive && likableMessage.sender.id !== user.id) {
            await this.notificationService.sendNotification(
                likableMessage.sender.id,         
                NotificationAction.LIKE,     
                `Your post was liked by ${user.username}`, 
                user.profilePic,     
                user.id                     
            );
        }
    
        return { isLike: existingLike.isLike };
    }
}
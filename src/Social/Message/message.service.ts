import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "./entity/message.entity";
import { Repository } from "typeorm";
import { User } from "@/User/user/entity/user.entity";


@Injectable()
export class MessageService{
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(User)
        private userRepository: Repository<User>,

    ){}

    async getMessage(userIdentifier: string): Promise<any> {

      const user = await this.userRepository.findOne({
        where: [
            { email: userIdentifier }, 
            { phone: userIdentifier }
        ]
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userId = user.id;

        const chats = await this.messageRepository
          .createQueryBuilder('message')
          .leftJoinAndSelect('message.sender', 'sender')
          .leftJoinAndSelect('message.receiver', 'receiver')
          .select([
            'message.id',
            'sender.id',
            'sender.profilePic',
            'sender.name',
            'sender.username',
            'receiver.id',
            'receiver.profilePic',
            'receiver.name',
            'receiver.username',
            'message.createdAt',
          ])
          .where('message.senderId = :userId OR message.receiverId = :userId', { userId }) 
          .orderBy('message.createdAt', 'DESC') 
          .getRawMany();
      
        const transformedChats = chats.map((chat) => {
          const otherUser = chat.sender_id === userId ? chat.receiver : chat.sender; 
          return {
            id: chat.message_id,
            user: {
              id: otherUser.id,
              name: otherUser.name,
              username: otherUser.username,
              pic: otherUser.profilePic,
            },
            lastSeen: chat.message_createdAt, 
          };
        });
      
        return {
          chats: transformedChats,
        };
    }
      
}
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "./entity/message.entity";
import { Repository } from "typeorm";


@Injectable()
export class MessageService{
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>
    ){}

    async getMessage(userPhone: string): Promise<any> {

        const chats = await this.messageRepository
          .createQueryBuilder('message')
          .leftJoinAndSelect('message.sender', 'sender')
          .leftJoinAndSelect('message.receiver', 'receiver')
          .select([
            'message.id',
            'sender.id',
            'sender.firstName',
            'sender.lastName',
            'sender.profilePic',
            'sender.userName',
            'receiver.id',
            'receiver.firstName',
            'receiver.lastName',
            'receiver.profilePic',
            'receiver.userName',
            'message.createdAt',
          ])
          .where('message.senderId = :userPhone OR message.receiverId = :userPhone', { userPhone }) 
          .orderBy('message.createdAt', 'DESC') 
          .getRawMany();
      
        const transformedChats = chats.map((chat) => {
          const otherUser = chat.sender_id === userPhone ? chat.receiver : chat.sender; 
          return {
            id: chat.message_id,
            user: {
              id: otherUser.id,
              name: `${otherUser.firstName} ${otherUser.lastName}`,
              pic: otherUser.profilePic,
              username: otherUser.username,
            },
            lastSeen: chat.message_createdAt, 
          };
        });
      
        return {
          chats: transformedChats,
        };
      }
      
}
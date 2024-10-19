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

    async getMessage(userIdentifier: string): Promise<any> {

        const chats = await this.messageRepository
          .createQueryBuilder('message')
          .leftJoinAndSelect('message.sender', 'sender')
          .leftJoinAndSelect('message.receiver', 'receiver')
          .select([
            'message.id',
            'sender.id',
            'sender.profilePic',
            'sender.username',
            'receiver.id',
            'receiver.profilePic',
            'receiver.username',
            'message.createdAt',
          ])
          .where('message.senderId = :userPhone OR message.receiverId = :userIdentifier', { userIdentifier }) 
          .orderBy('message.createdAt', 'DESC') 
          .getRawMany();
      
        const transformedChats = chats.map((chat) => {
          const otherUser = chat.sender_id === userIdentifier ? chat.receiver : chat.sender; 
          return {
            id: chat.message_id,
            user: {
              id: otherUser.id,
              name: `${otherUser.username}`,
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
import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Message} from "./entity/message.entity";
import {Repository} from "typeorm";
import {User} from "@/User/user/entity/user.entity";


@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
    }

    async getMessage(user: User): Promise<any> {

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
                'message.createdAt',
                'sender.id',
                'sender.profilePic',
                'sender.name',
                'sender.username',
                'receiver.id',
                'receiver.profilePic',
                'receiver.name',
                'receiver.username',
            ])
            .where('message.senderId = :userId OR message.receiverId = :userId', { userId })
            .distinctOn(['message.senderId', 'message.receiverId'])  // Ensure unique chats
            .orderBy('message.senderId')  // Match the DISTINCT ON columns
            .addOrderBy('message.receiverId')  // Match the DISTINCT ON columns
            .addOrderBy('message.createdAt', 'DESC')  // Sort by the latest message
            .limit(10)
            .getRawMany();

        const transformedChats = chats.map((chat) => {
            console.log(chat)
            const otherUser = chat.sender_id === userId ? {
                id: chat.receiver_id,
                name: chat.receiver_name,
                username: chat.receiver_username,
                pic: chat.receiver_profilePic,
            } : {
                id: chat.sender_id,
                name: chat.sender_name,
                username: chat.sender_username,
                pic: chat.sender_profilePic,
            };
            return {
                id: otherUser.id,
                user: otherUser,
                lastSeen: chat.message_createdAt,
            };
        });

        return {
            chats: transformedChats,
        };
    }

    async getMessagesForChat(
        senderId: number,
        receiverId: number
    ): Promise<any> {
        // Ensure sender and receiver exist
        const sender = await this.userRepository.findOne({where: {id: senderId}});
        const receiver = await this.userRepository.findOne({where: {id: receiverId}});

        if (!sender || !receiver) {
            throw new NotFoundException('Sender or Receiver not found');
        }

        // Fetch messages exchanged between the two users (both directions)
        const messages = await this.messageRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')   // Ensure sender data is loaded
            .leftJoinAndSelect('message.receiver', 'receiver') // Ensure receiver data is loaded
            .where('(message.senderId = :senderId AND message.receiverId = :receiverId)', { senderId, receiverId })
            .orWhere('(message.senderId = :receiverId AND message.receiverId = :senderId)', { senderId, receiverId })
            .orderBy('message.createdAt', 'ASC')  // Sort messages by creation date
            .getMany();

        return {
            chat: {
                id: 0,
                user: {
                    id: receiver.id,
                    name: receiver.name,
                    username: receiver.username,
                    pic: receiver.profilePic,
                },
            },
            messages: messages.map(msg => ({
                id: msg.id,
                content: msg.content,
                createdAt: msg.createdAt,
                sender: msg.sender,
            }))
        };
    }


    async sendMessage(
        user: User,
        receiverId: number,
        content: string
    ): Promise<any> {
        // Ensure sender and receiver are valid
        const sender = user;
        const receiver = await this.userRepository.findOne({where: {id: receiverId}});

        if (!sender || !receiver) {
            throw new NotFoundException('Sender or Receiver not found');
        }

        // Create a new message
        const message = this.messageRepository.create();
        message.sender = sender;
        message.receiver = receiver;
        message.content = content;

        // Save the message in the database
        await this.messageRepository.save(message);

        return {
            message: 'Message sent successfully',
            messageDetails: {
                id: message.id,
                content: message.content,
                sender: message.sender,
                receiver: message.receiver,
                timestamp: message.createdAt
            }
        };
    }

}
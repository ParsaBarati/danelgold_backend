import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {User} from "@/User/user/entity/user.entity";
import {NotificationService} from "@/Social/Notification/notification.service";
import { Message } from "./entity/message.entity";
import { NotificationAction } from "@/Social/Notification/entity/notification.entity";


@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private notification: NotificationService,
    ) {
    }

    async getMessage(user: User): Promise<any> {
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userId = user.id;

        // Fetch latest messages involving the user
        const chats = await this.messageRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.receiver', 'receiver')
            .select([
                'message.id AS message_id',
                'message.content AS message_content',
                'message.createdAt AS message_created_at',
                'sender.id AS sender_id',
                'sender.profilePic AS sender_profile_pic',
                'sender.name AS sender_name',
                'sender.username AS sender_username',
                'receiver.id AS receiver_id',
                'receiver.profilePic AS receiver_profile_pic',
                'receiver.name AS receiver_name',
                'receiver.username AS receiver_username',
            ])
            .where('message.senderId = :userId OR message.receiverId = :userId', {userId})
            .orderBy('message.createdAt', 'DESC')  // Sort by createdAt to get latest messages first
            .getRawMany();  // Use getRawMany to get raw results

        // Check if chats were retrieved
        if (!chats || chats.length === 0) {
            return {chats: []};  // Return empty if no chats found
        }

        // Create a map to hold unique chats
        const uniqueChatsMap = new Map<string, any>();

        // Iterate through chats to filter unique conversations
        for (const chat of chats) {
            const otherUser = chat.sender_id === userId ? {
                id: chat.receiver_id,
                name: chat.receiver_name,
                username: chat.receiver_username,
                pic: chat.receiver_profile_pic,
            } : {
                id: chat.sender_id,
                name: chat.sender_name,
                username: chat.sender_username,
                pic: chat.sender_profile_pic,
            };

            // Create a unique key for the conversation based on user IDs
            const uniqueKey = `${Math.min(chat.sender_id, chat.receiver_id)}_${Math.max(chat.sender_id, chat.receiver_id)}`;

            // Check if this conversation has already been added to the map
            if (!uniqueChatsMap.has(uniqueKey)) {
                uniqueChatsMap.set(uniqueKey, {
                    id: otherUser.id,
                    user: otherUser,
                    lastSeen: chat.message_created_at,
                });
            }
        }

        // Convert the map to an array of unique chats
        const uniqueChats = Array.from(uniqueChatsMap.values());

        return {
            chats: uniqueChats,
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
            .leftJoinAndSelect('message.story', 'story') // Ensure story data is loaded (if any)
            .leftJoinAndSelect('message.post', 'post') // Ensure post data is loaded (if any)
            .where('(message.senderId = :senderId AND message.receiverId = :receiverId)', {senderId, receiverId})
            .orWhere('(message.senderId = :receiverId AND message.receiverId = :senderId)', {senderId, receiverId})
            .orderBy('message.createdAt', 'ASC')  // Sort messages by creation date
            .getMany();

        // Format messages for response
        const formattedMessages = messages.map(msg => {
            const formattedMessage: any = {
                id: msg.id,
                content: msg.content,
                createdAt: msg.createdAt,
                sender: msg.sender,
                story: msg.story ? {
                    id: msg.story.id,
                    thumbnail: msg.story.thumbnail, // Assuming story has a title
                    isStory: true,
                    isAvailable: msg.story && (new Date().getTime() - new Date(msg.story.createdAt).getTime() <= 24 * 60 * 60 * 1000), // Check if created in last 24 hours

                    // Add other fields as necessary
                } : null,
                post: msg.post ? {
                    id: msg.post.id,
                    thumbnail: msg.post.mediaUrl, // Assuming post has a title
                    isStory: false,
                    isReel: false,
                    isAvailable: true,
                    // Add other fields as necessary
                } : null,
            };
            return formattedMessage;
        });

        return {
            chat: {
                id: receiver.id,
                user: {
                    id: receiver.id,
                    name: receiver.name,
                    username: receiver.username,
                    pic: receiver.profilePic,
                },
            },
            messages: formattedMessages,
        };
    }


    async sendMessage(
        user: User,
        receiverId: number,
        content: string,
        storyId?: number,
        postId?: number,
        replyId?: number
    ): Promise<any> {
        // Ensure sender and receiver are valid
        const sender = await this.userRepository.findOne({where: {id: user.id}});
        const receiver = await this.userRepository.findOne({where: {id: receiverId}});

        if (!sender || !receiver) {
            throw new NotFoundException('Sender or Receiver not found');
        }

        // Create a new message
        const message = this.messageRepository.create();
        message.sender = sender;
        message.receiver = receiver;
        message.content = content;

        if (storyId) {
            message.storyId = storyId;
        }
        if (postId) {
            message.postId = postId;
        }
        if (replyId) {
            message.replyId = replyId;
        }

        // Save the message in the database
        const sentMessage = await this.messageRepository.save(message);
        if (receiver.firebaseToken) {
            this.notification.sendPushNotificationToPushId(receiver.firebaseToken, `A new message from ${sender.username}`, {
                type: "message",
                message: JSON.stringify({
                    id: sentMessage.id,
                    timestamp: sentMessage.createdAt,
                    content: sentMessage.content,
                    storyId: message.storyId,  // Include optional fields in the response
                    postId: message.postId,
                    replyId: message.replyId,
                    sender: sender,

                }),
            }, message.content.substring(0, 100));
        }

        await this.notification.sendNotification(
            receiverId,               // Recipient: the user receiving the message
            NotificationAction.MESSAGE,   // Action type could be 'POST' or a new 'MESSAGE' type
            `New message from ${sender.username}`, // Notification title
            sender.profilePic,  // Thumbnail, e.g., sender's profile picture
            sender.id                  // Sender: the user who sent the message
        );

        return {
            message: 'Message sent successfully',
            messageDetails: {
                id: message.id,
                content: message.content,
                sender: message.sender,
                receiver: message.receiver,
                storyId: message.storyId,  // Include optional fields in the response
                postId: message.postId,
                replyId: message.replyId,
                timestamp: message.createdAt
            }
        };
    }

    async shareContent(
        user: User,
        userIds: number[], // Array of user IDs to whom the content will be shared
        content: string,
        storyId?: number,
        postId?: number
    ): Promise<any> {
        // Ensure sender is valid
        const sender = user;
        if (!sender) {
            throw new NotFoundException('Sender not found');
        }

        // Validate receivers
        const receivers = await this.userRepository.find({
            where: {id: In(userIds)} // Using 'In' to find users by their IDs
        });
        if (receivers.length === 0) {
            throw new NotFoundException('No receivers found');
        }

        const sentMessages = [];

        // Iterate through each receiver and send the message
        for (const receiver of receivers) {
            console.log(receiver)
            // Create a new message
            const message = this.messageRepository.create();
            message.sender = sender;
            message.receiver = receiver;
            message.content = content;

            if (storyId) {
                message.storyId = storyId;
            }
            if (postId) {
                message.postId = postId;
            }

            // Save the message in the database
            const sentMessage = await this.messageRepository.save(message);
            sentMessages.push(sentMessage);

            // Send a notification if the receiver has a valid firebase token
            if (receiver.firebaseToken) {
                await this.notification.sendPushNotificationToPushId(receiver.firebaseToken, `Shared content from ${sender.username}`, {
                    type: "share",
                    message: JSON.stringify({
                        id: sentMessage.id,
                        timestamp: sentMessage.createdAt,
                        content: sentMessage.content,
                        storyId: message.storyId,
                        postId: message.postId,
                        sender: sender,
                    }),
                }, content.substring(0, 100));
            }
        }

        return {
            message: 'Content shared successfully',
            sharedMessages: sentMessages.map(msg => ({
                id: msg.id,
                content: msg.content,
                sender: msg.sender,
                receiver: msg.receiver,
                storyId: msg.storyId,
                postId: msg.postId,
                timestamp: msg.createdAt,
            }))
        };
    }

}
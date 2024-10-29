import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {User} from "@/User/user/entity/user.entity";
import {NotificationService} from "@/Social/Notification/notification.service";
import {Message} from "./entity/message.entity";
import {likePost} from "@/Social/Post/like-post/entity/like-post.entity";
import {savePost} from "@/Social/Post/save-post/entity/save-post.entity";
import {Post} from "@/Social/Post/posts/entity/posts.entity";
import {NotificationAction} from "@/Social/Notification/entity/notification.entity";
import {BlockUser} from "@/Social/Block/entity/block.entity";
import {Story} from "@/Social/Story/stories/entity/stories.entity";


@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        @InjectRepository(Story)
        private storyRepository: Repository<Story>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(BlockUser)
        private blockUserRepository: Repository<BlockUser>,
        @InjectRepository(likePost)
        private likePostRepository: Repository<likePost>,
        @InjectRepository(savePost)
        private savePostRepository: Repository<savePost>,
        private notificationService: NotificationService,
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

        // Check if either user has blocked the other
        const [isBlocked, iHaveBlocked] = await Promise.all([
            this.blockUserRepository.findOneBy({blockerId: receiverId, blockedId: senderId}),
            this.blockUserRepository.findOneBy({blockerId: senderId, blockedId: receiverId})
        ]);

        if (isBlocked) {
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
                messages: [],
                isBlocked: true,
                iHaveBlocked: !!iHaveBlocked,
            };
        }

        // Fetch messages exchanged between the two users (both directions)
        const messages = await this.messageRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndSelect('message.receiver', 'receiver')
            .leftJoinAndSelect('message.story', 'story') // Load story data if any
            .leftJoinAndSelect('message.post', 'post') // Load post data if any
            .leftJoinAndSelect('message.replyMessage', 'replyMessage') // Load reply data if any
            .leftJoinAndSelect('message.storyReply', 'storyReply') // Load reply data if any
            .leftJoinAndSelect('replyMessage.post', 'replyMessage.post') // Load post data from the reply message
            .leftJoinAndSelect('replyMessage.story', 'replyMessage.story') // Load story data from the reply message
            .where('(message.senderId = :senderId AND message.receiverId = :receiverId)', {senderId, receiverId})
            .orWhere('(message.senderId = :receiverId AND message.receiverId = :senderId)', {senderId, receiverId})
            .orderBy('message.createdAt', 'ASC')
            .getMany();

        // Format messages for response
        const formattedMessages = messages.map(msg => {
            // Initial formatted message structure with essential fields
            const formattedMessage: any = {
                id: msg.id,
                content: msg.content,
                createdAt: msg.createdAt,
                sender: msg.sender, // Sender information for the message

                // Check if the message has an associated story
                story: msg.story ? {
                    id: msg.story.id,
                    thumbnail: msg.story.thumbnail,
                    isStory: true,
                    // Check if the story is available based on the 24-hour timeframe
                    isAvailable: (new Date().getTime() - new Date(msg.story.createdAt).getTime()) <= 24 * 60 * 60 * 1000
                } : null, // Null if no story is associated with this message

                // Check if the message has an associated post
                post: msg.post ? {
                    id: msg.post.id,
                    thumbnail: msg.post.mediaUrl,
                    isStory: false,
                    isReel: false,
                    isAvailable: true // Post is always considered available
                } : null, // Null if no post is associated with this message

                // Initialize placeholders for story and message replies
                storyReply: null,
                messageReply: null
            };

            // If this message is a reply to another message and not a story reply
            if (msg.replyMessage !== null) {
                // Populate messageReply with details from the replied message
                formattedMessage.messageReply = {
                    id: msg.replyMessage.id,
                    content: msg.replyMessage.content,
                    createdAt: msg.replyMessage.createdAt,
                    senderId: msg.senderId,
                    // Include story information if the replied message has an associated story
                    story: msg.replyMessage.story ? {
                        id: msg.replyMessage.story.id,
                        thumbnail: msg.replyMessage.story.thumbnail,
                        isStory: true,
                        isAvailable: (new Date().getTime() - new Date(msg.replyMessage.story.createdAt).getTime()) <= 24 * 60 * 60 * 1000
                    } : null, // Null if no story is associated with the replied message

                    // Include post information if the replied message has an associated post
                    post: msg.replyMessage.post ? {
                        id: msg.replyMessage.post.id,
                        thumbnail: msg.replyMessage.post.mediaUrl,
                        isStory: false,
                        isReel: false,
                        isAvailable: true
                    } : null // Null if no post is associated with the replied message
                };
            }
            // If this message is a reply to a story (and not another message)
            else if (msg.storyReply !== null) {
                // Populate storyReply with story details
                formattedMessage.storyReply = {
                    id: msg.storyReply.id,
                    thumbnail: msg.storyReply.thumbnail,
                    isStory: true,
                    // Check if the story reply is available based on the 24-hour timeframe
                    isAvailable: (new Date().getTime() - new Date(msg.storyReply.createdAt).getTime()) <= 24 * 60 * 60 * 1000
                };
            }

            return formattedMessage; // Return the formatted message object for each message in the array
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
            isBlocked: !!isBlocked,
            iHaveBlocked: !!iHaveBlocked,
            messages: formattedMessages,
        };
    }


    async sendMessage(
        user: User,
        receiverId: number,
        content: string,
        storyId?: number,
        postId?: number,
        replyId?: number,
        isStoryReply?: boolean // Add isStoryReply parameter
    ): Promise<any> {
        // Ensure sender and receiver are valid
        const sender = await this.userRepository.findOne({where: {id: user.id}});
        const receiver = await this.userRepository.findOne({where: {id: receiverId}});

        if (!sender || !receiver) {
            throw new NotFoundException('Sender or Receiver not found');
        }

        // Check if the sender is blocked by the receiver
        const isBlocked = await this.blockUserRepository.findOneBy({
            blockerId: receiver.id,
            blockedId: sender.id
        });

        if (isBlocked) {
            throw new NotFoundException('You are blocked and cannot send a message to this user');
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
            if (isStoryReply) {
                message.storyReplyId = replyId
            } else {
                message.replyId = replyId;
            }
        }

        // Save the message in the database
        const sentMessage = await this.messageRepository.save(message);

        // Fetch associated post and story if available
        const post = postId ? await this.postRepository.findOne({where: {id: postId}}) : null;
        const story = storyId ? await this.storyRepository.findOne({where: {id: storyId}}) : null;
        const replyMessage = replyId ? await this.messageRepository.findOne({where: {id: replyId}}) : null;

        // Format the message details for response and Firebase
        const formattedMessage: any = {
            id: sentMessage.id,
            content: sentMessage.content,
            createdAt: sentMessage.createdAt,
            receiver: {
                id: receiver.id,
                username: receiver.username,
                profilePic: receiver.profilePic,
                name: receiver.name,
            },
            sender: {
                id: sender.id,
                username: sender.username,

                profilePic: sender.profilePic,
                name: sender.name,
            },
            // Check if the message has an associated story
            story: story ? {
                id: story.id,
                thumbnail: story.thumbnail, // Assuming thumbnail is part of the story
                isStory: true,
                isAvailable: (new Date().getTime() - new Date(story.createdAt).getTime()) <= 24 * 60 * 60 * 1000,
            } : null,
            // Check if the message has an associated post
            post: post ? {
                id: post.id,
                thumbnail: post.mediaUrl, // Assuming mediaUrl is part of the post
                isStory: false,
                isReel: false,
                isAvailable: true,
            } : null,
            // Initialize placeholders for story and message replies
            storyReply: null,
            messageReply: null,
        };

        // If this message is a reply to another message
        if (replyMessage) {
            formattedMessage.messageReply = {
                id: replyMessage.id,
                content: replyMessage.content,
                createdAt: replyMessage.createdAt,
                senderId: replyMessage.senderId,
                // Include story information if the replied message has an associated story
                story: replyMessage.story ? {
                    id: replyMessage.story.id,
                    thumbnail: replyMessage.story.thumbnail,
                    isStory: true,
                    isAvailable: (new Date().getTime() - new Date(replyMessage.story.createdAt).getTime()) <= 24 * 60 * 60 * 1000,
                } : null,
                // Include post information if the replied message has an associated post
                post: replyMessage.post ? {
                    id: replyMessage.post.id,
                    thumbnail: replyMessage.post.mediaUrl,
                    isStory: false,
                    isReel: false,
                    isAvailable: true,
                } : null,
            };
        }

        // Send notification if receiver has a Firebase token
        if (receiver.firebaseToken) {
            this.notificationService.sendPushNotificationToPushId(
                receiver.firebaseToken,
                `${sender.username} Sent a message`,
                {
                    type: "message",
                    message: JSON.stringify(formattedMessage), // Use formatted message
                },
                message.content.substring(0, 100) // Truncate content for the notification body
            );
        }

        return {
            message: 'Message sent successfully',
            messageDetails: formattedMessage, // Return the formatted message structure
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
        console.log(receivers)
        // Iterate through each receiver and send the message
        for (const receiver of receivers) {
            console.log(receiver)
            // Create a new message
            const message = this.messageRepository.create();
            message.sender = sender;
            message.receiver = receiver;
            message.content = content;

            let type;
            let thumb = null;
            if (storyId) {
                message.storyId = storyId;
                type = 'story';
            }
            if (postId) {
                message.postId = postId;
                type = 'post';
                const post = await this.postRepository.findOne({where: {id: postId}});
                if (post) {
                    thumb = post.media;
                    post.shares += 1;
                    await this.postRepository.save(post);
                } else {
                    throw  new NotFoundException("Post not found");
                }
            }

            // Save the message in the database
            const sentMessage = await this.messageRepository.save(message);
            sentMessages.push(sentMessage);

            // Send a notification
            this.notificationService.sendNotification(user.id, NotificationAction.SHARE, `${user.username} shared a ${type}`, thumb, user.id,);

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


    async getPostsInChat(senderId: number,
                         receiverId: number) {
        const posts = await this.messageRepository
            .createQueryBuilder('message')
            .leftJoinAndSelect('message.post', 'post')
            .leftJoinAndSelect('post.postLikes', 'postLikes')
            .leftJoinAndSelect('post.comments', 'comments')
            .leftJoinAndSelect('post.user', 'user') // Include post creator's information
            .where(
                '(message.senderId = :senderId AND message.receiverId = :receiverId) OR ' +
                '(message.senderId = :receiverId AND message.receiverId = :senderId)',
                {senderId, receiverId}
            )
            .andWhere('message.postId IS NOT NULL') // Only messages with posts
            .select([
                'post.id AS post_id',
                'post.mediaUrl AS post_mediaUrl',
                'post.caption AS post_caption',
                'post.likes AS post_likes',
                'post.dislikes AS post_dislikes',
                'post.shares AS post_shares',
                'user.id AS user_id',
                'user.name AS user_name',
                'user.profilePic AS user_profilepic',
                'user.username AS user_username',
                'COUNT(comments.id) AS comments_count',
                'COUNT(postLikes.id) AS like_count',
                'post.createdAt AS createdAt',
                'post.media AS post_media',
                'post.content AS post_content',
            ])
            .groupBy('post.id, user.id') // Group to count likes and comments correctly
            .getRawMany();


        const finalPosts = [];

        for (const post of posts) {
            // یافتن اطلاعات لایک و ذخیره بودن پست برای کاربر
            const existingLike = await this.likePostRepository.findOne({
                where: {post: {id: post.id}, user: {id: senderId}},
            });
            const existingSave = await this.savePostRepository.findOne({
                where: {post: {id: post.id}, user: {id: senderId}},
            });

            if (post.post_id > 0) {
                finalPosts.push({
                    content: post.post_content, // Structure for additional images if needed
                    media: post.media,
                    id: post.post_id,
                    user: {
                        id: post.user_id,
                        name: post.user_name,
                        pic: post.user_profilepic,
                        username: post.user_username,
                    },
                    caption: post.post_caption,
                    img: post.post_media,
                    likes: post.post_likes,
                    dislikes: post.post_dislikes,
                    commentsCount: post.comments_count,
                    sharesCount: post.post_shares, // If you have a share count, replace this
                    comments: [], // You'll need to fetch and structure comments separately if needed
                    createdAt: post.createdAt,
                    isLiked: (!!existingLike && existingLike.isLike == 1), // Set based on your logic
                    isDisliked: (!!existingLike && existingLike.isLike == -1), // Set based on your logic
                    isSaved: (!!existingSave), // Set based on your logic

                });
            }
        }

        return finalPosts;
    }

}
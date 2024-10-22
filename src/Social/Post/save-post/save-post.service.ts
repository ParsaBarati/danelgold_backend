import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Post} from '@/Social/Post/posts/entity/posts.entity';
import {likePost} from '@/Social/Post/like-post/entity/like-post.entity';
import {User} from '@/User/user/entity/user.entity';
import {savePost} from "@/Social/Post/save-post/entity/save-post.entity";

@Injectable()
export class SavePostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(likePost)
        private readonly likePostRepository: Repository<likePost>,
        @InjectRepository(savePost)
        private savePostRepository: Repository<savePost>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    async savePost(
        postId: number,
        user: User,
    ): Promise<{ saves: number }> {

        const saveblePost = await this.postRepository.findOneBy(
            {id: postId}
        );

        if (!saveblePost) {
            throw new NotFoundException('Post not found!');
        }


        if (!user) {
            throw new NotFoundException('User not found');
        }

        let existingSave = await this.savePostRepository.findOne({
            where: {post: {id: postId}, user: {id: user.id}},
        });
        console.log(existingSave)

        if (!existingSave) {
            console.log(postId,user)
            const save = await this.savePostRepository.create({
                postId: postId,
                userId: user.id,
            });
            console.log(save)
            await this.savePostRepository.save(save);

            saveblePost.saves++;
        } else {
            await this.savePostRepository.remove(existingSave);
            saveblePost.saves--;
        }

        try {
            await this.postRepository.save(saveblePost);
        } catch (e) {
            console.info(e)
        }

        return {saves: saveblePost.saves};
    }
}

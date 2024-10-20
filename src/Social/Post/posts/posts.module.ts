import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/posts.entity';
import { User } from '@/User/user/entity/user.entity';
import { PostsController } from './posts.controller';
import { PostService } from './posts.service';
import { PaginationService } from '@/common/paginate/pagitnate.service';

@Module({
    imports: [TypeOrmModule.forFeature([Post,User])],
    controllers: [PostsController],
    providers: [PostService,PaginationService]
})
export class PostsModule {}

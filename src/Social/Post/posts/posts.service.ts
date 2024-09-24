import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "./entity/posts.entity";
import { Repository } from "typeorm";


@Injectable()
export class PostService{
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>
    ){}
}
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogPost } from "./entity/blog-post.entity";
import { BlogCategory } from "../blog-catagory/entity/blog-catagory.entity";
import { BlogPostController } from "./blog-post.controller";
import { BlogPostService } from "./blog-post.service";
import { PaginationService } from "@/common/paginate/pagitnate.service";


@Module({
    imports: [TypeOrmModule.forFeature([BlogPost,BlogCategory])],
    controllers: [BlogPostController],
    providers: [BlogPostService,PaginationService]
})
export class BlogPostModule{}
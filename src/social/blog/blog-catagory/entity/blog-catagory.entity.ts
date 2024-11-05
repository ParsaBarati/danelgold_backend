import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Relation } from 'typeorm';
import { BlogPost } from '../../blog-post/entity/blog-post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class BlogCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => BlogPost, blogPost => blogPost.category)
    @ApiProperty({ type: () => [BlogPost]})
    blogPosts: Relation<BlogPost[]>;
}

import { User } from '@/user/user/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Relation } from 'typeorm';
import { BlogCategory } from '../../blog-catagory/entity/blog-catagory.entity';

@Entity()
export class BlogPost {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    verticalCover: string;

    @Column()
    horizontalCover: string;

    @Column('text')
    text: string;

    @Column()
    subTitle: string;

    @ManyToOne(() => User, (author) => author.blogPost)
    @JoinColumn({ name: 'authorId' })
    @ApiProperty({ type: () => User })
    author: Relation<User>;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => BlogCategory, category => category.blogPosts)
    @JoinColumn({ name: 'categoryId' })
    @ApiProperty({ type: () => BlogCategory})
    category: Relation<BlogCategory>;
}

import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation} from 'typeorm';
import {User} from '@/User/user/entity/user.entity';
import {ApiProperty} from '@nestjs/swagger';

@Entity('follow')
export class FollowUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int'})
    followerId: number;

    @Column({ type: 'int'})
    followingId: number;

    @ManyToOne(() => User, user => user.following)
    @JoinColumn({name: 'followerId', referencedColumnName: 'id'})
    @ApiProperty({type: () => User})
    follower: Relation<User>;

    @ManyToOne(() => User, user => user.followers)
    @JoinColumn({name: 'followingId', referencedColumnName: 'id'})
    @ApiProperty({type: () => User})
    following: Relation<User>;
}

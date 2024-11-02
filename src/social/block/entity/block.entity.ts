import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { User } from '@/user/user/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('block')
export class BlockUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    blockerId: number;

    @Column({ type: 'int' })
    blockedId: number;

    @ManyToOne(() => User, user => user.blockedUsers)
    @JoinColumn({ name: 'blockerId', referencedColumnName: 'id' })
    @ApiProperty({ type: () => User })
    blocker: Relation<User>;

    @ManyToOne(() => User, user => user.blockingUsers)
    @JoinColumn({ name: 'blockedId', referencedColumnName: 'id' })
    @ApiProperty({ type: () => User })
    blocked: Relation<User>;
}

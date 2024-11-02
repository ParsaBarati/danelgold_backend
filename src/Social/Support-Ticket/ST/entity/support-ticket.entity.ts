import { User } from '@/user/user/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Relation, JoinColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { RST } from '@/social/support-ticket/rst/entity/rst.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
}

@Entity({ name: 'ST' })
export class SupportTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RST, (rsts) => rsts.parentST)
  @ApiProperty({ type: () => RST })
  rsts: Relation<RST[]>

  @ManyToOne(() => User, (user) => user.supportTickets)
  @ApiProperty({ type: () => User })
  user: Relation<User>;
}

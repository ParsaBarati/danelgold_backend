import { User } from '@/User/user/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Relation, JoinColumn } from 'typeorm';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
}

@Entity()
export class SupportTicket {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'varchar' })
  userPhone: string;

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

  @ManyToOne(() => User, (user) => user.supportTickets)
  @JoinColumn({ name: 'userPhone',referencedColumnName: 'phone'})
  user: Relation<User>;
}

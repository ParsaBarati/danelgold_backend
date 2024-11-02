import { ApiProperty } from '@nestjs/swagger';
import { SupportTicket } from '../../st/entity/support-ticket.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';

@Entity('rst')
export class RST {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updatedAt: Date | null;

  @Column({ type: 'int', nullable: true })
  parentSTId: number | null;

  @ManyToOne(() => SupportTicket, (ST) => ST.rsts)
  @JoinColumn({ name: 'parentSTId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => SupportTicket })
  parentST: Relation<SupportTicket>;
}

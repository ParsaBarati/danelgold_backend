import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('upload')
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  size: number | null;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar' })
  destination: string;

  @Column({ type: 'varchar', nullable: true })
  memType: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  lastModified: Date | null;
}

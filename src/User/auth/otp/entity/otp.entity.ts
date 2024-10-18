import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('otp')
export class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  email: string; // New field for email OTP

  @Column({ type: 'varchar' })
  otp: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expirationTime: Date | null;
}

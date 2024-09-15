import { Entity, PrimaryColumn, Column, Generated } from 'typeorm';

@Entity('session')
export class Session {
  @Column({ type: 'int' })
  @Generated('increment')
  id: number;

  @PrimaryColumn({ type: 'varchar' })
  sid: string;

  @Column({ type: 'json' })
  sess: Record<string, any>;

  @Column({ type: 'timestamp' })
  expire: Date;
}

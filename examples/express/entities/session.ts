import { SessionEntity } from 'typeorm-store'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm'
import { User } from './user'

@Entity('Session')
export class Session extends BaseEntity implements SessionEntity {
  @PrimaryColumn()
  public id: string

  @Column()
  public data: string

  @Column({ type: 'time', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string

  @Column({ type: 'time', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: string

  @Column()
  expiresAt: number

  /*
  @ManyToOne((type) => User)
  @JoinColumn({ name: 'id' })
  user: User
  */
}

import { ISession } from 'connect-typeorm'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn
} from 'typeorm'
import { User } from './user'

@Entity('Session')
export class Session implements ISession {
  @Index()
  @Column('bigint')
  public expiredAt = Date.now()

  @PrimaryColumn('varchar', { length: 255 })
  public id = ''

  @Column('text')
  public json = ''

  @Column({ type: 'time', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string

  @Column({ type: 'time', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: string

  @Column({ type: 'time' })
  expiresAt: string

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'id' })
  user: User
}

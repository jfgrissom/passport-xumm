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

  @Column({ default: () => new Date().getTime() })
  createdAt: number

  @Column({ default: () => new Date().getTime() })
  updatedAt: number

  @Column()
  expiresAt: number

  /*
  @ManyToOne((type) => User)
  @JoinColumn({ name: 'id' })
  user: User
  */
}

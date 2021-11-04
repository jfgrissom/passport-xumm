import { SessionEntity } from 'typeorm-store'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn
} from 'typeorm'
import { User } from './user'

@Entity('Session')
export class Session extends BaseEntity implements SessionEntity {
  @PrimaryColumn() // This is a UUID generated by the app not an integer generated by the DB.
  public id: string

  @Column() // Cookie data that shows up in the browser and a cookie.
  public data: string

  @Column({ default: () => new Date().getTime() })
  createdAt: number

  @Column({ default: () => new Date().getTime() })
  updatedAt: number

  @Column()
  expiresAt: number

  @OneToOne(() => User) // Optional because some user sessions are anonymous (unauthenticated).
  @JoinColumn()
  user?: User
}

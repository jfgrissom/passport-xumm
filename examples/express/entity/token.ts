import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm'

import { User } from './user'

@Entity('Token')
export class Token {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'time', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string

  @Column({ type: 'time', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: string

  @Column()
  hashedToken: string

  @Column({ type: 'time' })
  expiresAt: string

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'id' })
  user: User
}

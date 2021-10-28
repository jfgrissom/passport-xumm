import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn
} from 'typeorm'
import { Session } from './session'
import { Token } from './token'

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name?: string

  @Column({ type: 'time', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string

  @Column({ type: 'time', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: string

  @OneToMany((type) => Token, (Token) => Token.id)
  @JoinColumn({ name: 'id' })
  tokens: Token[]

  @OneToMany((type) => Session, (Session) => Session.id)
  @JoinColumn({ name: 'id' })
  sessions: Session[]
}

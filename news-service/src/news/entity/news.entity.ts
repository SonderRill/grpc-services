import { UserEntity } from './user.entity'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'

@Entity('news')
export class NewsEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ length: 55000 })
  article: string

  @ManyToOne(() => UserEntity, (user) => user.createdNews)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @ManyToMany(() => UserEntity, (user) => user.likedPosts, {
    cascade: true
  })
  @JoinTable()
  likes: UserEntity[]

  @ManyToMany(() => UserEntity, (user) => user.viewedPosts, {
    cascade: true
  })
  @JoinTable()
  views: UserEntity[]

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updated_at',
  })
  updatedAt: Date
}

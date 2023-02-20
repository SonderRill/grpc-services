import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
  Index,
} from 'typeorm'
import { NewsEntity } from './news.entity'

@Entity('user_to_news')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'bigint', name: 'user_id' })
  @Index('IDX_user_to_news__user_id')
  userId: number

  @OneToMany(() => NewsEntity, (news) => news.user)
  createdNews: NewsEntity[]

  @ManyToMany(() => NewsEntity, (news) => news.likes)
  likedPosts: NewsEntity[]

  @ManyToMany(() => NewsEntity, (news) => news.views)
  viewedPosts: NewsEntity[]

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

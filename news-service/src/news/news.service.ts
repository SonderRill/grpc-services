import { CreateNewsRequestDto } from './dto/requests/create-news-request.dto'
import { UserEntity } from './entity/user.entity'
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { NewsEntity } from './entity/news.entity'

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly _newsRepository: Repository<NewsEntity>,
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async find(): Promise<NewsEntity[]> {
    return this._newsRepository.createQueryBuilder('news')
      .loadRelationCountAndMap('news.likesCount', 'news.likes')
      .loadRelationCountAndMap('news.viewsCount', 'news.views')
      .getMany()

  }

  async findOne(id: number): Promise<NewsEntity> {
    const news = await this._newsRepository.findOneBy({ id })

    if (!news) {
      throw new NotFoundException('News not found')
    }

    return news
  }

  async create({ article, authorId }: CreateNewsRequestDto & { authorId: number }): Promise<NewsEntity> {
    let user = await this._getOrCreateUser(authorId)

    const product = this._newsRepository.create({
      article,
      user,
    })

    return this._newsRepository.save(product)
  }

  async addLike(id: number, userId: number) {
    const news = await this._newsRepository.findOne({ where: { id }, relations: ['likes'] })

    if (!news) {
      throw new NotFoundException('News not found')
    }

    const isLaked = news.likes.some((like) => like.userId == userId)

    if (isLaked) {
      throw new ForbiddenException('You already like')
    }

    let user = await this._getOrCreateUser(userId)

    news.likes.push(user)

    await this._newsRepository.save(news)
    return news
  }

  async addView(id: number, userId: number) {
    const news = await this._newsRepository.findOne({ where: { id }, relations: ['views'] })

    if (!news) {
      throw new NotFoundException('News not found')
    }

    const isViewed = news.views.some((view) => view.userId == userId)

    if (isViewed) {
      throw new ForbiddenException('You already viewed')
    }

    let user = await this._getOrCreateUser(userId)

    news.views.push(user)

    await this._newsRepository.save(news)
    return news
  }

  async delete(id: number, authorId: number): Promise<NewsEntity> {
    const news = await this._newsRepository.findOneBy({
      id,
      user: { userId: authorId },
    })

    if (!news) {
      throw new ForbiddenException("You can't delete this news")
    }

    return this._newsRepository.remove(news)
  }

  private async _getOrCreateUser(userId: number) {
    let user = await this._userRepository.findOneBy({
      userId,
    })

    if (!user) {
      user = this._userRepository.create({
        userId,
      })

      await this._userRepository.save(user)
    }

    return user
  }

}

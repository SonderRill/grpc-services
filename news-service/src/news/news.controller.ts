import { Roles } from './guards/roles.decorator'
import { CreateNewsRequestDto } from './dto/requests/create-news-request.dto'
import { NewsEntity } from './entity/news.entity'
import { Controller, Inject, Get, Param, Delete, Post, Body, Put, UseGuards } from '@nestjs/common'
import { NewsService } from './news.service'
import { AuthGuard } from './guards/auth.guard'
import { RolesGuard } from './guards/roles.guard'
import { Role } from './enums/role.enum'
import { HttpUser } from './guards/http-user.decorator'
import { User } from './interfaces/user'

@Controller()
export class ProductController {
  @Inject(NewsService)
  private readonly _newService: NewsService

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createNews: CreateNewsRequestDto, @HttpUser() user: User): Promise<NewsEntity> {
    return this._newService.create({ ...createNews, authorId: user.userId })
  }

  @Get(':newsId')
  findOne(@Param('newsId') newsId: string): Promise<NewsEntity> {
    return this._newService.findOne(+newsId)
  }

  @Get()
  find(): Promise<NewsEntity[]> {
    return this._newService.find()
  }

  @UseGuards(AuthGuard)
  @Put(':newsId/like')
  addLike(@Param('newsId') newsId: string, @HttpUser() user: User): Promise<NewsEntity> {
    return this._newService.addLike(+newsId, user.userId)
  }

  @UseGuards(AuthGuard)
  @Put(':newsId/view')
  addView(@Param('newsId') newsId: string, @HttpUser() user: User): Promise<NewsEntity> {
    return this._newService.addView(+newsId, user.userId)
  }

  @UseGuards(AuthGuard)
  @Delete(':newsId')
  delete(@Param('newsId') newsId: string, @HttpUser() user: User): Promise<NewsEntity> {
    return this._newService.delete(+newsId, user.userId)
  }
}

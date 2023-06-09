import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseInterceptors,
  Param,
  Delete,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  Req,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from 'src/common/interceptors/global.response.interceptor';
import { GlobalExceptionFilter } from '../../../common/filter/global.exception.filter';
import { FeedRequestDto } from '../dto/feed.request.dto';
import { FeedService } from '../service/feed.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { PositiveIntPipe } from '../../../common/pipes/positiveInt.pipe';

@Controller('feed')
@UseInterceptors(GlobalResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('/search')
  async getFeedMbti(@Query('mbti') mbti: string, @Query() user_id) {
    return this.feedService.getFeedMbti(mbti, user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FilesInterceptor('thumbnail', 5))
  async createFeed(
    @Body() body: FeedRequestDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req,
  ) {
    const user_id = req.user;
    return this.feedService.createFeed(body, user_id, files);
  }

  @Get()
  getAllFeed(@Query() req) {
    return this.feedService.getAllFeed(req);
  }

  @Get('/:feed_id')
  findFeedById(@Param('feed_id') feed_id, @Query() user_id) {
    return this.feedService.findFeedById(feed_id, user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:feed_id')
  deleteFeed(@Param('feed_id') feed_id, @Req() req) {
    const user_id = req.user;
    return this.feedService.deleteFeed(feed_id, user_id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:feedId/pick')
  async pickedFeed(
    @Req() req,
    @Param('feedId', ParseIntPipe) feed_id: number,
  ): Promise<{ message: string }> {
    const user_id = req.user;

    const chkPicked = await this.feedService.checkPicked(user_id, feed_id);

    if (!chkPicked) {
      return { message: '찜하기가 취소되었습니다.' };
    }

    return { message: '찜목록에 추가되었습니다.' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:feed_id/like')
  async createFeedLike(@Param('feed_id') feed_id, @Req() req) {
    const user_id = req.user;
    const isFeedLike = await this.feedService.checkFeedLike(feed_id, user_id);

    if (isFeedLike) {
      return '좋아요를 취소했습니다.';
    }
    return '좋아요 했습니다.';
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:feed_id/like')
  async getLikeCheck(
    @Param('feed_id', ParseIntPipe, PositiveIntPipe) feed_id: number,
    @Req() req,
  ) {
    const user_id = req.user;
    return this.feedService.getLikeCheck(feed_id, user_id);
  }
}

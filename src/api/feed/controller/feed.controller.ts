import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from 'src/common/interceptors/global.response.interceptor';
import { GlobalExceptionFilter } from '../../../common/filter/global.exception.filter';
import { FeedRequestDto } from '../dto/feed.request.dto';
// import { FeedService } from '../service/feed.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('feed')
@ApiTags('feed')
@UseInterceptors(GlobalResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
export class FeedController {
  // constructor(private readonly feedService: FeedService) {}
  // @ApiOperation({ summary: '피드 만들기' })
  // @ApiResponse({
  //   status: 200,
  //   description: '성공!',
  //   type: FeedRequestDto,
  // })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Server Error...',
  // })
  // @ApiResponse({
  //   status: 412,
  //   description: 'title or description는 필수값 입니다',
  // })
  // @Post()
  // async createFeed(@Body() body: FeedRequestDto) {
  //   const userId = { userId: 2 };
  //   return this.feedService.createFeed(body, userId);
  // }
  //
  // @ApiOperation({ summary: '게시글 이미지 업로드' })
  // // @UseInterceptors(FilesInterceptor('image', 10, multerOptions('feedImg')))
  // // @UseGuards(JwtAuthGuard)
  // @Post('upload')
  // uploadCatImg() {
  //   // @CurrentUser() feedImg: FeedImg, // @UploadedFiles() files: Array<Express.Multer.File>,
  //   // return this.feedService.uploadImg(feedImg, files);
  // }
}

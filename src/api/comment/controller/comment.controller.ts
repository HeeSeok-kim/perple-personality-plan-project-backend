import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from 'src/common/interceptors/global.response.interceptor';
import { GlobalExceptionFilter } from '../../../common/filter/global.exception.filter';
import { CommentService } from '../service/comment.service';
import { AuthGuard } from '@nestjs/passport';
import { CommentCreateDto } from '../dto/comment.create.dto';

@Controller('feeds/:feedId/comments')
@UseInterceptors(GlobalResponseInterceptor)
@UseFilters(GlobalExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/')
  async createComment(
    @Req() req,
    @Param('feedId') feedId: number,
    @Body()
    body: CommentCreateDto,
  ) {
    const userId = req.user as number;
    return this.commentService.createComment(userId, feedId, body);
  }

  @Delete('/:commentId')
  deleteComment(
    @Req() req,
    @Param('feedId') feedId: number,
    @Param('commentId') commentId: number,
  ) {
    const userId = req.user as number;
    return this.commentService.deleteComment(commentId, userId);
  }
}

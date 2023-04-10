import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentRepository } from '../comment.repository';
import { CommentCreateDto } from '../dto/comment.create.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(userId: number, feedId: number, body: CommentCreateDto) {
    return this.commentRepository.createComment(userId, feedId, body);
  }

  async deleteComment(commentId: number, userId: number) {
    const isComment = await this.commentRepository.findComment(commentId);

    if (!isComment) {
      throw new BadRequestException('존재하지 않는 댓글 입니다.');
    }

    if (isComment.user_id !== userId) {
      throw new BadRequestException('본인 댓글만 삭제 가능합니다.');
    }
    const deleteComment = await this.commentRepository.deleteComment(
      commentId,
      userId,
    );
    if (deleteComment) {
      return `댓글이 삭제 되었습니다.`;
    }
  }
}

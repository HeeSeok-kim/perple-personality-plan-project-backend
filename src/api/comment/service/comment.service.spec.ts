import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { CommentRepository } from '../comment.repository';
import { CommentCreateDto } from '../dto/comment.create.dto';
import { BadRequestException } from '@nestjs/common';

const mockCommentRepository = () => ({
  createComment: jest.fn(),
  findComment: jest.fn(),
  deleteComment: jest.fn(),
});

describe('CommentService', () => {
  let commentService: CommentService;
  let commentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: CommentRepository,
          useFactory: mockCommentRepository,
        },
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
    commentRepository = module.get<CommentRepository>(CommentRepository);
  });

  it('댓글 서비스 테스트', () => {
    expect(commentService).toBeDefined();
  });

  describe('댓글 생성 API테스트', () => {
    it('댓글 생성 정상 케이스', async () => {
      const userId = 1;
      const feedId = 123;
      const commentCreateDto = { comment: 'Test comment' };
      const expectedResult = { id: 1, ...commentCreateDto };

      commentRepository.createComment.mockResolvedValue(expectedResult);

      const result = await commentService.createComment(
        userId,
        feedId,
        commentCreateDto,
      );
      expect(result).toEqual(expectedResult);
      expect(commentRepository.createComment).toHaveBeenCalledWith(
        userId,
        feedId,
        commentCreateDto,
      );
    });
  });

  describe('댓글 삭제 API 테스트', () => {
    it('댓글이 존재 하지 않는 경우', async () => {
      const commentId = 1;
      const userId = 1;

      commentRepository.findComment.mockResolvedValue(null);

      await expect(
        commentService.deleteComment(commentId, userId),
      ).rejects.toThrow(BadRequestException);
      expect(commentRepository.findComment).toHaveBeenCalledWith(commentId);
    });

    it('본인 댓글이 아닌 경우', async () => {
      const commentId = 1;
      const userId = 1;
      const comment = { user_id: 2 };

      commentRepository.findComment.mockResolvedValue(comment);

      await expect(
        commentService.deleteComment(commentId, userId),
      ).rejects.toThrow(BadRequestException);
      expect(commentRepository.findComment).toHaveBeenCalledWith(commentId);
    });

    it('댓글 정상 삭제 케이스', async () => {
      const commentId = 1;
      const userId = 1;
      const comment = { user_id: 1 };
      const expectedResult = '댓글이 삭제 되었습니다.';

      commentRepository.findComment.mockResolvedValue(comment);
      commentRepository.deleteComment.mockResolvedValue(1);

      const result = await commentService.deleteComment(commentId, userId);
      expect(result).toEqual(expectedResult);
      expect(commentRepository.deleteComment).toHaveBeenCalledWith(
        commentId,
        userId,
      );
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from '../service/comment.service';

// Mock CommentService
const mockCommentService = () => ({
  createComment: jest.fn(),
  deleteComment: jest.fn(),
});

describe('CommentController', () => {
  let commentController: CommentController;
  let commentService: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useFactory: mockCommentService,
        },
      ],
    }).compile();

    commentController = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(commentController).toBeDefined();
  });

  describe('댓글 생성 컨트롤러 테스트', () => {
    it('댓글 생성 결과 전송 ', async () => {
      const userId = 1;
      const feedId = 123;
      const commentCreateDto = { comment: 'Test comment' };
      const expectedResult = { id: 1, ...commentCreateDto };

      commentService.createComment = jest.fn().mockResolvedValue(expectedResult);

      const req = { user: userId };
      expect(
        await commentController.createComment(req, feedId, commentCreateDto),
      ).toEqual(expectedResult);
      expect(commentService.createComment).toHaveBeenCalledWith(
        userId,
        feedId,
        commentCreateDto,
      );
    });
  });

  describe('댓글 삭제 컨트롤러 테스트', () => {
    it('댓글 삭제 결과 전송', async () => {
      const userId = 1;
      const feedId = 123;
      const commentId = 1;
      const expectedResult = '댓글이 삭제 되었습니다.';

      commentService.deleteComment = jest
        .fn()
        .mockResolvedValue(expectedResult);

      const req = { user: userId };
      expect(
        await commentController.deleteComment(req, feedId, commentId),
      ).toEqual(expectedResult);
      expect(commentService.deleteComment).toHaveBeenCalledWith(
        commentId,
        userId,
      );
    });
  });
});

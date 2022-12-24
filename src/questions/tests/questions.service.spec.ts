import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from '../entities/question.entity';
import { Comment } from '../entities/comment.entity';
import { QuestionsService } from '../questions.service';
import { Repository } from 'typeorm';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let module: TestingModule;
  let questionRepository: Repository<Question>;
  let commentRepository: Repository<Comment>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: getRepositoryToken(Question),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    questionRepository = module.get<Repository<Question>>(
      getRepositoryToken(Question),
    );
    commentRepository = module.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
  });

  describe('createQuestion', () => {
    it('should save question using repository', async () => {
      const dto = {
        user_first_name: 'john',
        user_last_name: 'smith',
        text: 'testing 123',
      };
      const result = {
        ...dto,
        id: 1,
      };

      questionRepository.save = jest.fn().mockResolvedValueOnce(result);

      expect(await service.createQuestion(dto)).toEqual(result);
      expect(questionRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('createComment', () => {
    it('should save comment using repository', async () => {
      const mockQuestion = { id: 1 };
      const mockParentComment = { id: 10 };
      const questionId = 1;
      const dto = {
        user_first_name: 'jane',
        user_last_name: 'doe',
        text: 'testing 123',
        parent_id: 10,
      };
      const result = {
        ...dto,
        id: 1,
        question_id: mockQuestion.id,
        parent_id: mockParentComment.id,
      };

      (service as any).validateAndFindQuestion = jest
        .fn()
        .mockResolvedValueOnce(mockQuestion);

      (service as any).validateAndFindParent = jest
        .fn()
        .mockResolvedValueOnce(mockParentComment);

      commentRepository.save = jest.fn().mockResolvedValueOnce(result);

      expect(await service.createComment(questionId, dto)).toEqual(result);
      expect((service as any).validateAndFindQuestion).toHaveBeenCalledWith(
        questionId,
      );
      expect((service as any).validateAndFindParent).toHaveBeenCalledWith(
        dto.parent_id,
      );
      expect(commentRepository.save).toHaveBeenCalledWith({
        user_first_name: dto.user_first_name,
        user_last_name: dto.user_last_name,
        text: dto.text,
        question: mockQuestion,
        parent: mockParentComment,
      });
    });
  });

  describe('getComments', () => {
    it('should get comments using repository', async () => {
      const questionId = 1;
      const mockComments = [
        {
          id: 1,
          question: {},
        },
      ];

      (service as any).validateAndFindQuestion = jest
        .fn()
        .mockResolvedValueOnce({});

      commentRepository.find = jest.fn().mockResolvedValueOnce(mockComments);

      expect(await service.getComments(questionId)).toEqual([{ id: 1 }]);
      expect(commentRepository.find).toHaveBeenCalledWith({
        relations: { question: true, parent: true },
        where: { question: { id: questionId } },
      });
    });
  });

  describe('validateAndFindQuestion', () => {
    const questionId = 1;

    it('should throw NotFoundException when no question found', async () => {
      questionRepository.findOneBy = jest.fn().mockResolvedValueOnce(null);

      await expect(
        (service as any).validateAndFindQuestion(questionId),
      ).rejects.toThrow(NotFoundException);
      expect(questionRepository.findOneBy).toHaveBeenCalledWith({
        id: questionId,
      });
    });

    it('should return question', async () => {
      questionRepository.findOneBy = jest.fn().mockResolvedValueOnce({});

      expect(
        await (service as any).validateAndFindQuestion(questionId),
      ).toEqual({});
      expect(questionRepository.findOneBy).toHaveBeenCalledWith({
        id: questionId,
      });
    });
  });

  describe('validateAndFindParent', () => {
    const parentId = 1;

    it('should return undefined if parentId parameter is missing', async () => {
      expect(await (service as any).validateAndFindParent()).toEqual(undefined);
    });

    it('should throw NotFoundException when no parent comment found', async () => {
      commentRepository.findOneBy = jest.fn().mockResolvedValueOnce(null);

      await expect(
        (service as any).validateAndFindParent(parentId),
      ).rejects.toThrow(NotFoundException);
      expect(commentRepository.findOneBy).toHaveBeenCalledWith({
        id: parentId,
      });
    });

    it('should return parent comment', async () => {
      commentRepository.findOneBy = jest.fn().mockResolvedValueOnce({});

      expect(await (service as any).validateAndFindParent(parentId)).toEqual(
        {},
      );
      expect(commentRepository.findOneBy).toHaveBeenCalledWith({
        id: parentId,
      });
    });
  });
});

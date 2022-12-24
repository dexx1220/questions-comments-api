import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from '../questions.controller';
import { QuestionsService } from '../questions.service';

describe('QuestionsController', () => {
  let controller: QuestionsController;
  let module: TestingModule;
  let service: QuestionsService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [{ provide: QuestionsService, useValue: {} }],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
    service = module.get<QuestionsService>(QuestionsService);
  });

  describe('createQuestion', () => {
    it('should create question using service', async () => {
      const dto = {
        user_first_name: 'john',
        user_last_name: 'smith',
        text: 'how are you?',
      };
      const result = {
        ...dto,
        id: 1,
      };

      service.createQuestion = jest.fn().mockResolvedValueOnce(result);

      expect(await controller.createQuestion(dto)).toEqual(result);
      expect(service.createQuestion).toHaveBeenCalledWith(dto);
    });
  });

  describe('createComment', () => {
    it('should create comment using service', async () => {
      const dto = {
        user_first_name: 'jane',
        user_last_name: 'doe',
        text: 'how is the weather today?',
        parent_id: 1,
      };
      const result = {
        ...dto,
        id: 1,
      };
      const questionId = 10;

      service.createComment = jest.fn().mockResolvedValueOnce(result);

      expect(await controller.createComment(questionId, dto)).toEqual(result);
      expect(service.createComment).toHaveBeenCalledWith(questionId, dto);
    });
  });

  describe('getQuestionComments', () => {
    it('should get question comments using service', async () => {
      const result = [];
      const questionId = 11;

      service.getComments = jest.fn().mockResolvedValueOnce(result);

      expect(await controller.getQuestionComments(questionId)).toEqual(result);
      expect(service.getComments).toHaveBeenCalledWith(questionId);
    });
  });
});

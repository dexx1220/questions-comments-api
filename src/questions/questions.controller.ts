import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionResponse } from './interfaces/question.interface';
import {
  BaseCommentResponse,
  CommentResponse,
} from './interfaces/comment.interface';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async createQuestion(
    @Body() body: CreateQuestionDto,
  ): Promise<QuestionResponse> {
    return await this.questionsService.createQuestion(body);
  }

  @Post('/:id/comments')
  async createComment(
    @Param('id') questionId: number,
    @Body() body: CreateCommentDto,
  ): Promise<CommentResponse> {
    return await this.questionsService.createComment(questionId, body);
  }

  @Get('/:id/comments')
  async getQuestionComments(
    @Param('id') questionId: number,
  ): Promise<BaseCommentResponse[]> {
    return await this.questionsService.getComments(questionId);
  }
}

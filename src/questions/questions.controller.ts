import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QuestionResponse } from './dto/question-response.dto';
import { CommentResponse } from './dto/comment-response.dto';

@ApiTags('Questions & Comments')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Question created by user returned as response',
    type: QuestionResponse,
  })
  async createQuestion(
    @Body() body: CreateQuestionDto,
  ): Promise<QuestionResponse> {
    return await this.questionsService.createQuestion(body);
  }

  @Post('/:id/comments')
  @ApiCreatedResponse({
    description: 'Comment created by user returned as response',
    type: CommentResponse,
  })
  @ApiNotFoundResponse({
    description:
      'If question or parent comment is not found, then 404 returned',
  })
  async createComment(
    @Param('id') questionId: number,
    @Body() body: CreateCommentDto,
  ): Promise<CommentResponse> {
    return await this.questionsService.createComment(questionId, body);
  }

  @Get('/:id/comments')
  @ApiOkResponse({
    description: 'Comments of a question returned as response',
    type: [CommentResponse],
  })
  @ApiNotFoundResponse({
    description: 'If question is not found, then 404 returned',
  })
  async getQuestionComments(
    @Param('id') questionId: number,
  ): Promise<CommentResponse[]> {
    return await this.questionsService.getComments(questionId);
  }

  @Delete('/:id/comments/:commentId')
  async deleteComment(
    @Param('id') questionId: number,
    @Param('commentId') commentId: number,
  ): Promise<void> {
    return await this.questionsService.deleteComment(questionId, commentId);
  }
}

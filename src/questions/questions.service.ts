import { Injectable, NotFoundException } from '@nestjs/common';
import { Question } from './entities/question.entity';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionResponse } from './interfaces/question.interface';
import {
  BaseCommentResponse,
  CommentResponse,
} from './interfaces/comment.interface';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,

    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async createQuestion(dto: CreateQuestionDto): Promise<QuestionResponse> {
    return await this.questionRepository.save(dto);
  }

  async createComment(
    questionId: number,
    dto: CreateCommentDto,
  ): Promise<CommentResponse> {
    const question = await this.validateAndFindQuestion(questionId);

    const { user_first_name, user_last_name, text, parent_comment_id } = dto;

    const parentComment = await this.validateAndFindParent(parent_comment_id);

    return await this.commentRepository.save({
      user_first_name,
      user_last_name,
      text,
      question,
      ...(parentComment ? { parent: parentComment } : {}),
    });
  }

  async getComments(questionId: number): Promise<BaseCommentResponse[]> {
    await this.validateAndFindQuestion(questionId);

    const comments = await this.commentRepository.find({
      relations: { question: true, parent: true },
      where: {
        question: {
          id: questionId,
        },
      },
    });

    return comments.map((comment) => {
      const { question, ...result } = comment;
      return result;
    });
  }

  private async validateAndFindQuestion(questionId: number): Promise<Question> {
    const question = await this.questionRepository.findOneBy({
      id: questionId,
    });

    if (!question) {
      throw new NotFoundException(`Question with ID: ${questionId} not found.`);
    }

    return question;
  }

  private async validateAndFindParent(
    parentId?: number,
  ): Promise<Comment | undefined> {
    if (!parentId) return;

    const comment = await this.commentRepository.findOneBy({
      id: parentId,
    });

    if (!comment) {
      throw new NotFoundException(
        `Parent comment with ID: ${parentId} not found.`,
      );
    }

    return comment;
  }
}

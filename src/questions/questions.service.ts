import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Question } from './entities/question.entity';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QuestionResponse } from './dto/question-response.dto';
import { CommentResponse } from './dto/comment-response.dto';

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

    const { user_first_name, user_last_name, text, parent_id } = dto;

    const parentComment = await this.validateAndFindParent(
      questionId,
      parent_id,
    );

    const result = await this.commentRepository.save({
      user_first_name,
      user_last_name,
      text,
      question,
      ...(parentComment ? { parent: parentComment } : {}),
    });

    return {
      id: result.id,
      user_first_name,
      user_last_name,
      text,
      question_id: question.id,
      parent_id,
      created_at: result.created_at,
      updated_at: result.updated_at,
    };
  }

  async getComments(questionId: number): Promise<CommentResponse[]> {
    await this.validateAndFindQuestion(questionId);

    const comments = await this.commentRepository.find({
      relations: { question: true, parent: true, children: true },
      where: {
        question: {
          id: questionId,
        },
      },
    });

    const commentsWithoutParents = comments.filter((c) => !c.parent);

    return commentsWithoutParents.map((c) => {
      const { question, ...result } = c;
      return {
        ...result,
        question_id: question.id,
        children: this.mapChildren(c),
      };
    });
  }

  mapChildren(comment: Comment): CommentResponse[] {
    if (!comment.children) return [];

    const { question } = comment;

    return comment.children.map((child) => {
      const { ...childResult } = child;
      return {
        ...childResult,
        question_id: question.id,
        parent_id: comment?.id,
        children: this.mapChildren(child),
      };
    });
  }

  async deleteComment(questionId: number, commentId: number): Promise<void> {
    await this.questionRepository.manager.transaction(async (entityManager) => {
      await entityManager.update(
        Comment,
        { id: commentId },
        { text: 'Deleted' },
      );
      await entityManager.softDelete(Comment, { id: commentId });
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
    questionId: number,
    parentId?: number,
  ): Promise<Comment | undefined> {
    if (!parentId) return;

    const comment = await this.commentRepository.findOne({
      where: { id: parentId },
      relations: { question: true },
    });

    if (!comment) {
      throw new NotFoundException(
        `Parent comment with ID: ${parentId} not found.`,
      );
    }

    if (comment.question.id.toString() !== questionId.toString()) {
      throw new BadRequestException('Wrong question for comment.');
    }

    return comment;
  }
}

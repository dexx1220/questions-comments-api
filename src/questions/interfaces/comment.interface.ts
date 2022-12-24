import { QuestionResponse } from './question.interface';

export interface BaseCommentResponse {
  id: number;
  user_first_name: string;
  user_last_name: string;
  text: string;
  parent?: BaseCommentResponse;
  created_at: string;
  updated_at: string;
}

export interface CommentResponse extends BaseCommentResponse {
  question: QuestionResponse;
}

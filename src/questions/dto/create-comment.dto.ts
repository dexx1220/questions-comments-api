export interface CreateCommentDto {
  user_first_name: string;
  user_last_name: string;
  text: string;
  parent_comment_id?: number;
}

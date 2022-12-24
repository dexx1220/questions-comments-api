import { ApiProperty } from '@nestjs/swagger';

export class CommentResponse {
  @ApiProperty({
    description: 'ID of comment',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'First name of author/user who created the comment',
  })
  user_first_name: string;

  @ApiProperty({
    description: 'Last name of author/user who created the comment',
  })
  user_last_name: string;

  @ApiProperty({
    description: 'The comment itself',
  })
  text: string;

  @ApiProperty({
    description: 'The ID of the question to which the comment belongs',
    example: 1,
  })
  question_id: number;

  @ApiProperty({
    description:
      'The ID of the parent comment. Will be present if created comment is a response to another comment. Otherwise it is null.',
    example: 10,
    required: false,
  })
  parent_id?: number;

  @ApiProperty({
    description: 'Creation date of comment',
    example: '2022-12-24T18:44:19.000Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Update date of comment',
    example: '2022-12-24T18:44:19.000Z',
  })
  updated_at: string;
}

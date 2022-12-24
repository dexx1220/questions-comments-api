import { ApiProperty } from '@nestjs/swagger';

export class QuestionResponse {
  @ApiProperty({
    description: 'ID of question',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'First name of author/user who created the question',
  })
  user_first_name: string;

  @ApiProperty({
    description: 'Last name of author/user who created the question',
  })
  user_last_name: string;

  @ApiProperty({
    description: 'The question itself',
  })
  text: string;

  @ApiProperty({
    description: 'Creation date of question',
    example: '2022-12-24T18:44:19.000Z',
  })
  created_at: string;

  @ApiProperty({
    description: 'Update date of question',
    example: '2022-12-24T18:44:19.000Z',
  })
  updated_at: string;
}

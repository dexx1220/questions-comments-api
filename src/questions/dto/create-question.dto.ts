import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'First name of user/author creating question',
    example: 'John',
  })
  user_first_name: string;

  @ApiProperty({
    description: 'Last name of user/author creating question',
    example: 'Smith',
  })
  user_last_name: string;

  @ApiProperty({
    description: 'The question being posed',
    example: 'How are you?',
  })
  text: string;
}

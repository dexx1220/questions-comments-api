import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'First name of user/author creating comment',
    example: 'John',
  })
  user_first_name: string;

  @ApiProperty({
    description: 'Last name of user/author creating question',
    example: 'Smith',
  })
  user_last_name: string;

  @ApiProperty({
    description: 'The comment itself',
    example: 'This looks neat.',
  })
  text: string;

  @ApiProperty({
    description:
      'The ID of parent comment object. If comment being created is a response to another comment, then this will be populated. Otherwise it will be null.',
    example: 10,
    required: false,
  })
  parent_id?: number;
}

import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { Comment } from './comment.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_first_name: string;

  @Column()
  user_last_name: string;

  @Column()
  text: string;

  @OneToMany(() => Comment, (comment) => comment.question)
  comments: Comment[];

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}

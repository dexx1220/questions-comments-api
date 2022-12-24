import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Question } from './question.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_first_name: string;

  @Column()
  user_last_name: string;

  @Column()
  text: string;

  @ManyToOne(() => Question, (question) => question.comments)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => Comment, (comment) => comment.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;
}

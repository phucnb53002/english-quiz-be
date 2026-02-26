import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
  @Prop({ type: Types.ObjectId, ref: 'Exam', required: false })
  examId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctAnswer: number;

  @Prop({ default: 'easy' })
  level: 'easy' | 'medium' | 'hard';
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

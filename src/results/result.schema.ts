import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ResultDocument = HydratedDocument<Result>;

@Schema({ timestamps: true })
export class Result {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  percentage: number;

  @Prop({ type: [{ questionId: String, correct: Boolean, yourAnswer: Number, correctAnswer: Number }] })
  results: { questionId: string; correct: boolean; yourAnswer: number; correctAnswer: number }[];

  @Prop({ default: 0 })
  timeSpent: number;
}

export const ResultSchema = SchemaFactory.createForClass(Result);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExamDocument = HydratedDocument<Exam>;

@Schema({ timestamps: true })
export class Exam {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);

import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateResultDto {
  @IsString()
  userId: string;

  @IsString()
  userName: string;

  @IsNumber()
  score: number;

  @IsNumber()
  total: number;

  @IsNumber()
  percentage: number;

  @IsArray()
  results: { questionId: string; correct: boolean; yourAnswer: number; correctAnswer: number }[];

  @IsNumber()
  timeSpent: number;
}

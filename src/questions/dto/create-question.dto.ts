import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsIn,
  MinLength,
  MaxLength,
  ArrayMinSize,
} from 'class-validator';

export class CreateQuestionDto {
  @IsOptional()
  @IsString()
  examId?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  content: string;

  @IsArray()
  @ArrayMinSize(2, { message: 'At least 2 options are required' })
  @IsString({ each: true })
  options: string[];

  @IsNumber()
  @IsNotEmpty()
  correctAnswer: number;

  @IsIn(['easy', 'medium', 'hard'])
  level?: 'easy' | 'medium' | 'hard';
}

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  examId?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  options?: string[];

  @IsOptional()
  @IsNumber()
  correctAnswer?: number;

  @IsIn(['easy', 'medium', 'hard'])
  level?: 'easy' | 'medium' | 'hard';
}

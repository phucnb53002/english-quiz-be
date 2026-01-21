import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsEnum,
  MinLength,
  MaxLength,
  ArrayMinSize,
  IsIn,
} from 'class-validator';

export class CreateQuestionDto {
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

  @IsEnum(['easy', 'medium', 'hard'])
  @IsIn(['easy', 'medium', 'hard'])
  level?: 'easy' | 'medium' | 'hard';
}

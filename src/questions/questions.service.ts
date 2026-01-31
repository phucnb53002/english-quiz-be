import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question, QuestionDocument } from './question.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const questionData: any = {
      content: createQuestionDto.content,
      options: createQuestionDto.options,
      correctAnswer: createQuestionDto.correctAnswer,
      level: createQuestionDto.level || 'easy',
    };

    if (createQuestionDto.examId) {
      questionData.examId = new Types.ObjectId(createQuestionDto.examId);
    }

    const question = new this.questionModel(questionData);
    return question.save();
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }

  async findByExam(examId: string): Promise<Question[]> {
    return this.questionModel
      .find({ examId: new Types.ObjectId(examId) })
      .exec();
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionModel.findById(id).exec();
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const updateData: any = { ...updateQuestionDto };

    if (updateQuestionDto.examId) {
      updateData.examId = new Types.ObjectId(updateQuestionDto.examId);
    }

    const question = await this.questionModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question;
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.questionModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Question not found');
    }

    return { message: 'Question deleted successfully' };
  }

  async findAllForQuiz(): Promise<Question[]> {
    const questions = await this.questionModel
      .find()
      .select('-correctAnswer')
      .exec();
    return questions;
  }

  async submitQuiz(answers: { questionId: string; answer: number }[]): Promise<{
    score: number;
    total: number;
    percentage: number;
    results: {
      questionId: string;
      correct: boolean;
      yourAnswer: number;
      correctAnswer: number;
    }[];
  }> {
    let correct = 0;
    const results: {
      questionId: string;
      correct: boolean;
      yourAnswer: number;
      correctAnswer: number;
    }[] = [];

    for (const answer of answers) {
      const question = await this.questionModel
        .findById(answer.questionId)
        .exec();
      if (question) {
        const isCorrect = question.correctAnswer === answer.answer;
        if (isCorrect) {
          correct++;
        }
        results.push({
          questionId: answer.questionId,
          correct: isCorrect,
          yourAnswer: answer.answer,
          correctAnswer: question.correctAnswer,
        });
      }
    }

    const total = answers.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return {
      score: correct,
      total,
      percentage,
      results,
    };
  }
}

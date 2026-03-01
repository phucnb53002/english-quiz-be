import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateExamDto, UpdateExamDto } from './dto/create-exam.dto';
import { Exam, ExamDocument } from './exam.schema';
import { Question, QuestionDocument } from '../questions/question.schema';

@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name)
    private readonly examModel: Model<ExamDocument>,
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const exam = new this.examModel(createExamDto);
    return exam.save();
  }

  async findAll(): Promise<Exam[]> {
    return this.examModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Exam> {
    const exam = await this.examModel.findById(id).exec();
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }
    return exam;
  }

  async findOneWithQuestions(
    id: string,
  ): Promise<{ exam: Exam; questions: Question[] }> {
    const exam = await this.examModel.findById(id).exec();
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }
    const questions = await this.questionModel
      .find({ examId: new Types.ObjectId(id) })
      .exec();
    return { exam, questions };
  }

  async findAllWithQuestionCount(): Promise<
    (Exam & { questionCount: number })[]
  > {
    const exams = await this.examModel.find().sort({ createdAt: -1 }).exec();

    const examsWithCount = await Promise.all(
      exams.map(async (exam) => {
        const count = await this.questionModel
          .countDocuments({ examId: exam._id })
          .exec();
        return { ...exam.toObject(), questionCount: count };
      }),
    );

    return examsWithCount;
  }

  async update(id: string, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = await this.examModel
      .findByIdAndUpdate(id, updateExamDto, { new: true })
      .exec();
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }
    return exam;
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.questionModel
      .deleteMany({ examId: new Types.ObjectId(id) })
      .exec();
    const result = await this.examModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Exam not found');
    }
    return { message: 'Exam deleted successfully' };
  }

  async getExamForQuiz(examId: string): Promise<Question[]> {
    const questions = await this.questionModel
      .find({ examId: new Types.ObjectId(examId) })
      .select('-correctAnswer')
      .exec();
    return questions;
  }

  async getAllActiveExams(): Promise<(Exam & { questionCount: number })[]> {
    const exams = await this.examModel
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .exec();

    const examsWithCount = await Promise.all(
      exams.map(async (exam) => {
        const count = await this.questionModel
          .countDocuments({ examId: exam._id })
          .exec();
        return { ...exam.toObject(), questionCount: count };
      }),
    );

    return examsWithCount;
  }

  async submitQuiz(
    examId: string,
    answers: { questionId: string; answer: number }[],
  ): Promise<{
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

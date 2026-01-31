import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateResultDto } from './dto/create-result.dto';
import { Result, ResultDocument } from './result.schema';

@Injectable()
export class ResultsService {
  constructor(
    @InjectModel(Result.name)
    private readonly resultModel: Model<ResultDocument>,
  ) {}

  async create(createResultDto: CreateResultDto): Promise<Result> {
    const result = new this.resultModel(createResultDto);
    return result.save();
  }

  async findAllByUser(userId: string): Promise<Result[]> {
    return this.resultModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findAll(): Promise<Result[]> {
    return this.resultModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Result> {
    const result = await this.resultModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException('Result not found');
    }
    return result;
  }

  async getStats(): Promise<{
    totalSubmissions: number;
    averageScore: number;
    passRate: number;
    recentResults: Result[];
    topResults: Result[];
  }> {
    const results = await this.resultModel.find().exec();
    
    const totalSubmissions = results.length;
    const averageScore = totalSubmissions > 0 
      ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / totalSubmissions)
      : 0;
    const passRate = totalSubmissions > 0 
      ? Math.round((results.filter(r => r.percentage >= 70).length / totalSubmissions) * 100)
      : 0;

    const recentResults = await this.resultModel.find().sort({ createdAt: -1 }).limit(5).exec();
    const topResults = await this.resultModel.find().sort({ percentage: -1 }).limit(5).exec();

    return {
      totalSubmissions,
      averageScore,
      passRate,
      recentResults,
      topResults,
    };
  }

  async getUserStats(userId: string): Promise<{
    totalSubmissions: number;
    averageScore: number;
    bestScore: number;
    recentResults: Result[];
  }> {
    const results = await this.resultModel.find({ userId }).sort({ createdAt: -1 }).exec();
    
    const totalSubmissions = results.length;
    const averageScore = totalSubmissions > 0 
      ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / totalSubmissions)
      : 0;
    const bestScore = totalSubmissions > 0 
      ? Math.max(...results.map(r => r.percentage))
      : 0;

    return {
      totalSubmissions,
      averageScore,
      bestScore,
      recentResults: results.slice(0, 5),
    };
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { ExamsService } from './exams.service';
import { CreateExamDto, UpdateExamDto } from './dto/create-exam.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../users/user.schema';

@UseGuards(JwtAuthGuard)
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.examsService.findAllWithQuestionCount();
  }

  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examsService.findOneWithQuestions(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(id, updateExamDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examsService.remove(id);
  }

  @Get('active/all')
  getActiveExams() {
    return this.examsService.getAllActiveExams();
  }

  @Get(':id/quiz')
  getExamForQuiz(@Param('id') id: string) {
    return this.examsService.getExamForQuiz(id);
  }

  @Post(':id/submit')
  submitQuiz(
    @Param('id') id: string,
    @Body() body: { answers: { questionId: string; answer: number }[] },
  ) {
    return this.examsService.submitQuiz(id, body.answers);
  }
}

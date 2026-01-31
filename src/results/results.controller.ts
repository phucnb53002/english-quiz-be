import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';

import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../users/user.schema';
import type { RequestWithUser } from 'src/auth/interface/request-with-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  create(@Body() createResultDto: CreateResultDto) {
    return this.resultsService.create(createResultDto);
  }

  @Get('my-history')
  getMyHistory(@Request() req: RequestWithUser) {
    return this.resultsService.findAllByUser(req.user.userId);
  }

  @Get('my-stats')
  getMyStats(@Request() req: RequestWithUser) {
    return this.resultsService.getUserStats(req.user.userId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.resultsService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('stats')
  getStats() {
    return this.resultsService.getStats();
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(id);
  }
}

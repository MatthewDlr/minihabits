import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create.dto';
import { AuthRequest } from '../auth/interfaces/request.interface';
import { UpdateHabitDto } from './dto/update.dto';
import { TrackHabitDto } from './dto/track.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  async getHabits(@Req() req: AuthRequest) {
    return this.habitsService.getHabits(req.user.sub);
  }

  @Get('types')
  getHabitTypes() {
    return this.habitsService.getHabitTypes();
  }

  @Get('stats')
  async getStats(@Req() req: AuthRequest) {
    return this.habitsService.getStats(req.user.sub);
  }

  @Post()
  async createHabit(
    @Body() createHabitDto: CreateHabitDto,
    @Req() req: AuthRequest,
  ) {
    return this.habitsService.createHabit(createHabitDto, req.user.sub);
  }

  @Delete(':id')
  async deleteHabit(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.habitsService.deleteHabit(id, req.user.sub);
  }

  @Patch(':id')
  async updateHabit(
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
    @Req() req: AuthRequest,
  ) {
    return this.habitsService.updateHabit(id, updateHabitDto, req.user.sub);
  }

  @Post(':id/track')
  async trackHabit(
    @Param('id') id: string,
    @Body() trackHabitDto: TrackHabitDto,
    @Req() req: AuthRequest,
  ) {
    return this.habitsService.trackHabit(id, trackHabitDto.date, req.user.sub);
  }

  @Delete(':id/track')
  async untrackHabit(
    @Param('id') id: string,
    @Body() trackHabitDto: TrackHabitDto,
    @Req() req: AuthRequest,
  ) {
    return this.habitsService.untrackHabit(
      id,
      trackHabitDto.date,
      req.user.sub,
    );
  }

  @Get(':id/streak')
  async getStreak(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.habitsService.getStreak(id, req.user.sub);
  }

  @Post(':id/increment')
  async incrementHabit(
    @Param('id') id: string,
    @Body() trackHabitDto: TrackHabitDto,
    @Req() req: AuthRequest,
  ) {
    return this.habitsService.incrementHabit(
      id,
      trackHabitDto.date,
      req.user.sub,
    );
  }

  @Post(':id/decrement')
  async decrementHabit(
    @Param('id') id: string,
    @Body() trackHabitDto: TrackHabitDto,
    @Req() req: AuthRequest,
  ) {
    return this.habitsService.decrementHabit(
      id,
      trackHabitDto.date,
      req.user.sub,
    );
  }
}

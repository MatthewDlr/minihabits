import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { StatsService } from '../../stats/stats.service';
import { HabitDocument, HabitType } from '../habits.schema';

@Injectable()
export class HabitsBooleanService {
  constructor(private readonly statsService: StatsService) {}

  async trackHabit(habit: HabitDocument, date: string) {
    if (habit.type !== HabitType.BOOLEAN) {
      throw new Error('This habit is not a boolean type');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');

    if (habit.completedDates.get(targetDate) === 1) {
      return habit;
    }
    habit.completedDates.set(targetDate, 1);

    habit.currentStreak = this.calculateStreak(habit.completedDates);
    habit.longestStreak = Math.max(habit.currentStreak, habit.longestStreak);

    await habit.save();
    await this.statsService.incrementTotalCompleted(date);
  }

  async untrackHabit(habit: HabitDocument, date: string) {
    if (habit.type !== HabitType.BOOLEAN) {
      throw new Error('This habit is not a boolean type');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');
    habit.completedDates.delete(targetDate);

    habit.currentStreak = this.calculateStreak(habit.completedDates);
    habit.longestStreak = Math.max(habit.currentStreak, habit.longestStreak);

    await habit.save();
    await this.statsService.decrementTotalCompleted(date);
  }

  private calculateStreak(completedDates: Map<string, number>): number {
    const today = moment().startOf('day');
    let streak = 0;
    let missedDays = 0;
    let daysInWeek = 0;

    const sortedDates = Array.from(completedDates.keys()).sort((a, b) =>
      moment(b).diff(moment(a)),
    );

    for (const dateStr of sortedDates) {
      const currentDate = moment(dateStr);
      if (currentDate.isAfter(today)) continue;

      const value = completedDates.get(dateStr);

      if (!value || value !== 1) {
        missedDays++;
        if (missedDays > 1) break;
      } else {
        streak++;
      }

      daysInWeek++;

      if (daysInWeek === 7) {
        daysInWeek = 0;
        missedDays = 0;
      }
    }
    return streak;
  }
}

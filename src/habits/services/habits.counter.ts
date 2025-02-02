import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { StatsService } from '../../stats/stats.service';
import { HabitDocument, HabitType } from '../habits.schema';

@Injectable()
export class HabitsCounterService {
  constructor(private readonly statsService: StatsService) {}

  async incrementHabit(habit: HabitDocument, date: string) {
    if (habit.type !== HabitType.COUNTER) {
      throw new Error('This habit is not a counter type');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');
    const currentValue = habit.completedDates.get(targetDate) || 0;
    habit.completedDates.set(targetDate, currentValue + 1);

    habit.currentStreak = this.calculateStreak(
      habit.completedDates,
      habit.targetCounter,
    );
    habit.longestStreak = Math.max(habit.currentStreak, habit.longestStreak);

    await habit.save();
    if (currentValue + 1 === 1) {
      await this.statsService.incrementTotalCompleted(date);
    }
  }

  async decrementHabit(habit: HabitDocument, date: string) {
    if (habit.type !== HabitType.COUNTER) {
      throw new Error('This habit is not a counter type');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');
    const currentValue = habit.completedDates.get(targetDate) || 0;

    // Prevent negative values
    if (currentValue > 0) {
      habit.completedDates.set(targetDate, currentValue - 1);
    }

    habit.currentStreak = this.calculateStreak(
      habit.completedDates,
      habit.targetCounter,
    );
    habit.longestStreak = Math.max(habit.currentStreak, habit.longestStreak);

    await habit.save();
    if (currentValue - 1 === 0) {
      await this.statsService.decrementTotalCompleted(date);
    }
  }

  private calculateStreak(
    completedDates: Map<string, number>,
    targetCounter: number,
  ): number {
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

      if (!value || value < targetCounter) {
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

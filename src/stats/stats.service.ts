import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { Stats } from './stats.schema';
import { Logger } from '@nestjs/common';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(@InjectModel(Stats.name) private statsModel: Model<Stats>) {}

  private getTodayDateComponents() {
    const today = moment().utc();
    return {
      year: today.year(),
      month: today.month() + 1, // moment months are 0-based
      day: today.date(),
    };
  }

  private getDateComponents(date: string) {
    const dateComponents = moment(date).startOf('day');
    return {
      year: dateComponents.year(),
      month: dateComponents.month() + 1,
      day: dateComponents.date(),
    };
  }

  async getHomeStats() {
    const dateComponents = this.getTodayDateComponents();
    const stats = await this.statsModel.findOne(dateComponents);
    return stats;
  }

  private async updateStats(value: number, date: string) {
    const dateComponents = this.getDateComponents(date);
    let stats = await this.statsModel.findOne(dateComponents);

    if (!stats) {
      stats = await this.statsModel.create({
        ...dateComponents,
        totalCompleted: 0,
      });
    }

    if (stats.totalCompleted + value >= 0) {
      stats.totalCompleted += value;
      await stats.save();
    }
  }

  async incrementTotalCompleted(date: string) {
    try {
      this.updateStats(1, date);
    } catch (error) {
      this.logger.error('Error incrementing total completed', error);
    }
  }

  async decrementTotalCompleted(date: string) {
    try {
      this.updateStats(-1, date);
    } catch (error) {
      this.logger.error('Error decrementing total completed', error);
    }
  }
}

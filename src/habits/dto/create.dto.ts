import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { HabitColor, HabitType } from '../habits.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHabitDto {
  @ApiProperty({
    description: 'Name of the habit',
    example: 'Daily Exercise',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Color of the habit',
    enum: HabitColor,
    required: false,
    example: HabitColor.BLUE,
  })
  @IsOptional()
  @IsEnum(HabitColor)
  color?: HabitColor;

  @ApiProperty({
    description: 'Type of the habit',
    enum: HabitType,
    required: false,
    example: HabitType.BOOLEAN,
  })
  @IsOptional()
  @IsEnum(HabitType)
  type?: HabitType;

  @ApiProperty({
    description: 'Target counter value for counter-type habits',
    required: false,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  targetCounter?: number;

  @ApiProperty({
    description: 'Description for task-type habits',
    required: false,
    example: 'Complete the project presentation',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Deadline for task-type habits (ISO string)',
    required: false,
    example: '2024-02-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}

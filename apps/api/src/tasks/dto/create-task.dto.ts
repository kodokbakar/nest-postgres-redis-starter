import { IsEnum, IsOptional, IsString, MaxLength, IsISO8601 } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsISO8601()
  dueDate?: string;
}

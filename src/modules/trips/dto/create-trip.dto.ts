import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  destination: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  @Min(0)
  budget: number;

  @IsOptional()
  @IsString()
  description?: string;
}
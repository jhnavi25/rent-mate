import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateRentalDto {
  @IsString()
  listingId!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;
}

export class MarkReturnedDto {
  @IsArray()
  @IsString({ each: true })
  photos!: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}

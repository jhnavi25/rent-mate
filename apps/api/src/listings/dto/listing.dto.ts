import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateListingDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  dailyPricePaise!: number;

  @IsInt()
  @Min(0)
  depositPaise!: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString({ each: true })
  mediaUrls?: string[];
}

export class UpdateListingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  dailyPricePaise?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  depositPaise?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  city?: string;
}

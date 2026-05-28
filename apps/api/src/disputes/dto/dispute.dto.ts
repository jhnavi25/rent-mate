import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FileDisputeDto {
  @IsInt()
  @Min(1)
  claimedAmountPaise!: number;

  @IsArray()
  @IsString({ each: true })
  evidenceUrls!: string[];

  @IsOptional()
  @IsString()
  description?: string;
}

export class ResolveDisputeDto {
  @IsInt()
  @Min(0)
  resolvedAmountPaise!: number;

  @IsOptional()
  @IsString()
  resolution?: string;
}

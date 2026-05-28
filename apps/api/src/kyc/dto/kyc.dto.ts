import { IsOptional, IsString, Length } from 'class-validator';

export class SubmitKycDto {
  @IsString()
  @Length(10, 10)
  panNumber!: string;

  @IsOptional()
  @IsString()
  aadhaarMasked?: string;

  @IsOptional()
  @IsString()
  bankAccountLast4?: string;
}

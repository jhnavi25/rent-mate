import { IsString, Length, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/)
  phone!: string;
}

export class VerifyOtpDto {
  @IsString()
  @Matches(/^\+?[0-9]{10,15}$/)
  phone!: string;

  @IsString()
  @Length(4, 6)
  code!: string;
}

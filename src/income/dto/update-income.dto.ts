import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateIncomeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;
}
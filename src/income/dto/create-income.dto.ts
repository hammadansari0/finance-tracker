import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateIncomeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  amount: number;
}
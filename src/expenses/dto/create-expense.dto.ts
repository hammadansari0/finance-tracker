import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateExpenseDto {

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  amount: number;

}
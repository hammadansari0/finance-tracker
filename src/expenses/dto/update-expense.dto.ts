import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateExpenseDto {

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

}
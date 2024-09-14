import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ description: 'Имя пользователя' })
    @IsString({ message: 'Name must be a string' })
    readonly name: string;
    @IsOptional()
    @ApiProperty({ description: 'Повышенный шанс выпадения редких бонусов' })
    @IsBoolean({ message: 'isInfluencer must be a boolean' })
    readonly isInfluencer?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateBalanceDto {
    @ApiProperty({ description: 'Величина изменения баланса' })
    @IsInt({ message: 'Amount must be an integer' })
    @Min(1, { message: 'Amount must be at least 1' })
    readonly amount: number;
  }
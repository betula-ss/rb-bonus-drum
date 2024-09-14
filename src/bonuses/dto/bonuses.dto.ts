import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Max, Min } from "class-validator";

export class CreateBonusDto {
    @ApiProperty({ description: 'Название бонуса' })
    @IsString({ message: 'Name must be a string' })
    readonly name: string;
    @ApiProperty({ description: 'Коэффициент выпадения (от 1 до 10)' })
    @IsInt({ message: 'Chance must be an integer' })
    @Min(1, { message: 'Chance must be at least 1' })
    @Max(10, { message: 'Chance must be less than or equal to 10' })
    readonly chance: number;
}

export class UpdateBonusDto extends PartialType(CreateBonusDto) {}
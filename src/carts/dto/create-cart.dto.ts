import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested } from "class-validator";
import { ItemCartDto } from "./item-cart.dto";

export class CreateCartDto {

    @IsString()
    @IsUUID()
    userId: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ItemCartDto)
    items: ItemCartDto[];

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    total?: number;
}

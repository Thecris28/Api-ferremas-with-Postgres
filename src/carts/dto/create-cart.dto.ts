import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { ItemCartDto } from "./item-cart.dto";

export class CreateCartDto {

    @IsString()
    @IsUUID()
    userId: string;

    @IsArray()
    @ArrayNotEmpty()
    @Type(() => ItemCartDto)
    items: ItemCartDto[];

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    total?: number;
}

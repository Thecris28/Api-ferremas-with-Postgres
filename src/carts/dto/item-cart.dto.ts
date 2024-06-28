import { Type } from "class-transformer";
import { IsNumber, IsPositive, IsString, Min } from "class-validator";

export class ItemCartDto {

    @IsString()
    productId: string;

    @IsNumber()
    @IsPositive()
    @Min(1)
    @Type(() => Number)
    quantity: number;
}
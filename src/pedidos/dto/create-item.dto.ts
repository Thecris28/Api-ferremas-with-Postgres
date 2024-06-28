
import { Type } from "class-transformer";
import { IsNumber, IsPositive, IsString, IsUUID, Min } from "class-validator";


export class CreateItemDto {
    @IsString()
    productId: string;

    @IsNumber()
    @IsPositive()
    @Min(1)
    @Type(() => Number)
    quantity: number;
}
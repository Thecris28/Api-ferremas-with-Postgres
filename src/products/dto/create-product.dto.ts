import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    marca: string;

    @IsString()
    @IsOptional()
    codigo?: string;

    @IsString()
    nombre: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    categoria: number;
    
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    precio: number;

    @IsNumber()
    @Min(0)
    @IsPositive()
    stock: number;
}

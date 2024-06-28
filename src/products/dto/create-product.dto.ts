import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

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
    @IsPositive()
    @Type(() => Number)
    stock: number;
}

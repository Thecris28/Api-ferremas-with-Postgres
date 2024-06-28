import { ArrayNotEmpty, IsArray, IsString, IsUUID } from "class-validator";
import { CreateItemDto } from "./create-item.dto";
import { Type } from "class-transformer";

export class CreatePedidoDto {

    @IsString()
    @IsUUID()
    userId: string;

    @IsString()
    @IsUUID()
    CartId: string;
}

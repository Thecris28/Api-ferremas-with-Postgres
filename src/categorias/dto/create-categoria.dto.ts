import { IsNotEmpty, IsString, Length } from "class-validator";


export class CreateCategoriaDto {

    @IsNotEmpty({ message: 'The name of the category cannot be empty' })
    @IsString({ message: 'The name of the category must be a string' })
    @Length(3, 50, { message: 'The name of the category must be between 3 and 50 characters' })
    nombre: string;

}

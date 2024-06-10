import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    marca: string

    @Column('text')
    codigo: string

    @Column('text', {
        unique: true
    })
    nombre: string;
    
    @Column('int')
    precio: number

    @Column('uuid')
    categoriaId: string

    @Column('int')
    stock: number

    @Column('date')
    createdAt: Date

    @Column('date',{
        nullable: true
    })
    updatedAt?: Date

}

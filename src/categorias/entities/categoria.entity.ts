import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categoria {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    nombre: string;

    @Column('date')
    createdAt: Date;
}

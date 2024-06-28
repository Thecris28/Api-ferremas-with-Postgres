import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PedidoItem } from "./pedido-Item.entity";

@Entity('pedidos')
export class Pedido {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    userId: string;

    @Column('text')
    cartId: string;

    @Column()
    date: Date;

    @OneToMany(
        () => PedidoItem, (pedidoItem) => pedidoItem.pedido, { cascade: true })
    items: PedidoItem[];

    @Column()
    amount: number
    

}

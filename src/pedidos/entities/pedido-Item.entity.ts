import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pedido } from "./pedido.entity";

@Entity('payment_details')
export class PedidoItem {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    productId: string;

    @Column()
    name: string

    @Column()
    price: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Pedido, (pedido) => pedido.items, { onDelete: 'CASCADE' })
    pedido: Pedido;

    
}
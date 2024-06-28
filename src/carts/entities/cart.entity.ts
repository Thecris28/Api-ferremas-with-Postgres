import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./cart-item.entity";

@Entity('cart')
export class Cart {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    userId: string

    @Column()
    total: number

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
    items: CartItem[]

}

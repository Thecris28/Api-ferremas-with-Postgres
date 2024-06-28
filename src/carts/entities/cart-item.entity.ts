import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";

@Entity('cart_item')
export class CartItem {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    productId : string;

    @Column()
    quantity : number;

    @ManyToMany( () => Cart , (cart) => cart.items)
    cart : Cart;
}
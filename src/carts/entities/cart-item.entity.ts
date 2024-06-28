import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";

@Entity('cart_item')
export class CartItem {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    productId : string;

    @Column()
    quantity : number;

    @ManyToOne( () => Cart , (cart) => cart.items,{ onDelete: 'CASCADE' } )
    cart : Cart ;
}
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductsService } from '../products/products.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartsService {

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository( CartItem)
    private readonly itemsRepository: Repository<CartItem>,
    private readonly productsService: ProductsService,
  ) {}

  async createCart(createCartDto: CreateCartDto) {

    const {items, userId} = createCartDto;


    const oldCart = await this.cartRepository.findOneBy({userId});

    if(oldCart) return this.updateCart(oldCart.id, createCartDto);


    let total = 0;

    let itemEntities: CartItem[] = await Promise.all( 
      items.map( async ( item ) => {
      const product = await this.productsService.findOne(item.productId);
      if(!product) throw new BadRequestException(`Product with id ${item.productId} not found`);

      if(item.quantity > product.stock) 
        throw new BadRequestException(`Product with id ${item.productId} has only ${product.stock} items`);

      total += product.precio * item.quantity;

      return this.itemsRepository.create({
        productId: item.productId,
        quantity: item.quantity
      })

    }));

    const cart = this.cartRepository.create({
      userId,
      items: itemEntities,
      total
    })

    const newCart = await this.cartRepository.save(cart);

    return newCart;
  }

  findAll() {
    return this.cartRepository.find();
  }

  async findOne(id: string) {
    const cart = await this.cartRepository.findOne({where: { id },
      relations: ['items']})
    if(!cart) throw new BadRequestException(`Cart with id ${id} not found`);
    return cart;
  }

  async updateCart(id: string, updateCartDto: UpdateCartDto) {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['items']
    });

    await this.cartRepository.delete({ id: cart.id, });

    // Elimina todos los ítems existentes
    await this.itemsRepository.delete({ cart: { id }, });

    // Crea y guarda los nuevos ítems
    const { items } = updateCartDto;

    let total = 0;

    const newItems: CartItem[] = await Promise.all( items.map(async item =>{

      const product = await this.productsService.findOne(item.productId);

      total += product.precio * item.quantity;

      return this.itemsRepository.create({
        productId: item.productId,
        quantity: item.quantity
      })
    }
    ));

    // Actualiza el carrito
    const cartUpdated = this.cartRepository.create({
      userId: updateCartDto.userId,
      items: newItems,
      total
    })

    return await this.cartRepository.save(cartUpdated);
  
  }

  async removeCart(id: string) {
    const cart = await this.findOne(id);
    const deleteCart = await this.cartRepository.delete(cart);
    return deleteCart;
  }

  async findCartByUserId(userId: string) {
    const cart = await this.cartRepository.findOneBy({userId});
    return cart;
  }
}

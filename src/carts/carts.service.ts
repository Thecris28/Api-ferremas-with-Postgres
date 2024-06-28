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

    const {userId , items} = createCartDto;

    let existsCart = await this.findCartByUserId(userId);

    if(existsCart) {
      const oldCartItems = await this.removeCart(existsCart.id);

      return;
    }


    let total = 0;

    const itemEntities = await Promise.all( items.map( async (item) => {

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

    this.cartRepository.save(cart);

    return cart;
  }

  findAll() {
    return this.cartRepository.find();
  }

  findOne(id: string) {
    const cart = this.cartRepository.findOneBy({id})
    if(!cart) throw new BadRequestException(`Cart with id ${id} not found`);
    return cart;
  }

  updateCart(id: string, updateCartDto: UpdateCartDto) {
    const cart = this.findOne(id);


    return `This action updates a #${id} cart`;
  }

  async removeCart(id: string) {
    const deleteCart = await this.cartRepository.delete(id)
    return deleteCart;
  }

  async findCartByUserId(userId: string) {
    const cart = await this.cartRepository.findOneBy({userId})
    return cart;
  }
}

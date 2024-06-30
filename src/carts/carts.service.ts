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

    if(oldCart) return this.replaceCart(oldCart.id, createCartDto);
    let total = 0;

    let itemEntities: CartItem[] = await Promise.all( 
      items.map( async ( item ) => {
      const product = await this.productsService.findOne(item.productId);
      if(!product) throw new BadRequestException(`Product with id ${item.productId} not found`);

      if(item.quantity > product.stock) 
        throw new BadRequestException('Not enough stock');

      total += product.precio * item.quantity;

      return this.itemsRepository.create({
        productId: item.productId,
        quantity: item.quantity,
        name: product.nombre,
        price: product.precio
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
    return this.cartRepository.find({relations:['items']});
  }

  async findOne(id: string ) {
    const cart = await this.cartRepository.findOne({where: { id },
      relations: ['items']})
    if(!cart) throw new BadRequestException(`Cart with id ${id} not found`);
    return cart;
  }

  async replaceCart(id: string, updateCartDto: UpdateCartDto) {

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
        quantity: item.quantity,
        name: product.nombre,
        price: product.precio
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

  async updateCart(id: string, updateCartDto: UpdateCartDto) {
    const { items } = updateCartDto;
  
    // Encuentra el carrito existente
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  
    if (!cart) throw new BadRequestException(`Cart with id ${id} not found`);
  
    // Calcula el nuevo total y actualiza los elementos del carrito
    let total = 0;
  
    // Crear un mapa de los productos que se van a actualizar
    const itemsMap = new Map(items.map(item => [item.productId, item]));
  
    const newItems = await Promise.all(
      cart.items.map(async (item) => {
        const updatedItem = itemsMap.get(item.productId);
        
        // Si el producto está en los nuevos elementos, actualizamos el stock
        if (updatedItem) {
          const product = await this.productsService.findOne(updatedItem.productId);
          if (!product) {
            throw new BadRequestException(`Product with id ${updatedItem.productId} not found`);
          }
          total += product.precio * updatedItem.quantity;
          // Actualiza la cantidad del elemento del carrito
          item.quantity = updatedItem.quantity;
  
          // Eliminamos el elemento del mapa para llevar un seguimiento de los elementos nuevos
          itemsMap.delete(updatedItem.productId);
  
          return item;
        }
  
        // Si el producto no está en los nuevos elementos, eliminamos el elemento del carrito
        await this.itemsRepository.remove(item);
      })
    );
  
    // Agregar nuevos elementos que no estaban en el carrito
    const additionalItems = await Promise.all(
      Array.from(itemsMap.values()).map(async (item) => {
        const product = await this.productsService.findOne(item.productId);
        if (!product) {
          throw new BadRequestException(`Product with id ${item.productId} not found`);
        }
  
        total += product.precio * item.quantity;
  
        return this.itemsRepository.create({
          id: id,
          productId: item.productId,
          quantity: item.quantity,
        });
      })
    );
  
    // Combina los elementos existentes actualizados y los nuevos elementos
    const updatedItems = newItems.filter(item => item !== undefined).concat(additionalItems);
  
    // Actualiza los elementos y el total en el carrito
    cart.items = updatedItems;
    cart.total = total;
  
    // Guarda los cambios en la base de datos
    await this.cartRepository.save(cart);
  
    return cart;
  }

  async removeCart(id: string) {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['items']
    });

    await this.cartRepository.delete({ id: cart.id, });
    await this.itemsRepository.delete({ cart: { id }, });

    return {message: `Cart with id:${id} was deleted`}
  }

  async findCartByUserId(userId: string) {
    const cart = await this.cartRepository.findOneBy({userId});
    return cart;
  }
}

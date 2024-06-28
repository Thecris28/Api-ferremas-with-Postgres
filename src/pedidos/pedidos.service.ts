import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { ProductsService } from '../products/products.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { Repository } from 'typeorm';
import { PedidoItem } from './entities/pedido-Item.entity';
import { CartsService } from '../carts/carts.service';

@Injectable()
export class PedidosService {

  constructor(
    @InjectRepository( Pedido )
    private readonly pedidosRepository: Repository<Pedido>,
    @InjectRepository( PedidoItem )
    private readonly pedidoItemsRepository: Repository<PedidoItem>,
    private productsService : ProductsService,
    private cartsService : CartsService
  ) {}

  async createPayment(createPedidoDto: CreatePedidoDto) {

    const { userId, CartId } = createPedidoDto;

    const cart = await this.cartsService.findOne(CartId);

    if(!cart) throw new BadRequestException(`Cart with id ${CartId} not found`);
  
    const { items, total } = cart

     let product = await Promise.all(items.map( async item => {
      const data = await this.productsService.findOne(item.productId);
      console.log(data)

       return this.pedidoItemsRepository.create({
         productId: item.productId,
         name: data.nombre,
         quantity: item.quantity,
         price: data.precio
       })
      
    }));

    console.log(product)
    
     
    const pedido = this.pedidosRepository.create({
      cartId: CartId,
      userId,
      items: product,
      date: new Date(),
      amount: total
    })
    


    this.pedidosRepository.save(pedido);

    return {pedido, message: 'Payment created successfully'};
  }

  findAll() {
    return this.pedidosRepository.find();
  }

  async findOne(id: string) {

    const pedido = await this.pedidosRepository.findOneBy({id});

    if(!pedido) throw new BadRequestException(`Order with id ${id} not found`)

    return pedido
  }

  update(id: number, updatePedidoDto: UpdatePedidoDto) {
    return `This action updates a #${id} pedido`;
  }

  remove(id: number) {
    return `This action removes a #${id} pedido`;
  }
}

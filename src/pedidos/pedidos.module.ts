import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { ProductsModule } from '../products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoItem } from './entities/pedido-Item.entity';
import { CartsModule } from '../carts/carts.module';

@Module({
  controllers: [PedidosController],
  providers: [PedidosService],

  imports: [ TypeOrmModule.forFeature([ Pedido, PedidoItem ]),ProductsModule, CartsModule],
})
export class PedidosModule {}

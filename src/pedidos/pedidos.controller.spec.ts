import { Test, TestingModule } from '@nestjs/testing';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { ProductsService } from '../products/products.service';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoItem } from './entities/pedido-Item.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartsService } from '../carts/carts.service';

const mockPedidoRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
});

const mockPedidoItemRepository = {
  create: jest.fn(),
  save: jest.fn(),
};

const mockProductsService = {
  findOne: jest.fn(),
};

const mockCartsService = {
  find: jest.fn()
}

describe('PedidosController', () => {
  let controller: PedidosController;
  let service: PedidosService;
  let PedidoRepository: Repository<Pedido>;
  let PedidoItemRepository: Repository<PedidoItem>;
  let productsService: ProductsService;
  let cartsService: CartsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidosController],
      providers: [
        PedidosService,
        { provide: getRepositoryToken(Pedido), useFactory: mockPedidoRepository },
        { provide: getRepositoryToken(PedidoItem), useValue: mockPedidoItemRepository },
        { provide: ProductsService, useValue: mockProductsService },
        { provide: CartsService, useValue: mockCartsService }
      ],
    }).compile();

    controller = module.get<PedidosController>(PedidosController);
    service = module.get<PedidosService>(PedidosService);
    PedidoRepository = module.get<Repository<Pedido>>(getRepositoryToken(Pedido));
    PedidoItemRepository = module.get<Repository<PedidoItem>>(getRepositoryToken(PedidoItem));
    productsService = module.get<ProductsService>(ProductsService);
    cartsService = module.get<CartsService>(CartsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

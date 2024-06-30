import { Test, TestingModule } from '@nestjs/testing';
import { PedidosService } from './pedidos.service';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoItem } from './entities/pedido-Item.entity';
import { ProductsService } from '../products/products.service';
import { CartsService } from '../carts/carts.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PedidosService', () => {
  let service: PedidosService;
  let PedidoRepository: Repository<Pedido>;
  let PedidoItemRepository: Repository<PedidoItem>;
  let productsService: ProductsService;
  let cartsService: CartsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidosService,
        {
          provide: getRepositoryToken(Pedido),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PedidoItem),
          useClass: Repository,
        },
        {
          provide: CartsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ProductsService,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PedidosService>(PedidosService);
    PedidoRepository = module.get<Repository<Pedido>>(getRepositoryToken(Pedido));
    PedidoItemRepository = module.get<Repository<PedidoItem>>(getRepositoryToken(PedidoItem));
    productsService = module.get<ProductsService>(ProductsService);
    cartsService = module.get<CartsService>(CartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

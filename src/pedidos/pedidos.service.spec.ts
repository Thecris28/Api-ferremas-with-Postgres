import { Test, TestingModule } from '@nestjs/testing';
import { PedidosService } from './pedidos.service';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoItem } from './entities/pedido-item.entity';
import { ProductsService } from '../products/products.service';
import { CartsService } from '../carts/carts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { CreateCartDto } from '../carts/dto/create-cart.dto';

describe('PedidosService', () => {
  let service: PedidosService;
  let pedidosRepository: jest.Mocked<Repository<Pedido>>;
  let pedidoItemsRepository: jest.Mocked<Repository<PedidoItem>>;
  let cartsService: jest.Mocked<CartsService>;
  let productsService: jest.Mocked<ProductsService>;

  const mockPedidosRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockPedidoItemsRepository = {
    create: jest.fn(),
  };

  const mockCartsService = {
    findOne: jest.fn(),
    removeCart: jest.fn(),
    createCart: jest.fn(),
  };

  const mockProductsService = {
    findOne: jest.fn(),
    updateStock: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidosService,
        { provide: getRepositoryToken(Pedido), useValue: mockPedidosRepository },
        { provide: getRepositoryToken(PedidoItem), useValue: mockPedidoItemsRepository },
        { provide: CartsService, useValue: mockCartsService },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    service = module.get<PedidosService>(PedidosService);
    pedidosRepository = module.get<Repository<Pedido>>(getRepositoryToken(Pedido)) as jest.Mocked<Repository<Pedido>>;
    pedidoItemsRepository = module.get<Repository<PedidoItem>>(getRepositoryToken(PedidoItem)) as jest.Mocked<Repository<PedidoItem>>;
    cartsService = module.get<CartsService>(CartsService) as jest.Mocked<CartsService>;
    productsService = module.get<ProductsService>(ProductsService) as jest.Mocked<ProductsService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a payment successfully', async () => {
    const createCartDto: CreateCartDto = {
      userId: 'user1',
      items: [
        { productId: 'product1', quantity: 2 }
      ],
    };

    const mockProduct1 = { id: 'product1', precio: 100, stock: 10 };
    const cart = { id: 'cart1', ...createCartDto };

    mockProductsService.findOne.mockResolvedValueOnce(mockProduct1);
    mockCartsService.createCart.mockResolvedValueOnce(cart);
    mockCartsService.findOne.mockResolvedValueOnce(cart);

    const pedidoItem = {
      productId: mockProduct1.id,
      name: 'Product 1',
      quantity: createCartDto.items[0].quantity,
      price: mockProduct1.precio,
    };

    const pedido = {
      cartId: cart.id,
      userId: createCartDto.userId,
      items: [pedidoItem],
      date: expect.any(Date),
      amount: pedidoItem.quantity * pedidoItem.price,
    };

    mockPedidoItemsRepository.create.mockReturnValueOnce(pedidoItem);
    mockPedidosRepository.create.mockReturnValueOnce(pedido);
    mockPedidosRepository.save.mockResolvedValueOnce(pedido);

    const createPedidoDto: CreatePedidoDto = {
      userId: createCartDto.userId,
      CartId: cart.id,
    };

    const result = await service.createPayment(createPedidoDto);

    expect(result).toEqual({ pedido, message: 'Payment created successfully' });
    expect(mockProductsService.findOne).toHaveBeenCalledWith(createCartDto.items[0].productId);
    expect(mockCartsService.findOne).toHaveBeenCalledWith(cart.id);
    

  });


  describe('findOne', () => {
    it('should return an order by userId', async () => {
      const order = { id: 'orderId1', userId: 'userId1', items: [{ productId: 'productId1', name: 'Product 1' }] };

      mockPedidosRepository.findOne.mockResolvedValue(order);

      const result = await service.findOne('userId1');

      expect(result).toEqual({
        ...order,
        items: order.items.map(item => {
          return item;
        }),
      });
    });

    it('should throw a BadRequestException if order not found', async () => {
      mockPedidosRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('userId1')).rejects.toThrow(BadRequestException);
      expect(mockPedidosRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 'userId1' },
        relations: ['items'],
      });
    });
  });

  it('should throw a BadRequestException if product stock is insufficient', async () => {
    const createPedidoDto = { userId: 'userId1', CartId: 'cartId1' };
    const cart = {
      id: 'cartId1',
      items: [
        { productId: 'productId1', quantity: 20 },
      ],
      total: 5000,
    };
    const product1 = { id: 'productId1', nombre: 'Product 1', precio: 1000, stock: 10 };

    mockPedidosRepository.findOne.mockResolvedValue(null);
    mockCartsService.findOne.mockResolvedValue(cart);
    mockProductsService.findOne.mockResolvedValue(product1);

    await expect(service.createPayment(createPedidoDto)).rejects.toThrow(BadRequestException);
    expect(mockProductsService.findOne).toHaveBeenCalledWith('productId1');
  });

  it('should throw a BadRequestException if payment already exists', async () => {
    const createPedidoDto = { userId: 'userId1', CartId: 'cartId1' };
    const existingPayment = { id: 'paymentId1', cartId: 'cartId1', userId: 'userId1', items: [], amount: 5000 };
  
    mockPedidosRepository.findOne.mockResolvedValue(existingPayment);
  
    await expect(service.createPayment(createPedidoDto)).rejects.toThrow(BadRequestException);
    
    
  });

  
});

import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from './../products/products.service';

describe('CartsService', () => {
  let service: CartsService;
  let cartRepository: Repository<Cart>;
  let cartItemRepository: Repository<CartItem>;
  let productsService: ProductsService;

  const mockCartRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  const mockCartItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockProductsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        { provide: getRepositoryToken(Cart), useValue: mockCartRepository },
        { provide: getRepositoryToken(CartItem), useValue: mockCartItemRepository },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    service = module.get<CartsService>(CartsService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    cartItemRepository = module.get<Repository<CartItem>>(getRepositoryToken(CartItem));
    productsService = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('crear un carrito', async () => {
    const createCartDto: CreateCartDto = {
      userId: 'user1',
      items: [
        { productId: 'product1', quantity: 2 },
        { productId: 'product2', quantity: 1 },
      ],
    };
    const mockProduct1 = { id: 'product1', precio: 100, stock: 10 };
    const mockProduct2 = { id: 'product2', precio: 200, stock: 5 };
    mockProductsService.findOne.mockResolvedValueOnce(mockProduct1).mockResolvedValueOnce(mockProduct2);
    mockCartRepository.create.mockReturnValue({ id: 'cart1', ...createCartDto });
    mockCartRepository.save.mockResolvedValue({ id: 'cart1', ...createCartDto });

    const result = await service.createCart(createCartDto);
    console.log(result)
    expect(result).toEqual({ id: 'cart1', ...createCartDto });
    expect(mockCartRepository.create).toHaveBeenCalled();
    expect(mockCartRepository.save).toHaveBeenCalled();
  });

  it('actualizar un carrito', async () => {



  })


});

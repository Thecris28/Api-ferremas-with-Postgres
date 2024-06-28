import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from './../products/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockCartRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
});

const mockCartItemRepository = {
  create: jest.fn(),
  save: jest.fn(),
};

const mockProductsService = {
  findOne: jest.fn(),
};

describe('CartsController', () => {
  let controller: CartsController;
  let service: CartsService;
  let cartRepository: Repository<Cart>;
  let cartItemRepository: Repository<CartItem>;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [
        CartsService,
        { provide: getRepositoryToken(Cart), useFactory: mockCartRepository },
        { provide: getRepositoryToken(CartItem), useValue: mockCartItemRepository },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compile();

    controller = module.get<CartsController>(CartsController);
    service = module.get<CartsService>(CartsService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    cartItemRepository = module.get<Repository<CartItem>>(getRepositoryToken(CartItem));
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from './../products/products.service';
import { UpdateCartDto } from './dto/update-cart.dto';

describe('CartsService', () => {
  let service: CartsService;
  let cartRepository: Repository<Cart>;
  let itemRepository: Repository<CartItem>;
  let productsService: ProductsService;

  const mockCartRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  const mockCartItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
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
    itemRepository = module.get<Repository<CartItem>>(getRepositoryToken(CartItem));
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

  describe('updateCart', () => {
    it('should update cart items and total', async () => {
      const updateCartDto: UpdateCartDto = {
        userId: 'user1',
        items: [
          { productId: 'product1', quantity: 1 },
          { productId: 'product2', quantity: 2 },
        ],
      };

      const cart = { id: '1', userId: 'user1', items: [], total: 0 } as Cart;

      const product1 = { id: 'product1',marca: 'test marca',codigo: 'test', categoria: 1, createdAt: new Date(), nombre: 'Product 1', precio: 1000, stock: 10 };
      const product2 = { id: 'product2',marca: 'test marca',codigo: 'test', categoria: 1, createdAt: new Date(), nombre: 'Product 2', precio: 2000, stock: 20 };

      jest.spyOn(productsService, 'findOne').mockResolvedValueOnce(product1);
      jest.spyOn(productsService, 'findOne').mockResolvedValueOnce(product2);

      const cartItem1 = { productId: 'product1', quantity: 1, name: 'Product 1', price: 100 } as CartItem;
      const cartItem2 = { productId: 'product2', quantity: 2, name: 'Product 2', price: 200 } as CartItem;

      jest.spyOn(itemRepository, 'create').mockReturnValueOnce(cartItem1);
      jest.spyOn(itemRepository, 'create').mockReturnValueOnce(cartItem2);

      jest.spyOn(cartRepository, 'findOne').mockResolvedValueOnce(cart);
      jest.spyOn(cartRepository, 'save').mockResolvedValueOnce(cart);

      const result = await service.updateCart('1', updateCartDto);

      expect(result).toEqual(cart);
      expect(cartRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['items'] });
      expect(itemRepository.create).toHaveBeenCalledTimes(2);
      expect(cartRepository.save).toHaveBeenCalledWith(cart);
    });
  });

  describe('removeCart', () => {
    it('should remove a cart and its items', async () => {
      const cart = { id: '1', userId: 'user1', items: [], total: 5000 } as Cart;

      jest.spyOn(cartRepository, 'findOne').mockResolvedValueOnce(cart);
      jest.spyOn(cartRepository, 'delete').mockResolvedValueOnce(null);
      jest.spyOn(itemRepository, 'delete').mockResolvedValueOnce(null);

      const result = await service.removeCart('1');

      expect(result).toEqual({ message: `Cart with id:1 was deleted` });
      expect(cartRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['items'] });
      expect(cartRepository.delete).toHaveBeenCalledWith({ id: '1' });
      expect(itemRepository.delete).toHaveBeenCalledWith({ cart: { id: '1' } });
    });
  });

  describe('findCartByUserId', () => {
    it('should return a cart for a user', async () => {
      const cart: Cart = { id: '1', userId: 'user1', items: [], total: 100 };

      jest.spyOn(cartRepository, 'findOneBy').mockResolvedValueOnce(cart);

      const result = await service.findCartByUserId('user1');

      expect(result).toEqual(cart);
      expect(cartRepository.findOneBy).toHaveBeenCalledWith({ userId: 'user1' });
    });
  });


});

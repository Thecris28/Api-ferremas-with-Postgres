import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateProductDto } from './dto/create-product.dto';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../users/auth/auth.guard';


const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockToken'),
  verify: jest.fn().mockReturnValue({ userId: '1' }),
};

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;
  let repository: Repository<Product>;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [ProductsController],
  //     providers: [ProductsService],
  //   }).compile();

  //   beforeEach(async () => {
  //     const module: TestingModule = await Test.createTestingModule({
  //       imports: [
  //         ProductsModule,
  //       ]
  //     }).compile();

  //   controller = module.get<ProductsController>(ProductsController);
  // });


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });


  // beforeEach(async () => {
  //   const app: TestingModule = await Test.createTestingModule({
  //     controllers: [ProductsController],
  //     providers: [ProductsService],
  //   }).compile();

  //   controller = app.get<ProductsController>(ProductsController);
  // });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        marca: 'Test Brand',
        codigo: '123ABC',
        nombre: 'Test Product',
        categoria: 1,
        precio: 100,
        stock: 10,
      };
      const result = { id: '1', ...createProductDto };

      jest.spyOn(service, 'create').mockResolvedValue(result as Product);

      expect(await controller.create(createProductDto)).toBe(result);
    });
  });
  
});

// });

import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsModule } from './products.module';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductsController', () => {
  let controller: ProductsController;
  let productoRepository: Repository<Product>;

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
      providers: [ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository, // Use useClass for mock Repository
        }
      ],
      
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    productoRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
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
  
});

  // it('should be defined', () => {
  //   expect(controller).toBeDefined();
  // });

  // it('probar', ()=> {
  //   expect(controller).;
  // });
// });

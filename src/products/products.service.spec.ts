import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductsService', () => {
  let service: ProductsService;
  let categoriaRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository, // Use useClass for mock Repository
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    categoriaRepository = module.get<Repository<Product>>(
    getRepositoryToken(Product),
  );
    
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


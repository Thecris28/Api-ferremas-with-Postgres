import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;

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
    productRepository = module.get<Repository<Product>>(
    getRepositoryToken(Product));
    
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        marca: 'Test Brand',
        codigo: '123ABC',
        nombre: 'Test Product',
        categoria: 1,
        precio: 100,
        stock: 10,
      };

      const newProduct: Product = {
        id: '1',
        marca: 'Test Brand',
        codigo: '123ABC',
        nombre: 'Test Product',
        categoria: 1,
        precio: 100,
        stock: 10,
        createdAt: new Date()
      };


      jest.spyOn(productRepository, 'create').mockReturnValueOnce(newProduct);
      jest.spyOn(productRepository, 'save').mockResolvedValueOnce(newProduct);

      const result = await service.create(createProductDto);

      expect(result).toEqual(newProduct);
    });


  
});





import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';

const mockProductRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
};

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository, 
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

  

  describe('Crear un nuevo producto', () => {
    it('create a product', async () => {
      const createProductDto: CreateProductDto = {
        marca: 'Test Marca',
        codigo: '123ABC',
        nombre: 'Test Product',
        categoria: 1,
        precio: 100,
        stock: 10,
      };

      const newProduct: Product = {
        id: '1',
        marca: 'Test Marca',
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
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(productRepository.save).toHaveBeenCalledWith(newProduct);

      expect(result).toEqual(newProduct);
    });

    it('Test create product when stock is less than 0', async () => {
      const createProductDto: CreateProductDto = {
        marca: 'Test Marca',
        codigo: '123ABC',
        nombre: 'Test Product',
        categoria: 1,
        precio: 100,
        stock: -1,
      };

      await expect(service.create(createProductDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('Actualizar un producto', () => {
    it('update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        marca: 'Test marca',
        codigo: '123ABC',
        nombre: 'Test Product',
        categoria: 1,
        precio: 1000,
        stock: 30,
      };

      const Product: Product = {
        id: '1',
        marca: 'Test marca',
        codigo: '123ABC',
        nombre: 'Test Product',
        categoria: 1,
        precio: 1000,
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(productRepository, 'preload').mockResolvedValueOnce(Product);
      jest.spyOn(productRepository, 'save').mockResolvedValueOnce(Product);

      const result = await service.updateProduct('1', updateProductDto);

      expect(result).toEqual(Product);
      expect(productRepository.preload).toHaveBeenCalledWith({ id: '1', ...updateProductDto, updatedAt: expect.any(Date) });
      expect(productRepository.save).toHaveBeenCalledWith(Product);

    })
    
  })
    

    describe('Eliminar un producto', () => {
      it('should throw an error if product not found', async () => {
        jest.spyOn(productRepository, 'findOneBy').mockResolvedValueOnce(null);
  
        await expect(service.removeProduct('1')).rejects.toThrow(NotFoundException);
      });
  
      it('should remove a product', async () => {
        const product: Product = { 
          id: '1', 
          marca: 'Test Marca', 
          codigo: '123', 
          nombre: 'Product 1', 
          categoria: 1, 
          precio: 8990, 
          stock: 10, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        };
  
        jest.spyOn(productRepository, 'findOneBy').mockResolvedValueOnce(product);
        jest.spyOn(productRepository, 'remove').mockResolvedValueOnce(product);
  
        const result = await service.removeProduct('1');
  
        expect(result).toEqual(`Product with id 1 has been deleted`);
        expect(productRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
        expect(productRepository.remove).toHaveBeenCalledWith(product);
      });
    });
  
});





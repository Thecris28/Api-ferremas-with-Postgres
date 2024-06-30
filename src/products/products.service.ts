import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto) {

    if (createProductDto.stock < 0) throw new BadRequestException('Stock must be greater than 0');
    try {

      // const newProduct = {...createProductDto, createdAt: new Date()}
      const product = this.productRepository.create(createProductDto);
      product.createdAt= new Date()
      // const newProduct = {...product, createdAt: new Date()}
      
      await this.productRepository.save(product)
      console.log(product)

      return product
      
    } catch (error) {
      
      this.handleDbException(error)
      
    }
  }

  findAll() {
    return this.productRepository.find();
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({id})
    if (!product) throw new NotFoundException(`Product with id ${id} not found`)
    return product
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {

    const {stock, ...toUpdate} = updateProductDto;

    if (stock < 0) throw new BadRequestException('Stock must be greater than 0');

    const product = await this.productRepository.preload({
      id: id,
      stock: stock,
      ...toUpdate,
      updatedAt: new Date()
    })

    if(!product) throw new NotFoundException(`Product with id ${id} not found`)
    try {
      await this.productRepository.save(product)
    } catch (error) {
      this.handleDbException(error)
      
    }
    return product;
  }

  async removeProduct(id: string) {
    const product = await this.findOne(id)
    await this.productRepository.remove(product)
    return `Product with id ${id} has been deleted`;
  }

  private handleDbException(error: any){
    if(error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error)
    throw new BadRequestException('An unexpected error occurred');

  }

  async updateStock(id: string, quantity: number) {
    
    const product = await this.productRepository.preload({
      id: id
    })

    if(!product) throw new NotFoundException(`Product with id ${id} not found`)

    product.stock = product.stock - quantity
    product.updatedAt = new Date()

    try {
      await this.productRepository.save(product)
      
    } catch (error) {
      this.handleDbException(error)
      
    }
    return product;
  }

  findByCategory(categoria: number) {
     const products = this.productRepository.find({
      where: {
        categoria: categoria
      }
    })

    if (!products) throw new NotFoundException(`Products with category ${categoria} not exist`)
    return products
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product')
    try {
      return await query
        .delete()
        .where({})
        .execute()
    } catch (error) {
      this.handleDbException(error)
    }

  }
}

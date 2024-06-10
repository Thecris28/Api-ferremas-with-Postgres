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
    try {
      // const {} = createProductDto

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

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    await this.productRepository.remove(product)
    return `El producto con el id ${id} ha sido eliminado`;
  }

  private handleDbException(error: any){
    if(error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}

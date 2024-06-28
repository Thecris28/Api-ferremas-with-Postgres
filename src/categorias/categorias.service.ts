import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';

@Injectable()
export class CategoriasService {

  private readonly logger = new Logger()

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>
  ){}


  async create(createCategoriaDto: CreateCategoriaDto) {
    try {

      const categoria = this.categoriasRepository.create(createCategoriaDto)

      categoria.createdAt = new Date()

      await this.categoriasRepository.save(categoria)

      return categoria
      
    } catch (error) {
      this.handleDbException(error)
    }
  }

  findAll() {
    return this.categoriasRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoriasRepository.findOneBy({id})

    if (!category) throw new NotFoundException(`Category with id ${id} not found`);
    return category;
  }

  async updateCategory(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const category = await this.categoriasRepository.preload({
      id: id,
      ...updateCategoriaDto
    })
    if(!category) throw new NotFoundException(`Category with id ${id} not found`) 
    
      try {
        await this.categoriasRepository.save(category)
        
      } catch (error) {
        this.handleDbException(error)
      }
      
    return category;
  }

  async remove(id: number) {
    const category = await this.findOne(id)
    await this.categoriasRepository.delete({id})
    return category
  }

  private handleDbException(error: any){
    if(error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

  async deleteAllCategories() {
    const query = this.categoriasRepository.createQueryBuilder('Categoria')
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

import { Injectable, Logger } from '@nestjs/common';
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


  create(createCategoriaDto: CreateCategoriaDto) {
    try {

      const categoria = this.categoriasRepository.create(createCategoriaDto)

      this.categoriasRepository.save(categoria)

      return categoria
      
    } catch (error) {
      
    }
  }

  findAll() {
    return this.categoriasRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} categoria`;
  }

  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return `This action updates a #${id} categoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoria`;
  }
}

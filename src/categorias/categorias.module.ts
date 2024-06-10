import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { Categoria } from './entities/categoria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService],
  imports:[
    TypeOrmModule.forFeature([ Categoria ])
  ]
})
export class CategoriasModule {}

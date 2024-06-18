import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { CategoriasModule } from './categorias.module';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CategoriasController', () => {
  let controller: CategoriasController;
  let categoriaRepository: Repository<Categoria>;
  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [CategoriasController],
  //     providers: [CategoriasService],
  //   }).compile();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [CategoriasService,
        {
          provide: getRepositoryToken(Categoria),
          useClass: Repository, // Use useClass for mock Repository
        }
      ],
      
    }).compile();

    controller = module.get<CategoriasController>(CategoriasController);
    categoriaRepository = module.get<Repository<Categoria>>(
      getRepositoryToken(Categoria),
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasService } from './categorias.service';
import { CategoriasModule } from './categorias.module';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { } from 'uuid'


  describe('CategoriaService', () => {
    let service: CategoriasService;
    let categoriaRepository: Repository<Categoria>;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          CategoriasService,
          {
            provide: getRepositoryToken(Categoria),
            useClass: Repository, // Use useClass for mock Repository
          },
        ],
      }).compile();

      service = module.get<CategoriasService>(CategoriasService);
      categoriaRepository = module.get<Repository<Categoria>>(
      getRepositoryToken(Categoria),
    );
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  

    it('should create a new categoria', async () => {
        const createCategoriaDto: CreateCategoriaDto = {
          nombre: 'Test Categoria',
        };
  
        const newCategoria: Categoria = {
          nombre: 'Test Categoria',
        } as Categoria;
  
        jest.spyOn(categoriaRepository, 'create').mockReturnValueOnce(newCategoria);
        jest.spyOn(categoriaRepository, 'save').mockResolvedValueOnce(newCategoria);
  
        const result = await service.create(createCategoriaDto);
        expect(result).toEqual(newCategoria);
      });

  
    // describe('findAll', () => {
    //   it('should return an array of categorias', async () => {
    //     const categorias: Categoria[] = [
    //       { id: 1, name: 'Categoria 1', description: 'Description 1' } as Categoria,
    //       { id: 2, name: 'Categoria 2', description: 'Description 2' } as Categoria,
    //     ];
  
    //     jest.spyOn(categoriaRepository, 'find').mockResolvedValueOnce(categorias);
  
    //     const result = await service.findAll();
    //     expect(result).toEqual(categorias);
    //   });
    // });
  
    // describe('findOne', () => {
    //   it('should return the categoria with the given id', async () => {
    //     const id = 1;
    //     const categoria: Categoria = { id, name: 'Test Categoria', description: 'Test Description' } as Categoria;
  
    //     jest.spyOn(categoriaRepository, 'findOne').mockResolvedValueOnce(categoria);
  
    //     const result = await service.findOne(id);
    //     expect(result).toEqual(categoria);
    //   });
    // });
  
    // describe('update', () => {
    //   it('should update the categoria with the given id', async () => {
    //     const id = 1;
    //     const updateCategoriaDto: UpdateCategoriaDto = {
    //       name: 'Updated Categoria',
    //       description: 'Updated Description',
    //     };
  
    //     const updatedCategoria: Categoria = {
    //       id,
    //       name: 'Updated Categoria',
    //       description: 'Updated Description',
    //     } as Categoria;
  
    //     jest.spyOn(categoriaRepository, 'findOne').mockResolvedValueOnce(updatedCategoria);
    //     jest.spyOn(categoriaRepository, 'save').mockResolvedValueOnce(updatedCategoria);
  
    //     const result = await service.update(id, updateCategoriaDto);
    //     expect(result).toEqual(updatedCategoria);
    //   });
    // });
  
    // describe('remove', () => {
    //   it('should remove the categoria with the given id', async () => {
    //     const id = 1;
  
    //     jest.spyOn(categoriaRepository, 'delete').mockResolvedValueOnce({ affected: 1 });
  
    //     const result = await service.remove(id);
    //     expect(result).toEqual({ id, message: 'Categoria removed' }); // Assuming you return some message
    //   });
    // });
  });


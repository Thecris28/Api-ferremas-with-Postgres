import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from '../products/products.module';
import { CategoriasModule } from 'src/categorias/categorias.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ProductsModule, CategoriasModule],
})
export class SeedModule {}

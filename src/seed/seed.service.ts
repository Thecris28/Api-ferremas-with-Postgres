import { Injectable } from '@nestjs/common';

import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-products';
import { initialCategories } from './data/seed-categories';
import { CategoriasService } from './../categorias/categorias.service';

@Injectable()
export class SeedService {
  

  constructor(
    private readonly productsService : ProductsService,
    private readonly categoriesService : CategoriasService
  ) {}



  async runSeed() {

    await this.generateProducts();

    await this.generatedCategories();
    
    return `Seed executed`;
  }

  private async generateProducts() {
    await this.productsService.deleteAllProducts();

    const Products = initialData.products;

    const insertProducts = [];

    Products.forEach(product => {
      insertProducts.push(this.productsService.create(product));
    });
    await Promise.all(insertProducts);
  }

  private async generatedCategories() {
    await this.categoriesService.deleteAllCategories();
    const Categories = initialCategories.categories;

    const insertCategories = [];

    Categories.forEach(category => {
      insertCategories.push(this.categoriesService.create(category));
    });
    await Promise.all(insertCategories);
  }


}

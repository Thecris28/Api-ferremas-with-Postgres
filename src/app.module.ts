import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CategoriasModule } from './categorias/categorias.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seed/seed.module';
import { CartsModule } from './carts/carts.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, //
      synchronize: true, // cambio en la entidades las sincroniza tambien se puede ejecutar las mjgraciones
    }),
    ProductsModule,
    CategoriasModule,
    PedidosModule,
    UsersModule,
    SeedModule,
    CartsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

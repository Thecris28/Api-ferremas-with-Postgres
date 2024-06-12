import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });

  let productId: string;

  it('/products (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({
        marca: 'Test Marca',
        codigo: '123ABC',
        nombre: 'Test Producto',
        precio: 100,
        categoriaId: 'ee3526f4-5610-4336-aea7-deee5a34d940',
        stock: 10,
        createdAt: new Date(),
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.nombre).toEqual('Test Producto');
    expect(response.body.precio).toEqual(100);

    productId = response.body.id;
  });

  it('/products (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/products/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', productId);
    expect(response.body.nombre).toEqual('Test Producto');
    expect(response.body.precio).toEqual(100);
  });

  it('/products/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(404);
  });


  
});

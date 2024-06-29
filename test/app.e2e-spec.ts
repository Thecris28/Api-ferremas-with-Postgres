import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { create } from 'domain';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

// Pruebas de Integración Modulo de Usuarios

  it('/users (POST) deberia crear un usuario', async () => {
    const registerReq = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'prueba@example.com',
        password: 'Abc123',
        name: 'prueba',
      })
      .expect(201);

    expect(registerReq.body.email).toEqual('prueba@example.com');
  });

  it('/users (POST) deberia dar error al registrar un email ya existente', async () => {
    const registerReq = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'prueba@example.com',
        password: 'Abc123',
        name: 'prueba',
      })
      .expect(400);

      console.log(registerReq.body)

    expect(registerReq.body).toEqual({ 
      error: 'Bad Request', 
      Message: 'Email already exists', 
      status: 400 });
  });



  let token = ''
  let userId = '';

  it('/users/login (POST)Se deberia obtener un token al hacer login', async () =>{
    const loginReg = await request(app.getHttpServer())
    .post('/users/login')
    .send({
      email: 'prueba@example.com', password: 'Abc123'})
    .expect(201);

    console.log(loginReg.body)

    token = loginReg.body.access_token;
    userId = loginReg.body.id;

  });

  it('/users (GET) Se deberia obtener un error al ingresar con credenciales incorrectas', 
    async () => {
      const loginnReq = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'prueba@example.com', password: 'Abc1234' // Prueba con contraseña incorrecta
      })
      .expect(401);

      expect(loginnReq.body).toEqual({
        "message": "Credentials are not valid",
        "error": "Unauthorized",
        "statusCode": 401
    });

    const loginEmail = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'email_incorrecto@example.com', password: 'Abc123' // Prueba con email incorrecto
      })
      .expect(401);

      expect(loginEmail.body).toEqual({
        "message": "Credentials are not valid",
        "error": "Unauthorized",
        "statusCode": 401
    });


    });

  // Pruebas de integracion Modulo de Productos

  let productId: string;

  it('/products (POST) Se deberia crear un producto', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({
        marca: 'Test Marca',
        codigo: '123ABC',
        nombre: 'Test Producto',
        precio: 100,
        categoria: 1,
        stock: 10,
        createdAt: new Date(),
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.nombre).toEqual('Test Producto');
    expect(response.body.precio).toEqual(100);

    productId = response.body.id;
  });

  it('/products (POST) Error al agregar un producto con stock negativo', 
    async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .send({
          marca: 'Test Marca',
          codigo: '123ABC',
          nombre: 'Test Producto',
          precio: 1000,
          categoria: 1,
          stock: -4,
          createdAt: new Date(),
        })
        .expect(400);

        expect(response.body).toEqual({
          statusCode: 400,
          message: 'Stock must be greater than 0',
          error: 'Bad Request',
        });
        
    });

  it('/products (GET) Se deberia obtener un listado de productos', async () => {
    const response = await request(app.getHttpServer())
      .get('/products')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/products/:id (GET) Se deberia obtener un producto por id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', productId);
    expect(response.body.nombre).toEqual('Test Producto');
    expect(response.body.precio).toEqual(100);
  });

  it('/products/:id (PATCH) Actualizar datos de un producto', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .send({
        marca: 'Test Marca2',
        codigo: 'updated123ABC',
        nombre: 'Update Test Product',
        precio: 40000,
        categoria: 1,
        stock: 20,
      })
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.marca).toEqual('Test Marca2');
    expect(response.body.precio).toEqual(40000);
    expect(response.body.stock).toEqual(20);
  });

  

  // Pruebas de Integracion Modulo carrito

  let cartId: '';
  let productId2: '';

  it ('/cart (POST) agregar producto con stock insuficiente', async () => {

    // Crear un producto con stock insuficiente
    const product = await request(app.getHttpServer())
      .post('/products')
      .send({
        marca: 'Marca',
        codigo: '123ABC',
        nombre: 'Test Producto 2',
        precio: 12990,
        categoria: 1,
        stock: 10
      })
      .expect(201);
  
     productId2 = product.body.id;
  
    const response = await request(app.getHttpServer())
      .post('/cart')
      .set('Authorization', 'Bearer ' + token)
      .send({
        userId: userId,
        items: [
          {
            productId: productId2,
            quantity: 100 
          }
        ]
      })
      .expect(400);
  
    expect(response.body).toEqual({
      statusCode: 400,
      message: 'Not enough stock',
      error: 'Bad Request',
    });
  
  });

  it('/cart (POST) Se deberia crear un carrito', async () => {
    const response = await request(app.getHttpServer())
      .post('/cart')
      .set('Authorization', 'Bearer ' + token)
      .send({
        userId: userId,
        items: [
          {
            productId: productId,
            quantity: 1
          }
        ]
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('total');

    cartId = response.body.id;
    console.log(cartId)

  });

  it('/cart (Patch) Se deberia actualizar cantidad de un carrito', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/cart/${cartId}`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        items: [
          {
            productId: productId,
            quantity: 2
          }
        ]
      })
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('total');
    expect( response.body.items[0].quantity).toEqual(2);

  });

  it('/cart (delete) Se deberia eliminar un carrito', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/cart/${cartId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    expect(response.body.message).toEqual(`Cart with id:${cartId} was deleted`);
  })


  // Pruebas de integracion Modulo pedidos

  let cartId2 = '';

  it('/pedidos (POST) Pagar un pedido sin autorizacion', async () => {

    const createCart = await request(app.getHttpServer())
      .post('/cart')
      .set('Authorization', 'Bearer ' + token)
      .send({
        userId: userId,
        items: [
          {
            productId: productId,
            quantity: 1
          }
        ]
      })
      .expect(201);
    
    cartId2 = createCart.body.id;

    const response = await request(app.getHttpServer())
      .post('/pedidos/pago')
      .send({
        userId: userId,
        CartId: cartId2,
      })
      .expect(401);
    
    expect(response.body).toEqual({
      statusCode: 401,
      message: 'You need a token to access',
      error: 'Unauthorized',
    });

    
  });

  it ('/pedidos (GET) Obtener pedidos', async () => {
    const response = await request(app.getHttpServer())
      .get('/pedidos')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it ('/pedidos/pago (POST) Pagar un pedido con autorizacion', async () => {
    const response = await request(app.getHttpServer())
      .post('/pedidos/pago')
      .set('Authorization', 'Bearer ' + token)
      .send({
        userId: userId,
        CartId: cartId2,
      })
      .expect(201);

      console.log(response.body.pedido)

    expect(response.body.pedido.items).toBeInstanceOf(Array);
    expect(response.body.message).toEqual('Payment created successfully');

  });

  it('/pedidos (POST) Pagar un carrito con multiples productos', async () => {

    const product = await request(app.getHttpServer())
      .post('/products')
      .send({
        marca: 'Marca',
        codigo: '123ABC',
        nombre: 'Test Producto 3',
        precio: 10990,
        categoria: 1,
        stock: 10
      })
      .expect(201);
  
      const productId3 = product.body.id;

    const response = await request(app.getHttpServer())
    .post('/cart')
      .set('Authorization', 'Bearer ' + token)
      .send({
        userId: userId,
        items: [
          {
            productId: productId,
            quantity: 1
          },
          {
            productId: productId3,
            quantity: 1
          }
        ]
      })
      .expect(201);
    
    const cartId3 = response.body.id;
    console.log(cartId3)

    const pago = await request(app.getHttpServer())
      .post('/pedidos/pago')
      .set('Authorization', 'Bearer ' + token)
      .send({
        userId: userId,
        CartId: cartId3,
      })
      .expect(201);

      console.log(response.body)

    expect(pago.body.pedido.items).toBeInstanceOf(Array);
    expect(pago.body.message).toEqual('Payment created successfully');

    await request(app.getHttpServer())
    .delete(`/products/${productId3}`)
    .expect(200);

  });


// eliminacion de datos generados por el test
  it('/products/:id (DELETE) Se deberia eliminar un producto por id', async () => {
    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .expect(200);
    
    // Se elimina el Producto 2
    await request(app.getHttpServer())
    .delete(`/products/${productId2}`)
    .expect(200);

    await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(404);
  });

  it('users (DELETE) Elimina el usuario creado', async () => {
    const deleteUser = await request(app.getHttpServer())
    .delete(`/users/${userId}`)
    .expect(200);

  })

  
});


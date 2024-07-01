<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  

## Descripción

🚧 🚧 API Desarrollada con [Nest](https://github.com/nestjs/nest) framework + TypeScript + Postgres 🚧 🚧

## Lista de operaciones que se pueden realizar 
* Productos
  * Crear un productos 
  * Listar productos
  * Listar producto por Id
  * Listar productos por categoria
  * Eliminar un producto
* Usuarios
  * Registrarse 
  * Login
  * Buscar Usuario
* Categorias
  * Consultar categorias
  * Crear una nuva categoria
  * Listar categorias
* Carrito
  * Crear un carrito
  * Buscar un carrito
  * Actualizar un carrito
  * Eliminar Carrito
* Pedidos 
  * Pagar un carrito
  * Consultar un Pedido
  * Consultar pedidos de usuarios
  

## Requerimientos

* Nodejs 20.x.x ó superior.   [Instalar Nodejs](https://nodejs.org/en)
```console
node --version
```
* Instalar docker 
[Instalar Nodejs](https://www.docker.com/products/docker-desktop/)

* Instalar NestJS 
```
npm i -g @nestjs/cli

## Paso a paso para iniciar Api

* Clonar repositorio

```bash
git clone https://github.com/Thecris28/Api-ferremas-with-Postgres.git
```
* Ingresar a la carpeta del proyecto
```bash
cd Api-ferremas
```
* Instalar dependencias
```bash
npm install
```
* Abrir docker e instalar imagen postgres o abrir cmd y ejecutar el siguiente comando
```bash
docker pull postgres:14.3
```
* Levantar imagen postgres con docker
Ejecutar para levantar imagen postgres
```bash
#los contenedores se ejecutan en segundo plano. Esto permite que el terminal quede libre para que puedas seguir usando otros comandos.
docker-compose up -d
```
o tambien puedes ejecutar 
```bash
docker-compose up
```
* ### Iniciamos la api 
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Test

```bash
# Pruebas unitarias
npm run test
```
```bash
# Pruebas unitarias por modulo
# Recomendado para ver el detalle de las pruebas 
npm test users.service.spec.ts
npm test carts.service.spec.ts
npm test pedidos.service.spec.ts
npm test products.service.spec.ts
```

```bash
# Pruebas de integracion
npm run test:e2e
```

### Cambiar a base de datos oracle

* Revisar archivo .env copia e ingresar los datos del usuario y contraseña de bd oracle
* Buscar el archivo app.module.ts y editar el
```type: 'oracle'``` 
* iniciar app e instalar drivers oracle
* Apareceran errores los cuales hay que bucar en los archivos dto y renombrar las columnas text a varchar
*Despues de eso estamos listos para iniciar la api 




## License

Nest is [MIT licensed](LICENSE).

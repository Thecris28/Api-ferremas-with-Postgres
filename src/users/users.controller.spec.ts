import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersModule } from './users.module';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersController', () => {
  let controller: UsersController;
  let userRepository: Repository<User>;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [UsersController],
  //     providers: [UsersService],
  //   }).compile();

  //   controller = module.get<UsersController>(UsersController);
  // });

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [
//         UsersModule,
//       ]
//     }).compile();

//   controller = module.get<UsersController>(UsersController);
// });

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [UsersController],
    providers: [UsersService,
      {
        provide: getRepositoryToken(User),
        useClass: Repository, // Use useClass for mock Repository
      }
    ],
    
  }).compile();

  controller = module.get<UsersController>(UsersController);
  userRepository = module.get<Repository<User>>(
    getRepositoryToken(User),
  );
});

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersModule } from './users.module';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

const mockUserRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

const mockJwtService = () => ({
  signAsync: jest.fn(),
});

describe('UsersController', () => {
  let controller: UsersController;
  let userRepository: Repository<User>;
  let service: UsersService;
  let jwtService: JwtService;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [UsersController],
    providers: [
      UsersService,
      { provide: getRepositoryToken(User), useFactory: mockUserRepository },
      { provide: JwtService, useFactory: mockJwtService },
    ],
    
  }).compile();

  controller = module.get<UsersController>(UsersController);
  service = module.get<UsersService>(UsersService);
  userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  jwtService = module.get<JwtService>(JwtService);
});

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

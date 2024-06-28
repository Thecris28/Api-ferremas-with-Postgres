import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('Deberia crear un nuevo usuario', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Anais A',
      };

      const hashedPassword = 'hashedPassword123';

      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hashedPassword);
      const user = { ...createUserDto, password: hashedPassword };

      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.createUser(createUserDto);
      console.log(result)

      expect(result).toEqual({ email: 'test@test.com', name: 'Anais A' });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: 'test@test.com',
        name: 'Anais A',
        password: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });

    it('should handle database errors', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password123',
        name: 'Anais A',
      };
      mockUserRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('loginUser', () => {
    it('should login a user successfully', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@test.com',
        password: 'password123',
      };
      const user = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword123',
      };
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      mockUserRepository.findOne.mockResolvedValue(user);
      const token = 'jwtToken';
      mockJwtService.signAsync.mockResolvedValue(token);

      const result = await service.loginUser(loginUserDto);
      console.log(result)

      expect(result).toEqual({
        email: 'test@test.com',
        id: '1',
        access_token: token,
      });
    });

    it('should throw UnauthorizedException if email is not valid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'invalid@test.com',
        password: 'password123',
      };
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.loginUser(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is not valid', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@test.com',
        password: 'wrongPassword',
      };
      const user = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword123',
      };
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
      mockUserRepository.findOne.mockResolvedValue(user);

      await expect(service.loginUser(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ email: 'test@test.com' }];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('findOneUser', () => {
    it('should return a user by ID', async () => {
      const user = { email: 'test@test.com' };
      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findOneUser('1');

      expect(result).toEqual(user);
    });

    it('should throw BadRequestException if user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOneUser('1')).rejects.toThrow(BadRequestException);
    });
  });
});
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository( User)
    private readonly productRepository: Repository<User>
  ){}


  createUser(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  
  loginUser(loginUserDto : LoginUserDto){ 
    return `This action returns a #${loginUserDto.email} user`;
    }
    
  findAll() {
      return `This action returns all users`;
  }
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
}

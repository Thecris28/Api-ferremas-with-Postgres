import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}


  async createUser(createUserDto: CreateUserDto) {

    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })

      await this.userRepository.save(user)

      delete user.password

      return user;
      
    } catch (error) {
      
      this.findDbError(error)
      
    }

  }

  
  async loginUser(loginUserDto : LoginUserDto){ 
    
      
      const { email, password } = loginUserDto;

      const user = await this.userRepository.findOne({ 
        where: {email},
        select: { email: true , password: true}
       })

       if(!user)
        throw new UnauthorizedException('Credentials are not valid')

       if(!bcrypt.compareSync(password,  (user).password))
        throw new UnauthorizedException('Credentials are not valid')

       const payload = { sub: user.id, email: user.email };

       return {
        ...loginUserDto,
        access_token: await this.jwtService.signAsync(payload),
      };

   
    }
    
  findAll() {
      return `This action returns all users`;
  }

  private findDbError(error: any) : never {
    if(error.code === '23505')
      throw  new BadRequestException({error:'Bad Request', Message: 'Email already exists', status: 400})

    console.log(error)

    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
}

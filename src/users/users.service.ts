import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
        select: { email: true , password: true , id: true}
       })

       if(!user)
        throw new UnauthorizedException('Credentials are not valid')

       if(!bcrypt.compareSync(password,  (user).password))
        throw new UnauthorizedException('Credentials are not valid')

       const payload = { sub: user.id, email: user.email };

       return {
        email: user.email,
        id: user.id,
        access_token: await this.jwtService.signAsync(payload),
      };

   
    }
    
  async findAll() {
      return this.userRepository.find();
  }

  private findDbError(error: any) : never {
    if(error.code === '23505')
      throw  new BadRequestException({error:'Bad Request', Message: 'Email already exists', status: 400})

    console.log(error)

    throw new InternalServerErrorException('Unexpected error, check server logs')
  }


  async findOneUser(id : string) {
    const user = await this.userRepository.findOneBy({id})

    if(!user) throw new BadRequestException(`User with id ${id} not found`)
    delete user.password
    return user
  }


  //Solo para test
  async deleteUser(id: string) {

    const user = await this.userRepository.findOneBy({id})

    if(!user) throw new NotFoundException(`User whith id ${id} not found`)
    

    return this.userRepository.delete(user)
  }

  
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
}

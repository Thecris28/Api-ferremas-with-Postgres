import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.loginUser(loginUserDto);
  }

  
  @Get()
  @UseGuards( AuthGuard )
  findAll() {
    return this.usersService.findAll();
  }
  
  @Get(':id')
  @UseGuards( AuthGuard )
  findOne(@Param('id') id: string) {
    return this.usersService.findOneUser(id);
  }

  @Get('private')
  @UseGuards( AuthGuard )
  testingPrivateRoute() {
    return 'private route found'
  }

  

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  
}

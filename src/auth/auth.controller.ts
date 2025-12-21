import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('auth')
export class AuthController {
  @Get()
  finalAll(): string {
    return 'Hello from AuthController';
  }

  @Get(':id')
  findOne(@Param() param): string {
    return `user with id:${param.id}`;
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): string {
    return `Name: ${createUserDto.name}, Country: ${createUserDto.country}`;
  }
}

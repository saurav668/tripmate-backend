import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Post,
} from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // CREATE USER
  @Post()
  create(@Body() body: any) {
    console.log('VVVVVVVVV', body);
    return this.usersService.create(body);
  }

  // GET ALL USERS
  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // // GET SINGLE USER
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // UPDATE USER
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() body: any) {
  //   return this.usersService.update(+id, body);
  // }
}
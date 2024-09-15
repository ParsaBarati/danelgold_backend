import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { UserService } from './user.service';


@Controller()
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  
}

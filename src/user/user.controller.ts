import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UserRole } from 'generated/prisma';
import { Authorization } from 'src/decorators/auth.decorator';
import { Authorized } from 'src/decorators/authorized.decorator';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async findProfile(@Authorized('id') userId: string ){
    return this.userService.findById(userId)
  }

  @Authorization(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('by-id/:id')
  public async findById(@Param('id') id: string) {
    return this.userService.findById(id)
  }
}

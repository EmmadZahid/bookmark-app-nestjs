import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService:UserService){}

    @Get('me')
    getMe(@GetUser() user:User){
        return user
    }


    @Patch('edit/:id')
    editUser(@Body() dto:EditUserDto, @Param('id', ParseIntPipe) id:number, @GetUser('id') currentUserId:number){
        return this.userService.editUser(currentUserId, id, dto)
    }
}

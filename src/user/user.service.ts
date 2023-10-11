import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService){}

    async editUser(currentUserId:number, userId:number, dto:EditUserDto){
        if(currentUserId ===  userId){
            const user = await this.prisma.user.update({
                where:{
                    id: userId
                },
                data: {
                    ...dto
                }
            })

            delete user.hash

            return user
        }

        throw new ForbiddenException("You are not authorized for this action")
    }
}

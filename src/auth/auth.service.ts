import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2';
import { AuthDto } from "./dto/auth.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { User } from "@prisma/client";
@Injectable()
export class AuthService{

    constructor(private prisma:PrismaService){}

    public async signup(dto:AuthDto): Promise<User>{
        try {
            const hash = await argon.hash(dto.password)
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash
                }
            })
    
            return user   
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002')  //Prisma own error for duplicate
                    throw new BadRequestException("Email already exists")
            }
            throw error
        }
    }

    public async signin(dto:AuthDto): Promise<User>{
        const user:User = await this.prisma.user.findUnique({where:{
            email: dto.email
        }})

        if(user){
            const passwordMatch = await argon.verify(user.hash, dto.password)
            if(passwordMatch){
                return user
            } else {
                throw new BadRequestException("Invalid credentials")    
            }
        } else {
            throw new BadRequestException("Invalid credentials")
        }
    }
}
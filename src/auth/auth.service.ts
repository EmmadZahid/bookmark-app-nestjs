import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from 'argon2';
import { AuthDto } from "./dto/auth.dto";
@Injectable()
export class AuthService{

    constructor(private prisma:PrismaService){}

    public async signup(dto:AuthDto){
        const hash = await argon.hash(dto.password)
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash
            }
        })

        return user
    }

    public signin(): string{
        return "signin"
    }
}
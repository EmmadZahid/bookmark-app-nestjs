import { Body, Controller, Post } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller('auth')
export class AuthController{
    constructor(private authService:AuthService){}

    @Post('signup')
    public signup(@Body() dto:AuthDto):Promise<User>{
        return this.authService.signup(dto)
    }

    @Post('signin')
    public signin(@Body() dto:AuthDto): Promise<{access_token: string}>{
        return this.authService.signin(dto)
    }
}
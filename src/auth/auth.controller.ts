import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller('auth')
export class AuthController{
    constructor(private authService:AuthService){}

    @Post('signup')
    public signup(@Body() dto:AuthDto){
        return this.authService.signup(dto)
    }

    @Post('signin')
    public signin(): string{
        return this.authService.signin()
    }
}
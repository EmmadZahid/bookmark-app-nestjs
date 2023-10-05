import { Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(private authService:AuthService){}

    @Post('signup')
    public signup(): string{
        return "I am signed up"
    }

    @Post('signin')
    public signin(): string{
        return "I am signed in"
    }
}
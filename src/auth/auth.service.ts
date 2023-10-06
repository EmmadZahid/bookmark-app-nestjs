import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService{

    public signup(): string{
        return "signup"
    }

    public signin(): string{
        return "signin"
    }
}
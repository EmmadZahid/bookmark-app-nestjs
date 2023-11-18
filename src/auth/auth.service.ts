import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  public async signup(dto: AuthDto): Promise<{ access_token: string }> {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          //Prisma own error for duplicate
          throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  public async signin(dto: AuthDto): Promise<{ access_token: string }> {
    const user: User = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) {
      const passwordMatch = await argon.verify(user.hash, dto.password);
      if (passwordMatch) {
        return this.signToken(user.id, user.email);
      } else {
        throw new BadRequestException('Invalid credentials');
      }
    } else {
      throw new BadRequestException('Invalid credentials');
    }
  }

  private signToken(userId: number, email: string): { access_token: string } {
    const payload = {
      sub: userId,
      email,
    };

    const token: string = this.jwt.sign(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECERET'),
    });

    return {
      access_token: token,
    };
  }
}

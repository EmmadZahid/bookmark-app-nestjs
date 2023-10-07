import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Global() //So that we dont have to import in every module
@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}

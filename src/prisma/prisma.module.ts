import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //So that we dont have to import in every module
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}

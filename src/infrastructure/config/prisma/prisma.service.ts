import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientWithClient } from './prisma-extensions';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

export function getPrismaWithClient(
  prismaService: PrismaService,
): PrismaClientWithClient {
  return prismaService as unknown as PrismaClientWithClient;
}

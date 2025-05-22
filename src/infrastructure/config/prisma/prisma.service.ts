import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientWithClient } from './prisma-extensions';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks() {
    this.$on('beforeExit', async () => {
      await this.$disconnect();
    });
  }
}

export function getPrismaWithClient(
  prismaService: PrismaService,
): PrismaClientWithClient {
  return prismaService as unknown as PrismaClientWithClient;
}
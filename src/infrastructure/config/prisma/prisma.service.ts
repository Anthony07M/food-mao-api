import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Ensure that all models are explicitly defined in the type
  client: any;
  order: any;
  orderItem: any;
  product: any;
  category: any;
  
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks() {
    // Close Prisma connection
    this.$on('beforeExit', async () => {
      await this.$disconnect();
    });
  }
}
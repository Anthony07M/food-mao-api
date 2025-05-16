import { PrismaClient } from '@prisma/client';

// Use a type that tells TypeScript that the client property exists, without
// trying to extend or override the original Prisma types
export type PrismaClientWithClient = PrismaClient & {
  client: {
    create: (args: { data: any; select?: any }) => Promise<any>;
    delete: (args: { where: { id: string } }) => Promise<any>;
    update: (args: { where: { id: string }; data: any }) => Promise<any>;
    findUnique: (args: { where: { id: string } }) => Promise<any>;
    findMany: (args: {
      skip?: number;
      take?: number;
      where?: any;
    }) => Promise<any[]>;
    count: (args?: { where?: any }) => Promise<number>;
  };
};

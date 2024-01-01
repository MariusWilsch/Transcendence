// prisma.service.ts
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

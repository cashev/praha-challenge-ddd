import { PrismaClient } from '@prisma/client';
import { IUserQS, UserDto } from 'src/app/query-service-interface/user-qs';

export class UserQS implements IUserQS {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<UserDto[]> {
    const users = await this.prismaClient.user.findMany();
    return users.map((user) => new UserDto({ ...user }));
  }
}

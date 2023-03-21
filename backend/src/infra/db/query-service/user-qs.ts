import { PrismaClient } from '@prisma/client';
import { IUserQS, UserDto } from 'src/app/query-service-interface/user-qs';

export class UserQS implements IUserQS {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async findById(id: number): Promise<UserDto> {
    const user = await this.prismaClient.user.findUniqueOrThrow({
      where: {id}
    });
    return new UserDto({...user});
  }

  public async getAll(): Promise<UserDto[]> {
    const users = await this.prismaClient.user.findMany();
    return users.map((user) => new UserDto({ ...user }));
  }
}

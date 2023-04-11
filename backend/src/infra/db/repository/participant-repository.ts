import { PrismaClient } from '@prisma/client';
import { Participant } from 'src/domain/entity/participant';
import { IParticipantRepository } from 'src/domain/repository-interface/participant-repository';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import { ParticipantName } from 'src/domain/value-object/participantName';
import {
  createUserStatus,
  getValue,
} from 'src/domain/value-object/participantStatus';

export class ParticipantRepository implements IParticipantRepository {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async find(id: number): Promise<Participant | null> {
    const result = await this.prismaClient.participant.findUnique({
      where: { id },
    });
    if (result == null) {
      return null;
    }
    return Participant.create(result.id, {
      participantName: ParticipantName.create(result.name),
      email: ParticipantEmail.create(result.email),
      status: createUserStatus(result.status),
    });
  }
  async getNextId(): Promise<number> {
    throw new Error();
  }
  async save(participant: Participant): Promise<void> {
    await this.prismaClient.participant.upsert({
      where: { id: participant.id },
      update: {
        name: participant.participantName.getValue(),
        email: participant.email.getValue(),
        status: getValue(participant.status),
      },
      create: {
        id: participant.id,
        name: participant.participantName.getValue(),
        email: participant.email.getValue(),
        status: getValue(participant.status),
      },
    });
  }
}

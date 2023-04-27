import { PrismaClient } from '@prisma/client';
import { Option, none, some } from 'fp-ts/lib/Option';
import { Participant } from 'src/domain/entity/participant';
import { IParticipantRepository } from 'src/domain/repository-interface/participant-repository';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import { ParticipantName } from 'src/domain/value-object/participantName';
import {
  createUserStatus,
  getParticipantStatusValue,
} from 'src/domain/value-object/participantStatus';

export class ParticipantRepository implements IParticipantRepository {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async find(id: string): Promise<Option<Participant>> {
    const result = await this.prismaClient.participant.findUnique({
      where: { id },
    });
    if (result == null) {
      return none;
    }
    const participant = Participant.create(result.id.toString(), {
      participantName: ParticipantName.create(result.name),
      email: ParticipantEmail.create(result.email),
      status: createUserStatus(result.status),
    });
    return some(participant);
  }

  async findByEmail(email: string): Promise<Option<Participant>> {
    const result = await this.prismaClient.participant.findUnique({
      where: { email },
    });
    if (result == null) {
      return none;
    }
    const participant = Participant.create(result.id.toString(), {
      participantName: ParticipantName.create(result.name),
      email: ParticipantEmail.create(result.email),
      status: createUserStatus(result.status),
    });
    return some(participant);
  }

  async save(participant: Participant): Promise<void> {
    await this.prismaClient.participant.upsert({
      where: { id: participant.id },
      update: {
        name: participant.participantName.getValue(),
        email: participant.email.getValue(),
        status: getParticipantStatusValue(participant.status),
      },
      create: {
        id: participant.id,
        name: participant.participantName.getValue(),
        email: participant.email.getValue(),
        status: getParticipantStatusValue(participant.status),
      },
    });
  }
}

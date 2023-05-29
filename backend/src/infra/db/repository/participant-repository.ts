import { PrismaClient } from '@prisma/client';
import { Option, none, some } from 'fp-ts/lib/Option';
import { Participant } from 'src/domain/entity/participant';
import { IParticipantRepository } from 'src/domain/repository-interface/participant-repository';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import { ParticipantName } from 'src/domain/value-object/participantName';

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
    const participant = Participant.create(
      result.id.toString(),
      ParticipantName.create(result.name),
      ParticipantEmail.create(result.email),
    );
    return some(participant);
  }

  async findByEmail(email: string): Promise<Option<Participant>> {
    const result = await this.prismaClient.participant.findUnique({
      where: { email },
    });
    if (result == null) {
      return none;
    }
    const participant = Participant.create(
      result.id.toString(),
      ParticipantName.create(result.name),
      ParticipantEmail.create(result.email),
    );
    return some(participant);
  }

  async save(participant: Participant): Promise<void> {
    await this.prismaClient.participant.upsert({
      where: { id: participant.id },
      update: {
        name: participant.getName().getValue(),
        email: participant.getEmail().getValue(),
      },
      create: {
        id: participant.id,
        name: participant.getName().getValue(),
        email: participant.getEmail().getValue(),
      },
    });
  }
}

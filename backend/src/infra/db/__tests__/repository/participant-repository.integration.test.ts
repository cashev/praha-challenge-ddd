import { prisma } from 'src/testUtil/prisma';
import { ParticipantRepository } from '../../repository/participant-repository';
import { Participant } from 'src/domain/entity/participant';
import { ParticipantName } from 'src/domain/value-object/participantName';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import {
  Taikai,
  createUserStatus,
  getParticipantStatusValue,
} from 'src/domain/value-object/participantStatus';
import { isNone, isSome } from 'fp-ts/lib/Option';
import { createTestParticipants } from 'src/testUtil/test-data';

describe('participant-repository.integration.test', () => {
  const participantRepository = new ParticipantRepository(prisma);

  beforeAll(async () => {
    await prisma.participant.deleteMany({});
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('find', () => {
    const data = createTestParticipants();
    beforeAll(async () => {
      await prisma.participant.createMany({ data });
    });
    afterEach(async () => {
      await prisma.participant.deleteMany({});
    });
    test('', async () => {
      const result = await participantRepository.find('003');
      if (isNone(result)) {
        throw new Error();
      }
      const p = result.value;
      const p3 = data[2];
      expect(p.participantName.getValue()).toEqual(p3.name);
      expect(p.email.getValue()).toEqual(p3.email);
      expect(getParticipantStatusValue(p.status)).toEqual(p3.status);
    });
  });

  describe('findByEmail', () => {
    beforeAll(async () => {
      await prisma.participant.createMany({ data: createTestParticipants() });
    });
    afterEach(async () => {
      await prisma.participant.deleteMany({});
    });
    test('[正常系] 存在するemail', async () => {
      const result = await participantRepository.findByEmail(
        'test001@example.com',
      );
      expect(isSome(result)).toBeTruthy();
    });
    test('[正常系] 存在しないemail', async () => {
      const result = await participantRepository.findByEmail(
        'test999@example.com',
      );
      expect(isNone(result)).toBeTruthy();
    });
  });

  describe('save', () => {
    const data = createTestParticipants();
    beforeAll(async () => {
      await prisma.participant.createMany({ data });
    });
    afterEach(async () => {
      await prisma.participant.deleteMany({});
    });
    const p901 = {
      id: '901',
      name: '平山 直秋',
      email: 'naoaki.hirayama@comeon.to',
      status: '在籍中',
    };

    test('[正常系] insert', async () => {
      const participant = Participant.create(p901.id.toString(), {
        name: ParticipantName.create(p901.name),
        email: ParticipantEmail.create(p901.email),
        status: createUserStatus(p901.status),
      });
      await participantRepository.save(participant);

      const result = await participantRepository.find(p901.id);
      if (isSome(result)) {
        const participant = result.value;
        expect(participant.participantName.getValue()).toEqual(p901.name);
        expect(participant.participantName.getValue()).toEqual(p901.name);
        expect(participant.email.getValue()).toEqual(p901.email);
        expect(getParticipantStatusValue(participant.status)).toEqual(
          p901.status,
        );
      } else {
        throw new Error();
      }
    });
    test('[正常系] update', async () => {
      const p5 = data[4];
      const participant = Participant.create(p5.id.toString(), {
        name: ParticipantName.create(p5.name),
        email: ParticipantEmail.create(p5.email),
        status: createUserStatus(p5.status),
      });
      participant.status = Taikai;
      await participantRepository.save(participant);

      const result = await participantRepository.find(p5.id);
      if (isNone(result)) {
        throw new Error();
      }
      const p = result.value;
      expect(getParticipantStatusValue(p.status)).toEqual(
        getParticipantStatusValue(Taikai),
      );
    });
  });
});

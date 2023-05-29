import { prisma } from 'src/testUtil/prisma';
import { ParticipantRepository } from '../../repository/participant-repository';
import { Participant } from 'src/domain/entity/participant';
import { ParticipantName } from 'src/domain/value-object/participantName';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
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
      expect(p.getName().getValue()).toEqual(p3.name);
      expect(p.getEmail().getValue()).toEqual(p3.email);
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
    };

    test('[正常系] insert', async () => {
      const participant = Participant.create(
        p901.id.toString(),
        ParticipantName.create(p901.name),
        ParticipantEmail.create(p901.email),
      );
      await participantRepository.save(participant);

      const result = await participantRepository.find(p901.id);
      if (isSome(result)) {
        const participant = result.value;
        expect(participant.getName().getValue()).toEqual(p901.name);
        expect(participant.getEmail().getValue()).toEqual(p901.email);
      } else {
        throw new Error();
      }
    });
  });
});

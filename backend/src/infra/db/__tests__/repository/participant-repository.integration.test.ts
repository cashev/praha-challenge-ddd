import { prisma } from 'src/testUtil/prisma';
import { ParticipantRepository } from '../../repository/participant-repository';
import { Participant } from 'src/domain/entity/participant';
import { ParticipantName } from 'src/domain/value-object/participantName';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import {
  Taikai,
  createUserStatus,
  getValue,
} from 'src/domain/value-object/participantStatus';

describe('participant-repository.integration.test', () => {
  const participantRepository = new ParticipantRepository(prisma);
  const p1 = {
    id: 1,
    name: '今井 光善',
    email: 'imai1979@example.gr.jp',
    status: '在籍中',
  };
  const p2 = {
    id: 2,
    name: '平山 直秋',
    email: 'naoaki.hirayama@comeon.to',
    status: '在籍中',
  };
  const p3 = {
    id: 3,
    name: '瀬戸 哲子',
    email: 'otes1981@dion.ne.jp',
    status: '在籍中',
  };
  const p4 = {
    id: 4,
    name: '神谷 真琴',
    email: 'sntnmktcomeon@comeon.to',
    status: '休会中',
  };
  const p5 = {
    id: 5,
    name: '福岡 慶太郎',
    email: 'hukuoka-keitarou@so-net.ne.jp',
    status: '退会済',
  };

  beforeAll(async () => {
    await prisma.participant.deleteMany({});
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('find', () => {
    beforeAll(async () => {
      await prisma.participant.createMany({ data: [p1, p2, p3, p4, p5] });
    });
    afterEach(async () => {
      await prisma.participant.deleteMany({});
    });
    test('', async () => {
      const result = await participantRepository.find(3);
      if (result == null) {
        throw new Error();
      }
      expect(result.participantName.getValue()).toEqual(p3.name);
      expect(result.email.getValue()).toEqual(p3.email);
      expect(getValue(result.status)).toEqual(p3.status);
    });
  });

  describe('getNextId', () => {
    // test('', async () => {
    //   await prisma.$queryRaw`select setval('Participant_id_seq', 5)`;
    //   const result = await participantRepository.getNextId();
    //   expect(result).toBe(6);
    // });
  });

  describe('save', () => {
    beforeAll(async () => {
      await prisma.participant.createMany({ data: [p1, p3] });
    });
    afterEach(async () => {
      await prisma.participant.deleteMany({});
    });
    test('[正常系] insert', async () => {
      const participant = Participant.create(p2.id.toString(), {
        participantName: ParticipantName.create(p2.name),
        email: ParticipantEmail.create(p2.email),
        status: createUserStatus(p2.status),
      });
      await participantRepository.save(participant);

      const result = await participantRepository.find(p2.id);
      if (result != null) {
        expect(result.participantName.getValue()).toEqual(p2.name);
        expect(result.participantName.getValue()).toEqual(p2.name);
        expect(result.email.getValue()).toEqual(p2.email);
        expect(getValue(result.status)).toEqual(p2.status);
      } else {
        throw new Error();
      }
    });
    test('[正常系] update', async () => {
      const participant = Participant.create(p3.id.toString(), {
        participantName: ParticipantName.create(p3.name),
        email: ParticipantEmail.create(p3.email),
        status: createUserStatus(p3.status),
      });
      participant.status = Taikai;
      await participantRepository.save(participant);

      const result = await participantRepository.find(p3.id);
      if (result == null) {
        throw new Error();
      }
      expect(getValue(result.status)).toEqual(getValue(Taikai));
    });
  });
});

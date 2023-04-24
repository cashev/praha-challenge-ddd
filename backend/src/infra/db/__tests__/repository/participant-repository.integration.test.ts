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

describe('participant-repository.integration.test', () => {
  const participantRepository = new ParticipantRepository(prisma);
  const p1 = {
    id: '1',
    name: '今井 光善',
    email: 'imai1979@example.gr.jp',
    status: '在籍中',
  };
  const p2 = {
    id: '2',
    name: '平山 直秋',
    email: 'naoaki.hirayama@comeon.to',
    status: '在籍中',
  };
  const p3 = {
    id: '3',
    name: '瀬戸 哲子',
    email: 'otes1981@dion.ne.jp',
    status: '在籍中',
  };
  const p4 = {
    id: '4',
    name: '神谷 真琴',
    email: 'sntnmktcomeon@comeon.to',
    status: '休会中',
  };
  const p5 = {
    id: '5',
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
      const result = await participantRepository.find('3');
      if (isNone(result)) {
        throw new Error();
      }
      const p = result.value;
      expect(p.participantName.getValue()).toEqual(p3.name);
      expect(p.email.getValue()).toEqual(p3.email);
      expect(getParticipantStatusValue(p.status)).toEqual(p3.status);
    });
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
      if (isSome(result)) {
        const participant = result.value;
        expect(participant.participantName.getValue()).toEqual(p2.name);
        expect(participant.participantName.getValue()).toEqual(p2.name);
        expect(participant.email.getValue()).toEqual(p2.email);
        expect(getParticipantStatusValue(participant.status)).toEqual(
          p2.status,
        );
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

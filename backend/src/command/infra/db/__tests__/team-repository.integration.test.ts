import { prisma } from 'src/testUtil/prisma';
import {
  creaeTestPairParticipants,
  creaeTestTeamKyukaiParticipants,
  creaeTestTeamParticipants,
  createTestPair,
  createTestParticipants,
  createTestTeam,
  createTestTeamPair,
} from 'src/testUtil/test-data';
import { isNone, none } from 'fp-ts/lib/Option';
import { TeamRepository } from '../team-repository';
import { Team } from 'src/command/domain/entity/team';

describe('team-repository.integration.test', () => {
  const teamRepository = new TeamRepository(prisma);

  const createTestData = async () => {
    await prisma.participant.createMany({ data: createTestParticipants() });
    await prisma.pair.createMany({ data: createTestPair() });
    await prisma.team.createMany({ data: createTestTeam() });
    await prisma.pair_Participant.createMany({
      data: creaeTestPairParticipants(),
    });
    await prisma.team_Pair.createMany({ data: createTestTeamPair() });
    await prisma.team_Participant.createMany({
      data: creaeTestTeamParticipants(),
    });
    await prisma.team_Kyukai_Participant.createMany({
      data: creaeTestTeamKyukaiParticipants(),
    });
  };
  const deleteTestData = async () => {
    await prisma.team_Pair.deleteMany();
    await prisma.team_Participant.deleteMany();
    await prisma.team_Kyukai_Participant.deleteMany();
    await prisma.pair_Participant.deleteMany();
    await prisma.team.deleteMany();
    await prisma.pair.deleteMany();
    await prisma.participant.deleteMany();
  };

  beforeAll(async () => {
    await deleteTestData();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('findByParticipantId', () => {
    beforeAll(async () => {
      await createTestData();
    });
    afterAll(async () => {
      await deleteTestData();
    });
    test('[正常系]', async () => {
      const result = await teamRepository.findByParticipantId('007');
      if (isNone(result)) {
        throw new Error();
      }
      const team = result.value;
      expect(team.id).toEqual('200');
      expect(team.name.getValue()).toEqual('204');
      expect(team.getPairs().length).toBe(2);
    });

    test('[異常系]', async () => {
      const result = await teamRepository.findByParticipantId('999');
      expect(isNone(result)).toBeTruthy();
    });
  });
  describe('getSmallestTeamList', () => {
    beforeAll(async () => {
      await createTestData();
    });
    afterAll(async () => {
      await deleteTestData();
    });
    test('[正常系]', async () => {
      const result = await teamRepository.getSmallestTeamList();
      if (isNone(result)) {
        throw new Error();
      }
      const teams = result.value;
      expect(teams.length).toBe(2);
      expect(
        teams.every((t) => t.getZaisekiMember().length === 3),
      ).toBeTruthy();
    });
  });
  describe('save', () => {
    beforeAll(async () => {
      await createTestData();
    });
    afterAll(async () => {
      await deleteTestData();
    });
    test('[正常系] メンバー追加', async () => {
      const team = Team.create('300', '303', [
        {
          pairId: '301',
          pairName: 'a',
          participants: ['008', '010'],
        },
        {
          pairId: '302',
          pairName: 'b',
          participants: ['009', '081'],
        },
      ]);
      await teamRepository.save(team);
      const result = await teamRepository.findByParticipantId('081');
      if (isNone(result)) {
        throw new Error();
      }
      const teamResult = result.value;
      expect(teamResult.id).toEqual('300');
      expect(teamResult.name.getValue()).toEqual('303');
      expect(teamResult.getPairs().length).toBe(2);
    });
    test('[正常系] メンバー削除', async () => {
      const team = Team.create('400', '404', [
        {
          pairId: '402',
          pairName: 'b',
          participants: ['011', '013', '014'],
        },
      ]);
      await teamRepository.save(team);
      const result = await teamRepository.findByParticipantId('011');
      if (isNone(result)) {
        throw new Error();
      }
      const teamResult = result.value;
      expect(teamResult.id).toEqual('400');
      expect(teamResult.getPairs().length).toBe(1);
      expect(teamResult.getPairs()[0].getParticipants().length).toBe(3);

      const result2 = await teamRepository.findByParticipantId('012');
      expect(result2).toEqual(none);
    });
  });
});

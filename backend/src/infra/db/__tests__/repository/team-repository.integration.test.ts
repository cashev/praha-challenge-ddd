import { prisma } from 'src/testUtil/prisma';
import { TeamRepository } from '../../repository/team-repository';
import {
  creaeTestPairParticipants,
  creaeTestTeamParticipants,
  createTestPair,
  createTestParticipants,
  createTestTeam,
  createTestTeamPair,
} from 'src/testUtil/test-data';
import { Team } from 'src/domain/entity/team';
import { TeamName } from 'src/domain/value-object/teamName';
import { Pair } from 'src/domain/entity/pair';
import { PairName } from 'src/domain/value-object/pairName';
import { ParticipantIdType } from 'src/domain/entity/participant';
import { isNone, none } from 'fp-ts/lib/Option';

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
  };
  const deleteTestData = async () => {
    await prisma.team_Pair.deleteMany();
    await prisma.team_Participant.deleteMany();
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
      expect(team.teamName.getValue()).toEqual('204');
      expect(team.pairList.length).toBe(2);
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
      const team = result.value;
      expect(team.length).toBe(3);
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
      const team = Team.create('300', {
        teamName: TeamName.create('303'),
        pairList: [
          Pair.create('301', {
            pairName: PairName.create('a'),
            member: ['008' as ParticipantIdType, '010' as ParticipantIdType],
          }),
          Pair.create('302', {
            pairName: PairName.create('b'),
            member: ['009' as ParticipantIdType, '081' as ParticipantIdType],
          }),
        ],
      });
      await teamRepository.save(team);
      const result = await teamRepository.findByParticipantId('081');
      if (isNone(result)) {
        throw new Error();
      }
      const teamResult = result.value;
      expect(teamResult.id).toEqual('300');
      expect(teamResult.teamName.getValue()).toEqual('303');
      expect(teamResult.pairList.length).toBe(2);
    });
    test('[正常系] メンバー削除', async () => {
      const team = Team.create('400', {
        teamName: TeamName.create('404'),
        pairList: [
          Pair.create('402', {
            pairName: PairName.create('b'),
            member: [
              '011' as ParticipantIdType,
              '013' as ParticipantIdType,
              '014' as ParticipantIdType,
            ],
          }),
        ],
      });
      await teamRepository.save(team);
      const result = await teamRepository.findByParticipantId('011');
      if (isNone(result)) {
        throw new Error();
      }
      const teamResult = result.value;
      expect(teamResult.id).toEqual('400');
      expect(teamResult.pairList.length).toBe(1);
      expect(teamResult.pairList[0].member.length).toBe(3);

      const result2 = await teamRepository.findByParticipantId('012');
      expect(result2).toEqual(none);
    });
  });
});

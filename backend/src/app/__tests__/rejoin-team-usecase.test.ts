import { Pair } from 'src/domain/entity/pair';
import { Team } from 'src/domain/entity/team';
import { Participant } from 'src/domain/entity/participant';
import { PairName } from 'src/domain/value-object/pairName';
import { TeamName } from 'src/domain/value-object/teamName';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import { ParticipantName } from 'src/domain/value-object/participantName';
import {
  Kyukai,
  Taikai,
  ParticipantStatus,
  Zaiseki,
} from 'src/domain/value-object/participantStatus';
import { RejoinTeamUseCase } from '../rejoin-team-usecase';

describe('do', () => {
  const createMockParticipantRepo = (participant: Participant | null) => {
    return {
      find: jest.fn().mockResolvedValue(participant),
      save: jest.fn(),
    };
  };
  const createMockTeamRepo = (team: Team[] | null) => {
    return {
      findByName: jest.fn(),
      findByParticipantId: jest.fn(),
      getSmallestTeamList: jest.fn().mockResolvedValue(team),
      getNextPairId: jest.fn(),
      save: jest.fn(),
    };
  };
  const createParticipant = (status: ParticipantStatus) => {
    return Participant.create(1, {
      participantName: ParticipantName.create('川島 佐十郎'),
      email: ParticipantEmail.create('sjurp8200331@combzmail.jp'),
      status,
    });
  };
  const createMember = () => {
    const p11 = Participant.create(11, {
      participantName: ParticipantName.create('大内 真志'),
      email: ParticipantEmail.create('isasam171@nifty.com'),
      status: Zaiseki,
    });
    const p12 = Participant.create(12, {
      participantName: ParticipantName.create('沼田 義武'),
      email: ParticipantEmail.create('yositake-numata@nifty.jp'),
      status: Zaiseki,
    });
    const p13 = Participant.create(13, {
      participantName: ParticipantName.create('中川 火呂絵'),
      email: ParticipantEmail.create('hre-nkgw@example.ad.jp'),
      status: Zaiseki,
    });
    return [p11, p12, p13];
  };
  const createMember2 = () => {
    const p21 = Participant.create(11, {
      participantName: ParticipantName.create('小倉 敬史'),
      email: ParticipantEmail.create('tks@infoseek.jp'),
      status: Zaiseki,
    });
    const p22 = Participant.create(12, {
      participantName: ParticipantName.create('井口 晴生'),
      email: ParticipantEmail.create('haruo1112@comeon.to'),
      status: Zaiseki,
    });
    const p23 = Participant.create(13, {
      participantName: ParticipantName.create('谷川 善二'),
      email: ParticipantEmail.create('zenzi-yagawa@dti.ne.jp'),
      status: Zaiseki,
    });
    return [p21, p22, p23];
  };

  test('[正常系] 既存のペアに参加する', async () => {
    const member = createMember().slice(0, 2);
    const pair1 = Pair.create(1, { pairName: PairName.create('a'), member });
    const pair2 = Pair.create(2, {
      pairName: PairName.create('b'),
      member: createMember2(),
    });
    const team = Team.create(1, {
      teamName: TeamName.create('1'),
      pairList: [pair1, pair2],
    });
    const newParticipant = createParticipant(Kyukai);

    const mockParticipantRepo = createMockParticipantRepo(newParticipant);
    const mockTeamRepo = createMockTeamRepo([team]);
    const participantcase = new RejoinTeamUseCase(
      mockParticipantRepo,
      mockTeamRepo,
    );
    await participantcase.do(1);

    expect(pair1.member).toEqual([...member, newParticipant]);
  });

  test('[正常系] 既存のペアを分割して参加する', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);

    const member = createMember();
    const pair1 = Pair.create(1, { pairName: PairName.create('a'), member });
    const team = Team.create(1, {
      teamName: TeamName.create('1'),
      pairList: [pair1],
    });
    const newParticipant = createParticipant(Taikai);

    const mockParticipantRepo = createMockParticipantRepo(newParticipant);
    const mockTeamRepo = createMockTeamRepo([team]);
    const participantcase = new RejoinTeamUseCase(
      mockParticipantRepo,
      mockTeamRepo,
    );
    await participantcase.do(1);

    expect(team.pairList.length).toBe(2);
    expect(pair1.member).toEqual(member.slice(1));
    expect(team.pairList[1].member).toEqual([member[0], newParticipant]);
  });

  test('[異常系] 存在しない参加者', async () => {
    const mockParticipantRepo = createMockParticipantRepo(null);
    const mockTeamRepo = createMockTeamRepo(null);
    const useCase = new RejoinTeamUseCase(mockParticipantRepo, mockTeamRepo);

    expect(useCase.do(1)).rejects.toThrow();
  });

  test('[異常系] 在籍中の参加者', async () => {
    const participant = createParticipant(Zaiseki);
    const mockParticipantRepo = createMockParticipantRepo(participant);
    const mockTeamRepo = createMockTeamRepo(null);
    const useCase = new RejoinTeamUseCase(mockParticipantRepo, mockTeamRepo);

    expect(useCase.do(1)).rejects.toThrow();
  });
});

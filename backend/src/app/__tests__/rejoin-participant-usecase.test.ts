import { Pair } from 'src/domain/entity/pair';
import { Team } from 'src/domain/entity/team';
import { Participant, ParticipantIdType } from 'src/domain/entity/participant';
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
import { RejoinParticipantUseCase } from '../rejoin-participant-usecase';
import { none, some } from 'fp-ts/lib/Option';
import { MockTeamRepository } from './mock/team-repository';
import { MockParticipantRepository } from './mock/participant-repository';

describe('do', () => {
  const createParticipant = (status: ParticipantStatus) => {
    return Participant.create('1', {
      participantName: ParticipantName.create('川島 佐十郎'),
      email: ParticipantEmail.create('sjurp8200331@combzmail.jp'),
      status,
    });
  };
  const createMember = () => {
    const p11 = '11' as ParticipantIdType;
    const p12 = '12' as ParticipantIdType;
    const p13 = '13' as ParticipantIdType;
    return [p11, p12, p13];
  };
  const createMember2 = () => {
    const p21 = '21' as ParticipantIdType;
    const p22 = '21' as ParticipantIdType;
    const p23 = '21' as ParticipantIdType;
    return [p21, p22, p23];
  };

  test('[正常系] 既存のペアに参加する', async () => {
    const member = createMember().slice(0, 2);
    const pair1 = Pair.create('1', { pairName: PairName.create('a'), member });
    const pair2 = Pair.create('2', {
      pairName: PairName.create('b'),
      member: createMember2(),
    });
    const team = Team.create('1', {
      teamName: TeamName.create('1'),
      pairList: [pair1, pair2],
    });
    const newParticipant = createParticipant(Kyukai);

    const mockParticipantRepo = new MockParticipantRepository(
      some(newParticipant),
    );
    const mockTeamRepo = new MockTeamRepository(none, some([team]));
    const participantcase = new RejoinParticipantUseCase(
      mockParticipantRepo,
      mockTeamRepo,
    );
    await participantcase.do('1');

    expect(pair1.member).toEqual([...member, newParticipant.id]);
  });

  test('[正常系] 既存のペアを分割して参加する', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);

    const member = createMember();
    const pair1 = Pair.create('1', { pairName: PairName.create('a'), member });
    const team = Team.create('1', {
      teamName: TeamName.create('1'),
      pairList: [pair1],
    });
    const newParticipant = createParticipant(Taikai);

    const mockParticipantRepo = new MockParticipantRepository(
      some(newParticipant),
    );
    const mockTeamRepo = new MockTeamRepository(none, some([team]));
    const participantcase = new RejoinParticipantUseCase(
      mockParticipantRepo,
      mockTeamRepo,
    );
    await participantcase.do('1');

    expect(team.pairList.length).toBe(2);
    expect(pair1.member).toEqual(member.slice(1));
    expect(team.pairList[1].member).toEqual([member[0], newParticipant.id]);
  });

  test('[異常系] 存在しない参加者', async () => {
    const mockParticipantRepo = new MockParticipantRepository();
    const mockTeamRepo = new MockTeamRepository();
    const useCase = new RejoinParticipantUseCase(
      mockParticipantRepo,
      mockTeamRepo,
    );

    expect(useCase.do('1')).rejects.toThrow();
  });

  test('[異常系] 在籍中の参加者', async () => {
    const participant = createParticipant(Zaiseki);
    const mockParticipantRepo = new MockParticipantRepository(
      some(participant),
    );
    const mockTeamRepo = new MockTeamRepository();
    const useCase = new RejoinParticipantUseCase(
      mockParticipantRepo,
      mockTeamRepo,
    );

    expect(useCase.do('1')).rejects.toThrow();
  });
});

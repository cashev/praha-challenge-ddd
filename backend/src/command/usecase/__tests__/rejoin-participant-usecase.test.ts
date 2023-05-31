import { RejoinParticipantUseCase } from '../rejoin-participant-usecase';
import { isSome, some } from 'fp-ts/lib/Option';
import { MockTeamRepository } from './mock/team-repository';
import { ParticipantIdType } from 'src/command/domain/entity/participant';
import { Team } from 'src/command/domain/entity/team';

const createThreeZaisekiMember = () => {
  const ps11 = {
    participantId: '11',
    status: '在籍中',
  };
  const ps12 = {
    participantId: '12',
    status: '在籍中',
  };
  const ps13 = {
    participantId: '13',
    status: '在籍中',
  };
  const ps14 = {
    participantId: '14',
    status: '休会中',
  };
  return [ps11, ps12, ps13, ps14];
};

const createPair = () => {
  const p1 = {
    pairId: '1',
    pairName: 'a',
    member: [...createThreeZaisekiMember()],
  };
  return [p1];
};

const createTeam = () => {
  const t1 = Team.create('1', '123', [...createPair()]);
  return t1;
};

describe('do', () => {
  test('[正常系]', async () => {
    const team = createTeam();
    const mockTeamRepo = new MockTeamRepository(some(team));
    const participantcase = new RejoinParticipantUseCase(mockTeamRepo);
    await participantcase.do('14');

    expect(team.getZaisekiMember().length).toEqual(4);
    const pid = '14' as ParticipantIdType;
    expect(team.getPairs().some((p) => p.isMember(pid))).toBeTruthy();
    const ps = team.getAllMember().filter((ps) => ps.participantId === pid)[0];
    expect(ps.isZaiseki()).toBeTruthy();
  });

  test('[異常系] 存在しない参加者', async () => {
    const mockTeamRepo = new MockTeamRepository();
    const useCase = new RejoinParticipantUseCase(mockTeamRepo);

    const result = await useCase.do('14');
    expect(isSome(result)).toBeTruthy();
  });

  test('[異常系] 在籍中の参加者', async () => {
    const team = createTeam();
    const mockTeamRepo = new MockTeamRepository(some(team));
    const useCase = new RejoinParticipantUseCase(mockTeamRepo);

    const result = await useCase.do('13');
    expect(isSome(result)).toBeTruthy();
    expect(team.getZaisekiMember().length).toEqual(3);
    const pid = '14' as ParticipantIdType;
    const ps = team.getAllMember().filter((ps) => ps.participantId === pid)[0];
    expect(ps.isKyukai()).toBeTruthy();
  });
});

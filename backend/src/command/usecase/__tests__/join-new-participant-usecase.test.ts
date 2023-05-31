import { JoinNewParticipantUsecase } from '../join-new-participant-usecase';
import { isSome, none, some } from 'fp-ts/lib/Option';
import { MockTeamRepository } from './mock/team-repository';
import { MockParticipantRepository } from './mock/participant-repository';
import { MockTaskStatusRepository } from './mock/taskStatus-repository';
import { ParticipantName } from 'src/command/domain/value-object/participantName';
import { ParticipantEmail } from 'src/command/domain/value-object/participantEmail';
import { Participant } from 'src/command/domain/entity/participant';
import { Yet } from 'src/command/domain/value-object/taskStatusValue';
import { TaskIdDto } from 'src/query/usecase/query-service-interface/task-qs';
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
  const createMockTaskQS = () => {
    const ret = [];
    for (let i = 1; i <= 80; i++) {
      const dto = new TaskIdDto({
        id: i.toString(),
      });
      ret.push(dto);
    }
    return {
      getAll: jest.fn().mockResolvedValue(ret),
    };
  };

  test('[正常系] 新規参加者を追加する', async () => {
    const team = createTeam();
    const mockTSRepository = new MockTaskStatusRepository();
    const usecase = new JoinNewParticipantUsecase(
      new MockParticipantRepository(),
      new MockTeamRepository(none, some([team])),
      mockTSRepository,
      createMockTaskQS(),
    );
    await usecase.do('三谷 照也', 'ayuret1975@gmo-media.jp');

    expect(team.getPairs().length).toBe(2);
    expect(team.getAllMember().length).toBe(5);
    expect(team.getZaisekiMember().length).toBe(4);
    const tsList = mockTSRepository.getAll();
    expect(tsList.length).toBe(80);
    expect(tsList.every((ts) => ts.status === Yet)).toBeTruthy();
  });

  test('[異常系] メールアドレスが重複した参加者を追加する', async () => {
    const duplicateParticipant = Participant.create(
      '31',
      ParticipantName.create('中島 裕実'),
      ParticipantEmail.create('nakasima-hiromi@dion.ne.jp'),
    );
    const team = createTeam();
    const usecase = new JoinNewParticipantUsecase(
      new MockParticipantRepository(some(duplicateParticipant)),
      new MockTeamRepository(none, some([team])),
      new MockTaskStatusRepository(),
      createMockTaskQS(),
    );
    const result = await usecase.do('中島 裕実', 'nakasima-hiromi@dion.ne.jp');
    expect(isSome(result)).toBeTruthy();
  });
});

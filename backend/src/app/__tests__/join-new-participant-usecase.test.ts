import { Pair } from 'src/domain/entity/pair';
import { Participant, ParticipantIdType } from 'src/domain/entity/participant';
import { Team } from 'src/domain/entity/team';
import { PairName } from 'src/domain/value-object/pairName';
import { TeamName } from 'src/domain/value-object/teamName';
import { JoinNewParticipantUsecase } from '../join-new-participant-usecase';
import { TaskStatus } from 'src/domain/entity/taskStatus';
import { Yet } from 'src/domain/value-object/taskStatusValue';
import { TaskIdDto } from '../query-service-interface/task-qs';
import { isSome, none, some } from 'fp-ts/lib/Option';
import { MockTeamRepository } from './mock/team-repository';
import { MockParticipantRepository } from './mock/participant-repository';
import { ParticipantName } from 'src/domain/value-object/participantName';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import { Zaiseki } from 'src/domain/value-object/participantStatus';

describe('do', () => {
  const createMockTaskStatusRepo = (nextId: number, tsList: TaskStatus[]) => {
    return {
      find: jest.fn(),
      getNextIdAndSetNext: jest.fn().mockResolvedValue(nextId),
      save: jest.fn(),
      saveAll: (taskStatusList: TaskStatus[]) => {
        taskStatusList.map((ts) => tsList.push(ts));
        return Promise.resolve();
      },
    };
  };
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
  const createThreeMember = () => {
    const p21 = '21' as ParticipantIdType;
    const p22 = '22' as ParticipantIdType;
    const p23 = '23' as ParticipantIdType;
    return [p21, p22, p23];
  };
  const createPair = () => {
    const pair = Pair.create('1', {
      pairName: PairName.create('a'),
      member: createThreeMember(),
    });
    return [pair];
  };
  const createTeam = () => {
    const team = Team.create('1', {
      teamName: TeamName.create('123'),
      pairList: createPair(),
    });
    return team;
  };

  test('[正常系] 新規参加者を追加する', async () => {
    const team = createTeam();
    const tsList: TaskStatus[] = [];
    const usecase = new JoinNewParticipantUsecase(
      new MockParticipantRepository(),
      new MockTeamRepository(none, some([team])),
      createMockTaskStatusRepo(241, tsList),
      createMockTaskQS(),
    );
    await usecase.do('三谷 照也', 'ayuret1975@gmo-media.jp');

    expect(team.pairList.length).toBe(2);
    expect(team.member.length).toBe(4);
    expect(tsList.length).toBe(80);
    expect(tsList.every((ts) => ts.status === Yet)).toBeTruthy();
  });

  test('[異常系] メールアドレスが重複した参加者を追加する', async () => {
    const duplicateParticipant = Participant.create('31', {
      participantName: ParticipantName.create('中島 裕実'),
      email: ParticipantEmail.create('nakasima-hiromi@dion.ne.jp'),
      status: Zaiseki,
    });
    const team = createTeam();
    const tsList: TaskStatus[] = [];
    const usecase = new JoinNewParticipantUsecase(
      new MockParticipantRepository(some(duplicateParticipant)),
      new MockTeamRepository(none, some([team])),
      createMockTaskStatusRepo(241, tsList),
      createMockTaskQS(),
    );
    const result = await usecase.do('中島 裕実', 'nakasima-hiromi@dion.ne.jp');
    expect(isSome(result)).toBeTruthy();
  });
});

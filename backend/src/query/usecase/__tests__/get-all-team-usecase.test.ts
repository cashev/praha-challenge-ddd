import { ITeamQS, TeamDto } from '../query-service-interface/team-qs';
import { GetAllTeamUseCase } from '../get-all-team-usecase';

describe('do', () => {
  const t1 = new TeamDto({
    id: '1',
    name: '1',
    pairs: [
      {
        pairId: '10',
        pairName: 'a',
        participants: [
          {
            participantId: '11',
            participantName: '田口 益三',
          },
          {
            participantId: '12',
            participantName: '渡部 玲奈',
          },
          {
            participantId: '13',
            participantName: '河村 三男',
          },
        ],
      },
    ],
    kyukaiParticipants: [],
  });
  const t2 = new TeamDto({
    id: '2',
    name: '2',
    pairs: [
      {
        pairId: '20',
        pairName: 'b',
        participants: [
          {
            participantId: '21',
            participantName: '横山 宜昭',
          },
          {
            participantId: '22',
            participantName: '松島 喜治',
          },
          {
            participantId: '23',
            participantName: '青山 謙三',
          },
        ],
      },
    ],
    kyukaiParticipants: [],
  });
  const t3 = new TeamDto({
    id: '3',
    name: '3',
    pairs: [
      {
        pairId: '30',
        pairName: 'c',
        participants: [
          {
            participantId: '31',
            participantName: '工藤 洋昌',
          },
          {
            participantId: '32',
            participantName: '瀬戸 江美',
          },
          {
            participantId: '33',
            participantName: '野崎 晶紀',
          },
        ],
      },
    ],
    kyukaiParticipants: [],
  });

  const mockTeamQS = new (class implements ITeamQS {
    getAll(): Promise<TeamDto[]> {
      return Promise.resolve([t1, t2, t3]);
    }
  })();

  test('[正常系]', async () => {
    const usecase = new GetAllTeamUseCase(mockTeamQS);
    const result = expect(usecase.do()).resolves;
    result.toEqual([t1, t2, t3]);
  });
});

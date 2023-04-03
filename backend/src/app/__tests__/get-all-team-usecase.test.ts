import { ITeamQS, TeamDto } from '../query-service-interface/team-qs';
import { GetAllTeamUseCase } from '../get-all-team-usecase';

describe('do', () => {
  const t1 = new TeamDto({
    id: 1,
    name: '1',
  });
  const t2 = new TeamDto({
    id: 2,
    name: '2',
  });
  const t3 = new TeamDto({
    id: 3,
    name: '3',
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

import { TeamName } from 'src/domain/value-object/teamName';
import { TeamService } from '../team-service';

describe('isDuplicated', () => {
  test('[正常系] 重複しないチーム名', async () => {
    const mockTeamRepo = {
      findByName: jest.fn().mockResolvedValue(null),
    };
    const uniqueTeamName = TeamName.create('1');

    const teamService = new TeamService(mockTeamRepo);
    expect(teamService.isDuplicated(uniqueTeamName)).resolves.toBeFalsy();
  });

  test('[正常系] 重複するチーム名', async () => {
    const mockTeam = {};
    const mockTeamRepo = {
      findByName: jest.fn().mockResolvedValue(mockTeam),
    };
    const duplicatedTeamName = TeamName.create('2');

    const teamService = new TeamService(mockTeamRepo);
    expect(teamService.isDuplicated(duplicatedTeamName)).resolves.toBeTruthy();
  });
});

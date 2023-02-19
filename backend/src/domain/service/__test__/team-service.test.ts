import { Team } from 'src/domain/entity/team';
import { User } from 'src/domain/entity/user';
import { TeamName } from 'src/domain/value-object/teamName';
import { UserEmail } from 'src/domain/value-object/userEmail';
import { UserName } from 'src/domain/value-object/userName';
import { Zaiseki } from 'src/domain/value-object/userStatus';
import { TeamService } from '../team-service';

describe('isDuplicated', () => {
  test('[正常系] 重複しないチーム名', async () => {
    const mockTeamRepo = {
      findByName: jest.fn().mockResolvedValue(null),
      findByUserId: jest.fn(),
    };
    const uniqueTeamName = TeamName.create('1');

    const teamService = new TeamService(mockTeamRepo);
    expect(teamService.isDuplicated(uniqueTeamName)).resolves.toBeFalsy();
  });

  test('[正常系] 重複するチーム名', async () => {
    const mockTeam = {};
    const mockTeamRepo = {
      findByName: jest.fn().mockResolvedValue(mockTeam),
      findByUserId: jest.fn(),
    };
    const duplicatedTeamName = TeamName.create('2');

    const teamService = new TeamService(mockTeamRepo);
    expect(teamService.isDuplicated(duplicatedTeamName)).resolves.toBeTruthy();
  });
});

describe('isSameTeam', () => {
  const createPairMember = () => {
    const u1 = User.create(1, {
      userName: UserName.create('杉田 八洲子'),
      email: UserEmail.create('tgs9650@odn.ne.jp'),
      status: Zaiseki,
    });
    const u2 = User.create(2, {
      userName: UserName.create('関根 三平'),
      email: UserEmail.create('enikes84@t-com.ne.jp'),
      status: Zaiseki,
    });

    return [u1, u2];
  };
  const createTeamMember = () => {
    const u3 = User.create(3, {
      userName: UserName.create('林田 一智'),
      email: UserEmail.create('kazutomo-hayasida@mail.goo.ne.jp'),
      status: Zaiseki,
    });
    const u4 = User.create(4, {
      userName: UserName.create('田畑 梨華'),
      email: UserEmail.create('kr1976@example.jp'),
      status: Zaiseki,
    });
    const u5 = User.create(5, {
      userName: UserName.create('須藤 智子'),
      email: UserEmail.create('uotus1989@sannet.ne.jp'),
      status: Zaiseki,
    });
    return [...createPairMember(), u3, u4, u5];
  };
  const teamName = TeamName.create('1');
  const team = Team.create(1, { teamName, member: createTeamMember() });

  test('[正常系] 参加者が同じチームからなる場合、True', async () => {
    const mockTeamRepo = {
      findByName: jest.fn(),
      findByUserId: jest.fn().mockResolvedValue(team),
    };
    const pairMember = createPairMember();

    const service = new TeamService(mockTeamRepo);
    expect(service.isSameTeam(pairMember)).resolves.toBeTruthy();
  });

  test('[正常系] 参加者が複数のチームからなる場合、False', async () => {
    const mockTeamRepo = {
      findByName: jest.fn(),
      findByUserId: jest.fn().mockResolvedValue(team),
    };
    const u6 = User.create(6, {
      userName: UserName.create('緒方 百世'),
      email: UserEmail.create('mmy179@mesh.ne.jp'),
      status: Zaiseki,
    });
    const pairMember = [...createPairMember(), u6];

    const service = new TeamService(mockTeamRepo);
    expect(service.isSameTeam(pairMember)).resolves.toBeFalsy();
  });
});

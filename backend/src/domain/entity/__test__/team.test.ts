import { TeamName } from 'src/domain/value-object/teamName';
import { UserEmail } from 'src/domain/value-object/userEmail';
import { UserName } from 'src/domain/value-object/userName';
import { Kyukai, Taikai, Zaiseki } from 'src/domain/value-object/userStatus';
import { Team } from '../team';
import { User } from '../user';

describe('create', () => {
  const createMember = () => {
    const u1 = User.create(1, {
      userName: UserName.create('本多 洵子'),
      email: UserEmail.create('honda_junko@example.jp'),
      status: Zaiseki,
    });
    const u2 = User.create(2, {
      userName: UserName.create('堀川 訓'),
      email: UserEmail.create('satosi1977@infoweb.ne.jp'),
      status: Zaiseki,
    });
    const u3 = User.create(3, {
      userName: UserName.create('吉川 永子'),
      email: UserEmail.create('nagako.yosikawa@infoseek.jp'),
      status: Zaiseki,
    });
    return [u1, u2, u3];
  };

  test('[正常系] チームの参加者が3人', () => {
    const member = createMember();
    const teamName = TeamName.create('123');

    const team = Team.create(1, { teamName, member });
    expect(team.teamName).toEqual(teamName);
    expect(team.member).toEqual(member);
  });

  test('[異常系] チームの参加者が2人', () => {
    const member = createMember().slice(0, 2);
    const teamName = TeamName.create('123');

    expect(() => Team.create(1, { teamName, member })).toThrow();
  });

  test('[異常系] 休会中の参加者が含まれる', () => {
    const member = createMember();
    member[0].status = Kyukai;
    const teamName = TeamName.create('123');

    expect(() => Team.create(1, { teamName, member })).toThrow();
  });

  test('[異常系] 退会済の参加者が含まれる', () => {
    const member = createMember();
    member[1].status = Taikai;
    const teamName = TeamName.create('123');

    expect(() => Team.create(1, { teamName, member })).toThrow();
  });
});

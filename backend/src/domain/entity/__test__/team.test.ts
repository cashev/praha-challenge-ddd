import { PairName } from 'src/domain/value-object/pairName';
import { TeamName } from 'src/domain/value-object/teamName';
import { UserEmail } from 'src/domain/value-object/userEmail';
import { UserName } from 'src/domain/value-object/userName';
import { Zaiseki } from 'src/domain/value-object/userStatus';
import { Pair } from '../pair';
import { Team } from '../team';
import { User } from '../user';

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

const createPairList = (member: User[]) => {
  const pairName = PairName.create('a');
  return [
    Pair.create(1, {
      pairName,
      member,
    }),
  ];
};

describe('create', () => {
  test('[正常系] チームの参加者が3人', () => {
    const pairList = createPairList(createMember());
    const teamName = TeamName.create('123');

    const team = Team.create(1, { teamName, pairList });
    expect(team.teamName).toEqual(teamName);
    expect(team.pairList).toEqual(pairList);
  });

  test('[異常系] チームの参加者が2人', () => {
    const pairList = createPairList(createMember().slice(0, 2));
    const teamName = TeamName.create('123');

    expect(() => Team.create(1, { teamName, pairList })).toThrow();
  });
});

describe('isMember', () => {
  test('[正常系] 引数の参加者がチームの一員である場合、True', () => {
    const member = createMember();
    const pairList = createPairList(member);
    const team = Team.create(1, { teamName: TeamName.create('1'), pairList });

    const u1 = member[0];
    expect(team.isMember(u1)).toBeTruthy();
  });

  test('[正常系] 引数の参加者がチームの一員でない場合、False', () => {
    const pairList = createPairList(createMember());
    const team = Team.create(1, { teamName: TeamName.create('1'), pairList });

    const u4 = User.create(4, {
      userName: UserName.create('藤村 和好'),
      email: UserEmail.create('kazuyosihuzimura@combzmail.jp'),
      status: Zaiseki,
    });
    expect(team.isMember(u4)).toBeFalsy();
  });
});

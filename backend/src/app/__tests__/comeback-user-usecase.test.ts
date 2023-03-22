import { Pair } from 'src/domain/entity/pair';
import { Team } from 'src/domain/entity/team';
import { User } from 'src/domain/entity/user';
import { PairName } from 'src/domain/value-object/pairName';
import { TeamName } from 'src/domain/value-object/teamName';
import { UserEmail } from 'src/domain/value-object/userEmail';
import { UserName } from 'src/domain/value-object/userName';
import {
  Kyukai,
  Taikai,
  UserStatus,
  Zaiseki,
} from 'src/domain/value-object/userStatus';
import { ComebackUserUseCase } from '../comeback-user-usecase';

describe('do', () => {
  const createMockUserRepo = (user: User | null) => {
    return {
      find: jest.fn().mockResolvedValue(user),
      save: jest.fn(),
    };
  };
  const createMockTeamRepo = (team: Team[] | null) => {
    return {
      findByName: jest.fn(),
      findByUserId: jest.fn(),
      getSmallestTeamList: jest.fn().mockResolvedValue(team),
      getNextPairId: jest.fn(),
      save: jest.fn(),
    };
  };
  const createUser = (status: UserStatus) => {
    return User.create(1, {
      userName: UserName.create('川島 佐十郎'),
      email: UserEmail.create('sjuru8200331@combzmail.jp'),
      status,
    });
  };
  const createMember = () => {
    const u11 = User.create(11, {
      userName: UserName.create('大内 真志'),
      email: UserEmail.create('isasam171@nifty.com'),
      status: Zaiseki,
    });
    const u12 = User.create(12, {
      userName: UserName.create('沼田 義武'),
      email: UserEmail.create('yositake-numata@nifty.jp'),
      status: Zaiseki,
    });
    const u13 = User.create(13, {
      userName: UserName.create('中川 火呂絵'),
      email: UserEmail.create('hre-nkgw@example.ad.jp'),
      status: Zaiseki,
    });
    return [u11, u12, u13];
  };
  const createMember2 = () => {
    const u21 = User.create(11, {
      userName: UserName.create('小倉 敬史'),
      email: UserEmail.create('tks@infoseek.jp'),
      status: Zaiseki,
    });
    const u22 = User.create(12, {
      userName: UserName.create('井口 晴生'),
      email: UserEmail.create('haruo1112@comeon.to'),
      status: Zaiseki,
    });
    const u23 = User.create(13, {
      userName: UserName.create('谷川 善二'),
      email: UserEmail.create('zenzi-yagawa@dti.ne.jp'),
      status: Zaiseki,
    });
    return [u21, u22, u23];
  };

  test('[正常系] 既存のペアに参加する', async () => {
    const member = createMember().slice(0, 2);
    const pair1 = Pair.create(1, { pairName: PairName.create('a'), member });
    const pair2 = Pair.create(2, {
      pairName: PairName.create('b'),
      member: createMember2(),
    });
    const team = Team.create(1, {
      teamName: TeamName.create('1'),
      pairList: [pair1, pair2],
    });
    const newUser = createUser(Kyukai);

    const mockUserRepo = createMockUserRepo(newUser);
    const mockTeamRepo = createMockTeamRepo([team]);
    const usercase = new ComebackUserUseCase(mockUserRepo, mockTeamRepo);
    await usercase.do(1);

    expect(pair1.member).toEqual([...member, newUser]);
  });

  test('[正常系] 既存のペアを分割して参加する', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);

    const member = createMember();
    const pair1 = Pair.create(1, { pairName: PairName.create('a'), member });
    const team = Team.create(1, {
      teamName: TeamName.create('1'),
      pairList: [pair1],
    });
    const newUser = createUser(Taikai);

    const mockUserRepo = createMockUserRepo(newUser);
    const mockTeamRepo = createMockTeamRepo([team]);
    const usercase = new ComebackUserUseCase(mockUserRepo, mockTeamRepo);
    await usercase.do(1);

    expect(team.pairList.length).toBe(2);
    expect(pair1.member).toEqual(member.slice(1));
    expect(team.pairList[1].member).toEqual([member[0], newUser]);
  });

  test('[異常系] 存在しない参加者', async () => {
    const mockUserRepo = createMockUserRepo(null);
    const mockTeamRepo = createMockTeamRepo(null);
    const useCase = new ComebackUserUseCase(mockUserRepo, mockTeamRepo);

    expect(useCase.do(1)).rejects.toThrow();
  });

  test('[異常系] 在籍中の参加者', async () => {
    const user = createUser(Zaiseki);
    const mockUserRepo = createMockUserRepo(user);
    const mockTeamRepo = createMockTeamRepo(null);
    const useCase = new ComebackUserUseCase(mockUserRepo, mockTeamRepo);

    expect(useCase.do(1)).rejects.toThrow();
  });
});

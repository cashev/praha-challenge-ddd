import { Pair } from 'src/domain/entity/pair';
import { User } from 'src/domain/entity/user';
import { PairName } from 'src/domain/value-object/pairName';
import { UserEmail } from 'src/domain/value-object/userEmail';
import { UserName } from 'src/domain/value-object/userName';
import { Zaiseki } from 'src/domain/value-object/userStatus';
import { PairService } from '../pair-service';

describe('isDuplicated', () => {
  const createMockPairRepo = (pair: Pair | null) => {
    return {
      findByName: jest.fn().mockResolvedValue(pair),
      getSmallestPairList: jest.fn(),
    };
  };

  test('[正常系] ペア名が重複しない場合、False', async () => {
    const mockPairRepo = createMockPairRepo(null);
    const pairService = new PairService(mockPairRepo);

    expect(pairService.isDuplicated('a')).resolves.toBeFalsy();
  });

  test('[正常系] ペア名が重複する場合、True', async () => {
    const u1 = User.create(1, {
      userName: UserName.create('小倉 常一'),
      email: UserEmail.create('uzakenut79@asp.home.ne.jp'),
      status: Zaiseki,
    });
    const u2 = User.create(2, {
      userName: UserName.create('石塚 唯'),
      email: UserEmail.create('iy9240025@infoseek.co.jp'),
      status: Zaiseki,
    });
    const p1 = Pair.create(1, {
      pairName: PairName.create('a'),
      member: [u1, u2],
    });
    const mockPairRepo = createMockPairRepo(p1);
    const pairService = new PairService(mockPairRepo);

    expect(pairService.isDuplicated('a')).resolves.toBeTruthy();
  });
});

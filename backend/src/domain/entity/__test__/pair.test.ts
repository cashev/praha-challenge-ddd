import { PairName } from 'src/domain/value-object/pairName';
import { UserEmail } from 'src/domain/value-object/userEmail';
import { UserName } from 'src/domain/value-object/userName';
import { Kyukai, Taikai, Zaiseki } from 'src/domain/value-object/userStatus';
import { Pair } from '../pair';
import { User } from '../user';

describe('', () => {
  const createMember = () => {
    const u1 = User.create(1, {
      userName: UserName.create('上村 真知子'),
      email: UserEmail.create('matiko-uemura@bbtec.net'),
      status: Zaiseki,
    });
    const u2 = User.create(2, {
      userName: UserName.create('柴田 嘉彦'),
      email: UserEmail.create('okihisoy9185@goo.ne.jp'),
      status: Zaiseki,
    });
    const u3 = User.create(3, {
      userName: UserName.create('永野 智子'),
      email: UserEmail.create('tmk.ngn@hi-ho.ne.jp'),
      status: Zaiseki,
    });
    return [u1, u2, u3];
  };

  test('[正常系] 2人のペア', () => {
    const member = createMember().splice(0, 2);
    const pairName = PairName.create('a');

    const pair = Pair.create(1, { pairName, member });
    expect(pair.pairName).toEqual(pairName);
    expect(pair.member).toEqual(member);
  });

  test('[正常系] 3人のペア', () => {
    const member = createMember();
    const pairName = PairName.create('b');

    const pair = Pair.create(2, { pairName, member });
    expect(pair.pairName).toEqual(pairName);
    expect(pair.member).toEqual(member);
  });

  test('[異常系] 1人のペア', () => {
    const member = createMember().splice(0, 1);
    const pairName = PairName.create('c');

    expect(() => Pair.create(3, { pairName, member })).toThrow();
  });

  test('[異常系] 4人のペア', () => {
    const u4 = User.create(3, {
      userName: UserName.create('松田 秀俊'),
      email: UserEmail.create('matudaadutam@example.ne.jp'),
      status: Zaiseki,
    });
    const member = [...createMember(), u4];
    const pairName = PairName.create('d');

    expect(() => Pair.create(4, { pairName, member })).toThrow();
  });

  test('[異常系] 休会中の参加者が含まれる', () => {
    const member = createMember();
    member[0].status = Kyukai;
    const pairName = PairName.create('e');

    expect(() => Pair.create(5, { pairName, member })).toThrow();
  });

  test('[異常系] 退会済の参加者が含まれる', () => {
    const member = createMember();
    member[1].status = Taikai;
    const pairName = PairName.create('f');

    expect(() => Pair.create(6, { pairName, member })).toThrow();
  });
});

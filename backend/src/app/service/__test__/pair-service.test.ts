import { Pair } from 'src/domain/entity/pair';
import { User } from 'src/domain/entity/user';
import { PairName } from 'src/domain/value-object/pairName';
import { UserEmail } from 'src/domain/value-object/userEmail';
import { UserName } from 'src/domain/value-object/userName';
import { Zaiseki } from 'src/domain/value-object/userStatus';
import { PairService } from '../pair-service';

describe('isDuplicated', () => {
  const createMockPairQS = (pair: Pair | null) => {
    return {
      findByName: jest.fn().mockResolvedValue(pair),
      getSmallestPairList: jest.fn(),
      getNextId: jest.fn(),
      findByTeamId: jest.fn(),
    };
  };

  test('[正常系] ペア名が重複しない場合、False', async () => {
    const mockPairQS = createMockPairQS(null);
    const pairService = new PairService(mockPairQS);

    expect(
      pairService.isDuplicated(1, PairName.create('a')),
    ).resolves.toBeFalsy();
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
    const mockPairRepo = createMockPairQS(p1);
    const pairService = new PairService(mockPairRepo);

    expect(
      pairService.isDuplicated(1, PairName.create('a')),
    ).resolves.toBeTruthy();
  });
});

describe('getUnusedPairName', () => {
  const createMockPairQS = (pairList: Pair[] | null) => {
    return {
      findByName: jest.fn(),
      getSmallestPairList: jest.fn(),
      getNextId: jest.fn(),
      findByTeamId: jest.fn().mockResolvedValue(pairList),
    };
  };

  const userTestData = [
    { name: '沢田 鉄次', email: 'tetuzi19720504@nifty.jp' },
    { name: '浅野 源三郎', email: 'asano.genzaburou@web.ad.jp' },
    { name: '田上 理江', email: 'ut183@coara.or.jp' },
    { name: '原口 顕子', email: 'akk_hrgt@infoweb.ne.jp' },
    { name: '小西 志奈', email: 'sinakonisi@example.gr.jp' },
    { name: '平岡 紀子', email: 'kst0908@tokyo24.com' },
    { name: '谷川 麗奈', email: 'aner5142@livedoor.com' },
    { name: '志村 元三', email: 'simura7885@ybb.ne.jp' },
    { name: '高田 真志', email: 'masasi0509@sannet.ne.jp' },
    { name: '古田 哲昭', email: 'aturuh@dsn.ad.jp' },
    { name: '下田 保二', email: 'yasuzi92@t-com.ne.jp' },
    { name: '村上 重行', email: 'kygs@excite.com' },

    { name: '井口 繁美', email: 'imegis2004@excite.co.jp' },
    { name: '樋口 歩', email: 'imuya@infoseek.jp' },
    { name: '小林 さやか', email: 'sayakakobayasi@cuib.or.jp' },
    { name: '金田 信人', email: 'otubon7380512@fdt.ne.jp' },
    { name: '松崎 ハルノ', email: 'harunoharuno@geocities.com' },
    { name: '小林 祐美', email: 'muy1989@coara.or.jp' },
    { name: '根岸 なつみ', email: 'negisi2118@hotmail.com' },
    { name: '安田 理恵子', email: 'yst.rek@gmo-media.jp' },
    { name: '入江 生三', email: 'uozuki@gmail.com' },
    { name: '小沢 ひとみ', email: 'ozw0920@hotmail.co.jp' },
    { name: '西本 錦也', email: 'kny2005@infoseek.jp' },
    { name: '本田 多恵子', email: 'okeat5551@sannet.ne.jp' },
    { name: '馬場 隆昭', email: 'takaaki@dti.ne.jp' },
    { name: '田辺 信也', email: 'nobuyatanabe@t-com.ne.jp' },
    { name: '落合 正次', email: 'masazi1991@dti.ne.jp' },
    { name: '福本 睦男', email: 'otm@ocn.ne.jp' },
    { name: '天野 惣之助', email: 'sounosuke@mesh.ne.jp' },
    { name: '坂本 虎之助', email: 'otomakas94@bbtec.net' },
    { name: '嶋田 康司', email: 'dms811@goo.ne.jp' },
    { name: '大平 信也', email: 'nby8998ybn@sannet.ne.jp' },

    { name: '菊地 八洲子', email: 'itukik1330055@combzmail.jp' },
    { name: '岡崎 恵志', email: 'okazaki0611@mesh.ne.jp' },
    { name: '酒井 裕行', email: 'yuukou509@users.gr.jp' },
    { name: '小笠原 田鶴子', email: 'okudat028@users.gr.jp' },
    { name: '笠原 光次', email: 'izutim0809@tokyo24.com' },
    { name: '北島 郁穂', email: 'ikuo_kitazima@freeml.co.jp' },
    { name: '広瀬 定行', email: 'esorih2007@example.gr.jp' },
    { name: '青山 俊憲', email: 'amayoa1982@mail.goo.ne.jp' },
    { name: '工藤 利恵', email: 'eir83@example.ne.jp' },
    { name: '長島 清重', email: 'kiyosigenagasima@example.ad.jp' },
    { name: '木村 伸二', email: 'sinzi1970@infoseek.jp' },
    { name: '菅原 斎', email: 'sghr1988@example.or.jp' },
    { name: '森山 周平', email: 'mrym_syuhi@hi-ho.ne.jp' },
    { name: '小森 政治', email: 'kmr@dion.ne.jp' },
    { name: '足立 玲一', email: 'tda19822891adt@ocn.ne.jp' },
    { name: '大槻 教夫', email: 'norio.ootuki@anet.ne.jp' },
    { name: '野沢 尚子', email: 'nozawa1987@example.co.jp' },
    { name: '吉田 愛', email: 'ai-yosida@infoweb.ne.jp' },
    { name: '星野 水泉', email: 'nesius76@example.or.jp' },
    { name: '今野 隆次', email: 'imano-takazi@dion.ne.jp' },
  ];

  const createUser = (id: number, name: string, email: string) => {
    return User.create(id, {
      userName: UserName.create(name),
      email: UserEmail.create(email),
      status: Zaiseki,
    });
  };

  const createPair = (id: number, name: string, index: number) => {
    const u1 = createUser(
      id,
      userTestData[index].name,
      userTestData[index].email,
    );
    const nextIndex = index + 1;
    const u2 = createUser(
      id,
      userTestData[nextIndex].name,
      userTestData[nextIndex].email,
    );
    return Pair.create(id, {
      pairName: PairName.create(name),
      member: [u1, u2],
    });
  };

  test('[正常系] aとbが使われている場合、c', async () => {
    const p1 = createPair(1, 'a', 0);
    const p2 = createPair(2, 'b', 2);
    const pairQS = createMockPairQS([p1, p2]);

    const service = new PairService(pairQS);
    expect(service.getUnusedPairName(1)).resolves.toEqual(PairName.create('c'));
  });

  test('[正常系] aとcが使われている場合、b', () => {
    const p1 = createPair(1, 'a', 0);
    const p3 = createPair(2, 'c', 2);
    const pairQS = createMockPairQS([p1, p3]);

    const service = new PairService(pairQS);
    expect(service.getUnusedPairName(2)).resolves.toEqual(PairName.create('b'));
  });

  test('[正常系] ペアがない場合、a', () => {
    const pairQS = createMockPairQS(null);

    const service = new PairService(pairQS);
    expect(service.getUnusedPairName(3)).resolves.toEqual(PairName.create('a'));
  });

  test('[異常系] 全て使われている場合、error', () => {
    const pairList = [];
    pairList.push(createPair(1, 'a', 0));
    pairList.push(createPair(2, 'b', 2));
    pairList.push(createPair(3, 'c', 4));
    pairList.push(createPair(4, 'd', 6));
    pairList.push(createPair(5, 'e', 8));
    pairList.push(createPair(6, 'f', 10));
    pairList.push(createPair(7, 'g', 12));
    pairList.push(createPair(8, 'h', 14));
    pairList.push(createPair(9, 'i', 16));
    pairList.push(createPair(10, 'j', 18));
    pairList.push(createPair(11, 'k', 20));
    pairList.push(createPair(12, 'l', 22));
    pairList.push(createPair(13, 'm', 24));
    pairList.push(createPair(14, 'n', 26));
    pairList.push(createPair(15, 'o', 28));
    pairList.push(createPair(16, 'p', 30));
    pairList.push(createPair(17, 'q', 32));
    pairList.push(createPair(18, 'r', 34));
    pairList.push(createPair(19, 's', 36));
    pairList.push(createPair(20, 't', 38));
    pairList.push(createPair(21, 'u', 40));
    pairList.push(createPair(22, 'v', 42));
    pairList.push(createPair(23, 'w', 44));
    pairList.push(createPair(24, 'x', 46));
    pairList.push(createPair(25, 'y', 48));
    pairList.push(createPair(26, 'z', 50));
    const pairQS = createMockPairQS(pairList);

    const service = new PairService(pairQS);
    expect(service.getUnusedPairName(1)).rejects.toThrow();
  });
});

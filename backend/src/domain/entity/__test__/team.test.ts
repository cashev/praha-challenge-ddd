import { PairName } from 'src/domain/value-object/pairName';
import { TeamName } from 'src/domain/value-object/teamName';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import { ParticipantName } from 'src/domain/value-object/participantName';
import { Kyukai, Zaiseki } from 'src/domain/value-object/participantStatus';
import { Pair } from '../pair';
import { Team } from '../team';
import { Participant } from '../participant';

const createMember = () => {
  const u1 = Participant.create(1, {
    participantName: ParticipantName.create('本多 洵子'),
    email: ParticipantEmail.create('honda_junko@example.jp'),
    status: Zaiseki,
  });
  const u2 = Participant.create(2, {
    participantName: ParticipantName.create('堀川 訓'),
    email: ParticipantEmail.create('satosi1977@infoweb.ne.jp'),
    status: Zaiseki,
  });
  const u3 = Participant.create(3, {
    participantName: ParticipantName.create('吉川 永子'),
    email: ParticipantEmail.create('nagako.yosikawa@infoseek.jp'),
    status: Zaiseki,
  });
  return [u1, u2, u3];
};

const createMember2 = () => {
  const u1 = Participant.create(1, {
    participantName: ParticipantName.create('長尾 由記彦'),
    email: ParticipantEmail.create('ykhk20210106@example.co.jp'),
    status: Zaiseki,
  });
  const u2 = Participant.create(2, {
    participantName: ParticipantName.create('佐野 晴仁'),
    email: ParticipantEmail.create('sano1988@sannet.ne.jp'),
    status: Zaiseki,
  });
  return [u1, u2];
};

const createPairList = (member: Participant[]) => {
  const pairName = PairName.create('a');
  return [
    Pair.create(1, {
      pairName,
      member,
    }),
  ];
};

const createMockTeamRepo = (pairId: number | null) => {
  return {
    findByParticipantId: jest.fn(),
    getSmallestTeamList: jest.fn(),
    getNextPairId: jest.fn().mockResolvedValue(pairId),
    save: jest.fn(),
  };
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

describe('removeMember', () => {
  test('[正常系] 3人のペアからメンバーを取り除く', async () => {
    const member = createMember();
    const pairList = createPairList(member);
    const team = Team.create(1, { teamName: TeamName.create('123'), pairList });
    const removeParticipant = member[0];

    await team.removeMember(removeParticipant, createMockTeamRepo(null));
    expect(team.pairList[0].member).toEqual(member.slice(1));
  });

  test('[正常系] 2人のペアからメンバーを取り除き、2人のペアに合流する', async () => {
    const member = createMember().slice(1);
    const pair1 = Pair.create(1, {
      pairName: PairName.create('a'),
      member,
    });
    const member2 = createMember2();
    const pair2 = Pair.create(2, {
      pairName: PairName.create('b'),
      member: member2,
    });
    const team = Team.create(1, {
      teamName: TeamName.create('123'),
      pairList: [pair1, pair2],
    });
    const removeParticipant = member[0];

    await team.removeMember(removeParticipant, createMockTeamRepo(null));
    expect(team.pairList.length).toBe(1);
    expect(team.pairList[0].member.length).toBe(3);
    expect(team.pairList[0].member).toEqual([...member2, member[1]]);
  });

  test('[正常系] 2人のペアからメンバーを取り除き、3人のペアに合流する', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);

    const member = createMember2();
    const pair1 = Pair.create(1, {
      pairName: PairName.create('a'),
      member,
    });
    const member2 = createMember();
    const pair2 = Pair.create(2, {
      pairName: PairName.create('b'),
      member: member2,
    });
    const team = Team.create(1, {
      teamName: TeamName.create('123'),
      pairList: [pair1, pair2],
    });
    const removeParticipant = member[0];

    await team.removeMember(removeParticipant, createMockTeamRepo(3));
    expect(team.pairList.length).toBe(2);
    expect(team.pairList[0].member).toEqual([...member2.slice(1)]);
    expect(team.pairList[1].member).toEqual([member2[0], member[1]]);
  });

  test('[異常系] 非メンバーを取り除く', async () => {
    const pairList = createPairList(createMember());
    const teamName = TeamName.create('123');
    const team = Team.create(1, { teamName, pairList });
    const removeParticipant = Participant.create(9, {
      participantName: ParticipantName.create('金城 望'),
      email: ParticipantEmail.create('kng-nzm19940330@excite.co.jp'),
      status: Kyukai,
    });

    expect(() => team.removeMember(removeParticipant, createMockTeamRepo(null))).rejects.toThrow();
  });
});

describe('addPair', () => {
  test('[正常系] ペア名が重複しない', () => {
    const pairList = createPairList(createMember());
    const teamName = TeamName.create('123');
    const team = Team.create(1, { teamName, pairList });

    const newPair = Pair.create(2, {
      pairName: PairName.create('b'),
      member: createMember2(),
    });
    team.addPair(newPair);

    expect(team.pairList).toEqual([...pairList, newPair]);
  });

  test('[異常系] ペア名が重複している場合、エラー', () => {
    const pairList = createPairList(createMember());
    const teamName = TeamName.create('123');
    const team = Team.create(1, { teamName, pairList });

    const newPair = Pair.create(2, {
      pairName: PairName.create('a'),
      member: createMember2(),
    });

    expect(() => team.addPair(newPair)).toThrow();
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

    const u4 = Participant.create(4, {
      participantName: ParticipantName.create('藤村 和好'),
      email: ParticipantEmail.create('kazuyosihuzimura@combzmail.jp'),
      status: Zaiseki,
    });
    expect(team.isMember(u4)).toBeFalsy();
  });
});

describe('getSmallestPair', () => {
  const createMember3 = () => {
    const u1 = Participant.create(1, {
      participantName: ParticipantName.create('原田 省次郎'),
      email: ParticipantEmail.create('urzuys71@geocities.com'),
      status: Zaiseki,
    });
    const u2 = Participant.create(2, {
      participantName: ParticipantName.create('下村 千治'),
      email: ParticipantEmail.create('sitamura_senzi@plala.or.jp'),
      status: Zaiseki,
    });
    const u3 = Participant.create(2, {
      participantName: ParticipantName.create('長島 義子'),
      email: ParticipantEmail.create('ysk_ngsm@sakura.ne.jp'),
      status: Zaiseki,
    });
    return [u1, u2, u3];
  };

  const createPair = (id: number, name: string, member: Participant[]) => {
    const pairName = PairName.create(name);
    return Pair.create(id, { pairName, member });
  };

  test('[正常系] 1つ目が最小のペアの場合', () => {
    const p1 = createPair(1, 'a', createMember2());
    const p2 = createPair(2, 'b', createMember());
    const p3 = createPair(3, 'c', createMember3());
    const team = Team.create(1, {
      teamName: TeamName.create('1'),
      pairList: [p1, p2, p3],
    });

    expect(team.getSmallestPair()).toEqual(p1);
  });

  test('[正常系] 2つ目が最小のペアの場合', () => {
    const p1 = createPair(1, 'a', createMember());
    const p2 = createPair(2, 'b', createMember2());
    const p3 = createPair(3, 'c', createMember3());
    const team = Team.create(1, {
      teamName: TeamName.create('1'),
      pairList: [p1, p2, p3],
    });

    expect(team.getSmallestPair()).toEqual(p2);
  });

  test('[正常系] 3つ目が最小のペアの場合', () => {
    const p1 = createPair(1, 'a', createMember());
    const p2 = createPair(2, 'b', createMember3());
    const p3 = createPair(3, 'c', createMember2());
    const team = Team.create(1, {
      teamName: TeamName.create('1'),
      pairList: [p1, p2, p3],
    });

    expect(team.getSmallestPair()).toEqual(p3);
  });
});

describe('getUnusedPairName', () => {
  test('[正常系] aとbが使われている場合、c', async () => {
    const p1 = Pair.create(1, {
      pairName: PairName.create('a'),
      member: createMember(),
    });
    const p2 = Pair.create(2, {
      pairName: PairName.create('b'),
      member: createMember(),
    });
    const team = Team.create(1, {
      teamName: TeamName.create('1'),
      pairList: [p1, p2],
    });
    expect(team.getUnusedPairName()).toEqual(PairName.create('c'));
  });

  test('[正常系] aとcが使われている場合、b', () => {
    const p1 = Pair.create(1, {
      pairName: PairName.create('a'),
      member: createMember(),
    });
    const p3 = Pair.create(3, {
      pairName: PairName.create('c'),
      member: createMember(),
    });
    const team = Team.create(1, {
      teamName: TeamName.create('1'),
      pairList: [p1, p3],
    });
    expect(team.getUnusedPairName()).toEqual(PairName.create('b'));
  });

  test('[正常系] bだけが使われている場合、a', () => {
    const p2 = Pair.create(2, {
      pairName: PairName.create('b'),
      member: createMember(),
    });
    const team = Team.create(1, {
      teamName: TeamName.create('1'),
      pairList: [p2],
    });
    expect(team.getUnusedPairName()).toEqual(PairName.create('a'));
  });

  test('[異常系] 全て使われている場合、error', () => {
    const pairList = [];
    pairList.push(
      Pair.create(1, {
        pairName: PairName.create('a'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(2, {
        pairName: PairName.create('b'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(3, {
        pairName: PairName.create('c'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(4, {
        pairName: PairName.create('d'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(5, {
        pairName: PairName.create('e'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(6, {
        pairName: PairName.create('f'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(7, {
        pairName: PairName.create('g'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(8, {
        pairName: PairName.create('h'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(9, {
        pairName: PairName.create('i'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(10, {
        pairName: PairName.create('j'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(11, {
        pairName: PairName.create('k'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(12, {
        pairName: PairName.create('l'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(13, {
        pairName: PairName.create('m'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(14, {
        pairName: PairName.create('n'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(15, {
        pairName: PairName.create('o'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(16, {
        pairName: PairName.create('p'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(17, {
        pairName: PairName.create('q'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(18, {
        pairName: PairName.create('r'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(19, {
        pairName: PairName.create('s'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(20, {
        pairName: PairName.create('t'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(21, {
        pairName: PairName.create('u'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(22, {
        pairName: PairName.create('v'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(23, {
        pairName: PairName.create('w'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(24, {
        pairName: PairName.create('x'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(25, {
        pairName: PairName.create('y'),
        member: createMember(),
      }),
    );
    pairList.push(
      Pair.create(26, {
        pairName: PairName.create('z'),
        member: createMember(),
      }),
    );
    const team = Team.create(1, {
      teamName: TeamName.create('1'),
      pairList,
    });
    expect(() => team.getUnusedPairName()).toThrow();
  });
});

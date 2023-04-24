import { PairName } from 'src/domain/value-object/pairName';
import { TeamName } from 'src/domain/value-object/teamName';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import { ParticipantName } from 'src/domain/value-object/participantName';
import {
  Kyukai,
  Taikai,
  Zaiseki,
} from 'src/domain/value-object/participantStatus';
import { Pair } from '../pair';
import { Team } from '../team';
import { Participant, ParticipantIdType } from '../participant';

const createThreeMember = () => {
  const u1 = Participant.create('11', {
    participantName: ParticipantName.create('本多 洵子'),
    email: ParticipantEmail.create('honda_junko@example.jp'),
    status: Zaiseki,
  });
  const u2 = Participant.create('12', {
    participantName: ParticipantName.create('堀川 訓'),
    email: ParticipantEmail.create('satosi1977@infoweb.ne.jp'),
    status: Zaiseki,
  });
  const u3 = Participant.create('13', {
    participantName: ParticipantName.create('吉川 永子'),
    email: ParticipantEmail.create('nagako.yosikawa@infoseek.jp'),
    status: Zaiseki,
  });
  return [u1, u2, u3];
};

const createTwoMember = () => {
  const u1 = Participant.create('21', {
    participantName: ParticipantName.create('長尾 由記彦'),
    email: ParticipantEmail.create('ykhk20210106@example.co.jp'),
    status: Zaiseki,
  });
  const u2 = Participant.create('22', {
    participantName: ParticipantName.create('佐野 晴仁'),
    email: ParticipantEmail.create('sano1988@sannet.ne.jp'),
    status: Zaiseki,
  });
  return [u1, u2];
};

const createPairList = (member: ParticipantIdType[]) => {
  const pairName = PairName.create('a');
  return [
    Pair.create('1', {
      pairName,
      member,
    }),
  ];
};

const convertToMember = (member: Participant[]) => {
  return member.map((p) => p.id);
};

describe('create', () => {
  test('[正常系] チームの参加者が3人', () => {
    const pairList = createPairList(convertToMember(createThreeMember()));
    const teamName = TeamName.create('123');

    const team = Team.create('1', { teamName, pairList });
    expect(team.teamName).toEqual(teamName);
    expect(team.pairList).toEqual(pairList);
  });

  test('[異常系] チームの参加者が2人', () => {
    const pairList = createPairList(
      convertToMember(createThreeMember().slice(0, 2)),
    );
    const teamName = TeamName.create('123');

    expect(() => Team.create('1', { teamName, pairList })).toThrow();
  });
});

describe('addParticipant', () => {
  test('[正常系] 既存のペアに参加する', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);

    const member = createThreeMember();
    const pair1 = Pair.create('1', {
      pairName: PairName.create('a'),
      member: convertToMember(member.slice(1)),
    });
    const member2 = createTwoMember();
    const pair2 = Pair.create('2', {
      pairName: PairName.create('b'),
      member: convertToMember(member2),
    });
    const team = Team.create('1', {
      teamName: TeamName.create('123'),
      pairList: [pair1, pair2],
    });
    const newParticipant = member[0];

    team.addParticipant(newParticipant);

    expect(team.pairList[0].member).toEqual([
      ...convertToMember(member.slice(1)),
      newParticipant.id,
    ]);
  });

  test('[正常系] 既存のペアを分割して参加する', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    const member = createThreeMember();
    const pairList = createPairList(convertToMember(member));
    const team = Team.create('1', {
      teamName: TeamName.create('123'),
      pairList,
    });
    const newParticipant = createTwoMember()[0];

    await team.addParticipant(newParticipant);

    expect(team.pairList.length).toBe(2);
    expect(team.pairList[0].member).toEqual([
      ...convertToMember(member.slice(1)),
    ]);
    expect(team.pairList[1].member).toEqual([member[0].id, newParticipant.id]);
  });

  test('[異常系] 休会中の参加者', async () => {
    const member = convertToMember(createThreeMember());
    const pairList = createPairList(member);
    const team = Team.create('1', {
      teamName: TeamName.create('123'),
      pairList,
    });
    const newParticipant = createTwoMember()[0];
    newParticipant.status = Kyukai;

    expect(team.addParticipant(newParticipant)).rejects.toThrow();
  });

  test('[異常系] 退会済の参加者', async () => {
    const member = convertToMember(createThreeMember());
    const pairList = createPairList(member);
    const team = Team.create('1', {
      teamName: TeamName.create('123'),
      pairList,
    });
    const newParticipant = createTwoMember()[0];
    newParticipant.status = Taikai;

    expect(team.addParticipant(newParticipant)).rejects.toThrow();
  });
});

describe('canRemoveParticipant', () => {
  test('[正常系] 参加者が4人であれば、true', () => {
    const member1 = createThreeMember().slice(1);
    const pair1 = Pair.create('1', {
      pairName: PairName.create('a'),
      member: member1.map((p) => p.id),
    });
    const member2 = createThreeMember().slice(1);
    const pair2 = Pair.create('2', {
      pairName: PairName.create('b'),
      member: member2.map((p) => p.id),
    });
    const team = Team.create('1', {
      teamName: TeamName.create('1'),
      pairList: [pair1, pair2],
    });

    expect(team.canRemoveParticipant()).toBeTruthy();
  });

  test('[正常系] 参加者が3人であれば、false', () => {
    const member1 = createThreeMember();
    const pair1 = Pair.create('1', {
      pairName: PairName.create('a'),
      member: member1.map((p) => p.id),
    });
    const team = Team.create('1', {
      teamName: TeamName.create('1'),
      pairList: [pair1],
    });

    expect(team.canRemoveParticipant()).toBeFalsy();
  });
});

describe('removeParticipant', () => {
  test('[正常系] 3人のペアから取り除く', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);

    const threeMember = createThreeMember();
    const pair1 = Pair.create('1', {
      pairName: PairName.create('a'),
      member: convertToMember(threeMember),
    });
    const twoMember = createTwoMember();
    const pair2 = Pair.create('2', {
      pairName: PairName.create('b'),
      member: convertToMember(twoMember),
    });
    const team = Team.create('1', {
      teamName: TeamName.create('123'),
      pairList: [pair1, pair2],
    });
    const removeParticipant = threeMember[0];

    team.removeParticipant(removeParticipant);

    expect(team.member.length).toBe(4);
    expect(team.member.some((p) => p == removeParticipant.id)).toBeFalsy();
    expect(team.pairList.length).toBe(2);
  });

  test('[正常系] 2人のペアから取り除き、残ったメンバーを3人ペアへ合流させる', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);

    const threeMember = createThreeMember();
    const pair1 = Pair.create('1', {
      pairName: PairName.create('a'),
      member: convertToMember(threeMember),
    });
    const twoMember = createTwoMember();
    const pair2 = Pair.create('2', {
      pairName: PairName.create('b'),
      member: convertToMember(twoMember),
    });
    const team = Team.create('1', {
      teamName: TeamName.create('123'),
      pairList: [pair1, pair2],
    });
    const removeParticipant = twoMember[0];

    team.removeParticipant(removeParticipant);

    expect(team.member.length).toBe(4);
    expect(team.member.some((p) => p == removeParticipant.id)).toBeFalsy();
    expect(team.pairList.length).toBe(2);
  });

  test('[正常系] 2人のペアから取り除き、残ったメンバーを2人ペアへ合流させる', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);

    const twoMember1 = createThreeMember().slice(1);
    const pair1 = Pair.create('1', {
      pairName: PairName.create('a'),
      member: convertToMember(twoMember1),
    });
    const twoMember2 = createTwoMember();
    const pair2 = Pair.create('2', {
      pairName: PairName.create('b'),
      member: convertToMember(twoMember2),
    });
    const team = Team.create('1', {
      teamName: TeamName.create('123'),
      pairList: [pair1, pair2],
    });
    const removeParticipant = twoMember1[0];

    team.removeParticipant(removeParticipant);

    expect(team.member.length).toBe(3);
    expect(team.member.some((p) => p == removeParticipant.id)).toBeFalsy();
    expect(team.pairList.length).toBe(1);
  });
});

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
import { Participant } from '../participant';

const createMember = () => {
  const u1 = Participant.create('1', {
    participantName: ParticipantName.create('本多 洵子'),
    email: ParticipantEmail.create('honda_junko@example.jp'),
    status: Zaiseki,
  });
  const u2 = Participant.create('2', {
    participantName: ParticipantName.create('堀川 訓'),
    email: ParticipantEmail.create('satosi1977@infoweb.ne.jp'),
    status: Zaiseki,
  });
  const u3 = Participant.create('3', {
    participantName: ParticipantName.create('吉川 永子'),
    email: ParticipantEmail.create('nagako.yosikawa@infoseek.jp'),
    status: Zaiseki,
  });
  return [u1, u2, u3];
};

const createMember2 = () => {
  const u1 = Participant.create('1', {
    participantName: ParticipantName.create('長尾 由記彦'),
    email: ParticipantEmail.create('ykhk20210106@example.co.jp'),
    status: Zaiseki,
  });
  const u2 = Participant.create('2', {
    participantName: ParticipantName.create('佐野 晴仁'),
    email: ParticipantEmail.create('sano1988@sannet.ne.jp'),
    status: Zaiseki,
  });
  return [u1, u2];
};

const createPairList = (member: Participant[]) => {
  const pairName = PairName.create('a');
  return [
    Pair.create('1', {
      pairName,
      member: member.map((p) => p.id),
    }),
  ];
};

describe('create', () => {
  test('[正常系] チームの参加者が3人', () => {
    const pairList = createPairList(createMember());
    const teamName = TeamName.create('123');

    const team = Team.create('1', { teamName, pairList });
    expect(team.teamName).toEqual(teamName);
    expect(team.pairList).toEqual(pairList);
  });

  test('[異常系] チームの参加者が2人', () => {
    const pairList = createPairList(createMember().slice(0, 2));
    const teamName = TeamName.create('123');

    expect(() => Team.create('1', { teamName, pairList })).toThrow();
  });
});

describe('addParticipant', () => {
  test('[正常系] 既存のペアに参加する', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);

    const member = createMember();
    const pair1 = Pair.create('1', {
      pairName: PairName.create('a'),
      member: member.slice(1).map((p) => p.id),
    });
    const member2 = createMember2();
    const pair2 = Pair.create('2', {
      pairName: PairName.create('b'),
      member: member2.map((p) => p.id),
    });
    const team = Team.create('1', {
      teamName: TeamName.create('123'),
      pairList: [pair1, pair2],
    });
    const newParticipant = member[0];

    team.addParticipant(newParticipant);

    expect(team.pairList[0].member).toEqual([
      ...member.slice(1).map((p) => p.id),
      newParticipant.id,
    ]);
  });

  test('[正常系] 既存のペアを分割して参加する', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    const member = createMember();
    const pairList = createPairList(member);
    const team = Team.create('1', {
      teamName: TeamName.create('123'),
      pairList,
    });
    const newParticipant = createMember2()[0];

    await team.addParticipant(newParticipant);

    expect(team.pairList.length).toBe(2);
    expect(team.pairList[0].member).toEqual([
      ...member.slice(1).map((p) => p.id),
    ]);
    expect(team.pairList[1].member).toEqual([member[0].id, newParticipant.id]);
  });

  test('[異常系] 休会中の参加者', async () => {
    const member = createMember();
    const pairList = createPairList(member);
    const team = Team.create('1', {
      teamName: TeamName.create('123'),
      pairList,
    });
    const newParticipant = createMember2()[0];
    newParticipant.status = Kyukai;

    expect(team.addParticipant(newParticipant)).rejects.toThrow();
  });

  test('[異常系] 退会済の参加者', async () => {
    const member = createMember();
    const pairList = createPairList(member);
    const team = Team.create('1', {
      teamName: TeamName.create('123'),
      pairList,
    });
    const newParticipant = createMember2()[0];
    newParticipant.status = Taikai;

    expect(team.addParticipant(newParticipant)).rejects.toThrow();
  });
});

describe('isMember', () => {
  test('[正常系] 引数の参加者がチームの一員である場合、True', () => {
    const member = createMember();
    const pairList = createPairList(member);
    const team = Team.create('1', { teamName: TeamName.create('1'), pairList });

    const u1 = member[0];
    expect(team.isMember(u1)).toBeTruthy();
  });

  test('[正常系] 引数の参加者がチームの一員でない場合、False', () => {
    const pairList = createPairList(createMember());
    const team = Team.create('1', { teamName: TeamName.create('1'), pairList });

    const u4 = Participant.create('4', {
      participantName: ParticipantName.create('藤村 和好'),
      email: ParticipantEmail.create('kazuyosihuzimura@combzmail.jp'),
      status: Zaiseki,
    });
    expect(team.isMember(u4)).toBeFalsy();
  });
});

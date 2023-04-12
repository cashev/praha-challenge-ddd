import { PairName } from 'src/domain/value-object/pairName';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import { ParticipantName } from 'src/domain/value-object/participantName';
import {
  Kyukai,
  Taikai,
  ParticipantStatus,
  Zaiseki,
} from 'src/domain/value-object/participantStatus';
import { Pair } from '../pair';
import { Participant } from '../participant';

const createMember = () => {
  const u1 = Participant.create('1', {
    participantName: ParticipantName.create('上村 真知子'),
    email: ParticipantEmail.create('matiko-uemura@bbtec.net'),
    status: Zaiseki,
  });
  const u2 = Participant.create('2', {
    participantName: ParticipantName.create('柴田 嘉彦'),
    email: ParticipantEmail.create('okihisoy9185@goo.ne.jp'),
    status: Zaiseki,
  });
  const u3 = Participant.create('3', {
    participantName: ParticipantName.create('永野 智子'),
    email: ParticipantEmail.create('tmk.ngn@hi-ho.ne.jp'),
    status: Zaiseki,
  });
  return [u1, u2, u3];
};

describe('create', () => {
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
    const u4 = Participant.create('3', {
      participantName: ParticipantName.create('松田 秀俊'),
      email: ParticipantEmail.create('matudaadutam@example.ne.jp'),
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

describe('addMember', () => {
  const createNewMember = (status: ParticipantStatus) => {
    return Participant.create('4', {
      participantName: ParticipantName.create('小柳 晃義'),
      email: ParticipantEmail.create('trys0216@hi-ho.ne.jp'),
      status,
    });
  };

  test('[正常系] 2名のペアには追加できる', () => {
    const member = createMember().slice(0, 2);
    const pairName = PairName.create('k');
    const pair = Pair.create(11, { pairName, member });
    const newMember = createNewMember(Zaiseki);

    pair.addMember(newMember);
    expect(pair.member).toEqual([...member, newMember]);
  });

  test('[異常系] 3名のペアには追加できない', () => {
    const member = createMember();
    const pairName = PairName.create('l');
    const pair = Pair.create(12, { pairName, member });
    const newMember = createNewMember(Zaiseki);

    expect(() => pair.addMember(newMember)).toThrow();
  });

  test('[異常系] 休会中の参加者は追加できない', () => {
    const member = createMember().slice(0, 2);
    const pairName = PairName.create('m');
    const pair = Pair.create(13, { pairName, member });
    const newMember = createNewMember(Kyukai);

    expect(() => pair.addMember(newMember)).toThrow();
  });

  test('[異常系] 退会済の参加者は追加できない', () => {
    const member = createMember().slice(0, 2);
    const pairName = PairName.create('n');
    const pair = Pair.create(14, { pairName, member });
    const newMember = createNewMember(Taikai);

    expect(() => pair.addMember(newMember)).toThrow();
  });

  test('[異常系] 既にペアの一員の参加者は追加できない', () => {
    const member = createMember().slice(0, 2);
    const pairName = PairName.create('o');
    const pair = Pair.create(15, { pairName, member });
    const newMember = member[0];

    expect(() => pair.addMember(newMember)).toThrow();
  });
});

describe('isFullMember', () => {
  test('[正常系] 2名のペアの場合、False', () => {
    const member = createMember().slice(0, 2);
    const pairName = PairName.create('u');
    const pair = Pair.create(21, { pairName, member });

    expect(pair.isFullMember()).toBeFalsy();
  });

  test('[正常系] 3名のペアの場合、True', () => {
    const member = createMember();
    const pairName = PairName.create('v');
    const pair = Pair.create(22, { pairName, member });

    expect(pair.isFullMember()).toBeTruthy();
  });
});

describe('isMember', () => {
  test('[正常系] 引数の参加者がペアの一員の場合、True', () => {
    const member = createMember();
    const pairName = PairName.create('w');
    const pair = Pair.create(23, { pairName, member });

    const memberUser = member[0];
    expect(pair.isMember(memberUser)).toBeTruthy();
  });

  test('[正常系] 引数の参加者がペアの一員でない場合、False', () => {
    const member = createMember();
    const pairName = PairName.create('w');
    const pair = Pair.create(23, { pairName, member });

    const nonMember = Participant.create('5', {
      participantName: ParticipantName.create('上原 つばさ'),
      email: ParticipantEmail.create('rhu469919720429@tokyo24.com'),
      status: Zaiseki,
    });
    expect(pair.isMember(nonMember)).toBeFalsy();
  });
});

describe('removeMember', () => {
  test('[正常系] ペアの一員であればremoveできる', () => {
    const member = createMember();
    const pairName = PairName.create('x');
    const pair = Pair.create(24, { pairName, member });

    const removedUser = member[0];
    const newMember = member.splice(1);

    pair.removeMember(removedUser);
    expect(pair.member).toEqual(newMember);
  });

  test('[異常系] ペアの一員でない場合、removeできない', () => {
    const member = createMember();
    const pairName = PairName.create('x');
    const pair = Pair.create(24, { pairName, member });

    const removedUser = Participant.create('5', {
      participantName: ParticipantName.create('奥村 都義'),
      email: ParticipantEmail.create('okumura83@eaccess.net'),
      status: Zaiseki,
    });

    expect(() => pair.removeMember(removedUser)).toThrow();
  });
});

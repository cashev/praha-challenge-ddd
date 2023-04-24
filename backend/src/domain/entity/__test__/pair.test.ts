import { PairName } from 'src/domain/value-object/pairName';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import { ParticipantName } from 'src/domain/value-object/participantName';
import {
  ParticipantStatus,
  Zaiseki,
} from 'src/domain/value-object/participantStatus';
import { Pair } from '../pair';
import { Participant, ParticipantIdType } from '../participant';

const createMember = () => {
  const p1 = '1' as ParticipantIdType;
  const p2 = '2' as ParticipantIdType;
  const p3 = '3' as ParticipantIdType;
  return [p1, p2, p3];
};

describe('create', () => {
  test('[正常系] 2人のペア', () => {
    const member = createMember().splice(0, 2);
    const pairName = PairName.create('a');

    const pair = Pair.create('1', { pairName, member });
    expect(pair.pairName).toEqual(pairName);
    expect(pair.member).toEqual(member);
  });

  test('[正常系] 3人のペア', () => {
    const member = createMember();
    const pairName = PairName.create('b');

    const pair = Pair.create('2', { pairName, member });
    expect(pair.pairName).toEqual(pairName);
    expect(pair.member).toEqual(member);
  });

  test('[異常系] 1人のペア', () => {
    const member = createMember().splice(0, 1);
    const pairName = PairName.create('c');

    expect(() => Pair.create('3', { pairName, member })).toThrow();
  });

  test('[異常系] 4人のペア', () => {
    const p4 = '4' as ParticipantIdType;
    const member = [...createMember(), p4];
    const pairName = PairName.create('d');

    expect(() => Pair.create('4', { pairName, member })).toThrow();
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
    const pair = Pair.create('11', { pairName, member });
    const newMember = createNewMember(Zaiseki);

    pair.addMember(newMember.id);
    expect(pair.member).toEqual([...member, newMember.id]);
  });

  test('[異常系] 3名のペアには追加できない', () => {
    const member = createMember();
    const pairName = PairName.create('l');
    const pair = Pair.create('12', { pairName, member });
    const newMember = createNewMember(Zaiseki);

    expect(() => pair.addMember(newMember.id)).toThrow();
  });

  test('[異常系] 既にペアの一員の参加者は追加できない', () => {
    const member = createMember().slice(0, 2);
    const pairName = PairName.create('o');
    const pair = Pair.create('13', { pairName, member });
    const newMember = member[0];

    expect(() => pair.addMember(newMember)).toThrow();
  });
});

describe('isFullMember', () => {
  test('[正常系] 2名のペアの場合、False', () => {
    const member = createMember().slice(0, 2);
    const pairName = PairName.create('u');
    const pair = Pair.create('21', { pairName, member });

    expect(pair.isFullMember()).toBeFalsy();
  });

  test('[正常系] 3名のペアの場合、True', () => {
    const member = createMember();
    const pairName = PairName.create('v');
    const pair = Pair.create('22', { pairName, member });

    expect(pair.isFullMember()).toBeTruthy();
  });
});

describe('isMember', () => {
  test('[正常系] 引数の参加者がペアの一員の場合、True', () => {
    const member = createMember();
    const pairName = PairName.create('w');
    const pair = Pair.create('23', { pairName, member });

    const memberUser = member[0];
    expect(pair.isMember(memberUser)).toBeTruthy();
  });

  test('[正常系] 引数の参加者がペアの一員でない場合、False', () => {
    const member = createMember();
    const pairName = PairName.create('w');
    const pair = Pair.create('23', { pairName, member });

    const nonMember = Participant.create('5', {
      participantName: ParticipantName.create('上原 つばさ'),
      email: ParticipantEmail.create('rhu469919720429@tokyo24.com'),
      status: Zaiseki,
    });
    expect(pair.isMember(nonMember.id)).toBeFalsy();
  });
});

describe('removeMember', () => {
  test('[正常系] ペアの一員であればremoveできる', () => {
    const member = createMember();
    const pairName = PairName.create('x');
    const pair = Pair.create('24', { pairName, member });

    const removedUser = member[0];
    const newMember = member.splice(1);

    pair.removeMember(removedUser);
    expect(pair.member).toEqual(newMember);
  });

  test('[異常系] ペアの一員でない場合、removeできない', () => {
    const member = createMember();
    const pairName = PairName.create('x');
    const pair = Pair.create('24', { pairName, member });

    const removedUser = Participant.create('5', {
      participantName: ParticipantName.create('奥村 都義'),
      email: ParticipantEmail.create('okumura83@eaccess.net'),
      status: Zaiseki,
    });

    expect(() => pair.removeMember(removedUser.id)).toThrow();
  });
});

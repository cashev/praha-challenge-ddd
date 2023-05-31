import { Team } from '../team';
import { ParticipantIdType } from '../participant';
import { isNone, isSome } from 'fp-ts/lib/Option';

const createThreeZaisekiMember = () => {
  const ps11 = {
    participantId: '11',
    status: '在籍中',
  };
  const ps12 = {
    participantId: '12',
    status: '在籍中',
  };
  const ps13 = {
    participantId: '13',
    status: '在籍中',
  };
  const ps14 = {
    participantId: '14',
    status: '休会中',
  };
  return [ps11, ps12, ps13, ps14];
};

const createTwoZaisekiMember01 = () => {
  const ps21 = {
    participantId: '21',
    status: '在籍中',
  };
  const ps22 = {
    participantId: '22',
    status: '在籍中',
  };
  const ps23 = {
    participantId: '23',
    status: '休会中',
  };
  return [ps21, ps22, ps23];
};

const createTwoZaisekiMember02 = () => {
  const ps21 = {
    participantId: '31',
    status: '在籍中',
  };
  const ps22 = {
    participantId: '32',
    status: '在籍中',
  };
  const ps23 = {
    participantId: '33',
    status: '休会中',
  };
  return [ps21, ps22, ps23];
};

describe('create', () => {
  test('[正常系] チームの参加者が3人', () => {
    const teamName = '123';
    const pairId = '1';
    const pairName = 'a';
    const member = [...createThreeZaisekiMember()];
    const team = Team.create('1', teamName, [{ pairId, pairName, member }]);

    expect(team.name.getValue()).toEqual(teamName);
    expect(team.getAllMember().length).toEqual(4);
    expect(team.getZaisekiMember().length).toEqual(3);
    expect(team.getPairs().length).toEqual(1);
    const pair = team.getPairs()[0];
    expect(pair.id).toEqual(pairId);
    expect(pair.name.getValue()).toEqual(pairName);
    expect(pair.getAllMember().length).toEqual(4);
    expect(pair.getZaisekiMember().length).toEqual(3);
    expect(
      pair.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual(member);
    expect(
      pair.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '11', status: '在籍中' },
      { participantId: '12', status: '在籍中' },
      { participantId: '13', status: '在籍中' },
      { participantId: '14', status: '休会中' },
    ]);
  });

  test('[異常系] チームの参加者が2人', () => {
    const teamName = '123';
    const pairId = '1';
    const pairName = 'a';
    const member = [...createTwoZaisekiMember01()];

    expect(() =>
      Team.create('1', teamName, [{ pairId, pairName, member }]),
    ).toThrow();
  });
});

describe('joinParticipant', () => {
  test('[正常系] 新規参加者を追加する', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    const team = Team.create('1', '123', [
      { pairId: '1', pairName: 'a', member: [...createThreeZaisekiMember()] },
      { pairId: '2', pairName: 'b', member: [...createTwoZaisekiMember02()] },
    ]);

    const pid = '91' as ParticipantIdType;
    const joinResult = team.joinParticipant(pid);

    expect(isNone(joinResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(8);
    expect(team.getZaisekiMember().length).toEqual(6);
    expect(team.getPairs().length).toEqual(2);
    const pair1 = team.getPairs()[0];
    expect(
      pair1.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '11', status: '在籍中' },
      { participantId: '12', status: '在籍中' },
      { participantId: '13', status: '在籍中' },
      { participantId: '14', status: '休会中' },
    ]);
    const pair2 = team.getPairs()[1];
    expect(
      pair2.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '31', status: '在籍中' },
      { participantId: '32', status: '在籍中' },
      { participantId: '33', status: '休会中' },
      { participantId: '91', status: '在籍中' },
    ]);
  });

  test('[正常系] 休会中の参加者を在籍中にする', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    const team = Team.create('1', '123', [
      { pairId: '1', pairName: 'a', member: [...createTwoZaisekiMember01()] },
      { pairId: '2', pairName: 'b', member: [...createTwoZaisekiMember02()] },
    ]);

    const pid = '33' as ParticipantIdType;
    const joinResult = team.joinParticipant(pid);

    expect(isNone(joinResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(6);
    expect(team.getZaisekiMember().length).toEqual(5);
    expect(team.getPairs().length).toEqual(2);
    const pair1 = team.getPairs()[0];
    expect(
      pair1.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '21', status: '在籍中' },
      { participantId: '22', status: '在籍中' },
      { participantId: '23', status: '休会中' },
      { participantId: '33', status: '在籍中' },
    ]);
    const pair2 = team.getPairs()[1];
    expect(
      pair2.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '31', status: '在籍中' },
      { participantId: '32', status: '在籍中' },
    ]);
  });

  test('[正常系] 既存のペアを分割して新規参加者を追加する', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    const member = [...createThreeZaisekiMember()];
    const team = Team.create('1', '123', [
      { pairId: '1', pairName: 'a', member },
    ]);

    const pid = '91' as ParticipantIdType;
    const joinResult = team.joinParticipant(pid);

    expect(isNone(joinResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(5);
    expect(team.getZaisekiMember().length).toEqual(4);
    expect(team.getPairs().length).toEqual(2);
    const pair1 = team.getPairs()[0];
    expect(
      pair1.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '12', status: '在籍中' },
      { participantId: '13', status: '在籍中' },
      { participantId: '14', status: '休会中' },
    ]);
    const pair2 = team.getPairs()[1];
    expect(
      pair2.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '11', status: '在籍中' },
      { participantId: '91', status: '在籍中' },
    ]);
  });

  test('[異常系] 在籍中の参加者を追加する', () => {
    const team = Team.create('1', '123', [
      { pairId: '1', pairName: 'a', member: [...createThreeZaisekiMember()] },
    ]);
    const joinResult = team.joinParticipant('11' as ParticipantIdType);
    expect(isSome(joinResult)).toBeTruthy();
  });
});

describe('canRemoveParticipant', () => {
  test('[正常系] 参加者が4人であれば、true', () => {
    const team = Team.create('1', '123', [
      { pairId: '1', pairName: 'a', member: [...createTwoZaisekiMember01()] },
      { pairId: '2', pairName: 'b', member: [...createTwoZaisekiMember02()] },
    ]);

    expect(team.canRemoveParticipant()).toBeTruthy();
  });

  test('[正常系] 参加者が3人であれば、false', () => {
    const team = Team.create('1', '123', [
      { pairId: '1', pairName: 'a', member: [...createThreeZaisekiMember()] },
    ]);

    expect(team.canRemoveParticipant()).toBeFalsy();
  });
});

describe('suspendParticipant', () => {
  test('[正常系] 3人ペアの参加者が休会する', () => {
    const team = Team.create('1', '123', [
      { pairId: '1', pairName: 'a', member: [...createThreeZaisekiMember()] },
      { pairId: '2', pairName: 'b', member: [...createTwoZaisekiMember02()] },
    ]);

    const pid = '12' as ParticipantIdType;
    const suspendResult = team.suspendParticipant(pid);

    expect(isNone(suspendResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(7);
    expect(team.getZaisekiMember().length).toEqual(4);
    expect(team.getPairs().length).toEqual(2);
    const pair1 = team.getPairs()[0];
    expect(
      pair1.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '11', status: '在籍中' },
      { participantId: '12', status: '休会中' },
      { participantId: '13', status: '在籍中' },
      { participantId: '14', status: '休会中' },
    ]);
    const pair2 = team.getPairs()[1];
    expect(
      pair2.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '31', status: '在籍中' },
      { participantId: '32', status: '在籍中' },
      { participantId: '33', status: '休会中' },
    ]);
  });

  test('[正常系] 2人ペアの参加者が休会し、残った参加者は2人ペアに合流する', () => {
    const team = Team.create('1', '123', [
      { pairId: '1', pairName: 'a', member: [...createTwoZaisekiMember01()] },
      { pairId: '2', pairName: 'b', member: [...createTwoZaisekiMember02()] },
    ]);

    const pid = '22' as ParticipantIdType;
    const suspendResult = team.suspendParticipant(pid);

    expect(isNone(suspendResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(6);
    expect(team.getZaisekiMember().length).toEqual(3);
    expect(team.getPairs().length).toEqual(1);
    const pair = team.getPairs()[0];
    expect(
      pair.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '21', status: '在籍中' },
      { participantId: '22', status: '休会中' },
      { participantId: '23', status: '休会中' },
      { participantId: '31', status: '在籍中' },
      { participantId: '32', status: '在籍中' },
      { participantId: '33', status: '休会中' },
    ]);
  });

  test('[正常系] 2人ペアの参加者が休会し、残った参加者は3人ペアに合流する', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    const team = Team.create('1', '123', [
      { pairId: '1', pairName: 'a', member: [...createThreeZaisekiMember()] },
      { pairId: '2', pairName: 'b', member: [...createTwoZaisekiMember02()] },
    ]);

    const pid = '32' as ParticipantIdType;
    const suspendResult = team.suspendParticipant(pid);

    expect(isNone(suspendResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(7);
    expect(team.getZaisekiMember().length).toEqual(4);
    expect(team.getPairs().length).toEqual(2);
    const pair1 = team.getPairs()[0];
    expect(
      pair1.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '12', status: '在籍中' },
      { participantId: '13', status: '在籍中' },
      { participantId: '14', status: '休会中' },
    ]);
    const pair2 = team.getPairs()[1];
    expect(
      pair2.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '11', status: '在籍中' },
      { participantId: '31', status: '在籍中' },
      { participantId: '32', status: '休会中' },
      { participantId: '33', status: '休会中' },
    ]);
  });
});

describe('removeParticipant', () => {
  test('[正常系] 3人ペアの参加者が退会する', () => {
    const team = Team.create('1', '123', [
      { pairId: '1', pairName: 'a', member: [...createThreeZaisekiMember()] },
      { pairId: '2', pairName: 'b', member: [...createTwoZaisekiMember02()] },
    ]);
    const pid = '12' as ParticipantIdType;

    const removeResult = team.removeParticipant(pid);

    expect(isNone(removeResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(6);
    expect(team.getZaisekiMember().length).toEqual(4);
    expect(team.getPairs().length).toEqual(2);
    const pair1 = team.getPairs()[0];
    expect(
      pair1.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '11', status: '在籍中' },
      { participantId: '13', status: '在籍中' },
      { participantId: '14', status: '休会中' },
    ]);
    const pair2 = team.getPairs()[1];
    expect(
      pair2.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '31', status: '在籍中' },
      { participantId: '32', status: '在籍中' },
      { participantId: '33', status: '休会中' },
    ]);
  });

  test('[正常系] 2人ペアの参加者が退会し、残った参加者は2人ペアに合流する', () => {
    const team = Team.create('1', '123', [
      { pairId: '1', pairName: 'a', member: [...createTwoZaisekiMember01()] },
      { pairId: '2', pairName: 'b', member: [...createTwoZaisekiMember02()] },
    ]);
    const pid = '22' as ParticipantIdType;

    const removeResult = team.removeParticipant(pid);

    expect(isNone(removeResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(5);
    expect(team.getZaisekiMember().length).toEqual(3);
    expect(team.getPairs().length).toEqual(1);
    const pair = team.getPairs()[0];
    expect(
      pair.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '21', status: '在籍中' },
      { participantId: '23', status: '休会中' },
      { participantId: '31', status: '在籍中' },
      { participantId: '32', status: '在籍中' },
      { participantId: '33', status: '休会中' },
    ]);
  });

  test('[正常系] 2人ペアの参加者が退会し、残った参加者は3人ペアに合流する', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    const team = Team.create('1', '123', [
      { pairId: '1', pairName: 'a', member: [...createThreeZaisekiMember()] },
      { pairId: '2', pairName: 'b', member: [...createTwoZaisekiMember02()] },
    ]);
    const pid = '32' as ParticipantIdType;

    const removeResult = team.removeParticipant(pid);

    expect(isNone(removeResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(6);
    expect(team.getZaisekiMember().length).toEqual(4);
    expect(team.getPairs().length).toEqual(2);
    const pair1 = team.getPairs()[0];
    expect(
      pair1.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '12', status: '在籍中' },
      { participantId: '13', status: '在籍中' },
      { participantId: '14', status: '休会中' },
    ]);
    const pair2 = team.getPairs()[1];
    expect(
      pair2.getAllMember().map((ps) => {
        return { participantId: ps.participantId, status: ps.getStatusValue() };
      }),
    ).toEqual([
      { participantId: '11', status: '在籍中' },
      { participantId: '31', status: '在籍中' },
      { participantId: '33', status: '休会中' },
    ]);
  });
});

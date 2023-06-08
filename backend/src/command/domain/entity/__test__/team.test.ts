import { Team } from '../team';
import { ParticipantIdType } from '../participant';
import { isNone, isSome } from 'fp-ts/lib/Option';

describe('create', () => {
  test('[正常系] チームの参加者が3人', () => {
    const teamName = '123';
    const pairId = '1';
    const pairName = 'a';
    const participants = ['11', '12', '13'];
    const team = Team.create(
      '1',
      teamName,
      [{ pairId, pairName, participants }],
      ['14'],
    );

    expect(team.name.getValue()).toEqual(teamName);
    expect(team.getAllMember().length).toEqual(4);
    expect(team.getZaisekiMember().length).toEqual(3);
    expect(team.getPairs().length).toEqual(1);
    const pair = team.getPairs()[0];
    expect(pair.id).toEqual(pairId);
    expect(pair.name.getValue()).toEqual(pairName);
    expect(pair.getParticipants().length).toEqual(3);
    expect(pair.getParticipants()).toEqual(participants);
  });

  test('[異常系] チームの参加者が2人', () => {
    const teamName = '123';
    const pairId = '1';
    const pairName = 'a';
    const participants = ['21', '22'];

    expect(() =>
      Team.create('1', teamName, [{ pairId, pairName, participants }]),
    ).toThrow();
  });
});

describe('joinParticipant', () => {
  test('[正常系] 新規参加者を追加する', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    const team = Team.create(
      '1',
      '123',
      [
        { pairId: '1', pairName: 'a', participants: ['11', '12', '13'] },
        { pairId: '2', pairName: 'b', participants: ['31', '32'] },
      ],
      ['14', '33'],
    );

    const pid = '91' as ParticipantIdType;
    const joinResult = team.joinParticipant(pid);

    expect(isNone(joinResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(8);
    expect(team.getZaisekiMember().length).toEqual(6);
    expect(team.getPairs().length).toEqual(2);
    const pair1 = team.getPairs()[0];
    expect(pair1.getParticipants()).toEqual(['11', '12', '13']);
    const pair2 = team.getPairs()[1];
    expect(pair2.getParticipants()).toEqual(['31', '32', '91']);
  });

  test('[正常系] 休会中の参加者を在籍中にする', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    const team = Team.create(
      '1',
      '123',
      [
        { pairId: '1', pairName: 'a', participants: ['21', '22'] },
        { pairId: '2', pairName: 'b', participants: ['31', '32'] },
      ],
      ['23', '33'],
    );

    const pid = '33' as ParticipantIdType;
    const joinResult = team.joinParticipant(pid);

    expect(isNone(joinResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(6);
    expect(team.getZaisekiMember().length).toEqual(5);
    expect(team.getPairs().length).toEqual(2);
    const pair1 = team.getPairs()[0];
    expect(pair1.getParticipants()).toEqual(['21', '22', '33']);
    const pair2 = team.getPairs()[1];
    expect(pair2.getParticipants()).toEqual(['31', '32']);
  });

  test('[正常系] 既存のペアを分割して新規参加者を追加する', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    const participants = ['11', '12', '13'];
    const team = Team.create(
      '1',
      '123',
      [{ pairId: '1', pairName: 'a', participants }],
      ['14'],
    );

    const pid = '91' as ParticipantIdType;
    const joinResult = team.joinParticipant(pid);

    expect(isNone(joinResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(5);
    expect(team.getZaisekiMember().length).toEqual(4);
    expect(team.getPairs().length).toEqual(2);
    const pair1 = team.getPairs()[0];
    expect(pair1.getParticipants()).toEqual(['12', '13']);
    const pair2 = team.getPairs()[1];
    expect(pair2.getParticipants()).toEqual(['11', '91']);
  });

  test('[異常系] 在籍中の参加者を追加する', () => {
    const team = Team.create(
      '1',
      '123',
      [{ pairId: '1', pairName: 'a', participants: ['11', '12', '13'] }],
      ['14'],
    );
    const joinResult = team.joinParticipant('11' as ParticipantIdType);
    expect(isSome(joinResult)).toBeTruthy();
  });
});

describe('canRemoveParticipant', () => {
  test('[正常系] 参加者が4人であれば、true', () => {
    const team = Team.create(
      '1',
      '123',
      [
        { pairId: '1', pairName: 'a', participants: ['21', '22'] },
        { pairId: '2', pairName: 'b', participants: ['31', '32'] },
      ],
      ['23', '33'],
    );

    expect(team.canRemoveParticipant()).toBeTruthy();
  });

  test('[正常系] 参加者が3人であれば、false', () => {
    const team = Team.create('1', '123', [
      { pairId: '1', pairName: 'a', participants: ['11', '12', '13'] },
    ]);

    expect(team.canRemoveParticipant()).toBeFalsy();
  });
});

describe('suspendParticipant', () => {
  test('[正常系] 3人ペアの参加者が休会する', () => {
    const team = Team.create(
      '1',
      '123',
      [
        { pairId: '1', pairName: 'a', participants: ['11', '12', '13'] },
        { pairId: '2', pairName: 'b', participants: ['31', '32'] },
      ],
      ['14', '33'],
    );

    const pid = '12' as ParticipantIdType;
    const suspendResult = team.suspendParticipant(pid);

    expect(isNone(suspendResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(7);
    expect(team.getZaisekiMember().length).toEqual(4);
    expect(team.getKyukaiMember()).toEqual(['12', '14', '33']);
    expect(team.getPairs().length).toEqual(2);
    const pair1 = team.getPairs()[0];
    expect(pair1.getParticipants()).toEqual(['11', '13']);
    const pair2 = team.getPairs()[1];
    expect(pair2.getParticipants()).toEqual(['31', '32']);
  });

  test('[正常系] 2人ペアの参加者が休会し、残った参加者は2人ペアに合流する', () => {
    const team = Team.create(
      '1',
      '123',
      [
        { pairId: '1', pairName: 'a', participants: ['21', '22'] },
        { pairId: '2', pairName: 'b', participants: ['31', '32'] },
      ],
      ['23', '33'],
    );

    const pid = '22' as ParticipantIdType;
    const suspendResult = team.suspendParticipant(pid);

    expect(isNone(suspendResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(6);
    expect(team.getZaisekiMember().length).toEqual(3);
    expect(team.getKyukaiMember()).toEqual(['22', '23', '33']);
    expect(team.getPairs().length).toEqual(1);
    const pair = team.getPairs()[0];
    expect(pair.getParticipants()).toEqual(['21', '31', '32']);
  });

  test('[正常系] 2人ペアの参加者が休会し、残った参加者は3人ペアに合流する', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    const team = Team.create(
      '1',
      '123',
      [
        { pairId: '1', pairName: 'a', participants: ['11', '12', '13'] },
        { pairId: '2', pairName: 'b', participants: ['31', '32'] },
      ],
      ['14', '33'],
    );

    const pid = '32' as ParticipantIdType;
    const suspendResult = team.suspendParticipant(pid);

    expect(isNone(suspendResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(7);
    expect(team.getZaisekiMember().length).toEqual(4);
    expect(team.getKyukaiMember()).toEqual(['14', '32', '33']);
    expect(team.getPairs().length).toEqual(2);
    const pair1 = team.getPairs()[0];
    expect(pair1.getParticipants()).toEqual(['12', '13']);
    const pair2 = team.getPairs()[1];
    expect(pair2.getParticipants()).toEqual(['11', '31']);
  });
});

describe('removeParticipant', () => {
  test('[正常系] 3人ペアの参加者が退会する', () => {
    const team = Team.create(
      '1',
      '123',
      [
        { pairId: '1', pairName: 'a', participants: ['11', '12', '13'] },
        { pairId: '2', pairName: 'b', participants: ['31', '32'] },
      ],
      ['14', '33'],
    );
    const pid = '12' as ParticipantIdType;

    const removeResult = team.removeParticipant(pid);

    expect(isNone(removeResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(6);
    expect(team.getZaisekiMember().length).toEqual(4);
    expect(team.getPairs().length).toEqual(2);
    const pair1 = team.getPairs()[0];
    expect(pair1.getParticipants()).toEqual(['11', '13']);
    const pair2 = team.getPairs()[1];
    expect(pair2.getParticipants()).toEqual(['31', '32']);
  });

  test('[正常系] 2人ペアの参加者が退会し、残った参加者は2人ペアに合流する', () => {
    const team = Team.create(
      '1',
      '123',
      [
        { pairId: '1', pairName: 'a', participants: ['21', '22'] },
        { pairId: '2', pairName: 'b', participants: ['31', '32'] },
      ],
      ['23', '33'],
    );
    const pid = '22' as ParticipantIdType;

    const removeResult = team.removeParticipant(pid);

    expect(isNone(removeResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(5);
    expect(team.getZaisekiMember().length).toEqual(3);
    expect(team.getPairs().length).toEqual(1);
    const pair = team.getPairs()[0];
    expect(pair.getParticipants()).toEqual(['21', '31', '32']);
  });

  test('[正常系] 2人ペアの参加者が退会し、残った参加者は3人ペアに合流する', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    const team = Team.create(
      '1',
      '123',
      [
        { pairId: '1', pairName: 'a', participants: ['11', '12', '13'] },
        { pairId: '2', pairName: 'b', participants: ['31', '32'] },
      ],
      ['14', '33'],
    );
    const pid = '32' as ParticipantIdType;

    const removeResult = team.removeParticipant(pid);

    expect(isNone(removeResult)).toBeTruthy();
    expect(team.getAllMember().length).toEqual(6);
    expect(team.getZaisekiMember().length).toEqual(4);
    expect(team.getPairs().length).toEqual(2);
    const pair1 = team.getPairs()[0];
    expect(pair1.getParticipants()).toEqual(['12', '13']);
    const pair2 = team.getPairs()[1];
    expect(pair2.getParticipants()).toEqual(['11', '31']);
  });
});

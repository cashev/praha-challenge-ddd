import { ParticipantIdType } from 'src/domain/entity/participant';
import { Team } from 'src/domain/entity/team';
import { some } from 'fp-ts/lib/Option';
import { MockTeamRepository } from './mock/team-repository';
import { isLeft, isRight } from 'fp-ts/lib/Either';
import { MockNotificationSender } from './mock/notification-sender';
import { RemovalTeamMemberValidator } from '../util/removal-team-member-validator';
import { ParticipantNameDto } from '../query-service-interface/participant-qs';

const createParticipantNameQS = () => {
  return {
    getNames: jest
      .fn()
      .mockResolvedValue([
        new ParticipantNameDto({ id: '11', name: '参加者11' }),
        new ParticipantNameDto({ id: '12', name: '参加者12' }),
        new ParticipantNameDto({ id: '13', name: '参加者13' }),
      ]),
  };
};

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

describe('validateFromParticipantId', () => {
  test('[正常系]', async () => {
    const team = Team.create('1', '123', [
      { pairId: '1', pairName: 'a', member: [...createTwoZaisekiMember01()] },
      { pairId: '2', pairName: 'b', member: [...createTwoZaisekiMember02()] },
    ]);
    const validator = new RemovalTeamMemberValidator(
      new MockTeamRepository(some(team)),
      new MockNotificationSender(),
      createParticipantNameQS(),
    );
    const pid = '21' as ParticipantIdType;

    const validateResult = await validator.validateFromParticipantId(pid);
    expect(isRight(validateResult)).toBeTruthy();
  });

  test('[異常系] 所属するチームが見つからない', async () => {
    const validator = new RemovalTeamMemberValidator(
      new MockTeamRepository(),
      new MockNotificationSender(),
      createParticipantNameQS(),
    );
    const pid = '99' as ParticipantIdType;

    const validateResult = await validator.validateFromParticipantId(pid);
    expect(isLeft(validateResult)).toBeTruthy();
  });

  test('[異常系] チームの人数が規定数を下回る', async () => {
    const team = Team.create('1', '123', [
      { pairId: '1', pairName: 'a', member: [...createThreeZaisekiMember()] },
    ]);
    const sender = new MockNotificationSender();
    const validator = new RemovalTeamMemberValidator(
      new MockTeamRepository(some(team)),
      sender,
      createParticipantNameQS(),
    );
    const pid = '11' as ParticipantIdType;

    const validateResult = await validator.validateFromParticipantId(pid);
    expect(isLeft(validateResult)).toBeTruthy();
    expect(sender.getAll().length).toEqual(1);
  });
});

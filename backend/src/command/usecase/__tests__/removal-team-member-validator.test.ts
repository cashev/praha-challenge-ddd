import { some } from 'fp-ts/lib/Option';
import { MockTeamRepository } from './mock/team-repository';
import { isLeft, isRight } from 'fp-ts/lib/Either';
import { MockNotificationSender } from './mock/notification-sender';
import { ParticipantNameDto } from 'src/query/usecase/query-service-interface/participant-qs';
import { RemovalTeamMemberValidator } from '../util/removal-team-member-validator';
import { ParticipantIdType } from 'src/command/domain/entity/participant';
import { Team } from 'src/command/domain/entity/team';

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

describe('validateFromParticipantId', () => {
  test('[正常系]', async () => {
    const team = Team.create(
      '1',
      '123',
      [
        { pairId: '1', pairName: 'a', participants: ['21', '22'] },
        { pairId: '2', pairName: 'b', participants: ['31', '32'] },
      ],
      ['23', '33'],
    );
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
    const team = Team.create(
      '1',
      '123',
      [{ pairId: '1', pairName: 'a', participants: ['11', '12', '13'] }],
      ['14'],
    );
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

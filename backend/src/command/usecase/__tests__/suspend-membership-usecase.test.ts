import { isNone, isSome } from 'fp-ts/lib/Option';
import { SuspendMembershipUsecase } from '../suspend-membership-usecase';
import { left, right } from 'fp-ts/lib/Either';
import { MockTeamRepository } from './mock/team-repository';
import { MockRemovalTeamMemberValidator } from './mock/removal-team-member-validator';
import { ParticipantIdType } from 'src/command/domain/entity/participant';
import { Team } from 'src/command/domain/entity/team';

const createTeam = () => {
  const t1 = Team.create(
    '1',
    '123',
    [
      { pairId: '1', pairName: 'a', participants: ['21', '22'] },
      { pairId: '2', pairName: 'b', participants: ['31', '32'] },
    ],
    ['23', '33'],
  );
  return t1;
};

describe('do', () => {
  test('[正常系]', async () => {
    const team = createTeam();
    const usecase = new SuspendMembershipUsecase(
      new MockTeamRepository(),
      new MockRemovalTeamMemberValidator(right(team)),
    );
    const result = await usecase.do('32');
    expect(isNone(result)).toBeTruthy();
    expect(team.getPairs().length).toEqual(1);
    expect(team.getAllMember().length).toEqual(6);
    expect(team.getZaisekiMember().length).toEqual(3);
    const pid = '32' as ParticipantIdType;
    expect(team.getPairs().some((p) => p.isMember(pid))).toBeFalsy();
    expect(team.getKyukaiMember()).toEqual(['23', '32', '33']);
  });

  test('[異常系]', async () => {
    const usecase = new SuspendMembershipUsecase(
      new MockTeamRepository(),
      new MockRemovalTeamMemberValidator(left(new Error())),
    );
    const result = await usecase.do('91');
    expect(isSome(result)).toBeTruthy();
  });
});

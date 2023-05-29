import { isNone, isSome } from 'fp-ts/lib/Option';
import { SuspendMembershipUsecase } from '../suspend-membership-usecase';
import { left, right } from 'fp-ts/lib/Either';
import { Team } from 'src/domain/entity/team';
import { MockTeamRepository } from './mock/team-repository';
import { MockRemovalTeamMemberValidator } from './mock/removal-team-member-validator';
import { ParticipantIdType } from 'src/domain/entity/participant';

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

const createTeam = () => {
  const t1 = Team.create('1', '123', [
    { pairId: '1', pairName: 'a', member: [...createTwoZaisekiMember01()] },
    { pairId: '2', pairName: 'b', member: [...createTwoZaisekiMember02()] },
  ]);
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
    expect(team.getPairs().some((p) => p.isMember(pid))).toBeTruthy();
    const ps = team.getAllMember().filter((ps) => ps.participantId == pid)[0];
    expect(ps.isKyukai()).toBeTruthy();
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

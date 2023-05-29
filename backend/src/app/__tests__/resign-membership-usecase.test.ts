import { ParticipantIdType } from 'src/domain/entity/participant';
import { isNone, isSome } from 'fp-ts/lib/Option';
import { ResignMembershipUsecase } from '../resign-membership-usecase';
import { left, right } from 'fp-ts/lib/Either';
import { MockTeamRepository } from './mock/team-repository';
import { MockRemovalTeamMemberValidator } from './mock/removal-team-member-validator';
import { Team } from 'src/domain/entity/team';

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
    const usecase = new ResignMembershipUsecase(
      new MockTeamRepository(),
      new MockRemovalTeamMemberValidator(right(team)),
    );
    const result = await usecase.do('31');
    expect(isNone(result)).toBeTruthy();
    expect(team.getPairs().length).toEqual(1);
    expect(team.getAllMember().length).toEqual(5);
    expect(team.getZaisekiMember().length).toEqual(3);
    const pid = '31' as ParticipantIdType;
    expect(team.getPairs().some((p) => p.isMember(pid))).toBeFalsy();
    expect(
      team.getAllMember().some((ps) => ps.participantId == pid),
    ).toBeFalsy();
  });

  test('[異常系]', async () => {
    const usecase = new ResignMembershipUsecase(
      new MockTeamRepository(),
      new MockRemovalTeamMemberValidator(left(new Error())),
    );
    const result = await usecase.do('91');
    expect(isSome(result)).toBeTruthy();
  });
});

import { Participant } from 'src/domain/entity/participant';
import { MockParticipantRepository } from './mock/participant-repository';
import { ParticipantName } from 'src/domain/value-object/participantName';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import { Taikai, Zaiseki } from 'src/domain/value-object/participantStatus';
import { isNone, isSome, some } from 'fp-ts/lib/Option';
import { ResignMembershipUsecase } from '../resign-membership-usecase';
import { MockRemoveMemberUsecase } from './mock/remove-member-usecase';
import { left, right } from 'fp-ts/lib/Either';

describe('do', () => {
  test('[正常系]', async () => {
    const participant = Participant.create('a', {
      participantName: ParticipantName.create('大内 唯'),
      email: ParticipantEmail.create('yui-oouti@example.net'),
      status: Zaiseki,
    });
    const usecase = new ResignMembershipUsecase(
      new MockParticipantRepository(some(participant)),
      new MockRemoveMemberUsecase(right(participant)),
    );
    const result = await usecase.do('');
    expect(isNone(result)).toBeTruthy();
    expect(participant.status).toEqual(Taikai);
  });

  test('[異常系]', async () => {
    const usecase = new ResignMembershipUsecase(
      new MockParticipantRepository(),
      new MockRemoveMemberUsecase(left(new Error())),
    );
    const result = await usecase.do('');
    expect(isSome(result)).toBeTruthy();
  });
});

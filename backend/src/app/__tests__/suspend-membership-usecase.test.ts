import { Participant } from 'src/domain/entity/participant';
import { MockParticipantRepository } from './mock/participant-repository';
import { ParticipantName } from 'src/domain/value-object/participantName';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import { Kyukai, Zaiseki } from 'src/domain/value-object/participantStatus';
import { isNone, some } from 'fp-ts/lib/Option';
import { SuspendMembershipUsecase } from '../suspend-membership-usecase';
import { MockRemoveMemberUsecase } from './mock/remove-member-usecase';

describe('do', () => {
  test('[正常系]', async () => {
    const participant = Participant.create('a', {
      participantName: ParticipantName.create('谷 信弥'),
      email: ParticipantEmail.create('tanitani@users.gr.jp'),
      status: Zaiseki,
    });
    const usecase = new SuspendMembershipUsecase(
      new MockParticipantRepository(some(participant)),
      new MockRemoveMemberUsecase(participant),
    );
    const result = await usecase.do('');
    expect(isNone(result)).toBeTruthy();
    expect(participant.status).toEqual(Kyukai);
  });
});

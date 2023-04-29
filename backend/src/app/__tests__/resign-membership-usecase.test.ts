import { Participant } from 'src/domain/entity/participant';
import { MockParticipantRepository } from './mock/participant-repository';
import { ParticipantName } from 'src/domain/value-object/participantName';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import { Taikai, Zaiseki } from 'src/domain/value-object/participantStatus';
import { isNone, some } from 'fp-ts/lib/Option';
import { ResignMembershipUsecase } from '../resign-membership-usecase';
import { right } from 'fp-ts/lib/Either';

describe('do', () => {
  const createRemoveMemberUsecase = (participant: Participant) => {
    return {
      do: jest.fn().mockResolvedValue(right(participant)),
    };
  };

  test('[正常系]', async () => {
    const participant = Participant.create('a', {
      participantName: ParticipantName.create('大内 唯'),
      email: ParticipantEmail.create('yui-oouti@example.net'),
      status: Zaiseki,
    });
    const usecase = new ResignMembershipUsecase(
      new MockParticipantRepository(some(participant)),
      createRemoveMemberUsecase(participant),
    );
    const result = await usecase.do('');
    expect(isNone(result)).toBeTruthy();
    expect(participant.status).toEqual(Taikai);
  });
});

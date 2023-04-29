import { Either, right } from 'fp-ts/lib/Either';
import { IRemoveMemberUsecase } from 'src/app/remove-member-usecase';
import { Participant } from 'src/domain/entity/participant';

export class MockRemoveMemberUsecase implements IRemoveMemberUsecase {
  private readonly participant: Participant;

  constructor(participant: Participant) {
    this.participant = participant;
  }

  do(participantId: string): Promise<Either<Error, Participant>> {
    participantId;
    return Promise.resolve(right(this.participant));
  }
}

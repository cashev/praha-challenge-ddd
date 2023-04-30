import { Either } from 'fp-ts/lib/Either';
import { left } from 'fp-ts/lib/Either';
import { IRemoveMemberUsecase } from 'src/app/remove-member-usecase';
import { Participant } from 'src/domain/entity/participant';

export class MockRemoveMemberUsecase implements IRemoveMemberUsecase {
  private readonly result: Either<Error, Participant>;

  constructor(result: Either<Error, Participant> = left(new Error())) {
    this.result = result;
  }

  do(participantId: string): Promise<Either<Error, Participant>> {
    participantId;
    return Promise.resolve(this.result);
  }
}

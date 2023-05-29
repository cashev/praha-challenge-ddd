import { Either } from 'fp-ts/lib/Either';
import { IRemovalTeamMemberValidator } from 'src/app/util/removal-team-member-validator';
import { ParticipantIdType } from 'src/domain/entity/participant';
import { Team } from 'src/domain/entity/team';

export class MockRemovalTeamMemberValidator
  implements IRemovalTeamMemberValidator
{
  constructor(private readonly result: Either<Error, Team>) {}

  validateFromParticipantId(
    participantId: ParticipantIdType,
  ): Promise<Either<Error, Team>> {
    participantId;
    return Promise.resolve(this.result);
  }
}

import { Either } from 'fp-ts/lib/Either';
import { ParticipantIdType } from 'src/command/domain/entity/participant';
import { Team } from 'src/command/domain/entity/team';
import { IRemovalTeamMemberValidator } from 'src/command/usecase/util/removal-team-member-validator';

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

import { Option, none } from 'fp-ts/lib/Option';
import { Participant } from 'src/domain/entity/participant';
import { IParticipantRepository } from 'src/domain/repository-interface/participant-repository';

export class MockParticipantRepository implements IParticipantRepository {
  constructor(private findResult: Option<Participant> = none) {}

  find(id: string): Promise<Option<Participant>> {
    id;
    return Promise.resolve(this.findResult);
  }
  save(participant: Participant): Promise<void> {
    participant;
    return Promise.resolve();
  }
}

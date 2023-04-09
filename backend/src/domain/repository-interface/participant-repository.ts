import { Participant } from 'src/domain/entity/participant';

export interface IParticipantRepository {
  find(id: number): Promise<Participant>;
  getNextId(): Promise<number>;
  save(participant: Participant): Promise<void>;
}

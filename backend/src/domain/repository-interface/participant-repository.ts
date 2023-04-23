import { Participant } from 'src/domain/entity/participant';

export interface IParticipantRepository {
  /**
   * 参加者idから参加者を取得します。
   * 
   * @param id 参加者id
   */
  find(id: string): Promise<Participant | null>;
  /**
   * 参加者を保存します。
   * 
   * @param participant 参加者
   */
  save(participant: Participant): Promise<void>;
}

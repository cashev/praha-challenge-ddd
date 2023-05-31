import { Option } from 'fp-ts/lib/Option';
import { Team } from '../entity/team';

export interface ITeamRepository {
  /**
   * 参加者idからその参加者が所属するチームを取得します。
   *
   * @param participantId 参加者id
   */
  findByParticipantId(participantId: string): Promise<Option<Team>>;
  /**
   * 所属する参加者が少ないチームを取得する。
   */
  getSmallestTeamList(): Promise<Option<Team[]>>;
  /**
   * チームとそのチームに紐づくペアの内容を保存します。
   *
   * @param team チーム
   */
  save(team: Team): Promise<void>;
}

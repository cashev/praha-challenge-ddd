import { Pair } from 'src/domain/entity/pair';

export interface IPairRepository {
  findByName(teamId: number, name: string): Promise<Pair>;
  getSmallestPairList(teamId: number): Promise<Pair[]>;
  getNextId(): Promise<number>;
  findByTeamId(teamId: number): Promise<Pair[]>;
}

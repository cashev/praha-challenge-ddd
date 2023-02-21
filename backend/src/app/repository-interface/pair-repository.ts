import { Pair } from 'src/domain/entity/pair';

export interface IPairRepository {
  findByName(name: string): Promise<Pair>;
  getSmallestPairList(teamId: number): Promise<Pair[]>;
}

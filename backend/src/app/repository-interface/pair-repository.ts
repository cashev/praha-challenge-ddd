import { Pair } from 'src/domain/entity/pair';

export interface IPairRepository {
  getSmallestPairList(teamId: number): Promise<Pair[]>;
}

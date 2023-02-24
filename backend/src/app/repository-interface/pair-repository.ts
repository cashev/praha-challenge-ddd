import { Pair } from 'src/domain/entity/pair';

export interface IPairRepository {
  findByName(teamId: number, name: string): Promise<Pair>;
  getSmallestPairList(teamId: number): Promise<Pair[]>;
  getMaxId(): Promise<number>;
}

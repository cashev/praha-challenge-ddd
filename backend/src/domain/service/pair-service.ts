import { IPairRepository } from 'src/app/repository-interface/pair-repository';
import { PairName } from '../value-object/pairName';

export class PairService {
  private readonly pairRepo: IPairRepository;

  constructor(pairRepo: IPairRepository) {
    this.pairRepo = pairRepo;
  }

  async isDuplicated(teamId: number, pairName: PairName): Promise<boolean> {
    const pair = await this.pairRepo.findByName(teamId, pairName.value);
    return pair !== null;
  }

  async getUnusedPairName(teamId: number): Promise<PairName> {
    const pairList = await this.pairRepo.findByTeamId(teamId);
    if (pairList == null) {
      return PairName.create('a');
    }
    const pairNameSet = new Set(pairList.map((pair) => pair.pairName.value));
    return this.findUnusedName(pairNameSet);
  }

  private findUnusedName(pairNameSet: Set<string>): PairName {
    const alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
    for (const i of alphabet) {
      if (pairNameSet.has(i)) {
        continue;
      }
      return PairName.create(i);
    }
    throw new Error('利用可能なペア名がありません。');
  }
}

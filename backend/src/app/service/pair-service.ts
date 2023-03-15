import { PairName } from 'src/domain/value-object/pairName';
import { IPairQS } from '../query-service-interface/pair-qs';

export class PairService {
  private readonly pairQS: IPairQS;

  constructor(pairQS: IPairQS) {
    this.pairQS = pairQS;
  }

  async isDuplicated(teamId: number, pairName: PairName): Promise<boolean> {
    const pair = await this.pairQS.findByName(teamId, pairName.value);
    return pair !== null;
  }

  async getUnusedPairName(teamId: number): Promise<PairName> {
    const pairList = await this.pairQS.findByTeamId(teamId);
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

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
}

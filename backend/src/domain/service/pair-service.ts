import { IPairRepository } from 'src/app/repository-interface/pair-repository';
import { PairName } from '../value-object/pairName';

export class PairService {
  private readonly pairRepo: IPairRepository;

  constructor(pairRepo: IPairRepository) {
    this.pairRepo = pairRepo;
  }

  async isDuplicated(pairName: PairName): Promise<boolean> {
    const pair = await this.pairRepo.findByName(pairName.value);
    return pair !== null;
  }
}

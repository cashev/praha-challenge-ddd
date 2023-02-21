import { IPairRepository } from 'src/app/repository-interface/pair-repository';

export class PairService {
  private readonly pairRepo: IPairRepository;

  constructor(pairRepo: IPairRepository) {
    this.pairRepo = pairRepo;
  }

  async isDuplicated(name: string): Promise<boolean> {
    const pair = await this.pairRepo.findByName(name);
    return pair !== null;
  }
}

import { PairDto } from 'src/app/query-service-interface/pair-qs';
import { PairName } from 'src/domain/value-object/pairName';
import { PairService } from '../pair-service';

describe('isDuplicated', () => {
  const createMockPairQS = (pairDto: PairDto | null) => {
    return {
      findByName: jest.fn().mockResolvedValue(pairDto),
      getSmallestPairList: jest.fn(),
      getNextId: jest.fn(),
      findByTeamId: jest.fn(),
    };
  };

  test('[正常系] ペア名が重複しない場合、False', async () => {
    const mockPairQS = createMockPairQS(null);
    const pairService = new PairService(mockPairQS);

    expect(
      pairService.isDuplicated(1, PairName.create('a')),
    ).resolves.toBeFalsy();
  });

  test('[正常系] ペア名が重複する場合、True', async () => {
    const pairDto = new PairDto({
      id: 1,
      name: 'a',
    });
    const mockPairQS = createMockPairQS(pairDto);
    const pairService = new PairService(mockPairQS);

    expect(
      pairService.isDuplicated(1, PairName.create('a')),
    ).resolves.toBeTruthy();
  });
});

describe('getUnusedPairName', () => {
  const createMockPairQS = (pairDtoList: PairDto[] | null) => {
    return {
      findByName: jest.fn(),
      getSmallestPairList: jest.fn(),
      getNextId: jest.fn(),
      findByTeamId: jest.fn().mockResolvedValue(pairDtoList),
    };
  };

  test('[正常系] aとbが使われている場合、c', async () => {
    const p1 = new PairDto({id: 1, name: 'a'});
    const p2 = new PairDto({id: 2, name: 'b'});
    const pairQS = createMockPairQS([p1, p2]);

    const service = new PairService(pairQS);
    expect(service.getUnusedPairName(1)).resolves.toEqual(PairName.create('c'));
  });

  test('[正常系] aとcが使われている場合、b', () => {
    const p1 = new PairDto({id: 1, name: 'a'});
    const p3 = new PairDto({id: 3, name: 'c'});
    const pairQS = createMockPairQS([p1, p3]);

    const service = new PairService(pairQS);
    expect(service.getUnusedPairName(2)).resolves.toEqual(PairName.create('b'));
  });

  test('[正常系] ペアがない場合、a', () => {
    const pairQS = createMockPairQS(null);

    const service = new PairService(pairQS);
    expect(service.getUnusedPairName(3)).resolves.toEqual(PairName.create('a'));
  });

  test('[異常系] 全て使われている場合、error', () => {
    const pairList = [];
    pairList.push(new PairDto({id: 1, name: 'a'}));
    pairList.push(new PairDto({id: 2, name: 'b'}));
    pairList.push(new PairDto({id: 3, name: 'c'}));
    pairList.push(new PairDto({id: 4, name: 'd'}));
    pairList.push(new PairDto({id: 5, name: 'e'}));
    pairList.push(new PairDto({id: 6, name: 'f'}));
    pairList.push(new PairDto({id: 7, name: 'g'}));
    pairList.push(new PairDto({id: 8, name: 'h'}));
    pairList.push(new PairDto({id: 9, name: 'i'}));
    pairList.push(new PairDto({id: 10, name: 'j'}));
    pairList.push(new PairDto({id: 11, name: 'k'}));
    pairList.push(new PairDto({id: 12, name: 'l'}));
    pairList.push(new PairDto({id: 13, name: 'm'}));
    pairList.push(new PairDto({id: 14, name: 'n'}));
    pairList.push(new PairDto({id: 15, name: 'o'}));
    pairList.push(new PairDto({id: 16, name: 'p'}));
    pairList.push(new PairDto({id: 17, name: 'q'}));
    pairList.push(new PairDto({id: 18, name: 'r'}));
    pairList.push(new PairDto({id: 19, name: 's'}));
    pairList.push(new PairDto({id: 20, name: 't'}));
    pairList.push(new PairDto({id: 21, name: 'u'}));
    pairList.push(new PairDto({id: 22, name: 'v'}));
    pairList.push(new PairDto({id: 23, name: 'w'}));
    pairList.push(new PairDto({id: 24, name: 'x'}));
    pairList.push(new PairDto({id: 25, name: 'y'}));
    pairList.push(new PairDto({id: 26, name: 'z'}));
    const pairQS = createMockPairQS(pairList);

    const service = new PairService(pairQS);
    expect(service.getUnusedPairName(1)).rejects.toThrow();
  });
});

import { PairName, PairNameType } from '../pairName';

describe('create', () => {
  test('[正常系]', () => {
    const validName = 'a' as PairNameType;
    const pairName = PairName.create(validName);
    expect(pairName.getValue()).toEqual(validName);
  });

  test('[異常系] ペア名に数字は使えない', () => {
    const invalidPairName = '1';
    expect(() => PairName.create(invalidPairName)).toThrow();
  });

  test('[異常系] ペア名は2文字ではない', () => {
    const invalidPairName = 'az';
    expect(() => PairName.create(invalidPairName)).toThrow();
  });
});

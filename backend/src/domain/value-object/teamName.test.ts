import { TeamName } from './teamName';

describe('create', () => {
  test('[正常系]', () => {
    const validTeamName = '123';
    const teamName = TeamName.create(validTeamName);
    expect(teamName.value).toBe(validTeamName);
  });

  test('[異常系]チーム名が4文字であればエラー', () => {
    const invalidTeamName = '1234';
    expect(() => TeamName.create(invalidTeamName)).toThrow();
  });

  test('[異常系]チーム名が数字でなければエラー', () => {
    const invalidTeamName = 'A';
    expect(() => TeamName.create(invalidTeamName)).toThrow();
  });
});

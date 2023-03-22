import { ParticipantEmail } from '../participantEmail';

describe('ParticipantEmailの生成テスト', () => {
  test('メールアドレスであればインスタンの生成に成功する', () => {
    const validEmail = 'test@example.com';
    const participantEmail = ParticipantEmail.create(validEmail);
    expect(participantEmail.value).toBe(validEmail);
  });

  test('不正な文字列であればインスタンス生成に失敗する', () => {
    const invalidEmail = 'abc';
    expect(() => ParticipantEmail.create(invalidEmail)).toThrow();
  });
});

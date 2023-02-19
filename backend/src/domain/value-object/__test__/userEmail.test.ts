import { UserEmail } from '../userEmail';

describe('UserEmailの生成テスト', () => {
  test('メールアドレスであればインスタンの生成に成功する', () => {
    const validEmail = 'test@example.com';
    const userEmail = UserEmail.create(validEmail);
    expect(userEmail.value).toBe(validEmail);
  });

  test('不正な文字列であればインスタンス生成に失敗する', () => {
    const invalidEmail = 'abc';
    expect(() => UserEmail.create(invalidEmail)).toThrow();
  });
});

import { User } from 'src/domain/entity/user';
import { UserEmail } from 'src/domain/value-object/userEmail';
import { UserName } from 'src/domain/value-object/userName';
import { Zaiseki } from 'src/domain/value-object/userStatus';
import { ComebackUserUseCase } from '../comeback-user-usecase';

describe('do', () => {
  const createMockUserRepo = (user: User | null) => {
    return {
      find: jest.fn().mockResolvedValue(user),
      save: jest.fn(),
    };
  };
  const createMockTeamRepo = () => {
    return {
      findByName: jest.fn(),
      findByUserId: jest.fn(),
      getSmallestTeamList: jest.fn(),
      getNextPairId: jest.fn(),
      save: jest.fn(),
    };
  };

  test('[異常系] 存在しない参加者', async () => {
    const mockUserRepo = createMockUserRepo(null);
    const mockTeamRepo = createMockTeamRepo();
    const useCase = new ComebackUserUseCase(mockUserRepo, mockTeamRepo);

    expect(useCase.do(1)).rejects.toThrow();
  });

  test('[異常系] 在籍中の参加者', async () => {
    const user = User.create(1, {
      userName: UserName.create('川島 佐十郎'),
      email: UserEmail.create('sjuru8200331@combzmail.jp'),
      status: Zaiseki,
    });
    const mockUserRepo = createMockUserRepo(user);
    const mockTeamRepo = createMockTeamRepo();
    const useCase = new ComebackUserUseCase(mockUserRepo, mockTeamRepo);

    expect(useCase.do(1)).rejects.toThrow();
  });
});

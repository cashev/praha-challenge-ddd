import { User } from 'src/domain/entity/user';
import { UserEmail } from 'src/domain/value-object/userEmail';
import { UserName } from 'src/domain/value-object/userName';
import { Zaiseki } from 'src/domain/value-object/userStatus';
import { ComebackUserUseCase } from '../comeback-user-usecase';
import { UserDto } from '../query-service-interface/user-qs';

describe('do', () => {
  const createMockUserQS = (user: UserDto | null) => {
    return {
      findById: jest.fn().mockResolvedValue(UserDto),
      getAll: jest.fn(),
    };
  };
  const createMockTeamRepo = () => {
    return {
      findByName: jest.fn(),
      findByUserId: jest.fn(),
      getSmallestTeamList: jest.fn(),
    };
  };
  const createMockPairRepo = () => {
    return {
      findByName: jest.fn(),
      getSmallestPairList: jest.fn(),
      getNextId: jest.fn(),
      findByTeamId: jest.fn(),
    };
  };

  test('[異常系] 存在しない参加者', async () => {
    const mockUserQS = createMockUserQS(null);
    const mockTeamRepo = createMockTeamRepo();
    const mockPairRepo = createMockPairRepo();
    const useCase = new ComebackUserUseCase(
      mockUserQS,
      mockTeamRepo,
      mockPairRepo,
    );

    expect(useCase.do(1)).rejects.toThrow();
  });

  test('[異常系] 在籍中の参加者', async () => {
    const userDto = new UserDto({
      id: 1,
      name: '川島 佐十郎',
      email: 'sjuru8200331@combzmail.jp',
      status: Zaiseki.toString(),
    });
    const mockUserQS = createMockUserQS(userDto);
    const mockTeamRepo = createMockTeamRepo();
    const mockPairRepo = createMockPairRepo();
    const useCase = new ComebackUserUseCase(
      mockUserQS,
      mockTeamRepo,
      mockPairRepo,
    );

    expect(useCase.do(1)).rejects.toThrow();
  });
});

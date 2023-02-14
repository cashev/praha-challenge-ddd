import { IUserQS, UserDto } from '../query-service-interface/user-qs';
import { GetAllUserUseCase } from '../get-all-user-usecase';

describe('do', () => {
  const u1 = new UserDto({
    id: 1,
    name: '永野 哲哉',
    email: 'tty-ngn19800814@dion.ne.jp',
  });
  const u2 = new UserDto({
    id: 2,
    name: '江口 隆吉',
    email: 'egt572@asp.home.ne.jp',
  });
  const u3 = new UserDto({
    id: 3,
    name: '柳沢 朋美',
    email: 'tmmyngsw@ybb.ne.jp',
  });
  const mockUserQS = new (class implements IUserQS {
    public getAll(): Promise<UserDto[]> {
      const users = [u1, u2, u3];
      return Promise.resolve(users);
    }
  })();

  test('[正常系]', async () => {
    const usecase = new GetAllUserUseCase(mockUserQS);
    const result = expect(usecase.do()).resolves;
    result.toEqual([u1, u2, u3]);
  });
});

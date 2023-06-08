import {
  IParticipantQS,
  ParticipantDto,
} from '../query-service-interface/participant-qs';
import { GetAllParticipantUseCase } from '../get-all-participant-usecase';

describe('do', () => {
  const u1 = new ParticipantDto({
    id: '1',
    name: '永野 哲哉',
    email: 'tty-ngn19800814@dion.ne.jp',
  });
  const u2 = new ParticipantDto({
    id: '2',
    name: '江口 隆吉',
    email: 'egt572@asp.home.ne.jp',
  });
  const u3 = new ParticipantDto({
    id: '3',
    name: '柳沢 朋美',
    email: 'tmmyngsw@ybb.ne.jp',
  });
  const mockParticipantQS = new (class implements IParticipantQS {
    public getAll(): Promise<ParticipantDto[]> {
      const users = [u1, u2, u3];
      return Promise.resolve(users);
    }
  })();

  test('[正常系]', async () => {
    const usecase = new GetAllParticipantUseCase(mockParticipantQS);
    const result = expect(usecase.do()).resolves;
    result.toEqual([u1, u2, u3]);
  });
});

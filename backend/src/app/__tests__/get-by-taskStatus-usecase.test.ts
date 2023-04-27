import { GetByTaskStatusUsecase } from '../get-by-taskStatus-usecase';
import {
  ITaskStatusQS,
  TaskStatusDto,
} from '../query-service-interface/task-status-qs';
import { ParticipantDto } from '../query-service-interface/participant-qs';

describe('do', () => {
  const p1 = new ParticipantDto({
    id: '1',
    name: '寺田 陽子',
    email: 'terada1979@example.ac.jp',
    status: '在籍中',
  });
  const p2 = new ParticipantDto({
    id: '2',
    name: '大森 定二',
    email: 'sdz82@dion.ne.jp',
    status: '在籍中',
  });
  const p3 = new ParticipantDto({
    id: '3',
    name: '藤村 美喜夫',
    email: 'mko_hzmr@ath.cx',
    status: '在籍中',
  });
  const p4 = new ParticipantDto({
    id: '4',
    name: '神谷 玲一',
    email: 'itiier018@so-net.ne.jp',
    status: '在籍中',
  });
  const p5 = new ParticipantDto({
    id: '5',
    name: '岸本 成美',
    email: 'mrn@example.ac.jp',
    status: '在籍中',
  });
  const p6 = new ParticipantDto({
    id: '6',
    name: '土屋 麻樹',
    email: 'maki.tutiya@example.ne.jp',
    status: '在籍中',
  });
  const p7 = new ParticipantDto({
    id: '7',
    name: '青柳 松次郎',
    email: 'matuzirou1986@rakuten.co.jp',
    status: '在籍中',
  });
  const p8 = new ParticipantDto({
    id: '8',
    name: '大山 友美',
    email: 'tmm-oymmyo-mmt@infoweb.ne.jp',
    status: '在籍中',
  });
  const p9 = new ParticipantDto({
    id: '9',
    name: '小谷 幸美',
    email: 'ntk4413414@excite.com',
    status: '在籍中',
  });
  const p10 = new ParticipantDto({
    id: '10',
    name: '根岸 保平',
    email: 'isigen732@dti.ne.jp',
    status: '在籍中',
  });
  const p11 = new ParticipantDto({
    id: '11',
    name: '黒沢 兼一',
    email: 'kurosawa.kanekazu@gmail.com',
    status: '在籍中',
  });
  const p12 = new ParticipantDto({
    id: '12',
    name: '石山 るり子',
    email: 'krr7920230114@hi-ho.ne.jp',
    status: '在籍中',
  });
  const plist = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12];

  const mockQS = new (class implements ITaskStatusQS {
    getAll(): Promise<TaskStatusDto[]> {
      return Promise.resolve([]);
    }
    getWithPagination(
      taskIds: string[],
      status: string,
      skip: number,
      take: number,
    ): Promise<ParticipantDto[]> {
      return Promise.resolve(plist.slice(skip, skip + take));
    }
  })();

  test('[正常系] 1ページ目', async () => {
    const usecase = new GetByTaskStatusUsecase(mockQS);
    const result = await usecase.do([], '', 0);
    expect(result.length).toBe(10);
    expect(result).toEqual(plist.slice(0, 10));
  });

  test('[正常系] 2ページ目', async () => {
    const usecase = new GetByTaskStatusUsecase(mockQS);
    const result = await usecase.do([], '', 1);
    expect(result.length).toBe(2);
    expect(result).toEqual(plist.slice(10, 12));
  });
});

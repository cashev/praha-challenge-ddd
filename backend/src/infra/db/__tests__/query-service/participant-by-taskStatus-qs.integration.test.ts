import { prisma } from 'src/testUtil/prisma';
import { TaskStatusQS } from '../../query-service/task-status-qs';

describe('participant-by-taskStatus-qs.integration.test', () => {
  const qs = new TaskStatusQS(prisma);
  beforeAll(async () => {
    await prisma.taskStatus.deleteMany({});
    await prisma.participant.deleteMany({});
    await prisma.task.deleteMany({});
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('', () => {
    const p1 = {
      id: '01',
      name: 'テスト001',
      email: 'test001@example.com',
      status: '在籍中',
    };
    const p2 = {
      id: '02',
      name: 'テスト002',
      email: 'test002@example.com',
      status: '在籍中',
    };
    const p3 = {
      id: '03',
      name: 'テスト003',
      email: 'test003@example.com',
      status: '在籍中',
    };
    const p4 = {
      id: '04',
      name: 'テスト004',
      email: 'test004@example.com',
      status: '在籍中',
    };
    const p5 = {
      id: '05',
      name: 'テスト005',
      email: 'test005@example.com',
      status: '在籍中',
    };
    const p6 = {
      id: '06',
      name: 'テスト006',
      email: 'test006@example.com',
      status: '在籍中',
    };
    const p7 = {
      id: '07',
      name: 'テスト007',
      email: 'test007@example.com',
      status: '在籍中',
    };
    const p8 = {
      id: '08',
      name: 'テスト008',
      email: 'test008@example.com',
      status: '在籍中',
    };
    const p9 = {
      id: '09',
      name: 'テスト009',
      email: 'test009@example.com',
      status: '在籍中',
    };
    const p10 = {
      id: '10',
      name: 'テスト010',
      email: 'test010@example.com',
      status: '休会中',
    };
    const p11 = {
      id: '11',
      name: 'テスト011',
      email: 'test011@example.com',
      status: '在籍中',
    };
    const p12 = {
      id: '12',
      name: 'テスト012',
      email: 'test012@example.com',
      status: '在籍中',
    };
    const p13 = {
      id: '13',
      name: 'テスト013',
      email: 'test013@example.com',
      status: '在籍中',
    };
    const p14 = {
      id: '14',
      name: 'テスト014',
      email: 'test014@example.com',
      status: '在籍中',
    };
    const p15 = {
      id: '15',
      name: 'テスト015',
      email: 'test015@example.com',
      status: '退会済',
    };
    const p16 = {
      id: '16',
      name: 'テスト016',
      email: 'test016@example.com',
      status: '在籍中',
    };
    const p17 = {
      id: '17',
      name: 'テスト017',
      email: 'test017@example.com',
      status: '在籍中',
    };
    const p18 = {
      id: '18',
      name: 'テスト018',
      email: 'test018@example.com',
      status: '在籍中',
    };

    const t1 = { id: '1', title: '課題01', content: '内容01' };
    const t2 = { id: '2', title: '課題02', content: '内容02' };
    const t3 = { id: '3', title: '課題03', content: '内容03' };
    const t4 = { id: '4', title: '課題04', content: '内容04' };

    const ts1 = { id: '01', participantId: '01', taskId: '1', status: '完了' };
    const ts2 = { id: '02', participantId: '02', taskId: '1', status: '完了' };
    const ts3 = { id: '03', participantId: '03', taskId: '1', status: '完了' };
    const ts4 = { id: '04', participantId: '04', taskId: '1', status: '完了' };
    const ts5 = { id: '05', participantId: '05', taskId: '1', status: '完了' };
    const ts6 = { id: '06', participantId: '06', taskId: '1', status: '完了' };
    const ts7 = { id: '07', participantId: '07', taskId: '1', status: '完了' };
    const ts8 = { id: '08', participantId: '08', taskId: '1', status: '完了' };
    const ts9 = { id: '09', participantId: '09', taskId: '1', status: '完了' };
    const ts10 = { id: '10', participantId: '10', taskId: '1', status: '完了' };
    const ts11 = { id: '11', participantId: '11', taskId: '1', status: '完了' };
    const ts12 = { id: '12', participantId: '12', taskId: '1', status: '完了' };
    const ts13 = { id: '13', participantId: '13', taskId: '1', status: '完了' };
    const ts14 = { id: '14', participantId: '14', taskId: '1', status: '完了' };
    const ts15 = { id: '15', participantId: '15', taskId: '1', status: '完了' };
    const ts16 = { id: '16', participantId: '16', taskId: '1', status: '完了' };
    const ts17 = { id: '17', participantId: '17', taskId: '1', status: '完了' };
    const ts18 = { id: '18', participantId: '18', taskId: '1', status: '完了' };

    const ts19 = { id: '19', participantId: '01', taskId: '2', status: '完了' };
    const ts20 = { id: '20', participantId: '02', taskId: '2', status: '完了' };
    const ts21 = { id: '21', participantId: '03', taskId: '2', status: '完了' };
    const ts22 = { id: '22', participantId: '04', taskId: '2', status: '完了' };
    const ts23 = { id: '23', participantId: '05', taskId: '2', status: '完了' };
    const ts24 = { id: '24', participantId: '06', taskId: '2', status: '完了' };
    const ts25 = { id: '25', participantId: '07', taskId: '2', status: '完了' };
    const ts26 = { id: '26', participantId: '08', taskId: '2', status: '完了' };
    const ts27 = { id: '27', participantId: '09', taskId: '2', status: '完了' };
    const ts28 = { id: '28', participantId: '10', taskId: '2', status: '完了' };
    const ts29 = { id: '29', participantId: '11', taskId: '2', status: '完了' };
    const ts30 = { id: '30', participantId: '12', taskId: '2', status: '完了' };
    const ts31 = { id: '31', participantId: '13', taskId: '2', status: '完了' };
    const ts32 = { id: '32', participantId: '14', taskId: '2', status: '完了' };
    const ts33 = { id: '33', participantId: '15', taskId: '2', status: '完了' };
    const ts34 = { id: '34', participantId: '16', taskId: '2', status: '完了' };
    const ts35 = { id: '35', participantId: '17', taskId: '2', status: '完了' };
    const ts36 = { id: '36', participantId: '18', taskId: '2', status: '完了' };

    const ts37 = { id: '37', participantId: '01', taskId: '3', status: '完了' };
    const ts38 = { id: '38', participantId: '02', taskId: '3', status: '完了' };
    const ts39 = { id: '39', participantId: '03', taskId: '3', status: '完了' };
    const ts40 = { id: '40', participantId: '04', taskId: '3', status: '完了' };
    const ts41 = { id: '41', participantId: '05', taskId: '3', status: '完了' };
    const ts42 = { id: '42', participantId: '06', taskId: '3', status: '完了' };
    const ts43 = { id: '43', participantId: '07', taskId: '3', status: '完了' };
    const ts44 = { id: '44', participantId: '08', taskId: '3', status: '完了' };
    const ts45 = {
      id: '45',
      participantId: '09',
      taskId: '3',
      status: 'レビュー待ち',
    };
    const ts46 = {
      id: '46',
      participantId: '10',
      taskId: '3',
      status: 'レビュー待ち',
    };
    const ts47 = {
      id: '47',
      participantId: '11',
      taskId: '3',
      status: 'レビュー待ち',
    };
    const ts48 = {
      id: '48',
      participantId: '12',
      taskId: '3',
      status: 'レビュー待ち',
    };
    const ts49 = {
      id: '49',
      participantId: '13',
      taskId: '3',
      status: 'レビュー待ち',
    };
    const ts50 = {
      id: '50',
      participantId: '14',
      taskId: '3',
      status: 'レビュー待ち',
    };
    const ts51 = {
      id: '51',
      participantId: '15',
      taskId: '3',
      status: '未着手',
    };
    const ts52 = {
      id: '52',
      participantId: '16',
      taskId: '3',
      status: '未着手',
    };
    const ts53 = {
      id: '53',
      participantId: '17',
      taskId: '3',
      status: '未着手',
    };
    const ts54 = {
      id: '54',
      participantId: '18',
      taskId: '3',
      status: '未着手',
    };

    const ts55 = {
      id: '55',
      participantId: '01',
      taskId: '4',
      status: '未着手',
    };
    const ts56 = {
      id: '56',
      participantId: '02',
      taskId: '4',
      status: '未着手',
    };
    const ts57 = {
      id: '57',
      participantId: '03',
      taskId: '4',
      status: '未着手',
    };
    const ts58 = {
      id: '58',
      participantId: '04',
      taskId: '4',
      status: '未着手',
    };
    const ts59 = {
      id: '59',
      participantId: '05',
      taskId: '4',
      status: '未着手',
    };
    const ts60 = {
      id: '60',
      participantId: '06',
      taskId: '4',
      status: '未着手',
    };
    const ts61 = {
      id: '61',
      participantId: '07',
      taskId: '4',
      status: '未着手',
    };
    const ts62 = {
      id: '62',
      participantId: '08',
      taskId: '4',
      status: '未着手',
    };
    const ts63 = {
      id: '63',
      participantId: '09',
      taskId: '4',
      status: '未着手',
    };
    const ts64 = {
      id: '64',
      participantId: '10',
      taskId: '4',
      status: '未着手',
    };
    const ts65 = {
      id: '65',
      participantId: '11',
      taskId: '4',
      status: '未着手',
    };
    const ts66 = {
      id: '66',
      participantId: '12',
      taskId: '4',
      status: '未着手',
    };
    const ts67 = {
      id: '67',
      participantId: '13',
      taskId: '4',
      status: '未着手',
    };
    const ts68 = {
      id: '68',
      participantId: '14',
      taskId: '4',
      status: '未着手',
    };
    const ts69 = {
      id: '69',
      participantId: '15',
      taskId: '4',
      status: '未着手',
    };
    const ts70 = {
      id: '70',
      participantId: '16',
      taskId: '4',
      status: '未着手',
    };
    const ts71 = {
      id: '71',
      participantId: '17',
      taskId: '4',
      status: '未着手',
    };
    const ts72 = {
      id: '72',
      participantId: '18',
      taskId: '4',
      status: '未着手',
    };

    beforeAll(async () => {
      await prisma.participant.createMany({
        data: [
          p1,
          p2,
          p3,
          p4,
          p5,
          p6,
          p7,
          p8,
          p9,
          p10,
          p11,
          p12,
          p13,
          p14,
          p15,
          p16,
          p17,
          p18,
        ],
      });
      await prisma.task.createMany({ data: [t1, t2, t3, t4] });
      await prisma.taskStatus.createMany({
        data: [
          ts1,
          ts2,
          ts3,
          ts4,
          ts5,
          ts6,
          ts7,
          ts8,
          ts9,
          ts10,
          ts11,
          ts12,
          ts13,
          ts14,
          ts15,
          ts16,
          ts17,
          ts18,
          ts19,
          ts20,
          ts21,
          ts22,
          ts23,
          ts24,
          ts25,
          ts26,
          ts27,
          ts28,
          ts29,
          ts30,
          ts31,
          ts32,
          ts33,
          ts34,
          ts35,
          ts36,
          ts37,
          ts38,
          ts39,
          ts40,
          ts41,
          ts42,
          ts43,
          ts44,
          ts45,
          ts46,
          ts47,
          ts48,
          ts49,
          ts50,
          ts51,
          ts52,
          ts53,
          ts54,
          ts55,
          ts56,
          ts57,
          ts58,
          ts59,
          ts60,
          ts61,
          ts62,
          ts63,
          ts64,
          ts65,
          ts66,
          ts67,
          ts68,
          ts69,
          ts70,
          ts71,
          ts72,
        ],
      });
    });
    afterAll(async () => {
      await prisma.taskStatus.deleteMany({});
      await prisma.participant.deleteMany({});
      await prisma.task.deleteMany({});
    });
    test('課題1, 2の進捗が完了の参加者の1ページ目', async () => {
      const result = await qs.getWithPagination(['1', '2'], '完了', 0, 10);
      expect(result).toEqual([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10]);
    });
    test('課題1, 2の進捗が完了の参加者の2ページ目', async () => {
      const result = await qs.getWithPagination(['1', '2'], '完了', 10, 10);
      expect(result).toEqual([p11, p12, p13, p14, p15, p16, p17, p18]);
    });
    test('課題1, 2, 3の進捗が完了の参加者', async () => {
      const result = await qs.getWithPagination(['1', '2', '3'], '完了', 0, 10);
      expect(result).toEqual([p1, p2, p3, p4, p5, p6, p7, p8]);
    });
    test('課題1, 2の進捗が未着手の参加者', async () => {
      const result = await qs.getWithPagination(['1', '2'], '未着手', 0, 10);
      expect(result.length).toBe(0);
    });
    test('課題3の進捗がレビュー待ちの参加者', async () => {
      const result = await qs.getWithPagination(['3'], 'レビュー待ち', 0, 10);
      expect(result).toEqual([p9, p10, p11, p12, p13, p14]);
    });
    test('課題3, 4の進捗が未着手の参加者', async () => {
      const result = await qs.getWithPagination(['3', '4'], '未着手', 0, 10);
      expect(result).toEqual([p15, p16, p17, p18]);
    });
    test('課題4の進捗が未着手の参加者の1ページ目', async () => {
      const result = await qs.getWithPagination(['4'], '未着手', 0, 10);
      expect(result).toEqual([p1, p2, p3, p4, p5, p6, p7, p8, p9, p10]);
    });
    test('課題4の進捗が未着手の参加者の2ページ目', async () => {
      const result = await qs.getWithPagination(['4'], '未着手', 10, 10);
      expect(result).toEqual([p11, p12, p13, p14, p15, p16, p17, p18]);
    });
  });
});

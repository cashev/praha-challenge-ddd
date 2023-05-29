import { prisma } from 'src/testUtil/prisma';
import { ParticipantQS } from '../../query-service/participant-qs';

describe('user-qs.integration.test', () => {
  const userQS = new ParticipantQS(prisma);
  beforeAll(async () => {
    await prisma.participant.deleteMany({});
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('', () => {
    const p1 = { id: '1', name: 'a', email: 'b' };
    beforeAll(async () => {
      await prisma.participant.create({ data: p1 });
    });
    afterEach(async () => {
      await prisma.participant.deleteMany({});
    });
    test('', async () => {
      const result = await userQS.getAll();
      expect(result).toEqual([p1]);
    });
  });
});

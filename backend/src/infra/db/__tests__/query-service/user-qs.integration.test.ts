import { prisma } from "src/testUtil/prisma";
import { UserQS } from "../../query-service/user-qs";

describe('user-qs.integration.test', () => {
    const userQS = new UserQS(prisma);
    beforeAll(async () => {
        await prisma.user.deleteMany({});
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('', () => {
        const u1 = {id: 1, name: 'a', email: 'b', status: 'c'};
        beforeAll(async () => {
            await prisma.user.create({data: u1});
        });
       afterEach(async () => {
        await prisma.user.deleteMany({});
       }) ;
       test('', async () => {
        const result = await userQS.getAll();
        expect(result).toEqual([u1]);
       });
    });
});

import { TaskQS } from "../task-qs";
import { prisma } from 'src/testUtil/prisma';
import { createTestTask } from 'src/testUtil/test-data';

describe('task-qs.integration.test', () => {
    const taskQS = new TaskQS(prisma);

    const deleteTestData = async () => {
        await prisma.task.deleteMany();
    };

    beforeAll(async () => {
        await deleteTestData();
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('getAll', () => {
        beforeAll(async () => {
            await prisma.task.createMany({ data: createTestTask() });
        });

        test('', async () => {
            const result = await taskQS.getAll();
            expect(result.length).toEqual(4);
            expect(result).toEqual([
                { id: 'T001', title: '課題001', content: '内容001' },
                { id: 'T002', title: '課題002', content: '内容002' },
                { id: 'T003', title: '課題003', content: '内容003' },
                { id: 'T004', title: '課題004', content: '内容004' },
            ]);
        });
    });
});

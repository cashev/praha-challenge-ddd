import { Prisma, PrismaClient } from "@prisma/client";
import { promises } from "dns";
const prisma = new PrismaClient();

async function main() {
    const p1 = await prisma.participant.upsert({
        where: { id: '1', },
        update: {},
        create: {
            id: '1',
            name: '谷川 千治',
            email: 'yagawa@cuib.or.jp',
            status: '在籍中',
        }
    });
    const p2 = await prisma.participant.upsert({
        where: { id: '2', },
        update: {},
        create: {
            id: '2',
            name: '丸山 永子',
            email: 'okagan9536@infoseek.co.jp',
            status: '在籍中',
        }
    });
    const p3 = await prisma.participant.upsert({
        where: { id: '3', },
        update: {},
        create: {
            id: '3',
            name: '山本 忠秋',
            email: 'tadaaki@dti.ne.jp',
            status: '在籍中',
        }
    });
    const p4 = await prisma.participant.upsert({
        where: { id: '4', },
        update: {},
        create: {
            id: '4',
            name: '中原 ひびき',
            email: 'rhknnkhr@dion.ne.jp',
            status: '休会中',
        }
    });
    const p5 = await prisma.participant.upsert({
        where: { id: '5', },
        update: {},
        create: {
            id: '5',
            name: '大橋 彩',
            email: 'ay85@nifty.com',
            status: '退会済',
        }
    });
    const pair = await prisma.pair.upsert({
        where: { id: '1' },
        update: {},
        create: {
            id: '1',
            name: 'a',
        },
    });
    await prisma.pair_Participant.createMany({
        data: [
            { pairId: '1', participantId: '1' },
            { pairId: '1', participantId: '2' },
            { pairId: '1', participantId: '3' },
        ],
    })
    const team = await prisma.team.upsert({
        where: { id: '1' },
        update: {},
        create: {
            id: '1',
            name: '1',
        },
    });
    await prisma.team_Pair.create({
        data: { teamId: '1', pairId: '1' },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

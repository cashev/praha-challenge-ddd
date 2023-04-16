import { PrismaClient } from "@prisma/client";
import { createRandomIdString } from "../src/util/random";

const participants = [
    {id: createRandomIdString(), name: '谷川 智美', email: 'tanikawa_tomomi@t-com.ne.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '星野 季雄', email: 'sueo.hosino@example.org', status: '在籍中'},
    {id: createRandomIdString(), name: '茂木 成夫', email: 'moki_nario@example.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '小柳 恵治', email: 'gnyk9598@example.org', status: '在籍中'},
    {id: createRandomIdString(), name: '高田 初美', email: 'htm.tkt@dti.ne.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '荒井 眞八', email: 'sny1976@excite.com', status: '在籍中'},
    {id: createRandomIdString(), name: '杉浦 文典', email: 'huminori.sugiura@tiki.ne.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '田原 完一', email: 'arahat928304@hi-ho.ne.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '大木 玲', email: 'ikoo0315@infoseek.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '小谷 邦煕', email: 'kotanikunihiro@geocities.com', status: '在籍中'},
    {id: createRandomIdString(), name: '近藤 安則', email: 'knduysnr@rakuten.co.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '西沢 治次', email: 'awazisin639@gmo-media.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '久保 健也', email: 'obuk71@example.ad.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '金田 正宣', email: 'masanori.kaneta@dion.ne.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '谷 錦也', email: 'tani@comeon.to', status: '在籍中'},
    {id: createRandomIdString(), name: '金沢 仁美', email: 'kanazawahitomi@mxi.asp.home.ne.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '足立 洋子', email: 'itada0303@combzmail.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '長島 梨恵子', email: 'ngsm_rek@infoweb.ne.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '岸 登喜雄', email: 'oikot1988@example.ne.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '天野 義幸', email: 'kysy74@sannet.ne.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '清水 千代枝', email: 'eoyittiyoe@excite.co.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '本多 雅栄', email: 'adnoh1986@sannet.ne.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '大崎 佳久', email: 'ikasoo739@example.ac.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '谷 洋助', email: 'tani0903@gmail.com', status: '在籍中'},
    {id: createRandomIdString(), name: '白川 真紀', email: 'ikam9120802@dti.ne.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '辻 秀春', email: 'zt@iij.ad.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '小西 志津恵', email: 'euzis@t-com.ne.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '足立 正宣', email: 'adati1981@infoseek.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '榎本 荘介', email: 'sousukeenomoto@hotmail.co.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '平野 礼', email: 'rei1977@infoweb.ne.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '松原 厚史', email: 'matubara70@freeml.co.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '岩崎 梨絵', email: 'rie0731@gmo-media.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '白井 邦江', email: 'kne_srikne_sri@hotmail.co.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '矢野 留美子', email: 'yano0701@livedoor.com', status: '在籍中'},
    {id: createRandomIdString(), name: '小倉 勇四郎', email: 'yusru06yusru06@users.gr.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '内海 武俊', email: 'taketosi1991@sunfield.ne.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '福島 倉美', email: 'amisukuh3860403@combzmail.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '福井 由水', email: 'hukui.yumi@plala.or.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '菅 健也', email: 'nak675211@goo.ne.jp', status: '在籍中'},
    {id: createRandomIdString(), name: '志村 拓夫', email: 'takuo1975@dti.ad.jp', status: '休会中'},
    {id: createRandomIdString(), name: '栗田 ひとみ', email: 'atiruk1975@sunfield.ne.jp', status: '休会中'},
    {id: createRandomIdString(), name: '市川 孝市', email: 'wkti@users.gr.jp', status: '休会中'},
    {id: createRandomIdString(), name: '小原 好行', email: 'ohr6461207@dion.ne.jp', status: '退会済'},
    {id: createRandomIdString(), name: '増田 三佐男', email: 'masuda.misao@example.or.jp', status: '退会済'},
    {id: createRandomIdString(), name: '中田 知生', email: 'tmo-nkt@mxi.asp.home.ne.jp', status: '退会済'},
];

const pairs = [
    {id: createRandomIdString(), name: 'a'},
    {id: createRandomIdString(), name: 'b'},
    {id: createRandomIdString(), name: 'c'},
    {id: createRandomIdString(), name: 'a'},
    {id: createRandomIdString(), name: 'b'},
    {id: createRandomIdString(), name: 'c'},
    {id: createRandomIdString(), name: 'a'},
    {id: createRandomIdString(), name: 'b'},
    {id: createRandomIdString(), name: 'c'},
    {id: createRandomIdString(), name: 'a'},
    {id: createRandomIdString(), name: 'b'},
    {id: createRandomIdString(), name: 'c'},
    {id: createRandomIdString(), name: 'a'},
    {id: createRandomIdString(), name: 'b'},
    {id: createRandomIdString(), name: 'c'},
    {id: createRandomIdString(), name: 'a'},
    {id: createRandomIdString(), name: 'b'},
    {id: createRandomIdString(), name: 'c'},
];

const teams = [
    {id: createRandomIdString(), name: '1'},
    {id: createRandomIdString(), name: '2'},
    {id: createRandomIdString(), name: '3'},
    {id: createRandomIdString(), name: '4'},
    {id: createRandomIdString(), name: '5'},
    {id: createRandomIdString(), name: '6'},
];

const tasks = [
    {id: createRandomIdString(), title: '課題タイトル001', content: '課題内容001'},
    {id: createRandomIdString(), title: '課題タイトル002', content: '課題内容002'},
    {id: createRandomIdString(), title: '課題タイトル003', content: '課題内容003'},
    {id: createRandomIdString(), title: '課題タイトル004', content: '課題内容004'},
    {id: createRandomIdString(), title: '課題タイトル005', content: '課題内容005'},
    {id: createRandomIdString(), title: '課題タイトル006', content: '課題内容006'},
    {id: createRandomIdString(), title: '課題タイトル007', content: '課題内容007'},
    {id: createRandomIdString(), title: '課題タイトル008', content: '課題内容008'},
    {id: createRandomIdString(), title: '課題タイトル009', content: '課題内容009'},
    {id: createRandomIdString(), title: '課題タイトル010', content: '課題内容010'},
    {id: createRandomIdString(), title: '課題タイトル011', content: '課題内容011'},
    {id: createRandomIdString(), title: '課題タイトル012', content: '課題内容012'},
    {id: createRandomIdString(), title: '課題タイトル013', content: '課題内容013'},
    {id: createRandomIdString(), title: '課題タイトル014', content: '課題内容014'},
    {id: createRandomIdString(), title: '課題タイトル015', content: '課題内容015'},
    {id: createRandomIdString(), title: '課題タイトル016', content: '課題内容016'},
    {id: createRandomIdString(), title: '課題タイトル017', content: '課題内容017'},
    {id: createRandomIdString(), title: '課題タイトル018', content: '課題内容018'},
    {id: createRandomIdString(), title: '課題タイトル019', content: '課題内容019'},
    {id: createRandomIdString(), title: '課題タイトル020', content: '課題内容020'},
    {id: createRandomIdString(), title: '課題タイトル021', content: '課題内容021'},
    {id: createRandomIdString(), title: '課題タイトル022', content: '課題内容022'},
    {id: createRandomIdString(), title: '課題タイトル023', content: '課題内容023'},
    {id: createRandomIdString(), title: '課題タイトル024', content: '課題内容024'},
    {id: createRandomIdString(), title: '課題タイトル025', content: '課題内容025'},
    {id: createRandomIdString(), title: '課題タイトル026', content: '課題内容026'},
    {id: createRandomIdString(), title: '課題タイトル027', content: '課題内容027'},
    {id: createRandomIdString(), title: '課題タイトル028', content: '課題内容028'},
    {id: createRandomIdString(), title: '課題タイトル029', content: '課題内容029'},
    {id: createRandomIdString(), title: '課題タイトル030', content: '課題内容030'},
    {id: createRandomIdString(), title: '課題タイトル031', content: '課題内容031'},
    {id: createRandomIdString(), title: '課題タイトル032', content: '課題内容032'},
    {id: createRandomIdString(), title: '課題タイトル033', content: '課題内容033'},
    {id: createRandomIdString(), title: '課題タイトル034', content: '課題内容034'},
    {id: createRandomIdString(), title: '課題タイトル035', content: '課題内容035'},
    {id: createRandomIdString(), title: '課題タイトル036', content: '課題内容036'},
    {id: createRandomIdString(), title: '課題タイトル037', content: '課題内容037'},
    {id: createRandomIdString(), title: '課題タイトル038', content: '課題内容038'},
    {id: createRandomIdString(), title: '課題タイトル039', content: '課題内容039'},
    {id: createRandomIdString(), title: '課題タイトル040', content: '課題内容040'},
    {id: createRandomIdString(), title: '課題タイトル041', content: '課題内容041'},
    {id: createRandomIdString(), title: '課題タイトル042', content: '課題内容042'},
    {id: createRandomIdString(), title: '課題タイトル043', content: '課題内容043'},
    {id: createRandomIdString(), title: '課題タイトル044', content: '課題内容044'},
    {id: createRandomIdString(), title: '課題タイトル045', content: '課題内容045'},
    {id: createRandomIdString(), title: '課題タイトル046', content: '課題内容046'},
    {id: createRandomIdString(), title: '課題タイトル047', content: '課題内容047'},
    {id: createRandomIdString(), title: '課題タイトル048', content: '課題内容048'},
    {id: createRandomIdString(), title: '課題タイトル049', content: '課題内容049'},
    {id: createRandomIdString(), title: '課題タイトル050', content: '課題内容050'},
    {id: createRandomIdString(), title: '課題タイトル051', content: '課題内容051'},
    {id: createRandomIdString(), title: '課題タイトル052', content: '課題内容052'},
    {id: createRandomIdString(), title: '課題タイトル053', content: '課題内容053'},
    {id: createRandomIdString(), title: '課題タイトル054', content: '課題内容054'},
    {id: createRandomIdString(), title: '課題タイトル055', content: '課題内容055'},
    {id: createRandomIdString(), title: '課題タイトル056', content: '課題内容056'},
    {id: createRandomIdString(), title: '課題タイトル057', content: '課題内容057'},
    {id: createRandomIdString(), title: '課題タイトル058', content: '課題内容058'},
    {id: createRandomIdString(), title: '課題タイトル059', content: '課題内容059'},
    {id: createRandomIdString(), title: '課題タイトル060', content: '課題内容060'},
    {id: createRandomIdString(), title: '課題タイトル061', content: '課題内容061'},
    {id: createRandomIdString(), title: '課題タイトル062', content: '課題内容062'},
    {id: createRandomIdString(), title: '課題タイトル063', content: '課題内容063'},
    {id: createRandomIdString(), title: '課題タイトル064', content: '課題内容064'},
    {id: createRandomIdString(), title: '課題タイトル065', content: '課題内容065'},
    {id: createRandomIdString(), title: '課題タイトル066', content: '課題内容066'},
    {id: createRandomIdString(), title: '課題タイトル067', content: '課題内容067'},
    {id: createRandomIdString(), title: '課題タイトル068', content: '課題内容068'},
    {id: createRandomIdString(), title: '課題タイトル069', content: '課題内容069'},
    {id: createRandomIdString(), title: '課題タイトル070', content: '課題内容070'},
    {id: createRandomIdString(), title: '課題タイトル071', content: '課題内容071'},
    {id: createRandomIdString(), title: '課題タイトル072', content: '課題内容072'},
    {id: createRandomIdString(), title: '課題タイトル073', content: '課題内容073'},
    {id: createRandomIdString(), title: '課題タイトル074', content: '課題内容074'},
    {id: createRandomIdString(), title: '課題タイトル075', content: '課題内容075'},
    {id: createRandomIdString(), title: '課題タイトル076', content: '課題内容076'},
    {id: createRandomIdString(), title: '課題タイトル077', content: '課題内容077'},
    {id: createRandomIdString(), title: '課題タイトル078', content: '課題内容078'},
    {id: createRandomIdString(), title: '課題タイトル079', content: '課題内容079'},
    {id: createRandomIdString(), title: '課題タイトル080', content: '課題内容080'},
];

const createTaskStatus = () => {
    const ret = [];
    for (const participant of participants) {
        for (let i = 0; i < 40; i++) {
            const task = tasks[i];
            const taskStatus = {
                id: createRandomIdString(),
                participantId: participant.id,
                taskId: task.id,
                status: '完了'
            }
            ret.push(taskStatus);
        }
        for (let i = 40; i < 50; i++) {
            const task = tasks[i];
            const taskStatus = {
                id: createRandomIdString(),
                participantId: participant.id,
                taskId: task.id,
                status: 'レビュー待ち'
            }
            ret.push(taskStatus);
        }
        for (let i = 50; i < 60; i++) {
            const task = tasks[i];
            const taskStatus = {
                id: createRandomIdString(),
                participantId: participant.id,
                taskId: task.id,
                status: ['未着手', 'レビュー待ち', '完了'][Math.floor(Math.random() * 3)]
            }
            ret.push(taskStatus);
        }
        for (let i = 60; i < 80; i++) {
            const task = tasks[i];
            const taskStatus = {
                id: createRandomIdString(),
                participantId: participant.id,
                taskId: task.id,
                status: '未着手'
            }
            ret.push(taskStatus);
        }
    }
    return ret;
}

const pairParticipants = [
    {pairId: pairs[0].id, participantId: participants[0].id},
    {pairId: pairs[0].id, participantId: participants[1].id},
    {pairId: pairs[1].id, participantId: participants[2].id},
    {pairId: pairs[1].id, participantId: participants[3].id},
    {pairId: pairs[2].id, participantId: participants[4].id},
    {pairId: pairs[2].id, participantId: participants[5].id},
    {pairId: pairs[2].id, participantId: participants[6].id},

    {pairId: pairs[3].id, participantId: participants[7].id},
    {pairId: pairs[3].id, participantId: participants[8].id},
    {pairId: pairs[4].id, participantId: participants[9].id},
    {pairId: pairs[4].id, participantId: participants[10].id},
    {pairId: pairs[5].id, participantId: participants[11].id},
    {pairId: pairs[5].id, participantId: participants[12].id},

    {pairId: pairs[6].id, participantId: participants[13].id},
    {pairId: pairs[6].id, participantId: participants[14].id},
    {pairId: pairs[7].id, participantId: participants[15].id},
    {pairId: pairs[7].id, participantId: participants[16].id},
    {pairId: pairs[8].id, participantId: participants[17].id},
    {pairId: pairs[8].id, participantId: participants[18].id},

    {pairId: pairs[9].id, participantId: participants[19].id},
    {pairId: pairs[9].id, participantId: participants[20].id},
    {pairId: pairs[10].id, participantId: participants[21].id},
    {pairId: pairs[10].id, participantId: participants[22].id},
    {pairId: pairs[11].id, participantId: participants[23].id},
    {pairId: pairs[11].id, participantId: participants[24].id},
    {pairId: pairs[11].id, participantId: participants[25].id},

    {pairId: pairs[12].id, participantId: participants[26].id},
    {pairId: pairs[12].id, participantId: participants[27].id},
    {pairId: pairs[13].id, participantId: participants[28].id},
    {pairId: pairs[13].id, participantId: participants[29].id},
    {pairId: pairs[14].id, participantId: participants[30].id},
    {pairId: pairs[14].id, participantId: participants[31].id},
    {pairId: pairs[14].id, participantId: participants[32].id},

    {pairId: pairs[15].id, participantId: participants[33].id},
    {pairId: pairs[15].id, participantId: participants[34].id},
    {pairId: pairs[16].id, participantId: participants[35].id},
    {pairId: pairs[16].id, participantId: participants[36].id},
    {pairId: pairs[17].id, participantId: participants[37].id},
    {pairId: pairs[17].id, participantId: participants[38].id},
];

const teamPair = [
    {teamId: teams[0].id, pairId: pairs[0].id},
    {teamId: teams[0].id, pairId: pairs[1].id},
    {teamId: teams[0].id, pairId: pairs[2].id},
    {teamId: teams[1].id, pairId: pairs[3].id},
    {teamId: teams[1].id, pairId: pairs[4].id},
    {teamId: teams[1].id, pairId: pairs[5].id},
    
    {teamId: teams[2].id, pairId: pairs[6].id},
    {teamId: teams[2].id, pairId: pairs[7].id},
    {teamId: teams[2].id, pairId: pairs[8].id},
    {teamId: teams[3].id, pairId: pairs[9].id},
    {teamId: teams[3].id, pairId: pairs[10].id},
    {teamId: teams[3].id, pairId: pairs[11].id},
    
    {teamId: teams[4].id, pairId: pairs[12].id},
    {teamId: teams[4].id, pairId: pairs[13].id},
    {teamId: teams[4].id, pairId: pairs[14].id},
    {teamId: teams[5].id, pairId: pairs[15].id},
    {teamId: teams[5].id, pairId: pairs[16].id},
    {teamId: teams[5].id, pairId: pairs[17].id},
];

const teamParticipants = [
    {teamId: teams[0].id, participantId: participants[0].id},
    {teamId: teams[0].id, participantId: participants[1].id},
    {teamId: teams[0].id, participantId: participants[2].id},
    {teamId: teams[0].id, participantId: participants[3].id},
    {teamId: teams[0].id, participantId: participants[4].id},
    {teamId: teams[0].id, participantId: participants[5].id},
    {teamId: teams[0].id, participantId: participants[6].id},
    {teamId: teams[1].id, participantId: participants[7].id},
    {teamId: teams[1].id, participantId: participants[8].id},
    {teamId: teams[1].id, participantId: participants[9].id},
    {teamId: teams[1].id, participantId: participants[10].id},
    {teamId: teams[1].id, participantId: participants[11].id},
    {teamId: teams[1].id, participantId: participants[12].id},

    {teamId: teams[2].id, participantId: participants[13].id},
    {teamId: teams[2].id, participantId: participants[14].id},
    {teamId: teams[2].id, participantId: participants[15].id},
    {teamId: teams[2].id, participantId: participants[16].id},
    {teamId: teams[2].id, participantId: participants[17].id},
    {teamId: teams[2].id, participantId: participants[18].id},
    {teamId: teams[3].id, participantId: participants[19].id},
    {teamId: teams[3].id, participantId: participants[20].id},
    {teamId: teams[3].id, participantId: participants[21].id},
    {teamId: teams[3].id, participantId: participants[22].id},
    {teamId: teams[3].id, participantId: participants[23].id},
    {teamId: teams[3].id, participantId: participants[24].id},
    {teamId: teams[3].id, participantId: participants[25].id},

    {teamId: teams[4].id, participantId: participants[26].id},
    {teamId: teams[4].id, participantId: participants[27].id},
    {teamId: teams[4].id, participantId: participants[28].id},
    {teamId: teams[4].id, participantId: participants[29].id},
    {teamId: teams[4].id, participantId: participants[30].id},
    {teamId: teams[4].id, participantId: participants[31].id},
    {teamId: teams[4].id, participantId: participants[32].id},
    {teamId: teams[5].id, participantId: participants[33].id},
    {teamId: teams[5].id, participantId: participants[34].id},
    {teamId: teams[5].id, participantId: participants[35].id},
    {teamId: teams[5].id, participantId: participants[36].id},
    {teamId: teams[5].id, participantId: participants[37].id},
    {teamId: teams[5].id, participantId: participants[38].id},
];

const prisma = new PrismaClient();
const taskStatus = createTaskStatus();

const deleteData = async () => {
    await prisma.taskStatus.deleteMany();
    await prisma.task.deleteMany();

    await prisma.team_Participant.deleteMany();
    await prisma.team_Pair.deleteMany();
    await prisma.pair_Participant.deleteMany();
    
    await prisma.participant.deleteMany();
    await prisma.pair.deleteMany();
    await prisma.team.deleteMany();
}

async function main() {    
    await deleteData();

    await prisma.participant.createMany({data: participants});
    await prisma.pair.createMany({data: pairs});
    await prisma.team.createMany({data: teams});

    await prisma.pair_Participant.createMany({data: pairParticipants})
    await prisma.team_Participant.createMany({data: teamParticipants})

    await prisma.task.createMany({data: tasks});
    await prisma.taskStatus.createMany({data: taskStatus});
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

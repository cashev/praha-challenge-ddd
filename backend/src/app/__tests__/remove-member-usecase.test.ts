import { Pair } from 'src/domain/entity/pair';
import { Participant, ParticipantIdType } from 'src/domain/entity/participant';
import { Team } from 'src/domain/entity/team';
import { PairName } from 'src/domain/value-object/pairName';
import { ParticipantEmail } from 'src/domain/value-object/participantEmail';
import { ParticipantName } from 'src/domain/value-object/participantName';
import {
  Kyukai,
  Taikai,
  Zaiseki,
} from 'src/domain/value-object/participantStatus';
import { TeamName } from 'src/domain/value-object/teamName';
import { isSome, none, some } from 'fp-ts/lib/Option';
import { RemoveMemberUsecase } from '../remove-member-usecase';
import { MockTeamRepository } from './mock/team-repository';
import { MockParticipantRepository } from './mock/participant-repository';

describe('do', () => {
  const createMockNotificationSender = () => {
    return {
      sendToAdmin: jest.fn(),
    };
  };
  const createParticipantNameQS = () => {
    return {
      getNames: jest.fn().mockResolvedValue(['参加者A', '参加者B', '参加者C']),
    };
  };
  const createTwoMember = () => {
    const p11 = '11' as ParticipantIdType;
    const p12 = '12' as ParticipantIdType;
    return [p11, p12];
  };
  const createThreeMember = () => {
    const p21 = '21' as ParticipantIdType;
    const p22 = '22' as ParticipantIdType;
    const p23 = '23' as ParticipantIdType;
    return [p21, p22, p23];
  };

  test('[正常系] 3人のペアからメンバーを取り除く', async () => {
    const twoMember = createTwoMember();
    const threeMember = createThreeMember();
    const twoPair = Pair.create('1', {
      pairName: PairName.create('a'),
      member: twoMember,
    });
    const threePair = Pair.create('2', {
      pairName: PairName.create('b'),
      member: threeMember,
    });
    const team = Team.create('1', {
      teamName: TeamName.create('1'),
      pairList: [twoPair, threePair],
    });

    const removeParticipant = Participant.create('21', {
      participantName: ParticipantName.create('足立 里香'),
      email: ParticipantEmail.create('adati568@dti.ad.jp'),
      status: Zaiseki,
    });
    const mockParticipantRepo = new MockParticipantRepository(
      some(removeParticipant),
    );
    const mockTeamRepo = new MockTeamRepository(some(team), none);

    const usecase = new RemoveMemberUsecase(
      mockParticipantRepo,
      mockTeamRepo,
      createMockNotificationSender(),
      createParticipantNameQS(),
    );
    await usecase.do('21', Taikai);

    expect(team.member.some((p) => p === removeParticipant.id)).toBeFalsy();
    expect(removeParticipant.status).toEqual(Taikai);
  });

  test('[正常系] 2人のペアからメンバーを取り除く', async () => {
    const twoMember1 = createTwoMember();
    const twoMember2 = createThreeMember().slice(0, 2);
    const twoPair = Pair.create('1', {
      pairName: PairName.create('a'),
      member: twoMember1,
    });
    const threePair = Pair.create('2', {
      pairName: PairName.create('b'),
      member: twoMember2,
    });
    const team = Team.create('1', {
      teamName: TeamName.create('1'),
      pairList: [twoPair, threePair],
    });

    const removeParticipant = Participant.create('21', {
      participantName: ParticipantName.create('足立 里香'),
      email: ParticipantEmail.create('adati568@dti.ad.jp'),
      status: Zaiseki,
    });
    const mockParticipantRepo = new MockParticipantRepository(
      some(removeParticipant),
    );
    const mockTeamRepo = new MockTeamRepository(some(team), none);

    const usecase = new RemoveMemberUsecase(
      mockParticipantRepo,
      mockTeamRepo,
      createMockNotificationSender(),
      createParticipantNameQS(),
    );
    await usecase.do('21', Taikai);

    expect(team.member.some((p) => p === removeParticipant.id)).toBeFalsy();
    expect(removeParticipant.status).toEqual(Taikai);
  });

  test('[異常系] 存在しない参加者id', async () => {
    const mockParticipantRepo = new MockParticipantRepository();
    const mockTeamRepo = new MockTeamRepository();

    const usecase = new RemoveMemberUsecase(
      mockParticipantRepo,
      mockTeamRepo,
      createMockNotificationSender(),
      createParticipantNameQS(),
    );
    const result = await usecase.do('31', Taikai);
    expect(isSome(result)).toBeTruthy();
  });

  test('[異常系] 休会中の参加者', async () => {
    const participant = Participant.create('32', {
      participantName: ParticipantName.create('白石 道和'),
      email: ParticipantEmail.create('siraisi1920902@mail.goo.ne.jp'),
      status: Kyukai,
    });
    const mockParticipantRepo = new MockParticipantRepository(
      some(participant),
    );
    const mockTeamRepo = new MockTeamRepository();

    const usecase = new RemoveMemberUsecase(
      mockParticipantRepo,
      mockTeamRepo,
      createMockNotificationSender(),
      createParticipantNameQS(),
    );
    const result = await usecase.do('32', Kyukai);
    expect(isSome(result)).toBeTruthy();
  });

  test('[異常系] 退会済の参加者', async () => {
    const participant = Participant.create('33', {
      participantName: ParticipantName.create('山村 偉生'),
      email: ParticipantEmail.create('hideoyamamura@freeml.co.jp'),
      status: Taikai,
    });
    const mockParticipantRepo = new MockParticipantRepository(
      some(participant),
    );
    const mockTeamRepo = new MockTeamRepository();

    const usecase = new RemoveMemberUsecase(
      mockParticipantRepo,
      mockTeamRepo,
      createMockNotificationSender(),
      createParticipantNameQS(),
    );
    const result = await usecase.do('33', Taikai);
    expect(isSome(result)).toBeTruthy();
  });

  test('[異常系] 管理者に通知する', async () => {
    const participant = Participant.create('34', {
      participantName: ParticipantName.create('高井 勝夫'),
      email: ParticipantEmail.create('oasam626@hotmail.co.jp'),
      status: Zaiseki,
    });
    const threeMember = createThreeMember();
    const threePair = Pair.create('2', {
      pairName: PairName.create('b'),
      member: threeMember,
    });
    const team = Team.create('1', {
      teamName: TeamName.create('1'),
      pairList: [threePair],
    });
    const mockParticipantRepo = new MockParticipantRepository(
      some(participant),
    );
    const mockTeamRepo = new MockTeamRepository(some(team));

    const usecase = new RemoveMemberUsecase(
      mockParticipantRepo,
      mockTeamRepo,
      createMockNotificationSender(),
      createParticipantNameQS(),
    );
    const result = await usecase.do('34', Taikai);
    expect(isSome(result)).toBeTruthy();
  });
});

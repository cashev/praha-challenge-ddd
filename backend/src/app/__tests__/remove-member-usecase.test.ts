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
import { none, some } from 'fp-ts/lib/Option';
import { RemoveMemberUsecase } from '../remove-member-usecase';
import { MockTeamRepository } from './mock/team-repository';
import { MockParticipantRepository } from './mock/participant-repository';
import { isLeft } from 'fp-ts/lib/Either';
import { MockNotificationSender } from './mock/notification-sender';

describe('do', () => {
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
      name: PairName.create('a'),
      member: twoMember,
    });
    const threePair = Pair.create('2', {
      name: PairName.create('b'),
      member: threeMember,
    });
    const team = Team.create('1', {
      name: TeamName.create('1'),
      pairList: [twoPair, threePair],
    });

    const removeParticipant = Participant.create('21', {
      name: ParticipantName.create('足立 里香'),
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
      new MockNotificationSender(),
      createParticipantNameQS(),
    );
    await usecase.do('21');

    expect(team.member.some((p) => p === removeParticipant.id)).toBeFalsy();
  });

  test('[正常系] 2人のペアからメンバーを取り除く', async () => {
    const twoMember1 = createTwoMember();
    const twoMember2 = createThreeMember().slice(0, 2);
    const twoPair = Pair.create('1', {
      name: PairName.create('a'),
      member: twoMember1,
    });
    const threePair = Pair.create('2', {
      name: PairName.create('b'),
      member: twoMember2,
    });
    const team = Team.create('1', {
      name: TeamName.create('1'),
      pairList: [twoPair, threePair],
    });

    const removeParticipant = Participant.create('21', {
      name: ParticipantName.create('足立 里香'),
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
      new MockNotificationSender(),
      createParticipantNameQS(),
    );
    await usecase.do('21');

    expect(team.member.some((p) => p === removeParticipant.id)).toBeFalsy();
  });

  test('[異常系] 存在しない参加者id', async () => {
    const mockParticipantRepo = new MockParticipantRepository();
    const mockTeamRepo = new MockTeamRepository();

    const usecase = new RemoveMemberUsecase(
      mockParticipantRepo,
      mockTeamRepo,
      new MockNotificationSender(),
      createParticipantNameQS(),
    );
    const result = await usecase.do('31');
    expect(isLeft(result)).toBeTruthy();
  });

  test('[異常系] 休会中の参加者', async () => {
    const participant = Participant.create('32', {
      name: ParticipantName.create('白石 道和'),
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
      new MockNotificationSender(),
      createParticipantNameQS(),
    );
    const result = await usecase.do('32');
    expect(isLeft(result)).toBeTruthy();
  });

  test('[異常系] 退会済の参加者', async () => {
    const participant = Participant.create('33', {
      name: ParticipantName.create('山村 偉生'),
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
      new MockNotificationSender(),
      createParticipantNameQS(),
    );
    const result = await usecase.do('33');
    expect(isLeft(result)).toBeTruthy();
  });

  test('[異常系] 参加者が取り除けないことを管理者に通知する', async () => {
    const participant = Participant.create('34', {
      name: ParticipantName.create('高井 勝夫'),
      email: ParticipantEmail.create('oasam626@hotmail.co.jp'),
      status: Zaiseki,
    });
    const threeMember = createThreeMember();
    const threePair = Pair.create('2', {
      name: PairName.create('b'),
      member: threeMember,
    });
    const team = Team.create('1', {
      name: TeamName.create('1'),
      pairList: [threePair],
    });
    const mockParticipantRepo = new MockParticipantRepository(
      some(participant),
    );
    const mockTeamRepo = new MockTeamRepository(some(team));
    const mockSender = new MockNotificationSender();
    const usecase = new RemoveMemberUsecase(
      mockParticipantRepo,
      mockTeamRepo,
      mockSender,
      createParticipantNameQS(),
    );
    const result = await usecase.do('34');
    expect(isLeft(result)).toBeTruthy();
    expect(mockSender.getAll().length).toBe(1);
  });

  test('[異常系] データ不整合を管理者に通知する', async () => {
    const participant = Participant.create('35', {
      name: ParticipantName.create('田上 澄'),
      email: ParticipantEmail.create('tagami1000011@plala.or.jp'),
      status: Zaiseki,
    });
    const mockParticipantRepo = new MockParticipantRepository(
      some(participant),
    );
    const mockTeamRepo = new MockTeamRepository();
    const mockSender = new MockNotificationSender();
    const usecase = new RemoveMemberUsecase(
      mockParticipantRepo,
      mockTeamRepo,
      mockSender,
      createParticipantNameQS(),
    );
    await expect(() => usecase.do('34')).rejects.toThrow();
    expect(mockSender.getAll().length).toBe(1);
  });
});

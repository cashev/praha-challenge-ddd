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
import { ResignMembershipUsecase } from '../resign-membership-usecase';
import { Option, none, some } from 'fp-ts/lib/Option';

describe('do', () => {
  const createMockParticipantRepo = (
    participant: Participant | null = null,
  ) => {
    return {
      find: jest.fn().mockResolvedValue(some(participant)),
      getNextId: jest.fn(),
      save: jest.fn(),
    };
  };
  const createMockTeamRepo = (team: Option<Team> = none) => {
    return {
      findByParticipantId: jest.fn().mockResolvedValue(team),
      getSmallestTeamList: jest.fn(),
      save: jest.fn(),
    };
  };
  const createMockNotificationSender = () => {
    return {
      sendToAdmin: jest.fn(),
    };
  };
  const createParticipantNameQS = () => {
    return {
      getNames: jest.fn(),
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
    const mockParticipantRepo = createMockParticipantRepo(removeParticipant);
    const mockTeamRepo = createMockTeamRepo(some(team));

    const usecase = new ResignMembershipUsecase(
      mockParticipantRepo,
      mockTeamRepo,
      createMockNotificationSender(),
      createParticipantNameQS(),
    );
    await usecase.do('21');

    expect(team.isMember(removeParticipant)).toBeFalsy();
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
    const mockParticipantRepo = createMockParticipantRepo(removeParticipant);
    const mockTeamRepo = createMockTeamRepo(some(team));

    const usecase = new ResignMembershipUsecase(
      mockParticipantRepo,
      mockTeamRepo,
      createMockNotificationSender(),
      createParticipantNameQS(),
    );
    await usecase.do('21');

    expect(team.isMember(removeParticipant)).toBeFalsy();
    expect(removeParticipant.status).toEqual(Taikai);
  });

  test('[異常系] 存在しない参加者id', async () => {
    const mockParticipantRepo = createMockParticipantRepo();
    const mockTeamRepo = createMockTeamRepo();

    const usecase = new ResignMembershipUsecase(
      mockParticipantRepo,
      mockTeamRepo,
      createMockNotificationSender(),
      createParticipantNameQS(),
    );
    expect(() => usecase.do('31')).rejects.toThrow();
  });

  test('[異常系] 休会中の参加者', async () => {
    const participant = Participant.create('32', {
      participantName: ParticipantName.create('白石 道和'),
      email: ParticipantEmail.create('siraisi1920902@mail.goo.ne.jp'),
      status: Kyukai,
    });
    const mockParticipantRepo = createMockParticipantRepo(participant);
    const mockTeamRepo = createMockTeamRepo();

    const usecase = new ResignMembershipUsecase(
      mockParticipantRepo,
      mockTeamRepo,
      createMockNotificationSender(),
      createParticipantNameQS(),
    );
    expect(() => usecase.do('32')).rejects.toThrow();
  });

  test('[異常系] 退会済の参加者', async () => {
    const participant = Participant.create('33', {
      participantName: ParticipantName.create('山村 偉生'),
      email: ParticipantEmail.create('hideoyamamura@freeml.co.jp'),
      status: Taikai,
    });
    const mockParticipantRepo = createMockParticipantRepo(participant);
    const mockTeamRepo = createMockTeamRepo();

    const usecase = new ResignMembershipUsecase(
      mockParticipantRepo,
      mockTeamRepo,
      createMockNotificationSender(),
      createParticipantNameQS(),
    );
    expect(() => usecase.do('33')).rejects.toThrow();
  });
});

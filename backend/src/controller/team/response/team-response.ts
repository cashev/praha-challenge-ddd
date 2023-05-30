import { ApiProperty } from '@nestjs/swagger';
import { TeamDto } from 'src/app/query-service-interface/team-qs';

export class GetTeamResponse {
  @ApiProperty({ type: () => [TeamData] })
  teamData: TeamData[];

  public constructor(params: { teamDtos: TeamDto[] }) {
    const { teamDtos: teamDtos } = params;
    this.teamData = teamDtos.map((dto) => new TeamData(dto));
  }
}

class TeamData {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  pairs: PairData[];

  public constructor(params: {
    id: string;
    name: string;
    pairs: {
      pairId: string;
      pairName: string;
      participants: {
        participantId: string;
        participantName: string;
        status: string;
      }[];
    }[];
  }) {
    this.id = params.id;
    this.name = params.name;
    this.pairs = params.pairs.map((p) => new PairData(p));
  }
}

class PairData {
  @ApiProperty()
  pairId: string;
  @ApiProperty()
  pairName: string;
  @ApiProperty()
  participants: ParticipantData[];

  constructor(params: {
    pairId: string;
    pairName: string;
    participants: {
      participantId: string;
      participantName: string;
      status: string;
    }[];
  }) {
    this.pairId = params.pairId;
    this.pairName = params.pairName;
    this.participants = params.participants.map((p) => new ParticipantData(p));
  }
}

class ParticipantData {
  @ApiProperty()
  participantId: string;
  @ApiProperty()
  participantName: string;
  @ApiProperty()
  status: string;

  constructor(params: {
    participantId: string;
    participantName: string;
    status: string;
  }) {
    this.participantId = params.participantId;
    this.participantName = params.participantName;
    this.status = params.status;
  }
}

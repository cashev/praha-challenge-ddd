import { ApiProperty } from '@nestjs/swagger';
import { TeamDto } from 'src/app/query-service-interface/team-qs';

export class GetTeamResponse {
  @ApiProperty({ type: () => [TeamData] })
  participantData: TeamData[];

  public constructor(params: { teamDtos: TeamDto[] }) {
    const { teamDtos: teamDtos } = params;
    this.participantData = teamDtos.map(({ id, name }) => {
      return new TeamData({
        id,
        name,
      });
    });
  }
}

class TeamData {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;

  public constructor(params: { id: string; name: string }) {
    this.id = params.id;
    this.name = params.name;
  }
}

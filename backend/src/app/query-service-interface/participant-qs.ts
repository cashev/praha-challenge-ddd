export class ParticipantDto {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly status: string;

  public constructor(props: {
    id: string;
    name: string;
    email: string;
    status: string;
  }) {
    const { id, name, email, status } = props;
    this.id = id;
    this.name = name;
    this.email = email;
    this.status = status;
  }
}

export interface IParticipantQS {
  getAll(): Promise<ParticipantDto[]>;
}

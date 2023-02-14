export class UserDto {
  public readonly id: number;
  public readonly name: string;
  public readonly email: string;

  public constructor(props: { id: number; name: string; email: string }) {
    const { id, name, email } = props;
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

export interface IUserQS {
  getAll(): Promise<UserDto[]>;
}

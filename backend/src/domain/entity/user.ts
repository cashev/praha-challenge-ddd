import { UserEmail } from '../value-object/userEmail';
import { UserName } from '../value-object/userName';
import { UserStatus } from '../value-object/userStatus';
import { Entity } from './entity';

interface UserProps {
  userName: UserName;
  email: UserEmail;
  status: UserStatus;
}

export class User extends Entity<UserProps> {
  get userName(): UserName {
    return this.props.userName;
  }

  set userName(userName: UserName) {
    this.props.userName = userName;
  }

  get email(): UserEmail {
    return this.props.email;
  }

  set email(email: UserEmail) {
    this.props.email = email;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  set status(status: UserStatus) {
    this.props.status = status;
  }

  private constructor(id: number, props: UserProps) {
    super(id, props);
  }

  public static create(id: number, props: UserProps): User {
    return new User(id, props);
  }
}

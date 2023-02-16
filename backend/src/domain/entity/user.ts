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
  private constructor(id: number, props: UserProps) {
    super(id, props);
  }

  public static create(id: number, props: UserProps): User {
    return new User(id, props);
  }
}

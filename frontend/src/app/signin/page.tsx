import { UserProvider } from '@/contexts/user-context';
import SignIn from '../../components/sign-in';

export default function SignInPage() {
  return (
    <div>
      <h1>サインイン画面</h1>
      <UserProvider>
        <SignIn />
      </UserProvider>
    </div>
  );
}

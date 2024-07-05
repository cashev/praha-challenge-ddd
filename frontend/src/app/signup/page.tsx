import { UserProvider } from '@/contexts/user-context';
import SignUp from '../../components/sign-up';

export default function SignUpPage() {
  return (
    <div>
      <h1>サインアップ画面</h1>
      <SignUp />
    </div>
  );
}

'use client';

import { useUser } from '../contexts/user-context';
import { auth } from '../lib/firebase/auth';

export default function SignOut() {
  const { setUser } = useUser();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      alert('ログアウト成功！');
    } catch (error: any) {
      alert(`ログアウト失敗: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={handleSignOut}>ログアウト</button>
    </div>
  );
}

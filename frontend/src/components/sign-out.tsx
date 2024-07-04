'use client';

import { useUser } from '../contexts/user-context';
import { auth } from '../lib/firebase/firebase';

export default function SignOut() {
  const { setUser } = useUser();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      alert('サインアウト成功！');
    } catch (error: any) {
      alert(`サインアウト失敗: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={handleSignOut}>サインアウト</button>
    </div>
  );
}

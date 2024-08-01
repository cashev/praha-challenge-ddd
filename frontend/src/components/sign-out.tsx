'use client';

import { auth } from '../lib/firebase/auth';
import { signOut } from 'next-auth/react';

export default function SignOut() {

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      await signOut();
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

'use client';

import { useState, FormEvent } from 'react';
import { auth } from '../lib/firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { signIn as signInByNextAuth } from 'next-auth/react';

export default function SignIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSignIn = async (e: FormEvent) => {
    if (!email) return;
    if (!password) return;
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      await signInByNextAuth("credentials", { idToken, callbackUrl: "/", });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSignIn}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}

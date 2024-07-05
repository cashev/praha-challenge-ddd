'use client';

import { useState, FormEvent } from 'react';
import { auth } from '../lib/firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useUser } from '../contexts/user-context';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();
  const router = useRouter();

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert('ログイン成功！');

      router.push('/');
    } catch (error: any) {
      setError(error.message);
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}

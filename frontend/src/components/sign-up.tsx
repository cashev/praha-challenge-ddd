'use client';

import { useState, FormEvent } from 'react';
import { auth } from '../lib/firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useUser } from '../contexts/user-context';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();
  const router = useRouter();

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert('新規登録成功！');

      router.push('/');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSignUp}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">新規登録</button>
      </form>
    </div>
  );
}

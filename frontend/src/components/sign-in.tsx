'use client';

import { useState, FormEvent } from 'react';
import { auth } from '../lib/firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useUser } from '../contexts/user-context';

export default function SignIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert('サインイン成功！');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>サインイン</h2>
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
        <button type="submit">サインイン</button>
      </form>
    </div>
  );
}

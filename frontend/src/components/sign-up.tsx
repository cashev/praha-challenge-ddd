'use client';

import { useState, FormEvent } from 'react';
import { auth } from '../lib/firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useUser } from '../contexts/user-context';

export default function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      alert('サインアップ成功！');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>サインアップ</h2>
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
        <button type="submit">サインアップ</button>
      </form>
    </div>
  );
}

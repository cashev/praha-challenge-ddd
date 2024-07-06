import { auth } from '../lib/firebase/auth';

export const getIdToken = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    localStorage.setItem('idToken', token);
    return token;
  }
  return null;
};

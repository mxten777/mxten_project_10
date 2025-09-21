import React from 'react';
import { signInAnonymously, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useAuthStore } from '../stores/authStore';

export const AuthButton: React.FC = () => {
  const { uid, isAnonymous, loading, setAuth, setLoading } = useAuthStore();

  React.useEffect(() => {
    setLoading(true);
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuth(user.uid, user.isAnonymous);
      } else {
        setAuth(null as any, false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [setAuth, setLoading]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInAnonymously(auth);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <button className="px-4 py-2 bg-gray-300 rounded" disabled>Loading...</button>;
  if (uid) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">{isAnonymous ? '익명' : '로그인'}: {uid.slice(0, 6)}...</span>
        <button className="px-3 py-1 bg-red-200 rounded hover:bg-red-300" onClick={handleLogout}>로그아웃</button>
      </div>
    );
  }
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleLogin}>
      익명 로그인
    </button>
  );
};

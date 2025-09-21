import { db, functions, getHttpsCallable } from './firebase';
import { getDocs, query, orderBy, limit, collection } from 'firebase/firestore';

export async function saveGameRun(run: {
  uid: string;
  score: number;
  ballsUsed: number;
  combos: number;
  createdAt: Date;
}) {
  const saveGameRunFn = getHttpsCallable(functions, 'saveGameRun');
  await saveGameRunFn({ ...run });
}

export async function getLeaderboard(topN = 10) {
  const q = query(collection(db, 'runs'), orderBy('score', 'desc'), limit(topN));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}

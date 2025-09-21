import React from 'react';
import { getLeaderboard } from '../utils/firestoreGame';

interface LeaderboardItem {
  uid: string;
  score: number;
}

const Leaderboard: React.FC = () => {
  const [items, setItems] = React.useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getLeaderboard(10).then((data) => {
      setItems(data as LeaderboardItem[]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded shadow w-full max-w-xs">
      <div className="font-bold text-center mb-2 dark:text-yellow-200">Leaderboard</div>
      {loading ? (
        <div className="text-center text-gray-400 dark:text-gray-300">Loading...</div>
      ) : (
        <ol className="space-y-1">
          {items.map((item, i) => {
            let crown = '';
            let rowClass = '';
            let scoreClass = '';
            if (i === 0) {
              crown = '👑';
              rowClass = 'bg-yellow-100 dark:bg-yellow-900 animate-leaderboard-pop';
              scoreClass = 'text-yellow-600 dark:text-yellow-200';
            } else if (i === 1) {
              crown = '🥈';
              rowClass = 'bg-gray-100 dark:bg-gray-700 animate-leaderboard-pop';
              scoreClass = 'text-gray-600 dark:text-gray-200';
            } else if (i === 2) {
              crown = '🥉';
              rowClass = 'bg-orange-100 dark:bg-orange-900 animate-leaderboard-pop';
              scoreClass = 'text-orange-600 dark:text-orange-200';
            } else {
              rowClass = 'bg-white dark:bg-gray-900';
              scoreClass = 'dark:text-yellow-200';
            }
            return (
              <li key={i} className={`flex justify-between px-2 py-1 rounded items-center font-mono ${rowClass}`}>
                <span className="flex items-center gap-1">
                  {crown && <span className="text-xl">{crown}</span>}
                  {i + 1}. {item.uid.slice(0, 6)}...
                </span>
                <span className={`font-bold ${scoreClass}`}>{item.score}</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;

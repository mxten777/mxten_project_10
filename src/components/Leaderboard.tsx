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
    <div className="p-3 bg-gradient-to-r from-gray-100/80 to-yellow-50/80 dark:from-gray-800/80 dark:to-yellow-900/80 rounded-xl shadow w-full h-24 flex flex-col justify-center items-center">
      <div className="font-bold text-sm dark:text-yellow-200 flex items-center gap-2 mb-2">
        <span className="text-lg">🏆</span>
        <span>리더보드</span>
      </div>
      {loading ? (
        <div className="text-center text-gray-400 dark:text-gray-300 text-xs">로딩중...</div>
      ) : (
        <div className="text-center text-sm">
          {items.length > 0 ? `1위: ${items[0].score.toLocaleString()}점` : '기록 없음'}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

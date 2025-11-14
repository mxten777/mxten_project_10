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
    <div className="p-4 sm:p-6 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl shadow-lg w-full min-h-[100px] flex flex-col justify-center items-center">
      <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
        <div className="font-bold text-base sm:text-lg flex items-center gap-2 sm:gap-3 text-white">
          <span className="text-xl sm:text-2xl">🏆</span>
          <span>리더보드</span>
        </div>
        {loading ? (
          <div className="text-center text-yellow-100 text-sm font-semibold">로딩중...</div>
        ) : (
          <div className="text-center text-sm sm:text-base font-bold text-white">
            {items.length > 0 
              ? `1위: ${items[0].score.toLocaleString()}점` 
              : '기록 없음'
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

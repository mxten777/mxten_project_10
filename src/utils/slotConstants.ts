// 슬롯머신 관련 상수 및 타입

export const SYMBOLS = {
  numbers: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
};

export const SYMBOL_PAYOUTS: Record<string, number> = {
  '1️⃣': 10,
  '2️⃣': 5,
  '3️⃣': 10,
  '4️⃣': 5,
  '5️⃣': 10,
  '6️⃣': 5,
  '7️⃣': 20,
  '8️⃣': 5,
  '9️⃣': 10
};

export const PAYLINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

export function getWeightedRandomSymbol(): string {
  // 숫자 3개가 더 자주 나오게 가중치 적용
  const pool = [
    '1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣',
    // 3개씩 추가로 확률 증가
    '1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣',
    '1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣',
    // 3개가 더 자주 나오게
    '3️⃣','3️⃣','3️⃣',
    '7️⃣','7️⃣','7️⃣',
    '1️⃣','1️⃣','1️⃣',
    '5️⃣','5️⃣','5️⃣',
    '9️⃣','9️⃣','9️⃣'
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomSymbols(): string[] {
  return Array(9).fill(0).map(() => getWeightedRandomSymbol());
}

export function getRandomSymbol(): string {
  return getWeightedRandomSymbol();
}

export interface WinResult {
  line: number[];
  symbol: string;
  payout: number;
  multiplier: number;
}

export function checkWinningCombinations(symbols: string[]): WinResult[] {
  const wins: WinResult[] = [];
  PAYLINES.forEach((line) => {
    const [pos1, pos2, pos3] = line;
    const symbol1 = symbols[pos1];
    const symbol2 = symbols[pos2];
    const symbol3 = symbols[pos3];
    const isWild = (sym: string) => sym === '🌟';
    if (symbol1 === symbol2 && symbol2 === symbol3 && !isWild(symbol1)) {
      wins.push({
        line,
        symbol: symbol1,
        payout: SYMBOL_PAYOUTS[symbol1] || 1,
        multiplier: 1
      });
    } else if (isWild(symbol1) || isWild(symbol2) || isWild(symbol3)) {
      const nonWildSymbols = [symbol1, symbol2, symbol3].filter(s => !isWild(s));
      if (nonWildSymbols.length >= 2 && nonWildSymbols[0] === nonWildSymbols[1]) {
        wins.push({
          line,
          symbol: nonWildSymbols[0],
          payout: SYMBOL_PAYOUTS[nonWildSymbols[0]] || 1,
          multiplier: 2
        });
      }
    }
  });
  return wins;
}

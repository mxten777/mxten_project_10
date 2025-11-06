// 슬롯머신 관련 상수 및 타입

export const SYMBOLS = {
  low: ['🎊', '⚡', '🔥'],
  medium: ['💰', '🎯', '🍀'],
  high: ['💥', '🌟', '💎'],
  special: ['🌟', '💥']
};

export const SYMBOL_PAYOUTS: Record<string, number> = {
  '🎊': 2,
  '⚡': 3,
  '🔥': 3,
  '💰': 4,
  '🎯': 5,
  '🍀': 6,
  '💥': 8,
  '🌟': 8,
  '💎': 10
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
  const random = Math.random();
  if (random < 0.45) return SYMBOLS.low[Math.floor(Math.random() * SYMBOLS.low.length)];
  if (random < 0.75) return SYMBOLS.medium[Math.floor(Math.random() * SYMBOLS.medium.length)];
  if (random < 0.92) return SYMBOLS.high[Math.floor(Math.random() * SYMBOLS.high.length)];
  return SYMBOLS.special[Math.floor(Math.random() * SYMBOLS.special.length)];
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

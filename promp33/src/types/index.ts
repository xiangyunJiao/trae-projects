export interface ZodiacSign {
  id: number;
  name: string;
  symbol: string;
  dateRange: string;
  startAngle: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  amount: number;
}

export interface ZodiacRank {
  zodiacId: number;
  user: User | null;
}

export interface ActivityData {
  topUser: User;
  zodiacRanks: ZodiacRank[];
}

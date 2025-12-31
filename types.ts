
export type Category = 'Food' | 'Hotel' | 'Transport' | 'Shopping' | 'Others';

export interface Member {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  photo: string;
  referralCode: string;
  totalInvites: number;
  totalRewards: number;
}

export type Language = 'Hinglish' | 'Hindi' | 'English';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export type SplitType = 'equal' | 'custom';

export interface Split {
  memberId: string;
  amount: number;
}

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  amount: number;
  paidBy: string; // memberId
  category: Category;
  splitType: SplitType;
  splits: Split[];
  note?: string;
  date: string;
  isSettlement?: boolean;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  members: Member[];
  totalExpense: number;
  image?: string;
  location?: string;
}

export interface Settlement {
  from: string; // memberId
  to: string;   // memberId
  amount: number;
}

export interface MemberBalance {
  memberId: string;
  paid: number;
  shouldPay: number;
  balance: number;
}

export interface AppSettings {
  language: Language;
  theme: 'light' | 'dark';
  currency: Currency;
  primaryColor: string;
}

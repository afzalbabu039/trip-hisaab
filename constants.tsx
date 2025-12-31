import { Trip, Expense, Category } from './types';

export const COLORS = {
  primary: '#2979FF',
  secondary: '#00C853',
  gray: '#E0E0E0',
  text: '#1F2937',
  bg: '#F9FAFB'
};

export const CATEGORY_ICONS: Record<Category, string> = {
  'Food': '🍴',
  'Hotel': '🏨',
  'Transport': '🚕',
  'Shopping': '🛍️',
  'Others': '✨'
};

const RAUL_ID = 'm1';
const PRIYA_ID = 'm2';
const AKASH_ID = 'm3';
const ANYA_ID = 'm4';
const AFZAL_ID = 'm5';
const DANISH_ID = 'm6';
const SARATJ_ID = 'm7';

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 't1',
    name: 'Goa Beach Trip',
    startDate: '2025-12-15',
    endDate: '2025-12-18',
    members: [
      { id: RAUL_ID, name: 'Rahul', phone: '9876543210' },
      { id: PRIYA_ID, name: 'Priya', phone: '9123456780' },
      { id: AKASH_ID, name: 'Akash', phone: '9988776655' },
      { id: ANYA_ID, name: 'Anya', phone: '9000011111' }
    ],
    totalExpense: 18500,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't2',
    name: 'Manali Snow Trip',
    startDate: '2026-01-10',
    endDate: '2026-01-14',
    members: [
       { id: RAUL_ID, name: 'Rahul', phone: '9876543210' },
       { id: PRIYA_ID, name: 'Priya', phone: '9123456780' },
       { id: AKASH_ID, name: 'Akash', phone: '9988776655' }
    ],
    totalExpense: 24000,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't3',
    name: 'Kolkata Trip',
    startDate: '2025-11-20',
    endDate: '2025-11-23',
    members: [
       { id: AFZAL_ID, name: 'Afzal', phone: '9812345678' },
       { id: DANISH_ID, name: 'Danish', phone: '9876543210' },
       { id: SARATJ_ID, name: 'Saratj', phone: '9012345678' }
    ],
    totalExpense: 12000,
    image: 'https://images.unsplash.com/photo-1558431382-27e39cbef4bc?auto=format&fit=crop&q=80&w=400',
    location: 'Kolkata, West Bengal'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'e1',
    tripId: 't1',
    title: 'Hotel Booking',
    amount: 8000,
    paidBy: RAUL_ID,
    category: 'Hotel',
    splitType: 'equal',
    splits: [
      { memberId: RAUL_ID, amount: 2000 },
      { memberId: PRIYA_ID, amount: 2000 },
      { memberId: AKASH_ID, amount: 2000 },
      { memberId: ANYA_ID, amount: 2000 }
    ],
    date: '2025-12-15'
  },
  {
    id: 'e2',
    tripId: 't1',
    title: 'Dinner at Shack',
    amount: 3500,
    paidBy: PRIYA_ID,
    category: 'Food',
    splitType: 'equal',
    splits: [
      { memberId: RAUL_ID, amount: 875 },
      { memberId: PRIYA_ID, amount: 875 },
      { memberId: AKASH_ID, amount: 875 },
      { memberId: ANYA_ID, amount: 875 }
    ],
    date: '2025-12-16'
  },
  {
    id: 'e3',
    tripId: 't1',
    title: 'Taxi Charges',
    amount: 7000,
    paidBy: AKASH_ID,
    category: 'Transport',
    splitType: 'custom',
    splits: [
      { memberId: RAUL_ID, amount: 500 },
      { memberId: PRIYA_ID, amount: 1000 },
      { memberId: AKASH_ID, amount: 300 },
      { memberId: ANYA_ID, amount: 5200 }
    ],
    date: '2025-12-17'
  }
];

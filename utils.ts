
import { Trip, Expense, MemberBalance, Settlement, Category } from './types';

export const formatCurrency = (amount: number, currencyCode: string = 'INR'): string => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (e) {
    // Fallback for unsupported currency codes or environments
    return `${currencyCode} ${amount.toLocaleString('en-IN')}`;
  }
};

export const calculateBalances = (trip: Trip, expenses: Expense[]): MemberBalance[] => {
  const balances: Record<string, MemberBalance> = {};
  
  trip.members.forEach(m => {
    balances[m.id] = {
      memberId: m.id,
      paid: 0,
      shouldPay: 0,
      balance: 0
    };
  });

  expenses.forEach(exp => {
    // Add to payer's total paid
    if (balances[exp.paidBy]) {
      balances[exp.paidBy].paid += exp.amount;
    }

    // Add to everyone's share
    exp.splits.forEach(s => {
      if (balances[s.memberId]) {
        balances[s.memberId].shouldPay += s.amount;
      }
    });
  });

  Object.values(balances).forEach(b => {
    b.balance = b.paid - b.shouldPay;
  });

  return Object.values(balances);
};

export const getSettlements = (balances: MemberBalance[]): Settlement[] => {
  const settlements: Settlement[] = [];
  const credit = balances.filter(b => b.balance > 0.01).map(b => ({ ...b }));
  const debit = balances.filter(b => b.balance < -0.01).map(b => ({ ...b, balance: Math.abs(b.balance) }));

  let i = 0, j = 0;
  while (i < credit.length && j < debit.length) {
    const amount = Math.min(credit[i].balance, debit[j].balance);
    if (amount > 0.01) {
      settlements.push({
        from: debit[j].memberId,
        to: credit[i].memberId,
        amount
      });
    }

    credit[i].balance -= amount;
    debit[j].balance -= amount;

    if (credit[i].balance <= 0.01) i++;
    if (debit[j].balance <= 0.01) j++;
  }

  return settlements;
};

export const getCategoryStats = (expenses: Expense[]): Record<Category, number> => {
  const stats: Record<Category, number> = {
    'Food': 0,
    'Hotel': 0,
    'Transport': 0,
    'Shopping': 0,
    'Others': 0
  };
  expenses.forEach(e => {
    if (!e.isSettlement) {
      stats[e.category] += e.amount;
    }
  });
  return stats;
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

const STORAGE_KEY = 'finance_app_data';

const defaultData = {
  fixedExpenses: [
    {
      id: '1',
      name: 'Credit casă - CEC Bank',
      amount: 0,
      category: 'credit',
      bank: 'CEC Bank',
    },
    {
      id: '2',
      name: 'Credit apartament - UniCredit',
      amount: 0,
      category: 'credit',
      bank: 'UniCredit',
    },
  ],
  dailyExpenses: [],
  incomes: [],
  categories: [
    'Mâncare',
    'Haine',
    'Cheltuieli Personale',
    'Carburant',
    'Leasing Mașini',
    'Transport',
    'Cafea & Băuturi',
    'Distracție',
    'Abonamente',
    'Sănătate',
    'Casa',
    'Altele',
  ],
  incomeCategories: [
    'Salariu',
    'Freelance',
    'Dividende',
    'Chirie',
    'Bonus',
    'Altele',
  ],
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    return JSON.parse(raw);
  } catch {
    return defaultData;
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getMonthlyExpenses(dailyExpenses, year, month) {
  return dailyExpenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export function getTotalFixed(fixedExpenses) {
  return fixedExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
}

export function getTotalDaily(expenses) {
  return expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
}

export function groupByCategory(expenses) {
  const groups = {};
  expenses.forEach((e) => {
    if (!groups[e.category]) {
      groups[e.category] = { total: 0, count: 0, items: [] };
    }
    groups[e.category].total += e.amount;
    groups[e.category].count += 1;
    groups[e.category].items.push(e);
  });
  return groups;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'short',
  });
}

export const MONTHS_RO = [
  'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
  'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie',
];

export const CATEGORY_COLORS = {
  'Mâncare': '#ef4444',
  'Haine': '#8b5cf6',
  'Cheltuieli Personale': '#ec4899',
  'Carburant': '#f59e0b',
  'Leasing Mașini': '#d97706',
  'Transport': '#3b82f6',
  'Cafea & Băuturi': '#a16207',
  'Distracție': '#db2777',
  'Abonamente': '#0891b2',
  'Sănătate': '#059669',
  'Casa': '#ea580c',
  'Altele': '#64748b',
  'credit': '#dc2626',
  'leasing': '#d97706',
};

export function getMonthlyIncomes(incomes, year, month) {
  return (incomes || []).filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export function getTotalIncome(incomes) {
  return (incomes || []).reduce((sum, e) => sum + (e.amount || 0), 0);
}

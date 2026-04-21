// Data constants, seed functions, i18n, and formatters
// Adapted from Claude Design's data.jsx

export const CATEGORIES = [
  { id: 'food',     ro: 'Mâncare',        en: 'Food',           icon: '🍜', color: 'oklch(0.78 0.14 30)',  glow: 'oklch(0.78 0.14 30 / 0.5)' },
  { id: 'coffee',   ro: 'Cafea & Băuturi',en: 'Coffee & Drinks',icon: '☕', color: 'oklch(0.72 0.12 65)',  glow: 'oklch(0.72 0.12 65 / 0.5)' },
  { id: 'transport',ro: 'Transport',      en: 'Transport',      icon: '🚗', color: 'oklch(0.72 0.15 235)', glow: 'oklch(0.72 0.15 235 / 0.5)' },
  { id: 'shopping', ro: 'Cumpărături',    en: 'Shopping',       icon: '🛍', color: 'oklch(0.74 0.18 320)', glow: 'oklch(0.74 0.18 320 / 0.5)' },
  { id: 'fun',      ro: 'Distracție',     en: 'Fun',            icon: '🎉', color: 'oklch(0.78 0.17 15)',  glow: 'oklch(0.78 0.17 15 / 0.5)' },
  { id: 'health',   ro: 'Sănătate',       en: 'Health',         icon: '💊', color: 'oklch(0.76 0.15 170)', glow: 'oklch(0.76 0.15 170 / 0.5)' },
  { id: 'home',     ro: 'Casă',           en: 'Home',           icon: '🏠', color: 'oklch(0.72 0.12 285)', glow: 'oklch(0.72 0.12 285 / 0.5)' },
  { id: 'other',    ro: 'Altele',         en: 'Other',          icon: '◌',  color: 'oklch(0.7 0.04 250)',  glow: 'oklch(0.7 0.04 250 / 0.4)' },
];

export const INCOME_CATS = [
  { id: 'salary',    ro: 'Salariu',    en: 'Salary',    icon: '💼', color: 'oklch(0.78 0.17 155)' },
  { id: 'freelance', ro: 'Freelance',  en: 'Freelance', icon: '💻', color: 'oklch(0.78 0.15 200)' },
  { id: 'dividends', ro: 'Dividende',  en: 'Dividends', icon: '📈', color: 'oklch(0.78 0.15 140)' },
  { id: 'rent',      ro: 'Chirie',     en: 'Rent',      icon: '🏘', color: 'oklch(0.78 0.15 280)' },
  { id: 'bonus',     ro: 'Bonus',      en: 'Bonus',     icon: '🎁', color: 'oklch(0.78 0.15 65)' },
];

export const FIXED = [
  { id: 'f1', nameRo: 'Rată apartament',       nameEn: 'Mortgage',         amount: 2450, dueDay: 12, icon: '🏠' },
  { id: 'f2', nameRo: 'Leasing mașină',        nameEn: 'Car lease',        amount: 890,  dueDay: 20, icon: '🚙' },
  { id: 'f3', nameRo: 'Abonament Digi',        nameEn: 'Digi subscription',amount: 55,   dueDay: 5,  icon: '📡' },
  { id: 'f4', nameRo: 'Asigurare locuință',    nameEn: 'Home insurance',   amount: 48,   dueDay: 8,  icon: '🛡' },
  { id: 'f5', nameRo: 'Curent & Gaz',          nameEn: 'Utilities',        amount: 340,  dueDay: 25, icon: '⚡' },
  { id: 'f6', nameRo: 'Abonament sală',        nameEn: 'Gym membership',   amount: 199,  dueDay: 1,  icon: '🏋' },
];

export const GOALS = [
  { id: 'g1', nameRo: 'Vacanță Japonia',   nameEn: 'Japan trip',      target: 12000, saved: 7850, deadline: '2026-10-01' },
  { id: 'g2', nameRo: 'Fond de urgență',   nameEn: 'Emergency fund',  target: 25000, saved: 18200, deadline: '2027-01-01' },
  { id: 'g3', nameRo: 'Laptop nou',        nameEn: 'New laptop',      target: 9500,  saved: 3400, deadline: '2026-08-15' },
];

export const T = {
  ro: {
    brand_tag: 'Banii tăi au acum un plan.',
    search: 'Caută...',
    nav: {
      dashboard: 'Panou', calendar: 'Calendar', income: 'Venituri',
      fixed: 'Fixe', daily: 'Zilnice', goals: 'Obiective',
      analysis: 'Analiză', reports: 'Rapoarte', health: 'Sănătate',
      loans: 'Împrumuturi', settings: 'Setări',
    },
    dashboard_sub: 'Bună dimineața, Andrei',
    balance_label: 'Balanță luna asta',
    income_this_month: 'Venituri',
    expenses_this_month: 'Cheltuieli',
    vs_last: 'vs luna trecută',
    categories: 'Categorii',
    spent: 'Cheltuiți',
    recent: 'Activitate recentă',
    see_all: 'Vezi toate',
    trend_30d: 'Cheltuieli — ultimele 30 zile',
    upcoming: 'Ce urmează să plătești',
    goals: 'Obiective',
    health: 'Sănătate financiară',
    health_sub: 'Scor bazat pe venit, cheltuieli și economii',
    today_spend: 'Cheltuit azi',
    avg_per_day: 'Medie/zi',
    largest: 'Cea mai mare',
    daily_title: 'Cheltuieli zilnice',
    daily_sub: 'Ce s-a întâmplat cu banii tăi',
    add_expense: 'Adaugă cheltuială',
    scan_receipt: 'Scanează bon',
    search_expenses: 'Caută cheltuieli...',
    filter_all: 'Toate',
    cal_title: 'Calendar',
    cal_sub: 'Vizualizare lunară',
    savings: 'Economii',
    saved_of: 'din',
    income_title: 'Venituri',
    income_sub: 'De unde vin banii',
    add_income: 'Adaugă venit',
    insights_title: 'Sugestii',
    fixed_title: 'Cheltuieli fixe',
    fixed_sub: 'Abonamente, rate și utilități',
    monthly: 'lunar',
    settings_title: 'Setări',
    settings_sub: 'Personalizează MoneyPulse',
    add_expense_title: 'Adaugă cheltuială',
    add_expense_sub: 'Urmărește exact unde se duc banii',
    what: 'Ce ai cumpărat?',
    amount: 'Sumă',
    category: 'Categorie',
    date: 'Data',
    cancel: 'Anulează',
    save: 'Salvează',
    mon: 'Lun', tue: 'Mar', wed: 'Mie', thu: 'Joi', fri: 'Vin', sat: 'Sâm', sun: 'Dum',
    today: 'Azi', yesterday: 'Ieri',
    goals_title: 'Obiective',
    goals_sub: 'Ce-ți propui și cât ai strâns',
    analysis_title: 'Analiză',
    analysis_sub: 'Unde poți face economii',
    reports_title: 'Rapoarte',
    reports_sub: 'Export și sinteze',
    health_title: 'Sănătate financiară',
    health_page_sub: 'Măsoară-ți echilibrul',
    top_spenders: 'Top cheltuieli',
    loans_title: 'Împrumuturi',
    loans_sub: 'Bani dați și de recuperat',
    add_loan: 'Adaugă împrumut',
    loan_to: 'Cui ai împrumutat?',
    loan_amount: 'Sumă',
    loan_date: 'Data',
    loan_note: 'Notă (opțional)',
    loan_status_active: 'De recuperat',
    loan_status_paid: 'Returnat',
    loan_total_out: 'Total de recuperat',
    loan_mark_paid: 'Marchează returnat',
    loan_mark_unpaid: 'Marchează nereturat',
    loan_no_loans: 'Nu ai împrumuturi active',
    loan_no_loans_sub: 'Adaugă un împrumut când dai bani cuiva',
    loan_history: 'Istoric',
    loan_active: 'Active',
  },
  en: {
    brand_tag: 'Your money just got smarter.',
    search: 'Search...',
    nav: {
      dashboard: 'Dashboard', calendar: 'Calendar', income: 'Income',
      fixed: 'Fixed', daily: 'Daily', goals: 'Goals',
      analysis: 'Analysis', reports: 'Reports', health: 'Health',
      loans: 'Loans', settings: 'Settings',
    },
    dashboard_sub: 'Good morning, Andrei',
    balance_label: 'Balance this month',
    income_this_month: 'Income',
    expenses_this_month: 'Expenses',
    vs_last: 'vs last month',
    categories: 'Categories',
    spent: 'Spent',
    recent: 'Recent activity',
    see_all: 'See all',
    trend_30d: 'Spending — last 30 days',
    upcoming: 'Upcoming bills',
    goals: 'Goals',
    health: 'Financial health',
    health_sub: 'Score based on income, spending, and savings',
    today_spend: 'Today',
    avg_per_day: 'Avg / day',
    largest: 'Largest',
    daily_title: 'Daily expenses',
    daily_sub: 'Where your money went',
    add_expense: 'Add expense',
    scan_receipt: 'Scan receipt',
    search_expenses: 'Search expenses...',
    filter_all: 'All',
    cal_title: 'Calendar',
    cal_sub: 'Monthly view',
    savings: 'Savings',
    saved_of: 'of',
    income_title: 'Income',
    income_sub: 'Where the money comes from',
    add_income: 'Add income',
    insights_title: 'Insights',
    fixed_title: 'Fixed expenses',
    fixed_sub: 'Subscriptions, installments and utilities',
    monthly: 'monthly',
    settings_title: 'Settings',
    settings_sub: 'Personalize MoneyPulse',
    add_expense_title: 'Add expense',
    add_expense_sub: 'Track exactly where money goes',
    what: 'What did you buy?',
    amount: 'Amount',
    category: 'Category',
    date: 'Date',
    cancel: 'Cancel',
    save: 'Save',
    mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
    today: 'Today', yesterday: 'Yesterday',
    goals_title: 'Goals',
    goals_sub: 'What you aim for and what you saved',
    analysis_title: 'Analysis',
    analysis_sub: 'Where you can save',
    reports_title: 'Reports',
    reports_sub: 'Exports and summaries',
    health_title: 'Financial health',
    health_page_sub: 'Track your balance',
    top_spenders: 'Top expenses',
    loans_title: 'Loans',
    loans_sub: 'Money lent & to collect',
    add_loan: 'Add loan',
    loan_to: 'Who did you lend to?',
    loan_amount: 'Amount',
    loan_date: 'Date',
    loan_note: 'Note (optional)',
    loan_status_active: 'To collect',
    loan_status_paid: 'Returned',
    loan_total_out: 'Total to collect',
    loan_mark_paid: 'Mark as returned',
    loan_mark_unpaid: 'Mark as not returned',
    loan_no_loans: 'No active loans',
    loan_no_loans_sub: 'Add a loan when you lend money to someone',
    loan_history: 'History',
    loan_active: 'Active',
  },
};

export const MONTHS_RO = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];
export const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export function fmt(n, { lang = 'ro' } = {}) {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  const [int, dec] = abs.toFixed(2).split('.');
  const withSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'ro' ? '.' : ',');
  return `${sign}${withSep}${dec === '00' ? '' : (lang === 'ro' ? ',' : '.') + dec}`;
}

export function fmtShort(n) {
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return Math.round(n).toString();
}

export function catById(id) { return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]; }
export function incomeCatById(id) { return INCOME_CATS.find(c => c.id === id) || INCOME_CATS[0]; }

export function seedExpenses() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const dayCur = today.getDate();

  const templates = [
    ['Mic-dejun Origo',         'Breakfast Origo',       28,  'coffee',   0],
    ['Supermarket Mega',        'Mega grocery',          184, 'food',     0],
    ['Uber centru',             'Uber downtown',         24,  'transport',0],
    ['Cafenea Beans&Dots',      'Beans&Dots café',       19,  'coffee',   -1],
    ['Farmacia Sensiblu',       'Sensiblu pharmacy',     42,  'health',   -1],
    ['Prânz Mahala',            'Mahala lunch',          85,  'food',     -1],
    ['Benzinărie OMV',          'OMV gas station',       310, 'transport',-2],
    ['Zara — jachetă',          'Zara — jacket',         299, 'shopping', -2],
    ['Spotify Family',          'Spotify Family',        29,  'fun',      -3],
    ['Cină Lacrimi și Sfinți',  'Dinner L&S',            148, 'food',     -3],
    ['IKEA — lampă',            'IKEA — lamp',           169, 'home',     -4],
    ['Cinema City',             'Cinema City',           52,  'fun',      -4],
    ['Mic-dejun acasă',         'Groceries Carrefour',   94,  'food',     -5],
    ['Parcare Muzeu',           'Museum parking',        15,  'transport',-5],
    ['Librăria Cărturești',     'Bookshop Cărturești',   78,  'shopping', -6],
    ['Covrig + cappuccino',     'Pretzel + cappuccino',  18,  'coffee',   -6],
    ['Netflix',                 'Netflix',               45,  'fun',      -7],
    ['Glovo — cină',            'Glovo — dinner',        67,  'food',     -7],
    ['Bolt',                    'Bolt',                  32,  'transport',-8],
    ['Emag — căști',            'Emag — earbuds',        420, 'shopping', -9],
    ['Piața Obor',              'Obor market',           55,  'food',     -10],
    ['Apă Aqua Carpatica',      'Sparkling water',       12,  'coffee',   -10],
    ['Fitness Pass',            'Fitness Pass',          220, 'health',   -11],
    ['Gelato Fratelli',         'Fratelli gelato',       22,  'fun',      -12],
    ['Carrefour — pâine',       'Carrefour — bread',     38,  'food',     -12],
    ['Decathlon',               'Decathlon',             140, 'shopping', -13],
    ['Metroul',                 'Subway',                8,   'transport',-14],
    ['Brunch Origo',            'Brunch Origo',          96,  'food',     -14],
    ['Poster — decorațiune',    'Poster — decor',        54,  'home',     -15],
    ['Cafea Ted\'s',            'Ted\'s coffee',         17,  'coffee',   -16],
    ['Dentist control',         'Dental checkup',        180, 'health',   -17],
    ['Taxi aeroport',           'Airport taxi',          95,  'transport',-18],
    ['Restaurant Kané',         'Kané restaurant',       210, 'food',     -19],
  ];

  return templates
    .map((t, i) => {
      const [nameRo, nameEn, amount, category, off] = t;
      const d = new Date(y, m, Math.max(1, dayCur + off));
      return {
        id: `exp-${i}`,
        nameRo, nameEn,
        amount,
        category,
        date: d.toISOString().slice(0, 10),
      };
    })
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === y && d.getMonth() === m;
    });
}

export function seedIncomes() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  return [
    { id: 'inc-1', nameRo: 'Salariu Aprilie', nameEn: 'April salary', amount: 9800, category: 'salary',    date: new Date(y, m, Math.min(5, today.getDate())).toISOString().slice(0, 10) },
    { id: 'inc-2', nameRo: 'Proiect freelance', nameEn: 'Freelance gig', amount: 3200, category: 'freelance', date: new Date(y, m, Math.min(12, today.getDate())).toISOString().slice(0, 10) },
    { id: 'inc-3', nameRo: 'Dividende ETF', nameEn: 'ETF dividends', amount: 480, category: 'dividends', date: new Date(y, m, Math.min(15, today.getDate())).toISOString().slice(0, 10) },
    { id: 'inc-4', nameRo: 'Chirie garsonieră', nameEn: 'Studio rent', amount: 1600, category: 'rent', date: new Date(y, m, Math.min(3, today.getDate())).toISOString().slice(0, 10) },
  ];
}

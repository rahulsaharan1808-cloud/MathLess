import { useState, useEffect } from 'react';

// ==========================================
// 🌍 CURRENCY & COUNTRY CODE DATA
// ==========================================
const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.0 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 150.0 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 7.2 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.36 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.52 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.34 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.9 },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', rate: 1330.0 }
];

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳' },
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+971', flag: '🇦🇪' },
  { code: '+65', flag: '🇸🇬' },
  { code: '+61', flag: '🇦🇺' }
];

// ==========================================
// 🎨 MINIMAL LIGHT THEME WRAPPER
// ==========================================
const MinimalScreenWrapper = ({ children }) => (
  <div className="min-h-screen bg-[#FFFFE3] font-sans text-[#4A4A4A] relative overflow-x-hidden selection:bg-[#BDDDFC] selection:text-[#384959]">
    <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#CFFFDC]/70 via-[#FFFFE3]/20 to-transparent"></div>
    <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#BDDDFC]/20 to-transparent pointer-events-none z-0"></div>
    {children}
  </div>
);

// ==========================================
// 🧩 SHARED NAVIGATION COMPONENT
// ==========================================
const SharedNav = ({ onHome, onProfile, onLogin, title, user }) => (
  <nav className="relative z-50 w-full bg-[#FFFFE3]/90 backdrop-blur-md border-b border-[#CBCBCB] p-4 md:p-6 flex justify-between items-center shadow-sm">
    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={onHome}>
      <div className="w-10 h-10 bg-[#2E6F40] rounded-xl flex items-center justify-center shadow-md">
        <span className="text-white text-xl font-bold">/</span>
      </div>
      <div>
        <h1 className="text-xl font-black tracking-tight text-[#253D2C]">MathLess</h1>
        {title && <p className="text-[#6A89A7] text-xs font-bold uppercase tracking-widest">{title}</p>}
      </div>
    </div>
    <div className="flex gap-3">
      {user ? (
        <button onClick={onProfile} className="text-sm font-bold text-[#384959] hover:text-[#253D2C] bg-white hover:bg-[#BDDDFC] px-5 py-2.5 rounded-full transition-colors border border-[#CBCBCB] flex items-center gap-2 shadow-sm">
          <span>👤</span> {user.name.split(' ')[0]}
        </button>
      ) : (
        <button onClick={onLogin} className="text-sm font-bold text-[#384959] hover:text-[#253D2C] bg-white hover:bg-[#BDDDFC] px-5 py-2.5 rounded-full transition-colors border border-[#CBCBCB] shadow-sm">
          Log in
        </button>
      )}
      <button onClick={onHome} className="hidden sm:block text-sm font-bold text-[#384959] hover:text-[#253D2C] bg-white hover:bg-[#BDDDFC] px-5 py-2.5 rounded-full transition-colors border border-[#CBCBCB] shadow-sm">
        Back Home
      </button>
    </div>
  </nav>
);

// ==========================================
// 🚀 MAIN APP FUNCTION
// ==========================================
export default function App() {
  useEffect(() => {
    document.title = "MathLess - Split smarter. Settle faster.";
  }, []);

  // --- 💾 DATABASE INIT ---
  const initStorage = (key, defaultVal) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultVal;
  };

  // Global App State
  const [currentView, setCurrentView] = useState('landing'); 
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  
  // User Authentication & Database State
  const [usersDb, setUsersDb] = useState(() => initStorage('mathless_users_db', []));
  const [user, setUser] = useState(() => initStorage('mathless_active_user', null));
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  // Platform Data States (Tied to active user)
  const [expenses, setExpenses] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [billHistory, setBillHistory] = useState([]);

  // Split Bill Form State
  const [billName, setBillName] = useState("");
  const [totalBill, setTotalBill] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [displayCurrency, setDisplayCurrency] = useState("INR");
  const [splitType, setSplitType] = useState("equal");
  const [isCalculating, setIsCalculating] = useState(false);
  const [participants, setParticipants] = useState([
    { id: 1, name: "", phoneCode: "+91", phone: "", paid: "", customShare: "" },
    { id: 2, name: "", phoneCode: "+91", phone: "", paid: "", customShare: "" }
  ]);
  const [settlementPlan, setSettlementPlan] = useState([]);

  // Tracker Form
  const [newExpName, setNewExpName] = useState("");
  const [newExpAmount, setNewExpAmount] = useState("");
  const [newExpCategory, setNewExpCategory] = useState("Food");

  // --- SESSION MANAGEMENT (LOAD USER DATA) ---
  useEffect(() => {
    if (user) {
      const currentUserData = usersDb.find(u => u.email === user.email);
      if (currentUserData) {
        setExpenses(currentUserData.expenses || []);
        setReminders(currentUserData.reminders || []);
        setBillHistory(currentUserData.history || []);
        setCurrency(user.defaultCurrency);
        setDisplayCurrency(user.defaultCurrency);
      }
    } else {
      setExpenses([]);
      setReminders([]);
      setBillHistory([]);
      setCurrency("INR");
      setDisplayCurrency("INR");
    }
  }, [user?.email]);

  // --- AUTO-SAVE DATA TO SPECIFIC USER ACCOUNT ---
  useEffect(() => {
    if (user) {
      setUsersDb(prevDb => prevDb.map(u => 
        u.email === user.email 
          ? { ...u, expenses, reminders, history: billHistory, defaultCurrency: user.defaultCurrency }
          : u
      ));
    }
  }, [expenses, reminders, billHistory, user?.defaultCurrency]);

  // --- SYNC DB TO LOCAL STORAGE ---
  useEffect(() => { localStorage.setItem('mathless_users_db', JSON.stringify(usersDb)); }, [usersDb]);
  useEffect(() => { localStorage.setItem('mathless_active_user', JSON.stringify(user)); }, [user]);

  const activeCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  
  const convertCurrency = (amount, fromCode, toCode) => {
    const fromRate = CURRENCIES.find(c => c.code === fromCode)?.rate || 1;
    const toRate = CURRENCIES.find(c => c.code === toCode)?.rate || 1;
    return (amount * (toRate / fromRate)).toFixed(2);
  };

  // --- NAVIGATION ACTIONS ---
  const goHome = () => setCurrentView('landing');
  const goProfile = () => setCurrentView('profile');
  const goLogin = () => setCurrentView('login');

  // --- AUTH ACTIONS ---
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) return alert("Please fill all fields.");
      if (usersDb.some(u => u.email === authEmail)) return alert("Email is already registered. Please sign in.");
      
      const newUser = {
        name: authName.trim(),
        email: authEmail.trim(),
        password: authPassword.trim(),
        defaultCurrency: "INR",
        expenses: [],
        reminders: [],
        history: []
      };
      
      setUsersDb([...usersDb, newUser]);
      setUser({ name: newUser.name, email: newUser.email, defaultCurrency: "INR" });
      setCurrentView('dashboard');
      
    } else {
      const existingUser = usersDb.find(u => u.email === authEmail.trim() && u.password === authPassword.trim());
      if (existingUser) {
        setUser({ name: existingUser.name, email: existingUser.email, defaultCurrency: existingUser.defaultCurrency });
        setCurrentView('dashboard');
      } else {
        alert("Invalid email or password. Please try again.");
      }
    }
    
    setAuthName(""); setAuthEmail(""); setAuthPassword("");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  const updateDefaultCurrency = (newCurrency) => {
    if (user) {
      setUser({ ...user, defaultCurrency: newCurrency });
      setCurrency(newCurrency);
      setDisplayCurrency(newCurrency);
    }
  };

  // --- SPLIT BILL ACTIONS ---
  const addParticipant = () => {
    setParticipants([...participants, { id: Date.now(), name: "", phoneCode: "+91", phone: "", paid: "", customShare: "" }]);
  };

  const removeParticipant = (id) => {
    if (participants.length > 2) setParticipants(participants.filter(p => p.id !== id));
  };

  const updateParticipant = (id, field, value) => {
    setParticipants(participants.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  
  const startNewBill = () => {
    setBillName(""); setTotalBill(""); setSplitType("equal");
    setCurrency(user ? user.defaultCurrency : "INR"); 
    setDisplayCurrency(user ? user.defaultCurrency : "INR");
    setParticipants([{ id: 1, name: "", phoneCode: "+91", phone: "", paid: "", customShare: "" }, { id: 2, name: "", phoneCode: "+91", phone: "", paid: "", customShare: "" }]);
    setSettlementPlan([]); setCurrentView('main');
  };

  const handleAddExpense = () => {
    if (!newExpName || !newExpAmount) return;
    setExpenses([{ id: Date.now(), name: newExpName, amount: parseFloat(newExpAmount), category: newExpCategory }, ...expenses]);
    setNewExpName(""); setNewExpAmount("");
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // --- WHATSAPP SHARE ---
  const shareToWhatsApp = () => {
    let text = `💸 *${billName || 'MathLess Settlement'}*\nTotal: ${activeCurrency.symbol}${parsedTotalBill}\n\n*Who Pays Whom:*\n`;
    
    if (settlementPlan.length === 0) {
      text += "Everyone is perfectly settled up! 🎉\n";
    } else {
      settlementPlan.forEach(t => { 
        text += `• ${t.from} pays ${t.to}: *${activeCurrency.symbol}${t.amount}*\n`; 
      });
    }
    
    text += `\n_Calculated via MathLess_ ⚡`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // --- VALIDATIONS ---
  const parsedTotalBill = parseFloat(totalBill) || 0;
  const totalPaid = participants.reduce((sum, p) => sum + (parseFloat(p.paid) || 0), 0);
  const totalCustomShares = participants.reduce((sum, p) => sum + (parseFloat(p.customShare) || 0), 0);
  const hasEmptyNames = participants.some(p => p.name.trim() === "");
  const participantNames = participants.map(p => p.name.trim().toLowerCase());
  const hasDuplicateNames = new Set(participantNames).size !== participantNames.length && participantNames.filter(n => n).length > 0;
  
  const isPaidValid = Math.abs(totalPaid - parsedTotalBill) < 0.01 && parsedTotalBill > 0;
  const isCustomValid = Math.abs(totalCustomShares - parsedTotalBill) < 0.01;
  const canCalculate = isPaidValid && !hasEmptyNames && !hasDuplicateNames && (splitType === 'equal' || isCustomValid);

  // --- NETTING LOGIC (FINALIZED DEBTS) ---
  const getNetPendingDebts = (remindersList) => {
    const balances = {};
    remindersList.filter(r => !r.isPaid).forEach(rem => {
      let from = rem.from;
      let to = rem.to;
      let amount = parseFloat(rem.amount);

      if (!from || !to) {
        const parts = rem.text.split(' owes ');
        if (parts.length === 2) {
          from = parts[0].trim();
          to = parts[1].split(' for ')[0].trim();
        }
      }

      if (from && to && !isNaN(amount)) {
        const fKey = from.toLowerCase();
        const tKey = to.toLowerCase();
        if (!balances[fKey]) balances[fKey] = { originalName: from, owes: {} };
        if (!balances[tKey]) balances[tKey] = { originalName: to, owes: {} };

        balances[fKey].owes[tKey] = (balances[fKey].owes[tKey] || 0) + amount;
        balances[tKey].owes[fKey] = (balances[tKey].owes[fKey] || 0) - amount;
      }
    });

    const netDebts = [];
    const processed = new Set();

    Object.keys(balances).forEach(personA => {
      Object.keys(balances[personA].owes).forEach(personB => {
        const pairKey = [personA, personB].sort().join('|');
        if (!processed.has(pairKey)) {
          processed.add(pairKey);
          const netAmount = balances[personA].owes[personB];
          if (netAmount > 0.01) {
            netDebts.push({ from: balances[personA].originalName, to: balances[personB].originalName, amount: netAmount });
          } else if (netAmount < -0.01) {
            netDebts.push({ from: balances[personB].originalName, to: balances[personA].originalName, amount: Math.abs(netAmount) });
          }
        }
      });
    });
    return netDebts;
  };

  const settleNetDebt = (personA, personB) => {
    const pA = personA.toLowerCase();
    const pB = personB.toLowerCase();
    
    const updatedReminders = reminders.map(rem => {
      if (rem.isPaid) return rem;
      
      let from = (rem.from || "").toLowerCase();
      let to = (rem.to || "").toLowerCase();
      
      if (!from || !to) {
        const parts = rem.text.split(' owes ');
        if (parts.length === 2) {
          from = parts[0].trim().toLowerCase();
          to = parts[1].split(' for ')[0].trim().toLowerCase();
        }
      }
      
      if ((from === pA && to === pB) || (from === pB && to === pA)) {
        return { ...rem, isPaid: true };
      }
      return rem;
    });
    setReminders(updatedReminders);
  };

  // --- SETTLEMENT ALGORITHM ---
  const executeCalculation = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const balances = participants.map(p => {
        const paid = parseFloat(p.paid) || 0;
        const fairShare = splitType === 'equal' ? parsedTotalBill / participants.length : parseFloat(p.customShare) || 0;
        return { name: p.name.trim(), paid, fairShare, balance: paid - fairShare };
      });

      let debtors = balances.filter(b => b.balance < -0.01).map(b => ({ ...b, balance: Math.abs(b.balance) }));
      let creditors = balances.filter(b => b.balance > 0.01);
      let transactions = [];
      let d = 0, c = 0;

      while (d < debtors.length && c < creditors.length) {
        let debtor = debtors[d]; let creditor = creditors[c];
        let amount = Math.min(debtor.balance, creditor.balance);
        transactions.push({ id: Math.random().toString(36).slice(2, 11), from: debtor.name, to: creditor.name, amount: amount.toFixed(2), isSettled: false });
        debtor.balance -= amount; creditor.balance -= amount;
        if (debtor.balance < 0.01) d++;
        if (creditor.balance < 0.01) c++;
      }

      const newHistoryItem = {
        id: Date.now(), 
        name: billName || "Unnamed Bill", 
        date: new Date().toLocaleDateString(),
        total: parsedTotalBill, 
        currency: currency, 
        participantsCount: participants.length,
        participantsDetail: balances,
        settlements: transactions
      };
      setBillHistory([newHistoryItem, ...billHistory]);

      if (transactions.length > 0 && billName) {
        const newReminders = transactions.map(tx => ({
          id: Math.random().toString(36).slice(2, 11),
          text: `${tx.from} owes ${tx.to} for ${billName}`,
          from: tx.from,
          to: tx.to,
          amount: tx.amount,
          isPaid: false
        }));
        setReminders([...newReminders, ...reminders]);
      }

      setSettlementPlan(transactions);
      setIsCalculating(false);
      setDisplayCurrency(currency);
      setCurrentView('results');
    }, 600); 
  };

  const toggleSettlement = (id) => setSettlementPlan(plan => plan.map(t => t.id === id ? { ...t, isSettled: !t.isSettled } : t));

  const copyToClipboard = () => {
    let text = `💸 *${billName || 'MathLess Settlement'}*\nTotal: ${activeCurrency.symbol}${parsedTotalBill}\n\n*Who Pays Whom:*\n`;
    if (settlementPlan.length === 0) text += "Everyone is settled!\n";
    else settlementPlan.forEach(t => { text += `• ${t.from} pays ${t.to}: ${activeCurrency.symbol}${t.amount}\n`; });
    navigator.clipboard.writeText(text);
    alert("Settlement plan copied to clipboard!");
  };

  // ==========================================
  // VIEW 1: SPLIT BILL (MAIN)
  // ==========================================
  if (currentView === 'main') {
    return (
      <MinimalScreenWrapper>
        <SharedNav onHome={goHome} onProfile={goProfile} onLogin={goLogin} user={user} title="Let MathLess handle the math"/>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-20 grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#CBCBCB] shadow-md rounded-[2rem] p-8">
              <h2 className="text-sm font-bold text-[#6A89A7] tracking-widest uppercase mb-6 flex items-center gap-2">
                <span>01.</span> Bill Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#4A4A4A] mb-2">Bill Name</label>
                  <input 
                    type="text" placeholder="e.g. Dinner" 
                    className="w-full bg-[#FFFFE3] border border-[#CBCBCB] rounded-2xl p-4 text-[#253D2C] outline-none focus:border-[#2E6F40] transition-colors font-bold placeholder-[#6D8196]" 
                    value={billName} onChange={e => setBillName(e.target.value)} 
                  />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/3">
                    <label className="block text-sm font-bold text-[#4A4A4A] mb-2">Currency</label>
                    <select 
                      className="w-full bg-[#FFFFE3] border border-[#CBCBCB] rounded-2xl p-4 text-[#253D2C] outline-none focus:border-[#2E6F40] transition-colors font-bold appearance-none cursor-pointer"
                      value={currency} onChange={e => setCurrency(e.target.value)}
                    >
                      {CURRENCIES.map(c => <option key={c.code} value={c.code} className="bg-white">{c.code}</option>)}
                    </select>
                  </div>
                  <div className="w-2/3">
                    <label className="block text-sm font-bold text-[#4A4A4A] mb-2">Total Bill</label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-[#6A89A7] font-black">{activeCurrency.symbol}</span>
                      <input 
                        type="number" placeholder="0.00" 
                        className="w-full bg-[#FFFFE3] border border-[#CBCBCB] rounded-2xl p-4 pl-10 text-[#253D2C] outline-none focus:border-[#2E6F40] transition-colors font-black text-lg placeholder-[#6D8196]" 
                        value={totalBill} onChange={e => setTotalBill(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#CBCBCB] shadow-md rounded-[2rem] p-8">
               <h2 className="text-sm font-bold text-[#6A89A7] tracking-widest uppercase mb-6 flex items-center gap-2">
                <span>02.</span> Split Method
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setSplitType('equal')} 
                  className={`p-6 rounded-2xl text-left transition-all border ${splitType === 'equal' ? 'bg-[#BDDDFC] border-[#88BDF2]' : 'bg-[#FFFFE3] border-[#CBCBCB] hover:border-[#6A89A7]'}`}
                >
                  <div className="text-2xl mb-2">⚖️</div>
                  <div className="font-bold text-[#253D2C] mb-1">Equal Split</div>
                  <div className="text-xs font-medium text-[#4A4A4A] leading-tight">Everyone pays exactly the same amount.</div>
                </button>
                <button 
                  onClick={() => setSplitType('custom')} 
                  className={`p-6 rounded-2xl text-left transition-all border ${splitType === 'custom' ? 'bg-[#CFFFDC] border-[#68BA7F]' : 'bg-[#FFFFE3] border-[#CBCBCB] hover:border-[#6A89A7]'}`}
                >
                  <div className="text-2xl mb-2">✨</div>
                  <div className="font-bold text-[#253D2C] mb-1">Custom Split</div>
                  <div className="text-xs font-medium text-[#4A4A4A] leading-tight">Specify exact amounts for each person.</div>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[#CBCBCB] shadow-md rounded-[2rem] p-6 md:p-8 min-h-full flex flex-col">
              <div className="flex justify-between items-end mb-6 border-b border-[#CBCBCB] pb-6">
                <h2 className="text-sm font-bold text-[#6A89A7] tracking-widest uppercase flex items-center gap-2">
                  <span>03.</span> Who&apos;s Involved?
                </h2>
                <div className={`text-sm font-bold flex items-center gap-2 ${isPaidValid ? 'text-[#2E6F40]' : 'text-[#384959]'}`}>
                  Recorded: {activeCurrency.symbol}{totalPaid.toFixed(2)} / {activeCurrency.symbol}{parsedTotalBill.toFixed(2)}
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {participants.map((p, index) => {
                  const paidAmount = parseFloat(p.paid) || 0;
                  return (
                    <div key={p.id} className="bg-[#FFFFE3] border border-[#CBCBCB] p-4 md:p-5 rounded-2xl transition-all relative overflow-hidden">
                      <div className="flex flex-col md:flex-row gap-4 relative z-10">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#BDDDFC] border border-[#88BDF2] flex items-center justify-center font-black text-[#384959]">
                              {p.name.charAt(0).toUpperCase() || '?'}
                            </div>
                            <input 
                              type="text" placeholder={`Person ${index + 1}`} 
                              className="w-full bg-transparent border-b border-[#CBCBCB] focus:border-[#2E6F40] pb-1 text-lg font-bold text-[#253D2C] outline-none transition-colors placeholder-[#6D8196]" 
                              value={p.name} onChange={e => updateParticipant(p.id, 'name', e.target.value)} 
                            />
                          </div>
                          <div className="flex bg-white rounded-xl border border-[#CBCBCB] overflow-hidden focus-within:border-[#2E6F40] transition-colors">
                            <select 
                              className="bg-transparent text-[#6A89A7] font-bold p-2 text-xs border-r border-[#CBCBCB] outline-none appearance-none px-3"
                              value={p.phoneCode} onChange={e => updateParticipant(p.id, 'phoneCode', e.target.value)}
                            >
                              {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                            </select>
                            <input 
                              type="tel" placeholder="Phone (Optional)" 
                              className="w-full bg-transparent p-2 text-sm text-[#4A4A4A] outline-none font-medium placeholder-[#6D8196]"
                              value={p.phone} onChange={e => updateParticipant(p.id, 'phone', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 items-start">
                          <div className="relative w-full md:w-28">
                            <div className="text-xs font-bold text-[#6A89A7] mb-1 pl-1">Already Paid</div>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-[#6D8196] font-black text-sm">{activeCurrency.symbol}</span>
                              <input 
                                type="number" placeholder="0" 
                                className="w-full bg-white border border-[#CBCBCB] rounded-xl p-2 pl-7 text-[#253D2C] outline-none focus:border-[#68BA7F] transition-colors font-black" 
                                value={p.paid} onChange={e => updateParticipant(p.id, 'paid', e.target.value)} 
                              />
                            </div>
                          </div>
                          
                          {splitType === 'custom' && (
                            <div className="relative w-full md:w-28">
                              <div className="text-xs font-bold text-[#384959] mb-1 pl-1">Their Share</div>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-[#6D8196] font-black text-sm">{activeCurrency.symbol}</span>
                                <input 
                                  type="number" placeholder="0" 
                                  className="w-full bg-white border border-[#CBCBCB] rounded-xl p-2 pl-7 text-[#253D2C] outline-none focus:border-[#88BDF2] transition-colors font-black" 
                                  value={p.customShare} onChange={e => updateParticipant(p.id, 'customShare', e.target.value)} 
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col justify-between h-[60px] items-end ml-2">
                             {participants.length > 2 ? (
                              <button onClick={() => removeParticipant(p.id)} className="text-[#6D8196] hover:text-[#4A4A4A] transition-colors p-1" title="Remove">✕</button>
                             ) : <div></div>}
                             {paidAmount > 0 && <div className="text-[10px] font-black uppercase tracking-wider text-[#2E6F40] bg-[#CFFFDC] px-2 py-1 rounded-md">Paid</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-[#CBCBCB] pt-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <button onClick={addParticipant} className="text-sm font-bold text-[#384959] hover:text-[#253D2C] bg-white hover:bg-[#BDDDFC] px-6 py-3 rounded-xl transition-colors border border-[#CBCBCB] flex items-center gap-2 w-full md:w-auto justify-center">
                  <span>+</span> Add Person
                </button>
                <div className="flex-1 w-full text-right">
                  {!isPaidValid && parsedTotalBill > 0 && (
                    <div className="text-xs font-bold text-[#4A4A4A]">
                      Payments ({activeCurrency.symbol}{totalPaid}) must equal Total ({activeCurrency.symbol}{parsedTotalBill}).
                    </div>
                  )}
                  {splitType === 'custom' && !isCustomValid && parsedTotalBill > 0 && (
                    <div className="text-xs font-bold text-[#4A4A4A]">
                      Shares ({activeCurrency.symbol}{totalCustomShares}) must equal Total.
                    </div>
                  )}
                </div>
              </div>

              <button 
                disabled={!canCalculate || isCalculating} 
                onClick={executeCalculation} 
                className={`w-full mt-6 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                  canCalculate 
                  ? 'bg-[#2E6F40] hover:bg-[#253D2C] text-white shadow-md cursor-pointer' 
                  : 'bg-[#CBCBCB] text-[#6D8196] cursor-not-allowed'
                }`}
              >
                {isCalculating ? (
                  <><span className="animate-spin text-2xl leading-none">⟳</span> Calculating...</>
                ) : (
                  <>Calculate Settlement <span className="text-xl leading-none">→</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      </MinimalScreenWrapper>
    );
  }

  // ==========================================
  // VIEW 2: RESULTS / SETTLEMENT & WHATSAPP
  // ==========================================
  if (currentView === 'results') {
    const dispCurrObj = CURRENCIES.find(c => c.code === displayCurrency) || CURRENCIES[0];
    
    return (
      <MinimalScreenWrapper>
        <SharedNav onHome={goHome} onProfile={goProfile} onLogin={goLogin} user={user} title="Settlement Plan"/>
        <div className="relative z-10 w-full max-w-3xl mx-auto bg-white border border-[#CBCBCB] shadow-lg rounded-[2.5rem] p-6 md:p-12 mt-10 mb-20">
          <div className="text-center mb-10 border-b border-[#CBCBCB] pb-10 relative">
            <div className="text-[#2E6F40] font-bold text-xs tracking-widest uppercase mb-3 mt-2">Settlement Complete</div>
            <h2 className="text-4xl md:text-5xl font-black text-[#253D2C] mb-6">{billName || "MathLess Summary"}</h2>
            <div className="inline-flex flex-col items-center bg-[#FFFFE3] border border-[#CBCBCB] rounded-2xl p-4 min-w-[200px]">
              <span className="text-[#6A89A7] font-bold text-xs uppercase mb-1">Total Bill</span>
              <span className="font-black text-3xl text-[#253D2C]">{activeCurrency.symbol}{parsedTotalBill.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-[#FFFFE3] rounded-[2rem] p-6 md:p-8 border border-[#CBCBCB] relative overflow-hidden mb-8">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-[#CBCBCB]">
              <h3 className="text-2xl font-black text-[#253D2C]">Who Pays Whom</h3>
              <div className="flex items-center gap-2 bg-white border border-[#CBCBCB] p-2 rounded-xl">
                <span className="text-xs font-bold text-[#6A89A7] pl-2 hidden sm:inline">View in</span>
                <span className="text-lg">💱</span>
                <select 
                  className="bg-transparent text-[#253D2C] font-bold outline-none cursor-pointer text-sm pr-2"
                  value={displayCurrency} onChange={e => setDisplayCurrency(e.target.value)}
                >
                  <option value={currency}>Orig ({currency})</option>
                  {CURRENCIES.filter(c => c.code !== currency).map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                </select>
              </div>
            </div>
            
            <div className="relative z-10">
              {settlementPlan.length === 0 ? (
                <div className="bg-white border border-[#CBCBCB] p-8 rounded-2xl text-center">
                  <p className="text-[#4A4A4A] font-bold text-lg">Everyone is perfectly settled up!</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {settlementPlan.map((t) => {
                    const displayAmt = displayCurrency === currency ? t.amount : convertCurrency(t.amount, currency, displayCurrency);
                    return (
                      <li key={t.id} className={`flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-5 rounded-2xl transition-all border ${t.isSettled ? 'bg-[#CBCBCB]/30 border-transparent opacity-60 grayscale' : 'bg-white border-[#CBCBCB] shadow-sm'}`}>
                        <div className="flex items-center gap-4">
                          <span className={`font-bold text-lg md:text-xl tracking-wide ${t.isSettled ? 'line-through text-[#6D8196]' : 'text-[#253D2C]'}`}>
                            <span className="text-[#4A4A4A]">{t.from}</span> pays <span className="text-[#384959]">{t.to}</span>
                          </span>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                          <div className="text-right">
                            <span className={`font-black text-2xl block ${t.isSettled ? 'text-[#6D8196]' : 'text-[#2E6F40]'}`}>
                              {dispCurrObj.symbol}{displayAmt}
                            </span>
                            {displayCurrency !== currency && <span className="text-[10px] font-bold text-[#6A89A7] uppercase">approx conversion</span>}
                          </div>
                          <button onClick={() => toggleSettlement(t.id)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${t.isSettled ? 'bg-[#CFFFDC] border-[#68BA7F] text-[#2E6F40]' : 'bg-[#FFFFE3] border-[#CBCBCB] text-[#4A4A4A] hover:bg-[#BDDDFC]'}`}>
                            {t.isSettled ? '✓ Settled' : 'Mark Settled'}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
             <button onClick={copyToClipboard} className="bg-white border border-[#CBCBCB] hover:bg-[#BDDDFC] text-[#384959] font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-sm">
               <span>📋</span> Copy Details
             </button>
             
             <button onClick={shareToWhatsApp} className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-sm">
               <span>💬</span> Share via WhatsApp
             </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button onClick={() => setCurrentView('main')} className="bg-[#FFFFE3] border border-[#CBCBCB] hover:bg-[#CBCBCB]/30 text-[#384959] font-bold py-4 rounded-2xl transition-colors">
               Edit Bill
             </button>
             <button onClick={startNewBill} className="bg-[#2E6F40] hover:bg-[#253D2C] text-white font-black py-4 rounded-2xl transition-colors shadow-md">
               New Split
             </button>
          </div>
        </div>
      </MinimalScreenWrapper>
    );
  }

  // ==========================================
  // VIEW 3: MINIMAL LANDING PAGE
  // ==========================================
  if (currentView === 'landing') {
    return (
      <MinimalScreenWrapper>
        <nav className="fixed top-0 w-full z-50 transition-all bg-[#FFFFE3]/90 backdrop-blur-md border-b border-[#CBCBCB]">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-[#253D2C] cursor-pointer" onClick={() => scrollToSection('hero')}>
              <div className="w-8 h-8 bg-[#2E6F40] rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-bold">/</span>
              </div>
              MathLess
            </div>
            <div className="hidden md:flex gap-8 text-sm font-bold text-[#6A89A7]">
              <a href="#platform" onClick={(e) => { e.preventDefault(); scrollToSection('platform'); }} className="hover:text-[#253D2C] transition-colors">Platform</a>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <button onClick={goProfile} className="hidden md:flex items-center gap-2 text-sm font-bold text-[#6A89A7] hover:text-[#253D2C] transition-colors">
                  <span>👤</span> {user.name.split(' ')[0]}
                </button>
              ) : (
                <button onClick={goLogin} className="hidden md:block text-sm font-bold text-[#6A89A7] hover:text-[#253D2C] transition-colors">
                  Log in
                </button>
              )}
              <button onClick={startNewBill} className="bg-[#2E6F40] hover:bg-[#253D2C] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm">Split a Bill</button>
            </div>
          </div>
        </nav>

        <section id="hero" className="relative pt-40 pb-32 z-10 text-[#4A4A4A]">
          <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#CBCBCB] text-xs font-bold text-[#6A89A7] mb-8 uppercase tracking-widest shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#68BA7F]"></span> Split smarter. Settle faster.
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-6 tracking-tighter max-w-2xl text-[#253D2C]">
                Split bills without the headache.
              </h1>
              <p className="text-lg md:text-xl text-[#6D8196] font-medium leading-relaxed mb-10 max-w-lg">
                A clean, professional expense platform that tracks your spending and makes bill splitting incredibly easy.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-start">
                <button onClick={startNewBill} className="bg-[#2E6F40] hover:bg-[#253D2C] text-white px-8 py-4 rounded-full font-black text-lg transition-colors flex items-center justify-center gap-2 shadow-md">
                  Split a Bill →
                </button>
                <button onClick={() => scrollToSection('platform')} className="bg-white hover:bg-[#BDDDFC] border border-[#CBCBCB] text-[#384959] px-8 py-4 rounded-full font-bold text-lg transition-colors">
                  Explore Platform
                </button>
              </div>
            </div>

            <div className="relative hidden lg:flex justify-center items-center h-[500px]">
               <div className="relative w-full max-w-sm">
                  <div className="absolute inset-0 bg-[#CFFFDC] rounded-[3rem] blur-3xl opacity-50 transform -rotate-6"></div>
                  
                  <div className="relative bg-white border border-[#CBCBCB] rounded-[2rem] p-8 shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-500 z-10">
                     <div className="w-12 h-12 bg-[#2E6F40] rounded-xl flex items-center justify-center text-white text-2xl mb-6 shadow-sm">✨</div>
                     <h2 className="text-3xl font-black text-[#253D2C] leading-tight mb-4">
                        Zero Math.<br/>Zero Drama.
                     </h2>
                     <p className="text-[#6D8196] font-medium mb-8">
                        Let the platform calculate the perfect settlement plan instantly.
                     </p>
                  </div>

                  <div className="absolute -right-8 top-12 bg-[#384959] text-white px-6 py-3 rounded-2xl shadow-lg border border-[#6A89A7] transform rotate-6 z-20">
                     <span className="text-xs font-bold uppercase tracking-widest text-[#BDDDFC] block mb-1">Status</span>
                     <span className="font-black">All Settled ✓</span>
                  </div>
               </div>
            </div>
          </div>
        </section>

        <section id="platform" className="relative z-10 pb-32 pt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-[#253D2C] mb-4 tracking-tight">Everything you need to stay on top.</h2>
              <p className="text-lg text-[#6D8196] font-medium max-w-2xl mx-auto">A unified ecosystem. From splitting a dinner bill to analyzing your monthly budget.</p>
            </div>

            <div className="bg-white border border-[#CBCBCB] rounded-[2rem] p-10 md:p-16 mb-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl">
                <div className="w-14 h-14 bg-[#FFFFE3] text-[#253D2C] rounded-2xl flex items-center justify-center border border-[#CBCBCB] text-3xl mb-6 shadow-sm">🧾</div>
                <h3 className="text-3xl md:text-5xl font-black text-[#253D2C] tracking-tight mb-4">Split Bills</h3>
                <p className="text-lg text-[#6D8196] font-medium leading-relaxed mb-8">Divide group expenses without the headache. Instantly calculate who owes whom across 12 different currencies.</p>
              </div>
              <div className="w-full md:w-auto text-right">
                <button onClick={startNewBill} className="w-full md:w-auto bg-[#2E6F40] hover:bg-[#253D2C] text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-sm">
                  Split a Bill →
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              
              <div className="bg-white border border-[#CBCBCB] rounded-[2rem] p-8 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 bg-[#BDDDFC] text-[#384959] rounded-2xl flex items-center justify-center border border-[#88BDF2] text-2xl mb-6">💳</div>
                  <h3 className="text-2xl font-black text-[#253D2C] tracking-tight mb-3">Track Every Expense</h3>
                  <p className="text-[#6D8196] font-medium leading-relaxed mb-6">Keep all your spending organized in one place. Every bill you split automatically syncs with your personal tracker.</p>
                </div>
                <div className="text-right">
                  <button onClick={() => setCurrentView('tracker')} className="text-[#6A89A7] hover:text-[#384959] font-bold transition-colors">
                    Open Tracker →
                  </button>
                </div>
              </div>

              <div className="bg-white border border-[#CBCBCB] rounded-[2rem] p-8 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 bg-[#CFFFDC] text-[#253D2C] rounded-2xl flex items-center justify-center border border-[#68BA7F] text-2xl mb-6">📊</div>
                  <h3 className="text-2xl font-black text-[#253D2C] tracking-tight mb-3">Understand Your Spending</h3>
                  <p className="text-[#6D8196] font-medium leading-relaxed mb-6">Get a visual overview of where your money goes. See your monthly trends and top spending categories.</p>
                </div>
                <div className="text-right">
                  <button onClick={() => setCurrentView('dashboard')} className="text-[#6A89A7] hover:text-[#384959] font-bold transition-colors">
                    View Dashboard →
                  </button>
                </div>
              </div>

              <div className="bg-white border border-[#CBCBCB] rounded-[2rem] p-8 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 bg-[#FFFFE3] text-[#4A4A4A] rounded-2xl flex items-center justify-center border border-[#CBCBCB] text-2xl mb-6 shadow-sm">✨</div>
                  <h3 className="text-2xl font-black text-[#253D2C] tracking-tight mb-3">Smarter AI Insights</h3>
                  <p className="text-[#6D8196] font-medium leading-relaxed mb-6">Use AI to turn raw expense data into useful observations. Spot your highest spending categories instantly.</p>
                </div>
                <div className="text-right">
                  <button onClick={() => setCurrentView('insights')} className="text-[#6A89A7] hover:text-[#384959] font-bold transition-colors">
                    View Insights →
                  </button>
                </div>
              </div>

              <div className="bg-white border border-[#CBCBCB] rounded-[2rem] p-8 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 bg-[#BDDDFC] text-[#384959] rounded-2xl flex items-center justify-center border border-[#88BDF2] text-2xl mb-6">🔔</div>
                  <h3 className="text-2xl font-black text-[#253D2C] tracking-tight mb-3">Never Forget a Payment</h3>
                  <p className="text-[#6D8196] font-medium leading-relaxed mb-6">Clear debts without the awkward conversations. Smart reminders for pending netted payments.</p>
                </div>
                <div className="text-right">
                  <button onClick={() => setCurrentView('reminders')} className="text-[#6A89A7] hover:text-[#384959] font-bold transition-colors">
                    View Reminders →
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="py-32 px-6 relative overflow-hidden text-center z-10 border-t border-[#CBCBCB]">
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-[#253D2C]">Your expenses.<br/>Finally under control.</h2>
            <button onClick={startNewBill} className="bg-[#2E6F40] hover:bg-[#253D2C] text-white px-10 py-5 rounded-full text-lg font-black mt-6 transition-colors shadow-md">
              Get Started Free →
            </button>
          </div>
        </section>

        <footer className="py-12 px-6 relative z-10 border-t border-[#CBCBCB] bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="font-black text-2xl tracking-tighter text-[#253D2C]">MathLess</div>
            </div>
            <button onClick={startNewBill} className="text-sm font-bold text-[#6A89A7] hover:text-[#384959] transition-colors">Get Started →</button>
          </div>
        </footer>
      </MinimalScreenWrapper>
    );
  }

  // ==========================================
  // UNIFIED LIGHT-MODE SUB-APPS
  // ==========================================
  if (currentView === 'tracker') {
    return (
      <MinimalScreenWrapper>
        <SharedNav onHome={goHome} onProfile={goProfile} onLogin={goLogin} user={user} title="Expense Tracker"/>
        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 pt-10 pb-20">
          <div className="bg-white border border-[#CBCBCB] shadow-md rounded-[2rem] p-6 md:p-10">
            <h2 className="text-3xl font-black mb-8 text-[#253D2C]">Track a new expense</h2>
            <div className="space-y-6 bg-[#FFFFE3] p-6 md:p-8 rounded-3xl border border-[#CBCBCB] mb-10">
               <div>
                <label className="block text-sm font-bold text-[#4A4A4A] mb-2">What did you buy?</label>
                <input 
                  type="text" placeholder="e.g. Cinema Tickets" 
                  className="w-full bg-white border border-[#CBCBCB] rounded-xl p-4 text-[#253D2C] outline-none focus:border-[#2E6F40] font-bold placeholder-[#6D8196] transition-colors" 
                  value={newExpName} onChange={e => setNewExpName(e.target.value)} 
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-[#4A4A4A] mb-2">Amount (₹)</label>
                  <input 
                    type="number" placeholder="0" 
                    className="w-full bg-white border border-[#CBCBCB] rounded-xl p-4 text-[#253D2C] outline-none focus:border-[#2E6F40] font-bold placeholder-[#6D8196] transition-colors" 
                    value={newExpAmount} onChange={e => setNewExpAmount(e.target.value)} 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-[#4A4A4A] mb-2">Category</label>
                  <select 
                    className="w-full bg-white border border-[#CBCBCB] rounded-xl p-4 text-[#253D2C] outline-none focus:border-[#2E6F40] font-bold appearance-none cursor-pointer transition-colors" 
                    value={newExpCategory} onChange={e => setNewExpCategory(e.target.value)}
                  >
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="College">College</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={handleAddExpense} 
                className="w-full bg-[#2E6F40] hover:bg-[#253D2C] text-white font-bold py-4 rounded-xl transition-colors shadow-sm mt-2"
              >
                Add to Tracker
              </button>
            </div>
            
            <h3 className="text-sm font-bold text-[#6A89A7] uppercase tracking-widest mb-6">Recent Expenses</h3>
            <div className="space-y-4">
              {expenses.length === 0 ? (
                <p className="text-[#6D8196] font-medium p-4 text-center bg-[#FFFFE3] rounded-xl border border-[#CBCBCB]">No expenses tracked yet.</p>
              ) : (
                expenses.map(exp => (
                  <div key={exp.id} className="flex justify-between items-center bg-[#FFFFE3] border border-[#CBCBCB] p-5 rounded-2xl transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white border border-[#CBCBCB] flex items-center justify-center text-xl shadow-sm">
                        {exp.category === 'Food' ? '🍕' : exp.category === 'Travel' ? '🚕' : exp.category === 'College' ? '📚' : '💳'}
                      </div>
                      <div>
                        <div className="font-bold text-[#253D2C] text-lg">{exp.name}</div>
                        <div className="text-xs font-bold text-[#6D8196] uppercase tracking-wider">{exp.category}</div>
                      </div>
                    </div>
                    <div className="font-black text-[#253D2C] text-xl">₹{exp.amount}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </MinimalScreenWrapper>
    );
  }

  if (currentView === 'dashboard') {
    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const catData = ['Food', 'Travel', 'Shopping', 'Entertainment', 'College', 'Other']
      .map(c => ({ name: c, val: expenses.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0) }))
      .sort((a, b) => b.val - a.val);
    
    const netPendingDebts = getNetPendingDebts(reminders);

    return (
      <MinimalScreenWrapper>
        <SharedNav onHome={goHome} onProfile={goProfile} onLogin={goLogin} user={user} title="Spending Dashboard"/>
        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 pt-10 pb-20">
          <div className="bg-white border border-[#CBCBCB] shadow-md rounded-[2rem] p-6 md:p-10">
            
            <div className="text-center mb-12 border-b border-[#CBCBCB] pb-10">
              <div className="text-[#6D8196] font-bold text-xs tracking-widest uppercase mb-3">This Month</div>
              <div className="text-6xl md:text-7xl font-black text-[#253D2C] mb-4">₹{totalSpent}</div>
              <div className="text-xs font-bold text-[#2E6F40] bg-[#CFFFDC] border border-[#68BA7F] inline-block px-4 py-1.5 rounded-full uppercase tracking-wider">
                On track with budget
              </div>
            </div>

            {netPendingDebts.length > 0 && (
              <div className="mb-12">
                <h3 className="text-sm font-bold text-[#6A89A7] uppercase tracking-widest mb-4">Pending Settlements</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {netPendingDebts.map((debt, idx) => (
                    <div key={idx} className="bg-[#FFFFE3] border border-[#CBCBCB] p-5 rounded-2xl flex justify-between items-center shadow-sm">
                      <span className="text-[#4A4A4A] font-medium text-sm leading-tight pr-2 capitalize">
                        <strong className="text-[#253D2C]">{debt.from}</strong> owes <strong className="text-[#253D2C]">{debt.to}</strong>
                      </span>
                      <span className="text-[#2E6F40] font-black text-lg">₹{debt.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h3 className="text-sm font-bold text-[#6A89A7] uppercase tracking-widest mb-6">Spending by Category</h3>
            <div className="space-y-6">
              {totalSpent === 0 ? (
                <p className="text-[#6D8196] text-sm font-medium text-center bg-[#FFFFE3] p-4 rounded-xl border border-[#CBCBCB]">No spending data yet.</p>
              ) : (
                catData.map(cat => cat.val > 0 && (
                  <div key={cat.name}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-[#4A4A4A]">{cat.name}</span>
                      <span className="font-bold text-[#253D2C]">₹{cat.val}</span>
                    </div>
                    <div className="w-full bg-[#FFFFE3] h-3 rounded-full overflow-hidden border border-[#CBCBCB]">
                      <div className="bg-[#88BDF2] h-full rounded-full" style={{ width: `${(cat.val / totalSpent) * 100}%` }}></div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <h3 className="text-sm font-bold text-[#6A89A7] uppercase tracking-widest mb-6 mt-12 border-t border-[#CBCBCB] pt-10">Past Splits History</h3>
            <div className="space-y-4">
              {billHistory.length === 0 ? (
                <p className="text-[#6D8196] text-sm font-medium text-center bg-[#FFFFE3] p-4 rounded-xl border border-[#CBCBCB]">No bills split yet.</p>
              ) : (
                billHistory.map(bill => (
                  <div key={bill.id} className="bg-[#FFFFE3] rounded-2xl border border-[#CBCBCB] overflow-hidden transition-all shadow-sm">
                    <div 
                      className="p-5 flex justify-between items-center cursor-pointer hover:bg-white transition-colors"
                      onClick={() => setExpandedHistoryId(expandedHistoryId === bill.id ? null : bill.id)}
                    >
                      <div>
                        <div className="font-bold text-[#253D2C] text-lg">{bill.name}</div>
                        <div className="text-xs font-bold text-[#6D8196] mt-1">{bill.date} • {bill.participantsCount || bill.participants} people</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-black text-[#2E6F40] text-lg">
                          {CURRENCIES.find(c=>c.code===bill.currency)?.symbol || '₹'}{Number(bill.total).toFixed(2)}
                        </div>
                        <div className="text-[#6D8196] text-xs w-4 text-center">{expandedHistoryId === bill.id ? '▲' : '▼'}</div>
                      </div>
                    </div>
                    
                    {expandedHistoryId === bill.id && bill.participantsDetail && (
                      <div className="p-5 bg-white border-t border-[#CBCBCB] text-sm space-y-6">
                        <div>
                          <div className="text-[10px] font-bold text-[#6A89A7] uppercase tracking-widest mb-3">Participant Details</div>
                          {bill.participantsDetail.map((p, i) => (
                            <div key={i} className="flex justify-between items-center mb-2">
                              <span className="text-[#4A4A4A]">{p.name} <span className="text-[#6D8196] text-xs">(Paid {p.paid})</span></span>
                              <span className={`font-bold ${p.balance > 0 ? 'text-[#2E6F40]' : p.balance < 0 ? 'text-[#384959]' : 'text-[#6D8196]'}`}>
                                {p.balance > 0 ? `+${p.balance.toFixed(2)}` : p.balance < 0 ? `${Math.abs(p.balance).toFixed(2)}` : 'Settled'}
                              </span>
                            </div>
                          ))}
                        </div>
                        {bill.settlements && bill.settlements.length > 0 && (
                          <div>
                            <div className="text-[10px] font-bold text-[#6A89A7] uppercase tracking-widest mb-3 border-t border-[#CBCBCB] pt-4">Settlement Plan</div>
                            {bill.settlements.map((s, i) => (
                              <div key={i} className="flex justify-between items-center mb-2 bg-[#FFFFE3] p-3 rounded-lg border border-[#CBCBCB]">
                                <span className="text-[#4A4A4A]"><span className="text-[#253D2C] font-bold">{s.from}</span> pays <span className="text-[#384959] font-bold">{s.to}</span></span>
                                <span className="font-black text-[#253D2C]">{s.amount}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </MinimalScreenWrapper>
    );
  }

  if (currentView === 'insights') {
    const insightTotalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const topCat = expenses.reduce((acc, curr) => { acc[curr.category] = (acc[curr.category] || 0) + curr.amount; return acc; }, {});
    
    const highestCat = Object.keys(topCat).length > 0 
      ? Object.keys(topCat).reduce((a, b) => topCat[a] > topCat[b] ? a : b) 
      : 'Food';
    const highestCatAmount = topCat[highestCat] || 0;

    return (
      <MinimalScreenWrapper>
        <SharedNav onHome={goHome} onProfile={goProfile} onLogin={goLogin} user={user} title="Smart AI Insights"/>
        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 pt-10 pb-20">
          <div className="bg-white border border-[#CBCBCB] shadow-md rounded-[2rem] p-6 md:p-10">
            {insightTotalSpent === 0 ? (
               <div className="text-center py-16 bg-[#FFFFE3] rounded-3xl border border-[#CBCBCB]">
                 <div className="text-5xl mb-4 opacity-50">🤖</div>
                 <h3 className="text-2xl font-black text-[#253D2C] mb-2">I need more data!</h3>
                 <p className="text-[#6D8196] font-medium">Add some expenses in the Tracker to generate insights.</p>
               </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-[#BDDDFC] p-8 md:p-10 rounded-3xl border border-[#88BDF2] relative overflow-hidden">
                  <div className="text-4xl mb-6 relative z-10">✨</div>
                  <h3 className="text-2xl font-black text-[#384959] mb-3 relative z-10">Spending Alert</h3>
                  <p className="text-[#4A4A4A] font-medium leading-relaxed relative z-10 text-lg">
                    Your highest spending category this month is <strong className="text-[#253D2C]">{highestCat}</strong> at ₹{highestCatAmount}. You have spent 18% more on {highestCat} compared to last month.
                  </p>
                </div>
                
                <div className="bg-[#CFFFDC] p-8 md:p-10 rounded-3xl border border-[#68BA7F]">
                  <div className="text-4xl mb-6">💡</div>
                  <h3 className="text-2xl font-black text-[#253D2C] mb-3">Saving Opportunity</h3>
                  <p className="text-[#4A4A4A] font-medium leading-relaxed text-lg">
                    You currently have ₹{insightTotalSpent} in tracked expenses. Reducing your "Entertainment" budget by 10% could save you enough to cover next month's internet bill.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </MinimalScreenWrapper>
    );
  }

  if (currentView === 'reminders') {
    const netPendingDebts = getNetPendingDebts(reminders);
    const settledReminders = reminders.filter(r => r.isPaid);

    return (
      <MinimalScreenWrapper>
        <SharedNav onHome={goHome} onProfile={goProfile} onLogin={goLogin} user={user} title="Payment Reminders"/>
        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 pt-10 pb-20">
          <div className="bg-white border border-[#CBCBCB] shadow-md rounded-[2rem] p-6 md:p-10">
            <h2 className="text-3xl font-black mb-8 text-[#253D2C] flex items-center gap-3">
              <span>🔔</span> Your Reminders
            </h2>
            
            <div className="space-y-4 mb-12">
              {netPendingDebts.length === 0 ? (
                <div className="text-center py-16 bg-[#FFFFE3] rounded-3xl border border-[#CBCBCB]">
                  <p className="text-[#6D8196] font-medium text-lg">No pending reminders. You are all settled up! 🎉</p>
                </div>
              ) : netPendingDebts.map((debt, idx) => (
                <div key={idx} className="p-6 rounded-3xl border transition-colors bg-[#FFFFE3] border-[#CBCBCB] shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="font-bold text-xl text-[#253D2C] capitalize">{debt.from} owes {debt.to}</div>
                      <div className="text-sm font-black text-[#2E6F40] mt-1 text-2xl">₹{debt.amount.toFixed(2)}</div>
                    </div>
                    <div className="text-xs font-black px-4 py-1.5 rounded-full bg-[#BDDDFC] text-[#384959] border border-[#88BDF2] uppercase tracking-widest">Pending</div>
                  </div>
                  <div className="flex gap-4">
                    <button className="flex-1 bg-white border border-[#CBCBCB] hover:bg-[#FFFFE3] text-[#4A4A4A] font-bold py-3.5 rounded-xl text-sm transition-colors">Send Reminder</button>
                    <button onClick={() => settleNetDebt(debt.from, debt.to)} className="flex-1 font-bold py-3.5 rounded-xl text-sm transition-colors bg-[#2E6F40] text-white hover:bg-[#253D2C] shadow-sm">
                      Mark as Paid
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {settledReminders.length > 0 && (
              <>
                <h3 className="text-sm font-bold text-[#6A89A7] uppercase tracking-widest mb-6 border-t border-[#CBCBCB] pt-8">Recently Settled</h3>
                <div className="space-y-3">
                  {settledReminders.map(rem => (
                    <div key={rem.id} className="p-5 rounded-2xl border border-[#CBCBCB] bg-[#FFFFE3] flex justify-between items-center">
                       <div>
                         <div className="font-bold text-[#6D8196] line-through text-sm">{rem.text}</div>
                       </div>
                       <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#CFFFDC] text-[#2E6F40] border border-[#68BA7F]">Settled ✓</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </MinimalScreenWrapper>
    );
  }

  // ==========================================
  // PROFILE VIEW
  // ==========================================
  if (currentView === 'profile') {
    if (!user) {
      setCurrentView('login');
      return null;
    }

    return (
      <MinimalScreenWrapper>
        <SharedNav onHome={goHome} onProfile={goProfile} onLogin={goLogin} user={user} title="Your Profile"/>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-md bg-white border border-[#CBCBCB] rounded-[2.5rem] p-10 shadow-lg text-center">
            <div className="w-24 h-24 bg-[#BDDDFC] rounded-full mx-auto flex items-center justify-center text-4xl mb-6 shadow-inner border border-[#88BDF2]">
               👤
            </div>
            <h2 className="text-3xl font-black text-[#253D2C] mb-2">{user.name}</h2>
            <p className="text-[#6D8196] font-bold mb-8">{user.email}</p>

            <div className="bg-[#FFFFE3] border border-[#CBCBCB] rounded-2xl p-6 mb-8 text-left">
              <label className="block text-sm font-bold text-[#4A4A4A] mb-3">Default Currency</label>
              <select 
                className="w-full bg-white border border-[#CBCBCB] rounded-xl p-4 text-[#253D2C] outline-none focus:border-[#2E6F40] font-bold appearance-none cursor-pointer shadow-sm transition-colors"
                value={user.defaultCurrency} 
                onChange={e => updateDefaultCurrency(e.target.value)}
              >
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.name} ({c.symbol})</option>)}
              </select>
              <p className="text-xs text-[#6A89A7] mt-3 font-medium">This currency will be pre-selected when you start a new bill.</p>
            </div>

            <button onClick={handleLogout} className="w-full bg-white border border-red-200 hover:bg-red-50 text-red-500 font-bold py-4 rounded-xl transition-colors">
              Log Out
            </button>
          </div>
        </div>
      </MinimalScreenWrapper>
    );
  }

  // ==========================================
  // FULL LOGIN / SIGN UP PAGE
  // ==========================================
  if (currentView === 'login') {
    return (
      <MinimalScreenWrapper>
        <SharedNav onHome={goHome} onProfile={goProfile} onLogin={goLogin} user={user} title="Authentication"/>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-md bg-white border border-[#CBCBCB] rounded-[2.5rem] p-10 shadow-lg">
            
            <div className="flex bg-[#FFFFE3] rounded-xl p-1 mb-8 border border-[#CBCBCB]">
              <button 
                onClick={() => setIsSignUp(false)} 
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${!isSignUp ? 'bg-white text-[#253D2C] shadow-sm border border-[#CBCBCB]' : 'text-[#6A89A7] hover:text-[#4A4A4A]'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsSignUp(true)} 
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${isSignUp ? 'bg-white text-[#253D2C] shadow-sm border border-[#CBCBCB]' : 'text-[#6A89A7] hover:text-[#4A4A4A]'}`}
              >
                Create Account
              </button>
            </div>

            <h2 className="text-3xl font-black text-center mb-8 text-[#253D2C]">
              {isSignUp ? "Join MathLess" : "Welcome back"}
            </h2>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4 mb-8">
              {isSignUp && (
                <div>
                  <input 
                    type="text" placeholder="Full Name" required
                    className="w-full bg-[#FFFFE3] border border-[#CBCBCB] rounded-xl p-4 text-[#253D2C] outline-none focus:border-[#2E6F40] font-bold placeholder-[#6D8196] transition-colors" 
                    value={authName} onChange={e => setAuthName(e.target.value)}
                  />
                </div>
              )}
              <div>
                <input 
                  type="email" placeholder="Email Address" required
                  className="w-full bg-[#FFFFE3] border border-[#CBCBCB] rounded-xl p-4 text-[#253D2C] outline-none focus:border-[#2E6F40] font-bold placeholder-[#6D8196] transition-colors" 
                  value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                />
              </div>
              <div>
                <input 
                  type="password" placeholder="Password" required
                  className="w-full bg-[#FFFFE3] border border-[#CBCBCB] rounded-xl p-4 text-[#253D2C] outline-none focus:border-[#2E6F40] font-bold placeholder-[#6D8196] transition-colors" 
                  value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                />
              </div>
              
              <button type="submit" className="w-full bg-[#2E6F40] hover:bg-[#253D2C] text-white font-black py-4 rounded-xl mt-2 transition-colors shadow-sm">
                {isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>

            <div className="relative border-t border-[#CBCBCB] pt-6 text-center">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 text-xs font-bold text-[#6A89A7]">OR</span>
              <button onClick={goHome} className="text-[#6A89A7] hover:text-[#384959] font-bold text-sm transition-colors underline underline-offset-4">
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      </MinimalScreenWrapper>
    );
  }

  return null;
}

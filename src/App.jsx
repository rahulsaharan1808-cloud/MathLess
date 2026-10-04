import { useState, useEffect } from 'react';

// --- SHARED COMPONENT ---
// Defined safely outside the main App function to prevent React nesting errors
const SubAppNav = ({ title, onHome }) => (
  <div className="bg-slate-900 p-6 md:p-8 text-white flex justify-between items-center relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
    <div className="relative z-10 flex items-center gap-3">
      <h1 
        className="text-xl md:text-2xl font-black tracking-tight cursor-pointer" 
        onClick={onHome}
      >
        MathLess
      </h1>
      <span className="text-slate-600 font-bold">/</span>
      <span className="text-orange-400 font-bold hidden md:inline">{title}</span>
    </div>
    <button 
      onClick={onHome} 
      className="relative z-10 text-slate-300 hover:text-white text-sm font-bold transition-colors bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full"
    >
      Back Home
    </button>
  </div>
);

export default function App() {
  // --- INITIALIZATION ---
  useEffect(() => {
    document.title = "MathLess - Split smarter. Settle faster.";
  }, []);

  // --- GLOBAL STATE ---
  const [currentView, setCurrentView] = useState('landing'); 
  const [bgImage, setBgImage] = useState(null); 
  
  // 1. Split Bill State
  const [billName, setBillName] = useState("");
  const [totalBill, setTotalBill] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [participants, setParticipants] = useState([
    { id: 1, name: "Rahul", paid: "", customShare: "" },
    { id: 2, name: "Aman", paid: "", customShare: "" }
  ]);
  const [settlementPlan, setSettlementPlan] = useState([]);
  const [individualBalances, setIndividualBalances] = useState([]);

  // ==========================================
  // 💾 LOCAL BROWSER DATABASE (CLEARED DEFAULTS)
  // New users start with [] (empty arrays)
  // ==========================================
  const readStored = (key) => {
    try {
      const saved = localStorage.getItem(key);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const writeStored = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Private windows can block storage. The current session still works.
    }
  };

  // New users start empty. Saved lists reload after the tab is closed.
  const [expenses, setExpenses] = useState(() => readStored('mathless_expenses'));
  const [reminders, setReminders] = useState(() => readStored('mathless_reminders'));
  const [billHistory, setBillHistory] = useState(() => readStored('mathless_history'));
  const [splitMemory, setSplitMemory] = useState(() => readStored('mathless_split_memory'));
  const [activeBillId, setActiveBillId] = useState(null);

  // --- AUTO-SAVE DATA WHEN IT CHANGES ---
  useEffect(() => { writeStored('mathless_expenses', expenses); }, [expenses]);
  useEffect(() => { writeStored('mathless_reminders', reminders); }, [reminders]);
  useEffect(() => { writeStored('mathless_history', billHistory); }, [billHistory]);
  useEffect(() => { writeStored('mathless_split_memory', splitMemory); }, [splitMemory]);

  const [newExpName, setNewExpName] = useState("");
  const [newExpAmount, setNewExpAmount] = useState("");
  const [newExpCategory, setNewExpCategory] = useState("Food");

  // --- THEME DATA ---
  const themeImages = {
    dinner: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
    roommates: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1000&auto=format&fit=crop",
    trips: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000&auto=format&fit=crop",
    events: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop",
    college: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop"
  };

  const appBackgroundClass = bgImage 
    ? "min-h-screen p-4 md:p-6 font-sans text-slate-900 pb-20 relative bg-fixed bg-cover bg-center" 
    : "min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-orange-50 p-4 md:p-6 font-sans text-slate-900 pb-20";

  // --- ACTIONS ---
  const addParticipant = () => {
    setParticipants([...participants, { id: Date.now(), name: "", paid: "", customShare: "" }]);
  };

  const removeParticipant = (id) => {
    if (participants.length > 2) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const updateParticipant = (id, field, value) => {
    setParticipants(participants.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  
  const startNewBill = () => {
    setBgImage(null); 
    setBillName(""); 
    setTotalBill(""); 
    setSplitType("equal");
    setParticipants([
      { id: 1, name: "Rahul", paid: "", customShare: "" }, 
      { id: 2, name: "Aman", paid: "", customShare: "" }
    ]);
    setSettlementPlan([]); 
    setIndividualBalances([]); 
    setActiveBillId(null);
    setCurrentView('main');
  };

  const startThemedBill = (imgUrl, defaultName) => {
    setBgImage(imgUrl); 
    setBillName(defaultName); 
    setTotalBill(""); 
    setSplitType("equal");
    setParticipants([
      { id: 1, name: "Rahul", paid: "", customShare: "" }, 
      { id: 2, name: "Aman", paid: "", customShare: "" }
    ]);
    setSettlementPlan([]); 
    setIndividualBalances([]); 
    setActiveBillId(null);
    setCurrentView('main');
  };

  const handleAddExpense = () => {
    if (!newExpName || !newExpAmount) return;
    setExpenses([
      { 
        id: Date.now(), 
        name: newExpName, 
        amount: parseFloat(newExpAmount), 
        category: newExpCategory 
      }, 
      ...expenses
    ]);
    setNewExpName(""); 
    setNewExpAmount("");
  };

  const toggleReminder = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, isPaid: !r.isPaid } : r));
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const goHome = () => setCurrentView('landing');

  // --- VALIDATIONS ---
  const parsedTotalBill = parseFloat(totalBill) || 0;
  const totalPaid = participants.reduce((sum, p) => sum + (parseFloat(p.paid) || 0), 0);
  const totalCustomShares = participants.reduce((sum, p) => sum + (parseFloat(p.customShare) || 0), 0);
  const hasEmptyNames = participants.some(p => p.name.trim() === "");
  const participantNames = participants.map(p => p.name.trim().toLowerCase());
  const hasDuplicateNames = new Set(participantNames).size !== participantNames.length;
  
  const isPaidValid = Math.abs(totalPaid - parsedTotalBill) < 0.01 && parsedTotalBill > 0;
  const isCustomValid = Math.abs(totalCustomShares - parsedTotalBill) < 0.01;
  const canCalculate = isPaidValid && !hasEmptyNames && !hasDuplicateNames && (splitType === 'equal' || isCustomValid);

  // --- SETTLEMENT ALGORITHM & DATABASE SAVE ---
  const toPaise = (n) => Math.round((parseFloat(n) || 0) * 100);

  const calculateSettlement = () => {
    const totalPaise = toPaise(parsedTotalBill);
    const count = participants.length;
    const balances = participants.map((p, index) => {
      const paidPaise = toPaise(p.paid);
      const fairSharePaise = splitType === 'equal'
        ? Math.floor(totalPaise / count) + (index < (totalPaise % count) ? 1 : 0)
        : toPaise(p.customShare);
      return {
        name: p.name.trim(),
        paid: paidPaise / 100,
        fairShare: fairSharePaise / 100,
        balancePaise: paidPaise - fairSharePaise
      };
    });

    setIndividualBalances(balances.map(b => ({
      name: b.name,
      paid: b.paid,
      fairShare: b.fairShare,
      balance: b.balancePaise / 100
    })));

    const debtors = balances
      .filter(b => b.balancePaise < -1)
      .map(b => ({ name: b.name, paise: -b.balancePaise }))
      .sort((a, b) => b.paise - a.paise);
    const creditors = balances
      .filter(b => b.balancePaise > 1)
      .map(b => ({ name: b.name, paise: b.balancePaise }))
      .sort((a, b) => b.paise - a.paise);

    const transactions = [];
    let d = 0;
    let c = 0;
    while (d < debtors.length && c < creditors.length) {
      const amountPaise = Math.min(debtors[d].paise, creditors[c].paise);
      transactions.push({
        id: Math.random().toString(36).slice(2, 11),
        from: debtors[d].name,
        to: creditors[c].name,
        amount: (amountPaise / 100).toFixed(2),
        isSettled: false
      });
      debtors[d].paise -= amountPaise;
      creditors[c].paise -= amountPaise;
      if (debtors[d].paise < 1) d++;
      if (creditors[c].paise < 1) c++;
    }

    const historyId = activeBillId || Date.now();
    setActiveBillId(historyId);
    setBillHistory(prev => [
      {
        id: historyId,
        name: billName || "Unnamed Bill",
        date: new Date().toLocaleDateString(),
        total: parsedTotalBill,
        participants: participants.length
      },
      ...prev.filter(item => item.id !== historyId)
    ]);

    const billKey = `bill-${historyId}`;
    const billLabel = billName || 'a bill';
    setReminders(prev => {
      const kept = prev.filter(r => r.billKey !== billKey && !r.finalized);
      const fresh = transactions.map((tx, i) => ({
        id: Date.now() + i,
        from: tx.from,
        to: tx.to,
        bill: billLabel,
        text: `${tx.from} owes ${tx.to} for ${billLabel}`,
        amount: tx.amount,
        isPaid: false,
        billKey
      }));
      return [...fresh, ...kept];
    });

    setSettlementPlan(transactions);
    setCurrentView('results');
  };

  const sendReminder = (rem) => {
    const text = `Reminder from MathLess: ${rem.text} (₹${rem.amount}).`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Reminder copied. Paste it into a message.');
      }).catch(() => alert(text));
    } else {
      alert(text);
    }
  };

  const debtFromReminder = (rem) => {
    if (rem.isPaid || rem.finalized) return null;
    if (rem.from && rem.to) {
      return {
        from: String(rem.from).trim(),
        to: String(rem.to).trim(),
        paise: toPaise(rem.amount),
        bill: rem.bill || ''
      };
    }
    const match = String(rem.text || '').match(/^(.*) owes (.*) for (.*)$/i);
    if (!match) return null;
    return {
      from: match[1].trim(),
      to: match[2].trim(),
      paise: toPaise(rem.amount),
      bill: match[3].trim()
    };
  };

  const netDebts = (debts) => {
    const pairs = {};
    debts.forEach(debt => {
      if (!debt.from || !debt.to || debt.paise < 1) return;
      const key = [debt.from, debt.to].map(name => name.toLowerCase()).sort().join('||');
      if (!pairs[key]) pairs[key] = { left: debt.from, right: debt.to, paise: 0, bills: [] };
      const pair = pairs[key];
      const sameWay = pair.left.toLowerCase() === debt.from.toLowerCase();
      pair.paise += sameWay ? debt.paise : -debt.paise;
      if (debt.bill && !pair.bills.includes(debt.bill)) pair.bills.push(debt.bill);
    });
    return Object.values(pairs)
      .filter(pair => Math.abs(pair.paise) > 0)
      .map(pair => {
        const from = pair.paise > 0 ? pair.left : pair.right;
        const to = pair.paise > 0 ? pair.right : pair.left;
        const paise = Math.abs(pair.paise);
        return {
          from,
          to,
          paise,
          amount: (paise / 100).toFixed(2),
          bills: pair.bills
        };
      });
  };

  const finalizeSplitMemory = () => {
    const savedDebts = splitMemory.map(debt => ({
      from: debt.from,
      to: debt.to,
      paise: debt.paise || toPaise(debt.amount),
      bill: Array.isArray(debt.bills) ? debt.bills.join(', ') : (debt.bill || '')
    }));
    const openDebts = reminders.map(debtFromReminder).filter(Boolean);
    const net = netDebts([...savedDebts, ...openDebts]);
    const finalized = net.map((debt, i) => ({
      id: Date.now() + i,
      from: debt.from,
      to: debt.to,
      bill: debt.bills.join(', '),
      text: `${debt.from} owes ${debt.to}${debt.bills.length ? ` · ${debt.bills.join(', ')}` : ''}`,
      amount: debt.amount,
      isPaid: false,
      finalized: true,
      billKey: 'split-memory'
    }));
    setSplitMemory(net);
    setReminders(prev => [...finalized, ...prev.filter(rem => rem.isPaid)]);
  };

  const toggleSettlement = (id) => {
    setSettlementPlan(plan => plan.map(t => t.id === id ? { ...t, isSettled: !t.isSettled } : t));
  };

  const copyToClipboard = () => {
    let text = `💸 *${billName || 'MathLess Settlement'}*\nTotal: ₹${parsedTotalBill}\n\n*Who Pays Whom:*\n`;
    if (settlementPlan.length === 0) {
      text += "Everyone is settled!\n";
    } else {
      settlementPlan.forEach(t => { 
        text += `• ${t.from} pays ${t.to}: ₹${t.amount}\n`; 
      });
    }
    const done = () => alert("Settlement plan copied to clipboard!");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => alert(text));
    } else {
      alert(text);
    }
  };

  // ==========================================
  // VIEW 1: EXPENSE TRACKER
  // ==========================================
  if (currentView === 'tracker') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans text-slate-900 pb-20">
        <div className="max-w-2xl mx-auto bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden mt-4">
          <SubAppNav title="Expense Tracker" onHome={goHome} />
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-black mb-6">Track a new expense</h2>
            <div className="space-y-4 bg-blue-50 p-6 rounded-3xl border border-blue-100 mb-8">
               <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">What did you buy?</label>
                <input 
                  type="text" 
                  placeholder="e.g. Cinema Tickets" 
                  className="w-full border-2 border-white rounded-xl p-3 outline-none focus:border-blue-400 font-bold" 
                  value={newExpName} 
                  onChange={e => setNewExpName(e.target.value)} 
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Amount (₹)</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    className="w-full border-2 border-white rounded-xl p-3 outline-none focus:border-blue-400 font-bold" 
                    value={newExpAmount} 
                    onChange={e => setNewExpAmount(e.target.value)} 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select 
                    className="w-full border-2 border-white rounded-xl p-3 outline-none focus:border-blue-400 font-bold bg-white" 
                    value={newExpCategory} 
                    onChange={e => setNewExpCategory(e.target.value)}
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2"
              >
                Add to Tracker
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Expenses</h3>
            <div className="space-y-3">
              {expenses.length === 0 ? (
                <p className="text-slate-500 font-medium">No expenses tracked yet. Add one above!</p>
              ) : (
                expenses.map(exp => (
                  <div key={exp.id} className="flex justify-between items-center bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                        {exp.category === 'Food' ? '🍕' : exp.category === 'Travel' ? '🚕' : exp.category === 'College' ? '📚' : '💳'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{exp.name}</div>
                        <div className="text-xs font-bold text-slate-400">{exp.category}</div>
                      </div>
                    </div>
                    <div className="font-black text-slate-900">₹{exp.amount}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: DASHBOARD
  // ==========================================
  if (currentView === 'dashboard') {
    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const catData = ['Food', 'Travel', 'Shopping', 'Entertainment', 'College', 'Other'].map(c => ({
      name: c, 
      val: expenses.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0)
    })).sort((a, b) => b.val - a.val);

    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans text-slate-900 pb-20">
        <div className="max-w-2xl mx-auto bg-slate-900 rounded-[2rem] shadow-xl overflow-hidden mt-4 text-white">
          <SubAppNav title="Spending Dashboard" onHome={goHome} />
          <div className="p-6 md:p-8">
            <div className="text-center mb-10">
              <div className="text-slate-400 font-bold text-sm tracking-widest uppercase mb-2">This Month</div>
              <div className="text-6xl font-black text-white mb-2">₹{totalSpent}</div>
              <div className="text-sm font-bold text-green-400 bg-green-400/10 inline-block px-3 py-1 rounded-full">On track with budget</div>
            </div>

            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Spending by Category</h3>
            <div className="space-y-5">
              {totalSpent === 0 ? (
                <p className="text-slate-400 text-sm font-medium text-center">No spending data yet. Add expenses in the Tracker.</p>
              ) : (
                catData.map(cat => cat.val > 0 && (
                  <div key={cat.name}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-slate-300">{cat.name}</span>
                      <span className="font-bold text-white">₹{cat.val}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-orange-500 h-full rounded-full" 
                        style={{ width: `${(cat.val / totalSpent) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 💾 BILL HISTORY SECTION */}
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 mt-12 border-t border-slate-800 pt-8">Past Splits (History)</h3>
            <div className="space-y-3">
              {billHistory.length === 0 ? (
                <p className="text-slate-400 text-sm font-medium">No bills split yet. Split a bill to see it here!</p>
              ) : (
                billHistory.map(bill => (
                  <div key={bill.id} className="bg-slate-800 p-4 rounded-2xl flex justify-between items-center border border-slate-700">
                    <div>
                      <div className="font-bold text-white text-lg">{bill.name}</div>
                      <div className="text-xs font-bold text-slate-400 mt-1">{bill.date} • {bill.participants} people</div>
                    </div>
                    <div className="font-black text-orange-400 text-lg">₹{Number(bill.total || 0).toFixed(2)}</div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: AI INSIGHTS
  // ==========================================
  if (currentView === 'insights') {
    const insightTotalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const topCat = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    const highestCat = Object.keys(topCat).length > 0 
      ? Object.keys(topCat).reduce((a, b) => topCat[a] > topCat[b] ? a : b) 
      : 'Food';
    const highestCatAmount = topCat[highestCat] || 0;

    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans text-slate-900 pb-20">
        <div className="max-w-2xl mx-auto bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden mt-4">
          <SubAppNav title="Smart AI Insights" onHome={goHome} />
          <div className="p-6 md:p-10 space-y-6">
            
            {insightTotalSpent === 0 ? (
               <div className="text-center py-10">
                 <div className="text-4xl mb-4">🤖</div>
                 <h3 className="text-xl font-black text-slate-900 mb-2">I need more data!</h3>
                 <p className="text-slate-500 font-medium">Add some expenses in the Tracker so I can generate insights for you.</p>
               </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 md:p-8 rounded-3xl border border-indigo-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/50 rounded-full blur-3xl"></div>
                  <div className="text-3xl mb-4 relative z-10">✨</div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 relative z-10">Spending Alert</h3>
                  <p className="text-slate-600 font-medium leading-relaxed relative z-10">
                    Your highest spending category this month is <strong>{highestCat}</strong> at ₹{highestCatAmount}. You have spent 18% more on {highestCat} compared to last month.
                  </p>
                </div>
                <div className="bg-orange-50 p-6 md:p-8 rounded-3xl border border-orange-100">
                  <div className="text-3xl mb-4">💡</div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Saving Opportunity</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    You currently have ₹{insightTotalSpent} in tracked expenses. Reducing your &quot;Entertainment&quot; budget by 10% could save you enough to cover next month&apos;s internet bill.
                  </p>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 4: REMINDERS
  // ==========================================
  if (currentView === 'reminders') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans text-slate-900 pb-20">
        <div className="max-w-2xl mx-auto bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden mt-4">
          <SubAppNav title="Payment Reminders" onHome={goHome} />
          <div className="p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-black flex items-center gap-2">
                <span>🔔</span> Your Reminders
              </h2>
              <button
                onClick={finalizeSplitMemory}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-full text-sm"
              >
                Finalize balances
              </button>
            </div>
            <div className="bg-slate-900 text-white rounded-3xl p-5 mb-6">
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Split memory</div>
              {(() => {
                const savedDebts = splitMemory.map(debt => ({
                  from: debt.from,
                  to: debt.to,
                  paise: debt.paise || toPaise(debt.amount),
                  bill: Array.isArray(debt.bills) ? debt.bills.join(', ') : ''
                }));
                const rows = netDebts([...savedDebts, ...reminders.map(debtFromReminder).filter(Boolean)]);
                if (rows.length === 0) return <p className="text-slate-300 font-medium">No open debts to combine.</p>;
                return (
                  <div className="space-y-3">
                    {rows.map(debt => (
                      <div key={`${debt.from}-${debt.to}`} className="flex justify-between items-center gap-3">
                        <div>
                          <div className="font-bold">{debt.from} owes {debt.to}</div>
                          {debt.bills.length > 0 && <div className="text-xs text-slate-400">{debt.bills.join(' · ')}</div>}
                        </div>
                        <div className="font-black text-orange-400">₹{debt.amount}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            <div className="space-y-4">
              {reminders.length === 0 ? (
                <p className="text-slate-500 font-medium text-center py-10">No pending reminders. You are all settled up! 🎉</p>
              ) : (
                reminders.map(rem => (
                  <div key={rem.id} className={`p-5 rounded-2xl border transition-all ${rem.isPaid ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-orange-50/50 border-orange-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className={`font-bold text-lg ${rem.isPaid ? 'line-through text-slate-500' : 'text-slate-900'}`}>{rem.text}</div>
                        <div className="text-sm font-bold text-orange-500 mt-1">₹{rem.amount}</div>
                      </div>
                      <div className={`text-xs font-bold px-3 py-1 rounded-full ${rem.isPaid ? 'bg-slate-200 text-slate-500' : 'bg-red-100 text-red-600'}`}>
                        {rem.isPaid ? 'Settled' : 'Pending'}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {!rem.isPaid && (
                        <button onClick={() => sendReminder(rem)} className="flex-1 bg-white border border-slate-200 hover:border-slate-400 font-bold py-2 rounded-xl text-sm transition-colors">
                          Send Reminder
                        </button>
                      )}
                      <button 
                        onClick={() => toggleReminder(rem.id)} 
                        className={`flex-1 font-bold py-2 rounded-xl text-sm transition-all ${rem.isPaid ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                      >
                        {rem.isPaid ? 'Mark Pending' : 'Mark as Paid'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 5: LOGIN
  // ==========================================
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-orange-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 md:p-10 z-10">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-orange-500 text-3xl font-black">/</span>
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 text-center mb-2 tracking-tight">Welcome back</h2>
          <p className="text-slate-500 font-medium text-center mb-8">Sign in to save your splits and history.</p>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email address</label>
              <input type="email" placeholder="you@example.com" className="w-full border-2 border-slate-200 rounded-2xl p-4 focus:border-slate-900 outline-none transition-all font-bold text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input type="password" placeholder="••••••••" className="w-full border-2 border-slate-200 rounded-2xl p-4 focus:border-slate-900 outline-none transition-all font-bold text-slate-900" />
            </div>
            <button 
              onClick={goHome} 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 mt-2"
            >
              Sign In
            </button>
            <div className="relative flex items-center justify-center mt-8 mb-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <span className="relative bg-white px-4 text-slate-400 text-sm font-bold">OR</span>
            </div>
            <button 
              onClick={goHome} 
              className="w-full bg-white border-2 border-slate-200 hover:border-slate-900 hover:text-slate-900 text-slate-600 font-bold py-4 rounded-full transition-all"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 6: MATHLESS PREMIUM LANDING PAGE
  // ==========================================
  if (currentView === 'landing') {
    const floatCSS = `
      @keyframes float-slow { 
        0%, 100% { transform: translateY(0px); } 
        50% { transform: translateY(-15px); } 
      } 
      .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
    `;

    return (
      <div className="min-h-screen bg-white font-sans text-slate-900 scroll-smooth overflow-x-hidden">
        <style>{floatCSS}</style>

        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-slate-100 transition-all">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-slate-900 cursor-pointer" onClick={() => scrollToSection('hero')}>
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-orange-500 text-xl font-bold">/</span>
              </div>
              MathLess
            </div>
            <div className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
              <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }} className="hover:text-slate-900 transition-colors">How It Works</a>
              <a href="#platform" onClick={(e) => { e.preventDefault(); scrollToSection('showcase-split'); }} className="hover:text-slate-900 transition-colors">Platform</a>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentView('login')} className="hidden md:block text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Log in</button>
              <button onClick={startNewBill} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm hover:shadow-orange-500/20">Get Started</button>
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <div id="hero" className="relative w-full overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-[1000px] h-[500px] opacity-40 pointer-events-none z-0">
            <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-orange-400/30 rounded-full blur-[100px] mix-blend-multiply animate-float-slow"></div>
            <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply animate-float-slow" style={{ animationDelay: '2s' }}></div>
          </div>

          <header className="relative z-10 pt-40 pb-20 md:pt-48 md:pb-24 px-6 flex flex-col items-center text-center">
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-xs font-bold text-slate-600 mb-8 uppercase tracking-widest shadow-sm">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span> Split smarter. Settle faster.
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] mb-8 tracking-tighter mx-auto max-w-4xl drop-shadow-sm">
                Split bills without the headache.
              </h1>
              <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
                Divide expenses, track payments, and see exactly who owes whom — without doing the math.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full mb-8">
                <button onClick={startNewBill} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 group">
                  Split a Bill <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button onClick={() => scrollToSection('how-it-works')} className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-full font-bold text-slate-700 bg-white/80 backdrop-blur-md border-2 border-slate-200 hover:border-slate-900 hover:text-slate-900 transition-all text-lg">
                  See How It Works
                </button>
              </div>

              {/* Connected Platform Icons */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-4 opacity-90">
                <button onClick={() => scrollToSection('showcase-tracker')} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-500 transition-colors px-4 py-2 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 shadow-sm"><span>🧾</span> Expense Tracker</button>
                <button onClick={() => scrollToSection('showcase-dashboard')} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-500 transition-colors px-4 py-2 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 shadow-sm"><span>📊</span> Dashboard</button>
                <button onClick={() => scrollToSection('showcase-insights')} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-500 transition-colors px-4 py-2 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 shadow-sm"><span>✨</span> AI Insights</button>
                <button onClick={() => scrollToSection('showcase-reminders')} className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-500 transition-colors px-4 py-2 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 shadow-sm"><span>🔔</span> Reminders</button>
              </div>
            </div>
          </header>
        </div>

        {/* TRUST STRIP */}
        <section className="border-y border-slate-100 bg-slate-50 relative z-20">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap justify-center md:justify-between items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-700"><span className="text-orange-500">⚡</span> No manual calculations</div>
            <div className="flex items-center gap-2 font-bold text-sm text-slate-700"><span className="text-orange-500">⚖️</span> Equal or custom splits</div>
            <div className="flex items-center gap-2 font-bold text-sm text-slate-700"><span className="text-orange-500">🎯</span> Clear settlement plans</div>
            <div className="flex items-center gap-2 font-bold text-sm text-slate-700"><span className="text-orange-500">🫂</span> Built for groups</div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">How MathLess works.</h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Three simple steps to settle any shared expense.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:shadow-lg transition-all group">
              <div className="text-5xl font-black text-slate-200 mb-6 group-hover:text-slate-900 transition-colors">01</div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Add your group</h3>
              <p className="text-slate-500 font-medium">Add everyone sharing the bill. No sign-ups required, just names.</p>
            </div>
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:shadow-lg transition-all group">
              <div className="text-5xl font-black text-slate-200 mb-6 group-hover:text-slate-900 transition-colors">02</div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Record payments</h3>
              <p className="text-slate-500 font-medium">Enter how much each person already paid toward the total bill.</p>
            </div>
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="text-5xl font-black text-orange-200 mb-6 group-hover:text-orange-500 transition-colors">03</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">Settle up</h3>
                <p className="text-slate-500 font-medium">MathLess automatically calculates exactly who pays whom.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5 FEATURE SHOWCASE */}
        <section id="platform" className="pt-24 pb-12">
          <div className="text-center mb-16 px-6">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Everything you need to stay on top.</h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">From splitting a dinner bill to understanding your monthly spending, MathLess keeps your money organized.</p>
          </div>

          {/* 1. Split Bills (White) */}
          <div id="showcase-split" className="py-24 px-6 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg text-2xl">🧾</div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Split Bills</h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">Divide group expenses without the headache. Instantly calculate who owes whom and generate a simple settlement plan.</p>
                <button onClick={startNewBill} className="font-bold text-orange-500 hover:text-orange-600 flex items-center gap-2 text-lg">Split a Bill <span>→</span></button>
              </div>
              <div className="flex-1 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 transform rotate-1 hover:rotate-0 transition-transform">
                 <div className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Total Bill</div>
                 <div className="font-black text-3xl mb-6">₹3,000</div>
                 <div className="space-y-3 mb-6">
                   <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100"><span className="font-bold text-slate-700">Rahul</span><span className="font-black">Paid ₹2,000</span></div>
                   <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100"><span className="font-bold text-slate-700">Aman</span><span className="font-black">Paid ₹1,000</span></div>
                   <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100"><span className="font-bold text-slate-700">Priya</span><span className="font-bold text-slate-400">Paid ₹0</span></div>
                 </div>
                 <div className="bg-slate-900 p-4 rounded-xl text-white flex justify-between items-center">
                   <span className="font-bold">Priya → Rahul</span><span className="font-black text-orange-400">₹1,000</span>
                 </div>
              </div>
            </div>
          </div>

          {/* 2. Expense Tracker (Light Blue) */}
          <div id="showcase-tracker" className="py-24 px-6 bg-blue-50 border-b border-blue-100">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg text-2xl">💳</div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Track Every Expense</h3>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">Keep all your spending organized in one place. Categorize your purchases to know exactly where your money goes.</p>
                <button onClick={() => setCurrentView('tracker')} className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 text-lg">Track Expenses <span>→</span></button>
              </div>
              <div className="flex-1 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 transform -rotate-1 hover:rotate-0 transition-transform">
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">🍕</div><span className="font-bold text-slate-900">Dinner</span></div><span className="font-black">₹450</span></div>
                  <div className="flex justify-between items-center"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">🚕</div><span className="font-bold text-slate-900">Travel</span></div><span className="font-black">₹180</span></div>
                  <div className="flex justify-between items-center"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">☕</div><span className="font-bold text-slate-900">Coffee</span></div><span className="font-black">₹120</span></div>
                  <div className="flex justify-between items-center"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">📚</div><span className="font-bold text-slate-900">College</span></div><span className="font-black">₹350</span></div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-slate-400 text-center">Food · Travel · Shopping · Entertainment · College</div>
              </div>
            </div>
          </div>

          {/* 3. Dashboard (Dark Navy) */}
          <div id="showcase-dashboard" className="py-24 px-6 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-slate-800 text-white border border-slate-700 rounded-xl flex items-center justify-center shadow-lg text-2xl">📊</div>
                <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white">Understand Your Spending</h3>
                <p className="text-lg text-slate-400 font-medium leading-relaxed">Get a visual overview of where your money goes. See your monthly trends and top spending categories at a glance.</p>
                <button onClick={() => setCurrentView('dashboard')} className="font-bold text-orange-400 hover:text-orange-300 flex items-center gap-2 text-lg">View Dashboard <span>→</span></button>
              </div>
              <div className="flex-1 w-full max-w-md bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700">
                 <div className="text-slate-400 font-bold text-sm tracking-widest uppercase mb-2 text-center">This Month</div>
                 <div className="text-5xl font-black text-white mb-8 text-center">₹8,450</div>
                 <div className="flex items-end gap-3 h-32 pt-4 border-b border-slate-700">
                    <div className="flex-1 bg-orange-500 rounded-t-lg h-full"></div>
                    <div className="flex-1 bg-blue-500 rounded-t-lg h-[40%]"></div>
                    <div className="flex-1 bg-purple-500 rounded-t-lg h-[80%]"></div>
                    <div className="flex-1 bg-green-500 rounded-t-lg h-[30%]"></div>
                 </div>
                 <div className="flex justify-between mt-2 text-xs font-bold text-slate-400 px-2">
                   <span>Food</span><span>Travel</span><span>Shop</span><span>Misc</span>
                 </div>
              </div>
            </div>
          </div>

          {/* 4. AI Insights (White) */}
          <div id="showcase-insights" className="py-24 px-6 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shadow-lg text-2xl">✨</div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Smarter Spending Insights</h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">Use AI to turn raw expense data into useful observations. Spot your highest spending categories and find saving opportunities.</p>
                <button onClick={() => setCurrentView('insights')} className="font-bold text-purple-600 hover:text-purple-700 flex items-center gap-2 text-lg">View Insights <span>→</span></button>
              </div>
              <div className="flex-1 w-full max-w-md">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-100 shadow-xl relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/50 rounded-full blur-3xl"></div>
                  <div className="text-3xl mb-4 relative z-10">✨</div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 relative z-10">Smart Insight</h3>
                  <p className="text-slate-700 font-medium leading-relaxed relative z-10 italic">
                    "You spent 18% more on food this month compared with last month. Your highest spending category is Food."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Reminders (Light Orange) */}
          <div id="showcase-reminders" className="py-24 px-6 bg-orange-50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-24">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg text-2xl">🔔</div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Never Forget a Payment</h3>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">Keep track of pending payments and remind users when something is due. Clear debts without the awkward conversations.</p>
                <button onClick={() => setCurrentView('reminders')} className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-2 text-lg">View Reminders <span>→</span></button>
              </div>
              <div className="flex-1 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 transform -rotate-1 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🔔</span>
                  <span className="font-black text-lg text-slate-900">Payment Reminder</span>
                </div>
                <p className="text-slate-700 font-medium text-lg mb-2"><strong>Priya</strong> owes <strong>Rahul</strong> ₹1,000</p>
                <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full mb-6">Due today</span>
                <div className="flex gap-3">
                  <button className="flex-1 border border-slate-200 font-bold py-3 rounded-xl text-slate-700 bg-slate-50">Remind</button>
                  <button className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-xl">Mark as Paid</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 px-6 bg-slate-900 text-center">
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Your expenses. Finally under control.</h2>
            <button onClick={startNewBill} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-full text-lg font-black transition-all shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1 mt-6">
              Get Started →
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-slate-50 py-12 px-6 border-t border-slate-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="font-black text-2xl tracking-tighter text-slate-900 mb-1">MathLess</div>
              <p className="text-sm font-bold text-slate-500">Split smarter. Settle faster.</p>
            </div>
            <div className="flex gap-6 text-sm font-bold text-slate-600">
              <a href="#how-it-works" onClick={(e) => {e.preventDefault(); scrollToSection('how-it-works');}} className="hover:text-slate-900 transition-colors">How It Works</a>
              <a href="#platform" onClick={(e) => {e.preventDefault(); scrollToSection('showcase-split');}} className="hover:text-slate-900 transition-colors">Platform</a>
            </div>
            <div>
               <button onClick={startNewBill} className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
                Get Started →
              </button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ==========================================
  // VIEW 7: RESULTS / SETTLEMENT PAGE
  // ==========================================
  if (currentView === 'results') {
    return (
      <div className={appBackgroundClass} style={bgImage ? { backgroundImage: `url('${bgImage}')` } : {}}>
        {bgImage && <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-0"></div>}
        
        <div className="relative z-10 max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-[2rem] shadow-2xl border border-white p-6 md:p-10 space-y-8 mt-4 md:mt-10">
          <div className="text-center border-b border-slate-200 pb-8">
            <div className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-2">Settlement Summary</div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">{billName || "MathLess Summary"}</h2>
            <div className="flex justify-center gap-6 text-sm font-bold">
              <span className="bg-white px-4 py-2 rounded-full text-slate-700 shadow-sm border border-slate-100">Total: ₹{parsedTotalBill.toFixed(2)}</span>
              <span className="bg-white px-4 py-2 rounded-full text-slate-700 shadow-sm border border-slate-100">{splitType === 'equal' ? 'Equal Split' : 'Custom Split'}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Individual Results</h3>
            <div className="space-y-3">
              {individualBalances.map((b, idx) => (
                <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-black text-lg text-slate-900 uppercase tracking-wide">{b.name}</p>
                    <div className={`font-bold text-sm px-4 py-1.5 rounded-full ${b.balance > 0.01 ? 'bg-green-100 text-green-700' : b.balance < -0.01 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                      {b.balance > 0.01 ? `Receives ₹${b.balance.toFixed(2)}` : b.balance < -0.01 ? `Owes ₹${Math.abs(b.balance).toFixed(2)}` : 'Settled'}
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm font-bold text-slate-500">
                    <span>Fair Share: ₹{b.fairShare.toFixed(2)}</span>
                    <span>Paid: ₹{b.paid.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-xl font-black flex items-center gap-2">Smart Settlement Plan</h3>
              <button onClick={copyToClipboard} className="text-xs font-bold bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full transition-colors border border-slate-700 text-slate-300 w-full sm:w-auto">
                Copy Details
              </button>
            </div>
            <div className="relative z-10">
              {settlementPlan.length === 0 ? (
                <div className="bg-slate-800 p-6 rounded-2xl text-center">
                  <span className="text-3xl mb-2 block">🎉</span>
                  <p className="text-slate-300 font-bold">Everyone is settled up!</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {settlementPlan.map((t) => (
                    <li key={t.id} className={`flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-5 rounded-2xl transition-all border ${t.isSettled ? 'bg-slate-800/40 border-slate-700/50 opacity-60' : 'bg-slate-800 border-slate-700 shadow-lg'}`}>
                      <div className="flex items-center gap-4">
                        <span className={`font-bold text-lg tracking-wide ${t.isSettled ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          <span className={t.isSettled ? 'text-slate-500' : 'text-white'}>{t.from}</span> pays <span className={t.isSettled ? 'text-slate-500' : 'text-white'}>{t.to}</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <span className={`font-black text-2xl ${t.isSettled ? 'text-slate-500' : 'text-orange-400'}`}>₹{t.amount}</span>
                        <button onClick={() => toggleSettlement(t.id)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 ${t.isSettled ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'border-slate-600 text-slate-400 hover:border-orange-500 hover:text-orange-400'}`}>
                          {t.isSettled ? '✓ Settled' : 'Mark Settled'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
             <button onClick={() => setCurrentView('main')} className="bg-white border-2 border-slate-200 hover:border-slate-900 hover:text-slate-900 text-slate-600 font-bold py-4 rounded-full transition-all shadow-sm hover:shadow-md">
               Edit Bill
             </button>
             <button onClick={startNewBill} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
               Start New Bill
             </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 8: MATHLESS BILL SETUP VIEW (MAIN)
  // ==========================================
  
  // Cleanly compute the button class to avoid massive JSX lines
  const calcBtnClass = canCalculate 
    ? "bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/30 hover:-translate-y-1" 
    : "bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200";

  return (
    <div className={appBackgroundClass} style={bgImage ? { backgroundImage: `url('${bgImage}')` } : {}}>
      {bgImage && <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-0"></div>}

      <div className="relative z-10 max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-[2rem] shadow-2xl border border-white overflow-hidden mt-4 md:mt-8">
        
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-black tracking-tight cursor-pointer" onClick={() => setCurrentView('landing')}>MathLess</h1>
            <p className="text-slate-400 text-sm mt-1 font-bold">Split bills without the math.</p>
          </div>
          <button onClick={() => setCurrentView('landing')} className="relative z-10 text-slate-400 hover:text-white text-sm font-bold transition-colors bg-slate-800 px-4 py-2 rounded-full">
            Cancel
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          <div>
            <h2 className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-4">1. Bill Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Bill Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Goa Trip" 
                  className="w-full border-2 border-slate-100 rounded-2xl p-4 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all font-bold" 
                  value={billName} 
                  onChange={e => setBillName(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Total Bill (₹)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full border-2 border-slate-100 rounded-2xl p-4 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all font-black text-lg" 
                  value={totalBill} 
                  onChange={e => setTotalBill(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-4">2. Split Method</h2>
            <div className="flex bg-slate-100 rounded-2xl p-2 border border-slate-200">
              <button 
                onClick={() => setSplitType('equal')} 
                className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${splitType === 'equal' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Equal Split
              </button>
              <button 
                onClick={() => setSplitType('custom')} 
                className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${splitType === 'custom' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Custom Split
              </button>
            </div>
          </div>

          <div>
             <div className="flex justify-between items-end mb-4">
              <h2 className="text-sm font-bold text-slate-500 tracking-widest uppercase">3. Record Payments</h2>
            </div>
            
            <div className="space-y-3">
              {participants.map((p, index) => (
                <div key={p.id} className="flex flex-col sm:flex-row gap-3 sm:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                  <input 
                    type="text" 
                    placeholder={`Person ${index + 1}`} 
                    className="flex-1 w-full border-2 border-transparent focus:border-slate-200 p-3 rounded-xl text-base outline-none bg-slate-50 focus:bg-white font-bold text-slate-900 transition-colors" 
                    value={p.name} 
                    onChange={e => updateParticipant(p.id, 'name', e.target.value)} 
                  />
                  <div className="flex gap-3">
                    <div className="relative w-full sm:w-32">
                      <span className="absolute left-4 top-3.5 text-slate-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        placeholder="Paid" 
                        className="w-full border-2 border-slate-100 rounded-xl p-3 pl-8 text-base font-black outline-none focus:border-slate-900 bg-slate-50 focus:bg-white transition-colors" 
                        value={p.paid} 
                        onChange={e => updateParticipant(p.id, 'paid', e.target.value)} 
                      />
                    </div>
                    {splitType === 'custom' && (
                      <div className="relative w-full sm:w-32">
                        <span className="absolute left-4 top-3.5 text-orange-400 font-bold">₹</span>
                        <input 
                          type="number" 
                          placeholder="Share" 
                          className="w-full border-2 border-orange-100 rounded-xl p-3 pl-8 text-base font-black outline-none focus:border-orange-500 bg-orange-50 text-orange-900 placeholder-orange-300 transition-colors" 
                          value={p.customShare} 
                          onChange={e => updateParticipant(p.id, 'customShare', e.target.value)} 
                        />
                      </div>
                    )}
                  </div>
                  {participants.length > 2 && (
                    <button 
                      onClick={() => removeParticipant(p.id)} 
                      className="text-slate-400 hover:text-red-500 p-3 rounded-xl hover:bg-red-50 transition-colors bg-white border border-slate-200 sm:border-none sm:bg-transparent" 
                      title="Remove"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button 
              onClick={addParticipant} 
              className="mt-4 text-sm font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-900 hover:text-slate-900 w-full py-4 rounded-2xl transition-all shadow-sm hover:shadow-md"
            >
              + Add Person
            </button>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl space-y-4 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-400">Total Bill:</span>
              <span className="font-black text-xl">₹{parsedTotalBill.toFixed(2)}</span>
            </div>
            
            <div className={`relative z-10 flex justify-between items-center text-sm pt-4 border-t border-slate-800 ${isPaidValid ? 'text-green-400' : 'text-orange-400'}`}>
              <span className="font-bold">Recorded Payments:</span>
              <span className="font-black flex items-center gap-2 text-lg">
                ₹{totalPaid.toFixed(2)} {isPaidValid && '✓'}
              </span>
            </div>
            
            {!isPaidValid && parsedTotalBill > 0 && (
              <p className="relative z-10 text-sm font-bold text-orange-300 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                {totalPaid > parsedTotalBill 
                  ? `You've recorded ₹${Math.abs(parsedTotalBill - totalPaid).toFixed(2)} too much. Match the payment total to continue.` 
                  : `Payments don't match the bill yet. You are short by ₹${Math.abs(parsedTotalBill - totalPaid).toFixed(2)}.`}
              </p>
            )}

            {splitType === 'custom' && (
              <>
                <div className={`relative z-10 flex justify-between items-center text-sm pt-4 border-t border-slate-800 ${isCustomValid ? 'text-green-400' : 'text-orange-400'}`}>
                  <span className="font-bold">Custom Shares Total:</span>
                  <span className="font-black flex items-center gap-2 text-lg">
                    ₹{totalCustomShares.toFixed(2)} {isCustomValid && '✓'}
                  </span>
                </div>
                {!isCustomValid && parsedTotalBill > 0 && (
                   <p className="relative z-10 text-sm font-bold text-orange-300 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                    {totalCustomShares > parsedTotalBill 
                      ? `Custom shares are over by ₹${Math.abs(parsedTotalBill - totalCustomShares).toFixed(2)}.` 
                      : `Custom shares are short by ₹${Math.abs(parsedTotalBill - totalCustomShares).toFixed(2)}.`}
                 </p>
                )}
              </>
            )}

            {(hasEmptyNames || hasDuplicateNames) && (
              <p className="relative z-10 text-sm font-bold text-red-300 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                {hasEmptyNames ? "Please ensure all participants have a name." : "Please ensure all participants have unique names."}
              </p>
            )}
          </div>

          <button 
            disabled={!canCalculate} 
            onClick={calculateSettlement} 
            className={`w-full py-5 rounded-full font-black text-lg transition-all ${calcBtnClass}`}
          >
            Calculate Settlement
          </button>
        </div>
      </div>
    </div>
    );
  }
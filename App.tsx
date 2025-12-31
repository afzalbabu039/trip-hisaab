import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Trip, Expense, Member, Category, AppSettings, UserProfile, Language, Currency } from './types';
import { INITIAL_TRIPS, INITIAL_EXPENSES, CATEGORY_ICONS } from './constants';
import { 
  Plus, ChevronLeft, Trash2, Wallet, Users, Info, ArrowRight, Share2, 
  Receipt, Settings, PieChart, Moon, Sun, Filter, User, Bell,
  CheckCircle2, MapPin, Calendar, Clock, BarChart3, TrendingUp, Camera, Save, X, 
  Globe, IndianRupee, Gift, ChevronRight, Award, Database, RefreshCw, AlertTriangle,
  History, LayoutDashboard, Calculator, ArrowUpRight, ArrowDownLeft, Edit2, WifiOff, Wifi,
  DollarSign, Languages, Copy, Check, MoreVertical, UserPlus
} from 'lucide-react';
import { 
  formatCurrency, generateId, calculateBalances, 
  getSettlements, getCategoryStats 
} from './utils';

// --- Shared Components ---

type TripTab = 'summary' | 'analytics';

const OfflineIndicator: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  if (isOnline) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest py-1 flex items-center justify-center gap-2 shadow-lg">
      <WifiOff size={10} />
      You are using TripHisaab in Offline Mode.
    </div>
  );
};

const HomeView: React.FC<{
  trips: Trip[];
  expenses: Expense[];
  onSelectTrip: (id: string) => void;
  onCreateTrip: () => void;
  onOpenSettings: () => void;
  onOpenBreakdown: () => void;
  settings: AppSettings;
  user: UserProfile;
}> = ({ trips, expenses, onSelectTrip, onCreateTrip, onOpenSettings, onOpenBreakdown, settings, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTrips = trips.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.location && t.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalSpent = expenses.reduce((sum: number, e: Expense) => sum + e.amount, 0);

  return (
    <div className={`pb-32 p-4 min-h-screen transition-all duration-300 ${settings.theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-[#FDFDFD] text-gray-900'}`}>
      <header className="flex justify-between items-center mb-6 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 shadow-sm" style={{ borderColor: settings.primaryColor }}>
            <img src={user.photo} alt="profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-bold opacity-50 uppercase tracking-tighter">Namaste,</p>
            <h1 className="text-xl font-black tracking-tight" style={{ color: settings.primaryColor }}>{user.name}</h1>
          </div>
        </div>
        <button onClick={onOpenSettings} className={`p-3 rounded-2xl border transition-all ${settings.theme === 'dark' ? 'border-gray-800 bg-gray-900 text-gray-400' : 'bg-white border-gray-100 text-gray-600 shadow-sm hover:shadow-md'}`}>
          <Settings size={22}/>
        </button>
      </header>

      {/* Lifetime Spend Card (Home) */}
      <button 
        onClick={onOpenBreakdown}
        className={`w-full mb-8 p-6 rounded-[2.5rem] text-left relative overflow-hidden transition-all shadow-xl shadow-green-500/10 active:scale-[0.98] ${settings.theme === 'dark' ? 'bg-green-900/20 border border-green-800/30' : 'bg-green-50 border border-green-100'}`}
      >
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-2">
            <p className="opacity-50 text-[10px] font-bold uppercase tracking-widest">Lifetime Spend</p>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <p className="text-4xl font-black mb-6 tracking-tighter">{formatCurrency(totalSpent, settings.currency.code)}</p>
          <div className="flex gap-3">
             <div className="bg-blue-500/10 px-4 py-2 rounded-2xl flex flex-col">
                <span className="text-[8px] font-black opacity-50 uppercase">Trips</span>
                <span className="text-sm font-black text-blue-500">{trips.length}</span>
             </div>
             <div className="bg-green-500/10 px-4 py-2 rounded-2xl flex flex-col">
                <span className="text-[8px] font-black opacity-50 uppercase">Friends</span>
                <span className="text-sm font-black text-green-500">{Array.from(new Set(trips.flatMap(t => t.members.map(m => m.id)))).length}</span>
             </div>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
      </button>

      <div className="relative mb-8 group">
        <input 
          type="text"
          placeholder="Trip ya City dhundhein..."
          className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all outline-none ${settings.theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white focus:border-blue-500/50' : 'bg-white border-gray-100 shadow-sm focus:border-blue-500 focus:shadow-md font-medium'}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black">All Trips</h2>
      </div>

      <div className="grid gap-6">
        {filteredTrips.map((trip) => (
          <button
            key={trip.id}
            onClick={() => onSelectTrip(trip.id)}
            className={`group w-full text-left overflow-hidden rounded-[2.5rem] border transition-all active:scale-[0.98] ${settings.theme === 'dark' ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-100 shadow-sm hover:shadow-xl'}`}
          >
            <div className="h-44 w-full overflow-hidden relative">
              <img src={trip.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=600'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={trip.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                {trip.location && (
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1 mb-1">
                    <MapPin size={10}/> {trip.location}
                  </p>
                )}
                <h3 className="text-2xl font-black text-white">{trip.name}</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex -space-x-3">
                    {trip.members.slice(0, 3).map((m, i) => (
                      <div key={m.id} className="w-10 h-10 rounded-full border-4 border-white dark:border-gray-900 bg-blue-500 flex items-center justify-center text-xs font-black text-white" style={{ zIndex: 10-i }}>{m.name[0]}</div>
                    ))}
                    {trip.members.length > 3 && (
                      <div className="w-10 h-10 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-[10px] font-black text-gray-500">+{trip.members.length - 3}</div>
                    )}
                </div>
                <div className="text-right">
                   <p className="text-2xl font-black text-blue-500">{formatCurrency(trip.totalExpense, settings.currency.code)}</p>
                   <p className="text-[10px] font-black uppercase opacity-40">Trip Total</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onCreateTrip}
        className="fixed bottom-10 right-8 text-white w-20 h-20 rounded-[2.5rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50 ring-8 ring-white dark:ring-gray-900"
        style={{ backgroundColor: settings.primaryColor }}
      >
        <Plus size={40} strokeWidth={3}/>
      </button>
    </div>
  );
};

const TripDetailsView: React.FC<{
  trip: Trip;
  expenses: Expense[];
  onBack: () => void;
  onAddExpense: () => void;
  onEditExpense: (expenseId: string, newAmount: number) => void;
  onDeleteTrip: (tripId: string) => void;
  onAddMember: (tripId: string, name: string) => void;
  settings: AppSettings;
}> = ({ trip, expenses, onBack, onAddExpense, onEditExpense, onDeleteTrip, onAddMember, settings }) => {
  const [activeTab, setActiveTab] = useState<TripTab>('summary');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const [showSharedTooltip, setShowSharedTooltip] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');

  const balances = useMemo(() => calculateBalances(trip, expenses), [trip, expenses]);
  const settlements = useMemo(() => getSettlements(balances), [balances]);
  const categoryStats = getCategoryStats(expenses);
  const avgSpend = trip.totalExpense / (trip.members.length || 1);

  const memberSpending = useMemo(() => {
    const stats: Record<string, number> = {};
    trip.members.forEach(m => stats[m.id] = 0);
    expenses.forEach(e => {
      stats[e.paidBy] = (stats[e.paidBy] || 0) + e.amount;
    });
    return stats;
  }, [expenses, trip.members]);

  const handleStartEdit = (exp: Expense) => {
    setEditingId(exp.id);
    setEditAmount(exp.amount.toString());
  };

  const handleSaveEdit = () => {
    const amt = parseFloat(editAmount);
    if (!isNaN(amt) && editingId) {
      onEditExpense(editingId, amt);
      setEditingId(null);
    }
  };

  const handleAddMemberSubmit = () => {
    if (newMemberName.trim()) {
      onAddMember(trip.id, newMemberName.trim());
      setNewMemberName('');
      setShowAddMember(false);
    }
  };

  const handleShareSummary = async () => {
    let text = `🚩 Trip Summary: ${trip.name}\n`;
    text += `💰 Total Spent: ${formatCurrency(trip.totalExpense, settings.currency.code)}\n\n`;
    
    text += `👥 Hisaab Status:\n`;
    balances.forEach(b => {
      const m = trip.members.find(mem => mem.id === b.memberId);
      const isCreditor = b.balance >= 0.01;
      const isDebtor = b.balance <= -0.01;
      
      if (isCreditor) {
        text += `- ${m?.name} ko ₹${Math.abs(b.balance).toFixed(0)} lene hain\n`;
      } else if (isDebtor) {
        text += `- ${m?.name} ko ₹${Math.abs(b.balance).toFixed(0)} dene hain\n`;
      } else {
        text += `- ${m?.name} ka Hisaab barabar hai\n`;
      }
    });

    if (settlements.length > 0) {
      text += `\n🔄 Settlement Details:\n`;
      settlements.forEach(s => {
        const from = trip.members.find(m => m.id === s.from)?.name;
        const to = trip.members.find(m => m.id === s.to)?.name;
        text += `- ${from} ko ${to} ko ${formatCurrency(s.amount, settings.currency.code)} dene hain\n`;
      });
    } else {
      text += `\n✅ Sab Settled Hai!\n`;
    }

    text += `\nShared via TripHisaab ✈️`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `TripHisaab: ${trip.name}`, text });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setShowSharedTooltip(true);
        setTimeout(() => setShowSharedTooltip(false), 2000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 flex flex-col ${settings.theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-[#F2F4F7] text-gray-900'}`}>
      
      <header className="px-4 py-6 flex items-center justify-between z-30 relative">
        <button onClick={onBack} className={`p-3 rounded-2xl border transition-all ${settings.theme === 'dark' ? 'border-gray-800 bg-gray-900/50' : 'bg-white border-gray-100 shadow-sm'}`}>
          <ChevronLeft size={20}/>
        </button>
        <h1 className="text-xl font-black text-center flex-1 truncate px-2">{trip.name}</h1>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`p-3 rounded-2xl border transition-all ${settings.theme === 'dark' ? 'border-gray-800 bg-gray-900/50' : 'bg-white border-gray-100 shadow-sm'}`}
          >
            <MoreVertical size={20}/>
          </button>
          {showMenu && (
            <div className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-xl z-50 border overflow-hidden ${settings.theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              <button 
                onClick={() => { setShowMenu(false); setShowAddMember(true); }}
                className={`w-full px-4 py-4 flex items-center gap-3 font-bold transition-colors ${settings.theme === 'dark' ? 'text-blue-400 hover:bg-blue-950/20' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <UserPlus size={18}/>
                <span>Add Member</span>
              </button>
              <button 
                onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }}
                className="w-full px-4 py-4 flex items-center gap-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-t dark:border-gray-800"
              >
                <Trash2 size={18}/>
                <span>Delete Trip</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className={`w-full max-w-sm p-8 rounded-[2.5rem] text-center ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <AlertTriangle size={32} className="mx-auto mb-6 text-red-500" />
            <h2 className="text-xl font-black mb-2">Are you sure you want to delete this trip?</h2>
            <p className="text-sm opacity-50 mb-8">Is trip ka poora data (expenses, members, settlement) delete ho jayega.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => onDeleteTrip(trip.id)} 
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-red-500/20"
              >
                Delete Trip
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)} 
                className={`w-full py-4 rounded-2xl font-black text-sm border ${settings.theme === 'dark' ? 'border-gray-800 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className={`w-full max-w-sm p-8 rounded-[2.5rem] text-center ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-500 mx-auto mb-6">
              <UserPlus size={32} />
            </div>
            <h2 className="text-xl font-black mb-2">Add New Member</h2>
            <p className="text-sm opacity-50 mb-6">Apne friend ka naam likhein.</p>
            <input 
              autoFocus
              type="text" 
              placeholder="Friend ka naam..."
              className={`w-full p-5 rounded-2xl border font-black outline-none mb-6 ${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMemberSubmit()}
            />
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleAddMemberSubmit} 
                className="w-full py-4 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20"
                style={{ backgroundColor: settings.primaryColor }}
              >
                Add Friend
              </button>
              <button 
                onClick={() => { setShowAddMember(false); setNewMemberName(''); }} 
                className={`w-full py-4 rounded-2xl font-black text-sm border ${settings.theme === 'dark' ? 'border-gray-800 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="px-6 pb-12 text-center relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase opacity-40 tracking-[0.3em] mb-1">Total Spend</p>
          <p className="text-5xl font-black text-blue-600 tracking-tighter">{formatCurrency(trip.totalExpense, settings.currency.code)}</p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]"></div>
      </section>

      <div className={`flex-1 mx-4 -mt-6 p-6 rounded-t-[3.5rem] shadow-2xl z-20 transition-all ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'summary' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'bg-gray-50 dark:bg-gray-800 opacity-40'}`}
          >
            Summary
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'bg-gray-50 dark:bg-gray-800 opacity-40'}`}
          >
            Analytics
          </button>
        </div>

        <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-500">
          {activeTab === 'summary' && (
            <div className="space-y-10">
              
              <div className="flex items-center justify-between px-4 py-4 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                <p className="text-[10px] font-black uppercase opacity-40">Per person average</p>
                <p className="text-sm font-black text-blue-600">{formatCurrency(avgSpend, settings.currency.code)}</p>
              </div>

              <button 
                onClick={handleShareSummary}
                className="w-full py-5 rounded-[2rem] border-2 border-dashed flex items-center justify-center gap-3 transition-all active:scale-95 group relative"
                style={{ borderColor: `${settings.primaryColor}30`, color: settings.primaryColor }}
              >
                <Share2 size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="font-black text-xs uppercase tracking-widest">Share Summary with Dosts</span>
                {showSharedTooltip && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 animate-bounce">
                    <Check size={12} /> Summary Copied!
                  </div>
                )}
              </button>

              <section className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 flex items-center gap-2">
                    <Users size={12}/> All Members Status
                  </h3>
                  <button 
                    onClick={() => setShowAddMember(true)}
                    className="text-[10px] font-black uppercase text-blue-500 flex items-center gap-1"
                  >
                    <Plus size={10} /> Add Friend
                  </button>
                </div>
                <div className="space-y-3">
                  {balances.map(b => {
                    const m = trip.members.find(mem => mem.id === b.memberId);
                    const isCreditor = b.balance >= 0.01;
                    const isDebtor = b.balance <= -0.01;
                    
                    return (
                      <div key={b.memberId} className="p-5 rounded-[2rem] border dark:border-gray-800 bg-white dark:bg-gray-900/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center font-black text-xs">
                              {m?.name?.[0] || '?'}
                            </div>
                            <div>
                              <p className="font-black text-sm">{m?.name || 'Unknown'}</p>
                              <p className="text-[10px] font-black opacity-30 uppercase">Paid: {formatCurrency(b.paid, settings.currency.code)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-xs font-black uppercase ${isCreditor ? 'text-green-500' : isDebtor ? 'text-orange-500' : 'text-gray-400'}`}>
                              {isCreditor ? `ko ${formatCurrency(Math.abs(b.balance), settings.currency.code)} lene hain` : isDebtor ? `ko ${formatCurrency(Math.abs(b.balance), settings.currency.code)} dene hain` : 'Hisaab barabar'}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 px-2 flex items-center gap-2">
                  <RefreshCw size={12}/> Settlement Summary
                </h3>
                <div className="space-y-3">
                  {settlements.length > 0 ? settlements.map((s, i) => (
                    <div key={i} className="p-5 rounded-[2rem] bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 flex items-center gap-4">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded-xl text-orange-500"><ArrowRight size={18}/></div>
                      <div className="flex-1 text-sm font-bold">
                        <span className="text-orange-500">{trip.members.find(m => m.id === s.from)?.name}</span>
                        <span className="opacity-40"> ko </span>
                        <span className="text-green-500">{trip.members.find(m => m.id === s.to)?.name}</span>
                        <span className="opacity-40"> ko dene hain</span>
                      </div>
                      <div className="text-blue-600 font-black">{formatCurrency(s.amount, settings.currency.code)}</div>
                    </div>
                  )) : (
                    <div className="p-8 text-center opacity-20 border-2 border-dashed rounded-[2rem] font-black uppercase text-xs">Everything Settled! ✅</div>
                  )}
                </div>
              </section>

              <section className="space-y-4 pb-32">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 px-2">Recent Expenses</h3>
                <div className="space-y-3">
                  {expenses.map(exp => (
                    <div key={exp.id} className="p-5 rounded-[2.5rem] border dark:border-gray-800 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{CATEGORY_ICONS[exp.category]}</span>
                        <div>
                          <p className="font-bold text-sm">{exp.title}</p>
                          <p className="text-[9px] font-black uppercase opacity-30">{trip.members.find(m => m.id === exp.paidBy)?.name} ne pay kiya</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {editingId === exp.id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              autoFocus
                              type="number" 
                              className="w-20 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-black outline-none border border-blue-500"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                            />
                            <button onClick={handleSaveEdit} className="p-2 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20"><CheckCircle2 size={16}/></button>
                            <button onClick={() => setEditingId(null)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl"><X size={16}/></button>
                          </div>
                        ) : (
                          <>
                            <p className="font-black text-blue-600">{formatCurrency(exp.amount, settings.currency.code)}</p>
                            <button 
                              onClick={() => handleStartEdit(exp)}
                              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl opacity-60 hover:opacity-100 transition-all active:scale-90"
                            >
                              <Edit2 size={14} className="text-blue-500" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8 pb-32">
              <section className={`p-8 rounded-[3rem] border shadow-sm ${settings.theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50/50 border-gray-100'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-8">Category wise Chart</h3>
                <div className="flex items-center gap-8">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      {(() => {
                        const entries = Object.entries(categoryStats) as [Category, number][];
                        const total = entries.reduce((acc: number, curr: [Category, number]) => acc + curr[1], 0);
                        let cumulativeOffset = 0;
                        const colors = ['#2979FF', '#00C853', '#FF9100', '#F50057', '#651FFF'];

                        return entries.map(([cat, val], idx) => {
                          const percentage = total > 0 ? (val / total) * 100 : 0;
                          const currentOffset = cumulativeOffset;
                          if (percentage > 0) cumulativeOffset += percentage;

                          return percentage > 0 && (
                            <circle
                              key={cat}
                              cx="18" cy="18" r="15.9"
                              fill="transparent"
                              stroke={colors[idx % colors.length]}
                              strokeWidth="4"
                              strokeDasharray={`${percentage} ${100 - percentage}`}
                              strokeDashoffset={-currentOffset}
                              className="transition-all duration-1000"
                            />
                          );
                        });
                      })()}
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <LayoutDashboard size={14} className="text-blue-500"/>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    {(Object.entries(categoryStats) as [Category, number][]).map(([cat, val], idx) => val > 0 && (
                      <div key={cat} className="flex items-center justify-between text-[10px] font-black">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#2979FF', '#00C853', '#FF9100', '#F50057', '#651FFF'][idx] }}></div>
                          <span className="opacity-40 uppercase tracking-tighter">{cat}</span>
                        </div>
                        <span>{formatCurrency(val, settings.currency.code)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className={`p-8 rounded-[3rem] border shadow-sm ${settings.theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50/50 border-gray-100'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-8">Member wise Chart</h3>
                <div className="space-y-6">
                  {trip.members.map((m, idx) => {
                    const spend = memberSpending[m.id] || 0;
                    const maxSpend = Math.max(...Object.values(memberSpending), 1);
                    const width = (spend / maxSpend) * 100;
                    const colors = ['#2979FF', '#00C853', '#FF9100', '#F50057', '#651FFF'];
                    return (
                      <div key={m.id} className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black">
                          <span className="opacity-60 uppercase tracking-tighter">{m.name}</span>
                          <span className="text-blue-600">{formatCurrency(spend, settings.currency.code)}</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-1000 rounded-full" 
                            style={{ width: `${width}%`, backgroundColor: colors[idx % colors.length] }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      <button onClick={onAddExpense} className="fixed bottom-12 left-1/2 -translate-x-1/2 text-white px-12 py-5 rounded-full shadow-2xl font-black text-lg active:scale-95 transition-all z-50 ring-8 ring-white dark:ring-gray-950" style={{ backgroundColor: settings.primaryColor }}>
        + Add Expense
      </button>
    </div>
  );
};

const SpendingBreakdownView: React.FC<{
  trips: Trip[];
  expenses: Expense[];
  onBack: () => void;
  settings: AppSettings;
}> = ({ trips, expenses, onBack, settings }) => {
  const categoryStats = getCategoryStats(expenses);
  const totalSpent = expenses.reduce((sum: number, e: Expense) => sum + e.amount, 0);

  const memberTotals = useMemo(() => {
    const stats: Record<string, { name: string, amount: number }> = {};
    expenses.forEach(e => {
      const payerId = e.paidBy;
      if (!stats[payerId]) {
        const m = trips.flatMap(t => t.members).find(mem => mem.id === payerId);
        stats[payerId] = { name: m?.name || 'Unknown', amount: 0 };
      }
      stats[payerId].amount += e.amount;
    });
    return Object.values(stats).sort((a, b) => b.amount - a.amount);
  }, [expenses, trips]);

  return (
    <div className={`pb-32 p-4 min-h-screen transition-all duration-300 ${settings.theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-[#FDFDFD] text-gray-900'}`}>
      <header className="flex items-center gap-4 mb-10 pt-4">
        <button onClick={onBack} className={`p-3 rounded-2xl border transition-all ${settings.theme === 'dark' ? 'border-gray-800 bg-gray-900 text-gray-400' : 'bg-white border-gray-100 text-gray-600 shadow-sm hover:shadow-md'}`}>
          <ChevronLeft size={20}/>
        </button>
        <h1 className="text-xl font-black tracking-tight">Professional Summary</h1>
      </header>

      <div className={`w-full mb-8 p-8 rounded-[2.5rem] text-center relative overflow-hidden shadow-xl shadow-blue-500/10 ${settings.theme === 'dark' ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-100'}`}>
        <p className="text-[10px] font-black uppercase opacity-40 tracking-[0.3em] mb-2">Lifetime Total Kharcha</p>
        <p className="text-5xl font-black text-blue-600 tracking-tighter mb-4">{formatCurrency(totalSpent, settings.currency.code)}</p>
        <div className="flex justify-center gap-4">
          <div className="px-4 py-2 bg-blue-500/10 rounded-2xl flex flex-col">
            <span className="text-[8px] font-black opacity-50 uppercase">Total Trips</span>
            <span className="text-sm font-black text-blue-500">{trips.length}</span>
          </div>
          <div className="px-4 py-2 bg-green-500/10 rounded-2xl flex flex-col">
            <span className="text-[8px] font-black opacity-50 uppercase">Expenses</span>
            <span className="text-sm font-black text-green-500">{expenses.length}</span>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <section className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 px-2">Category-wise Summary</h3>
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border dark:border-gray-800 shadow-sm">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {(() => {
                  const entries = Object.entries(categoryStats) as [Category, number][];
                  let cumulativeOffset = 0;
                  const colors = ['#2979FF', '#00C853', '#FF9100', '#F50057', '#651FFF'];

                  return entries.map(([cat, val], idx) => {
                    const percentage = totalSpent > 0 ? (val / totalSpent) * 100 : 0;
                    const currentOffset = cumulativeOffset;
                    if (percentage > 0) cumulativeOffset += percentage;

                    return percentage > 0 && (
                      <circle
                        key={cat}
                        cx="18" cy="18" r="15.9"
                        fill="transparent"
                        stroke={colors[idx % colors.length]}
                        strokeWidth="4"
                        strokeDasharray={`${percentage} ${100 - percentage}`}
                        strokeDashoffset={-currentOffset}
                        className="transition-all duration-1000"
                      />
                    );
                  });
                })()}
              </svg>
            </div>
            <div className="flex-1 w-full grid grid-cols-1 gap-2">
              {(Object.entries(categoryStats) as [Category, number][]).map(([cat, val], idx) => val > 0 && (
                <div key={cat} className="flex justify-between items-center text-[11px] font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#2979FF', '#00C853', '#FF9100', '#F50057', '#651FFF'][idx] }}></div>
                    <span className="opacity-50 uppercase">{cat}</span>
                  </div>
                  <span>{formatCurrency(val, settings.currency.code)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 px-2">Member-wise Summary</h3>
          <div className="space-y-4">
            {memberTotals.map((m, idx) => {
              const maxMemberAmt = Math.max(...memberTotals.map(x => x.amount), 1);
              const width = (m.amount / maxMemberAmt) * 100;
              return (
                <div key={m.name} className={`p-5 rounded-[2rem] border transition-all ${settings.theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black uppercase tracking-tight">{m.name}</span>
                    <span className="font-black text-blue-600 text-sm">{formatCurrency(m.amount, settings.currency.code)}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                     <div 
                      className="h-full bg-blue-500 transition-all duration-1000" 
                      style={{ width: `${width}%` }}
                     ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

const SettingsView: React.FC<{
  onBack: () => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => void;
  onClearData: () => void;
}> = ({ onBack, settings, setSettings, user, onUpdateUser, onClearData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile>(user);
  const [confirmModal, setConfirmModal] = useState<'none' | 'data' | 'cache'>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = () => { onUpdateUser(editedUser); setIsEditing(false); };
  const handlePhotoClick = () => { if (isEditing) fileInputRef.current?.click(); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditedUser({ ...editedUser, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleClearCache = () => { window.location.reload(); };

  const currencies: Currency[] = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' }
  ];

  return (
    <div className={`p-6 min-h-screen transition-all duration-300 ${settings.theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-[#F9FAFB] text-gray-900'}`}>
      <header className="flex items-center gap-4 mb-8 pt-4">
        <button onClick={onBack} className={`p-3 rounded-2xl border ${settings.theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'bg-white border-gray-100 shadow-sm'}`}><ChevronLeft size={20}/></button>
        <h1 className="text-2xl font-black tracking-tight">Mera Profile</h1>
      </header>
      <div className="space-y-6 max-w-md mx-auto">
        <div className={`p-8 rounded-[3rem] border ${settings.theme === 'dark' ? 'bg-gray-900 border-gray-800 shadow-lg' : 'bg-white border-gray-100 shadow-lg shadow-gray-200/50'}`}>
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 group cursor-pointer" onClick={handlePhotoClick}>
              <div className={`w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 ${isEditing ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-white'}`}>
                <img src={isEditing ? editedUser.photo : user.photo} alt="profile" className="w-full h-full object-cover" />
              </div>
              {isEditing && <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center text-white"><Camera size={24} /></div>}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-black">{user.name}</h2>
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.3em] mb-4">{user.phone}</p>
                <button onClick={() => { setEditedUser(user); setIsEditing(true); }} className="px-6 py-2 rounded-xl text-white bg-green-600 text-xs font-black">Edit Karain</button>
              </>
            ) : (
              <div className="space-y-4 w-full">
                <input className={`w-full p-4 rounded-2xl border font-black outline-none ${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`} value={editedUser.name} onChange={e => setEditedUser({...editedUser, name: e.target.value})} />
                <div className="flex gap-2">
                  <button onClick={handleSaveProfile} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm">Save</button>
                  <button onClick={() => setIsEditing(false)} className="px-5 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl"><X size={18}/></button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase opacity-40 px-3">Currency Select Karain</p>
          <div className="grid grid-cols-3 gap-2">
            {currencies.map(c => (
              <button key={c.code} onClick={() => setSettings(s => ({ ...s, currency: c }))} className={`p-4 rounded-[1.5rem] border font-black text-sm transition-all ${settings.currency.code === c.code ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-gray-950 border-gray-100 opacity-60'}`}>
                {c.symbol} {c.code}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => setSettings(s => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }))} className={`w-full p-5 flex items-center justify-between rounded-3xl ${settings.theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <div className="flex items-center gap-4">
             {settings.theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
             <span className="font-black text-sm">Dark Mode</span>
          </div>
          <div className={`w-12 h-6 rounded-full relative transition-colors ${settings.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'}`}>
             <div className={`absolute top-1 bottom-1 w-4 bg-white rounded-full transition-all ${settings.theme === 'dark' ? 'right-1' : 'left-1'}`}></div>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setConfirmModal('data')} className="p-5 flex items-center justify-center gap-2 rounded-3xl text-orange-600 font-black border border-orange-200 bg-orange-50/50"><Database size={18} /> Clear Data</button>
          <button onClick={() => setConfirmModal('cache')} className="p-5 flex items-center justify-center gap-2 rounded-3xl text-gray-500 font-black border border-gray-200 bg-gray-50/50"><RefreshCw size={18} /> Refresh</button>
        </div>
      </div>

      {confirmModal !== 'none' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
          <div className={`w-full max-sm p-8 rounded-[2.5rem] text-center ${settings.theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <AlertTriangle size={32} className="mx-auto mb-6 text-orange-600" />
            <h2 className="text-xl font-black mb-2">{confirmModal === 'data' ? 'Clear All Data?' : 'Refresh App?'}</h2>
            <p className="text-sm opacity-50 mb-8">{confirmModal === 'data' ? 'Trips and Expenses will be gone forever!' : 'App will reload now. Unsaved changes might be lost.'}</p>
            <div className="flex gap-3">
              <button onClick={() => { if (confirmModal === 'data') onClearData(); else handleClearCache(); setConfirmModal('none'); }} className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-black text-sm">Confirm</button>
              <button onClick={() => setConfirmModal('none')} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-black text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CreateTripView: React.FC<{
  onBack: () => void;
  onSave: (trip: Trip) => void;
  settings: AppSettings;
}> = ({ onBack, onSave, settings }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [members, setMembers] = useState<Member[]>([ { id: generateId(), name: '', phone: '' } ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = () => { fileInputRef.current?.click(); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name || !startDate || !endDate || members.some(m => !m.name)) {
      alert("Sari details bharein!");
      return;
    }
    onSave({
      id: generateId(),
      name,
      location,
      startDate,
      endDate,
      members: members.filter(m => m.name.trim() !== ''),
      totalExpense: 0,
      image: image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800'
    });
  };

  return (
    <div className={`p-6 min-h-screen transition-all duration-300 ${settings.theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <header className="flex items-center gap-4 mb-10 pt-4">
        <button onClick={onBack} className={`p-3 rounded-2xl border ${settings.theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'bg-white border-gray-100 shadow-sm'}`}><ChevronLeft size={20}/></button>
        <h1 className="text-2xl font-black tracking-tight">Create Trip</h1>
      </header>
      <div className="space-y-8 max-w-sm mx-auto">
        <div onClick={handlePhotoSelect} className={`w-full aspect-video rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden transition-all group ${settings.theme === 'dark' ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
          {image ? <img src={image} className="w-full h-full object-cover" alt="cover" /> : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 transition-transform group-hover:scale-110"><Camera size={28} /></div>
              <p className="text-xs font-black uppercase opacity-40 tracking-widest">Cover Photo Select Karain</p>
            </>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
        <div className="space-y-3">
          <input className="w-full p-5 rounded-3xl border outline-none font-bold text-lg dark:bg-gray-900 dark:border-gray-800" placeholder="Trip Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="w-full p-5 rounded-3xl border outline-none font-bold dark:bg-gray-900 dark:border-gray-800" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="date" className="p-5 rounded-3xl border dark:bg-gray-900 dark:border-gray-800 font-bold" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <input type="date" className="p-5 rounded-3xl border dark:bg-gray-900 dark:border-gray-800 font-bold" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div className="space-y-4">
          <button onClick={() => setMembers([...members, { id: generateId(), name: '', phone: '' }])} className="text-blue-500 text-xs font-black uppercase tracking-widest">+ Add Member</button>
          {members.map((m, i) => (
            <div key={m.id} className="flex gap-2">
              <input placeholder={`Member ${i+1}`} className="flex-1 p-4 rounded-3xl border dark:bg-gray-900 dark:border-gray-800 font-bold" value={m.name} onChange={e => setMembers(members.map(item => item.id === m.id ? {...item, name: e.target.value} : item))} />
              {members.length > 1 && <button onClick={() => setMembers(members.filter(item => item.id !== m.id))} className="p-3 text-red-500 bg-red-500/10 rounded-2xl"><Trash2 size={20}/></button>}
            </div>
          ))}
        </div>
        <button onClick={handleSave} className="w-full py-6 text-white rounded-[2.5rem] font-black text-xl shadow-xl shadow-blue-500/20" style={{ backgroundColor: settings.primaryColor }}>Trip Save Karein ✅</button>
      </div>
    </div>
  );
};

const AddExpenseView: React.FC<{
  trip: Trip;
  onBack: () => void;
  onSave: (expense: Expense) => void;
  settings: AppSettings;
}> = ({ trip, onBack, onSave, settings }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [paidBy, setPaidBy] = useState(trip.members[0]?.id || '');

  const handleSave = () => {
    const amtNum = parseFloat(amount);
    if (!title || !amount || isNaN(amtNum)) return;
    const share = amtNum / (trip.members.length || 1);
    onSave({
      id: generateId(),
      tripId: trip.id,
      title,
      amount: amtNum,
      paidBy,
      category,
      splitType: 'equal',
      splits: trip.members.map(m => ({ memberId: m.id, amount: share })),
      date: new Date().toISOString()
    });
  };

  return (
    <div className={`p-6 min-h-screen transition-all duration-300 ${settings.theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <header className="flex items-center gap-4 mb-10 pt-4">
        <button onClick={onBack} className="p-3 rounded-2xl border dark:border-gray-800"><ChevronLeft size={20}/></button>
        <h1 className="text-2xl font-black">Add Expense</h1>
      </header>
      <div className="space-y-6 max-w-sm mx-auto">
        <div className="grid grid-cols-5 gap-2">
          {(['Food', 'Hotel', 'Transport', 'Shopping', 'Others'] as Category[]).map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`p-2 rounded-2xl border text-center transition-all ${category === cat ? 'bg-blue-600 border-blue-600 text-white' : 'dark:bg-gray-900 dark:border-gray-800'}`}>
              <span className="text-xl block">{CATEGORY_ICONS[cat]}</span>
              <span className="text-[8px] font-bold">{cat}</span>
            </button>
          ))}
        </div>
        <input className="w-full p-5 rounded-3xl border dark:bg-gray-900 dark:border-gray-800 font-bold" placeholder="Kharcha Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input type="number" className="w-full p-5 rounded-3xl border dark:bg-gray-900 dark:border-gray-800 font-black text-2xl text-blue-500" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} />
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase opacity-40 px-3">Kisne pay kiya?</p>
          <select className="w-full p-5 rounded-3xl border dark:bg-gray-900 dark:border-gray-800 font-bold bg-transparent" value={paidBy} onChange={e => setPaidBy(e.target.value)}>
            {trip.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <button onClick={handleSave} className="w-full py-6 text-white rounded-[2.5rem] font-black text-xl shadow-xl shadow-blue-500/20" style={{ backgroundColor: settings.primaryColor }}>Kharcha Add Karein</button>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'home' | 'create' | 'details' | 'add-expense' | 'settings' | 'breakdown'>('home');
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('triphisaab_trips');
    return saved ? (JSON.parse(saved) as Trip[]) : INITIAL_TRIPS;
  });
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('triphisaab_expenses');
    return saved ? (JSON.parse(saved) as Expense[]) : INITIAL_EXPENSES;
  });
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('triphisaab_user');
    return saved ? (JSON.parse(saved) as UserProfile) : {
      name: 'Rahul Sharma',
      phone: '+91 9876543210',
      photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
      referralCode: 'TRIP9876',
      totalInvites: 5,
      totalRewards: 2500
    };
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('triphisaab_settings');
    return saved ? (JSON.parse(saved) as AppSettings) : {
      language: 'Hinglish',
      theme: 'light',
      currency: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
      primaryColor: '#2979FF'
    };
  });
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => { localStorage.setItem('triphisaab_trips', JSON.stringify(trips)); }, [trips]);
  useEffect(() => { localStorage.setItem('triphisaab_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('triphisaab_user', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('triphisaab_settings', JSON.stringify(settings)); }, [settings]);

  const selectedTrip = useMemo(() => trips.find(t => t.id === selectedTripId), [trips, selectedTripId]);
  const tripExpenses = useMemo(() => expenses.filter(e => e.tripId === selectedTripId), [expenses, selectedTripId]);

  const handleCreateTrip = (newTrip: Trip) => { setTrips(prev => [newTrip, ...prev]); setView('home'); };
  
  const handleAddExpense = (newExpense: Expense) => {
    setExpenses(prev => [newExpense, ...prev]);
    setTrips(prev => prev.map(t => t.id === newExpense.tripId ? { ...t, totalExpense: t.totalExpense + newExpense.amount } : t));
    setView('details');
  };
  
  const handleEditExpense = (expenseId: string, newAmount: number) => {
    const expenseToEdit = expenses.find(e => e.id === expenseId);
    if (!expenseToEdit) return;

    const oldAmountValue = expenseToEdit.amount;
    const tripIdValue = expenseToEdit.tripId;

    setExpenses((prev: Expense[]) => prev.map((e: Expense) => {
      if (e.id === expenseId) {
        const share = newAmount / (e.splits.length || 1);
        return { ...e, amount: newAmount, splits: e.splits.map(s => ({ ...s, amount: share })) };
      }
      return e;
    }));

    setTrips((prev: Trip[]) => prev.map((t: Trip) => t.id === tripIdValue ? { ...t, totalExpense: (t.totalExpense - oldAmountValue) + newAmount } : t));
  };

  const handleDeleteTrip = (tripId: string) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
    setExpenses(prev => prev.filter(e => e.tripId !== tripId));
    setSelectedTripId(null);
    setView('home');
  };

  const handleAddMember = (tripId: string, name: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          members: [...t.members, { id: generateId(), name, phone: '' }]
        };
      }
      return t;
    }));
  };
  
  const handleClearData = () => { setTrips([]); setExpenses([]); localStorage.clear(); setView('home'); };

  return (
    <div className={`max-w-md mx-auto min-h-screen transition-all duration-300 font-sans antialiased overflow-x-hidden ${settings.theme === 'dark' ? 'bg-gray-950' : 'bg-[#F9FAFB]'}`}>
      <OfflineIndicator isOnline={isOnline} />
      {view === 'home' && (
        <HomeView 
          trips={trips} 
          expenses={expenses} 
          onSelectTrip={(id) => { setSelectedTripId(id); setView('details'); }} 
          onCreateTrip={() => setView('create')} 
          onOpenSettings={() => setView('settings')} 
          onOpenBreakdown={() => setView('breakdown')} 
          settings={settings} 
          user={userProfile} 
        />
      )}
      {view === 'breakdown' && <SpendingBreakdownView trips={trips} expenses={expenses} onBack={() => setView('home')} settings={settings} />}
      {view === 'create' && <CreateTripView onBack={() => setView('home')} onSave={handleCreateTrip} settings={settings} />}
      {view === 'details' && selectedTrip && (
        <TripDetailsView 
          trip={selectedTrip} 
          expenses={tripExpenses} 
          onBack={() => setView('home')} 
          onAddExpense={() => setView('add-expense')} 
          onEditExpense={handleEditExpense} 
          onDeleteTrip={handleDeleteTrip} 
          onAddMember={handleAddMember}
          settings={settings} 
        />
      )}
      {view === 'add-expense' && selectedTrip && <AddExpenseView trip={selectedTrip} onBack={() => setView('details')} onSave={handleAddExpense} settings={settings} />}
      {view === 'settings' && <SettingsView onBack={() => setView('home')} settings={settings} setSettings={setSettings} user={userProfile} onUpdateUser={setUserProfile} onClearData={handleClearData} />}
    </div>
  );
}
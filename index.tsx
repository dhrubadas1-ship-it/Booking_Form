
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  FileText, 
  LogOut, 
  Bell,
  Menu,
  X,
  Scan, 
  User, 
  MapPin, 
  Phone, 
  Briefcase, 
  Users, 
  Clock, 
  Hotel, 
  CreditCard,
  Calculator,
  Save,
  Calendar,
  Layers,
  Trees,
  Trash2,
  CheckCircle2,
  Circle,
  FilePlus,
  TrendingUp,
  Search,
  Download,
  FileDown, // Added missing icon import to fix the compilation error
  Filter,
  MoreVertical,
  Eye,
  UserCheck,
  ShieldCheck,
  IndianRupee,
  Printer,
  CheckSquare,
  Square,
  FileJson,
  FileSpreadsheet
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";

// --- Types ---

export interface Visitor {
  name: string;
  address: string;
  phone: string;
  idNumber: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  dob: string;
  age: number;
  isHead?: boolean;
}

export interface Costs {
  guideCharges: number;
  vehicleCharges: number;
  boatCharges: number;
  boatmenCharges: number;
  forestPermission: number;
  forestGuardCharges: number;
  communityContribution: number;
  commissionPercentage: number;
  serviceCharges: number;
}

export interface TourismActivity {
  id: string;
  date: string;
  time: string;
  visitors: Visitor[];
  guideName: string;
  hotelName: string;
  visitorCharges: number;
  costs: Costs;
  totalProfit: number;
}

export type ViewState = 'dashboard' | 'new-entry' | 'records' | 'reports';

// --- Services ---

const extractVisitorFromDocument = async (base64: string, mimeType: string): Promise<Partial<Visitor>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: "Extract visitor details from this document. Return ONLY a JSON object with name, address, phone (if present), idNumber, gender (Male, Female, or Other), and dob (YYYY-MM-DD)." },
          { inlineData: { mimeType: mimeType, data: base64 } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            address: { type: Type.STRING },
            phone: { type: Type.STRING },
            idNumber: { type: Type.STRING },
            gender: { type: Type.STRING, enum: ["Male", "Female", "Other"] },
            dob: { type: Type.STRING, description: "Date of birth in YYYY-MM-DD format" },
          },
          required: ["name", "address", "idNumber"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
  } catch (error) {
    console.error("Error extracting document info:", error);
  }
  return {};
};

// --- Components ---

const Dashboard: React.FC<{ activities: TourismActivity[] }> = ({ activities }) => {
  const totalVisitors = activities.reduce((acc, curr) => acc + curr.visitors.length, 0);
  const totalRevenue = activities.reduce((acc, curr) => acc + curr.visitorCharges, 0);
  const totalProfit = activities.reduce((acc, curr) => acc + curr.totalProfit, 0);

  const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          <span>{Math.abs(trend)}%</span>
          {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        </div>
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
    </div>
  );

  const ArrowUpRight = ({ size }: { size: number }) => <span style={{ fontSize: size }}>↗</span>;
  const ArrowDownRight = ({ size }: { size: number }) => <span style={{ fontSize: size }}>↘</span>;

  const chartData = activities.map(a => ({
    name: a.date,
    revenue: a.visitorCharges,
    profit: a.totalProfit
  })).reverse();

  return (
    <div className="space-y-8">
      <div className="bg-black text-white p-12 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between overflow-hidden relative border border-gray-800 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center space-x-4 mb-8">
            <svg viewBox="0 0 24 24" className="w-20 h-20 text-white transform rotate-[-5deg]" fill="currentColor">
              <path d="M12,2C10.5,2 9,3.5 9,5.5C9,6.5 9.5,7.5 10,8C8.5,8.5 7,9 5,9C3,9 1,10 1,12C1,14 3,15 5,15C7,15 8.5,14.5 10,14C11,15.5 12.5,16.5 14.5,16.5C16.5,16.5 18,15.5 19,14C20.5,14.5 22,15 23,13.5C23.5,12.5 23.5,11.5 23,10.5C22,9 20.5,8.5 19,8C18,6.5 16.5,5.5 14.5,5.5C14,5.5 13.5,5.5 13,5.7C13.2,5.1 13.2,4.5 13,3.9C12.8,3.2 12.4,2.5 12,2ZM14.5,7.5C15.9,7.5 17,8.6 17,10C17,11.4 15.9,12.5 14.5,12.5C13.1,12.5 12,11.4 12,10C12,8.6 13.1,7.5 14.5,7.5Z" />
            </svg>
            <div className="flex flex-col">
              <h1 className="text-5xl font-black tracking-tighter logo-font">WEAVERS NEST</h1>
              <p className="text-2xl font-bold tagline-font text-emerald-400 mt-1 italic">Discover Assam Empower Communities</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-lg mt-4 font-medium">
            Operational dashboard for wildlife logistics, community homestays, and ethnic tourism across the heart of Assam.
          </p>
        </div>
        <div className="hidden lg:block absolute right-0 bottom-0 top-0 w-2/3 bg-emerald-600/5 skew-x-[-12deg] translate-x-1/3"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Tourists" value={totalVisitors} trend={18} color="bg-emerald-600" />
        <StatCard icon={IndianRupee} label="Gross Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} trend={22} color="bg-blue-600" />
        <StatCard icon={TrendingUp} label="Net Profit" value={`₹${totalProfit.toLocaleString('en-IN')}`} trend={14} color="bg-indigo-600" />
        <StatCard icon={Calendar} label="Bookings" value={activities.length} trend={5} color="bg-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-8">Financial Insights (INR)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  formatter={(value: any) => `₹${value.toLocaleString('en-IN')}`}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}
                  cursor={{stroke: '#10b981', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="profit" stroke="#000000" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Arrivals</h3>
          <div className="space-y-6">
            {activities.length > 0 ? activities.slice(0, 5).map((activity, idx) => {
              const head = activity.visitors.find(v => v.isHead) || activity.visitors[0];
              return (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                      {head?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-gray-900 block">{head?.name || 'Anonymous'}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest">{activity.hotelName}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">{activity.visitors.length} Pax</span>
                </div>
              );
            }) : (
              <p className="text-gray-400 text-sm text-center py-10">No recent activity found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EntryForm: React.FC<{ onAdd: (activity: TourismActivity) => void }> = ({ onAdd }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [visitors, setVisitors] = useState<Visitor[]>([
    { name: '', address: '', phone: '', idNumber: '', gender: '', dob: '', age: 0, isHead: true }
  ]);
  const DEFAULT_GUIDES = ["Pranjal Gogoi", "Nabajyoti Das", "Hemanta Borah"];
  const DEFAULT_STAYS = ["Kaziranga Eco Camp", "Majuli Island Homestay", "Manas Tiger Lodge"];

  const [activity, setActivity] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    guideName: DEFAULT_GUIDES[0],
    hotelName: DEFAULT_STAYS[0]
  });

  const [costs, setCosts] = useState<Costs>({
    guideCharges: 2000,
    vehicleCharges: 3500,
    boatCharges: 1500,
    boatmenCharges: 800,
    forestPermission: 1000,
    forestGuardCharges: 500,
    communityContribution: 500,
    commissionPercentage: 10,
    serviceCharges: 1200
  });

  const addVisitor = () => {
    setVisitors([...visitors, { name: '', address: '', phone: '', idNumber: '', gender: '', dob: '', age: 0, isHead: false }]);
  };

  const removeVisitor = (index: number) => {
    if (visitors.length === 1) return;
    const newVisitors = visitors.filter((_, i) => i !== index);
    if (!newVisitors.some(v => v.isHead)) newVisitors[0].isHead = true;
    setVisitors(newVisitors);
  };

  const setHead = (index: number) => {
    setVisitors(visitors.map((v, i) => ({ ...v, isHead: i === index })));
  };

  const updateVisitor = (index: number, data: Partial<Visitor>) => {
    const newVisitors = [...visitors];
    newVisitors[index] = { ...newVisitors[index], ...data };
    if (data.dob) {
      const birthDate = new Date(data.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      newVisitors[index].age = Math.max(0, age);
    }
    setVisitors(newVisitors);
  };

  const calculations = useMemo(() => {
    const baseLogistics = 
      costs.guideCharges + 
      costs.vehicleCharges + 
      costs.boatCharges + 
      costs.boatmenCharges + 
      costs.forestPermission + 
      costs.forestGuardCharges +
      costs.communityContribution;
    
    const commissionAmount = (costs.commissionPercentage / 100) * baseLogistics;
    const totalCharge = baseLogistics + commissionAmount + costs.serviceCharges;
    const profit = costs.serviceCharges + commissionAmount;
    return { totalCharge, profit, commissionAmount };
  }, [costs]);

  const handleScanForVisitor = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        const extracted = await extractVisitorFromDocument(base64String, file.type);
        updateVisitor(index, extracted);
      } catch (error) { console.error("Scan failed", error); }
      finally { setIsScanning(false); }
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        visitors,
        ...activity,
        visitorCharges: calculations.totalCharge,
        costs,
        totalProfit: calculations.profit
      });
    }} className="space-y-8 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">New Excursion Entry</h2>
          <p className="text-gray-500 font-medium">Capture details for multiple guests. Designate one as Head for the official invoice.</p>
        </div>
        <button type="button" onClick={addVisitor} className="flex items-center space-x-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20">
          <FilePlus size={20} />
          <span>Add New ID / Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {visitors.map((v, idx) => (
            <div key={idx} className={`bg-white p-8 rounded-[2.5rem] border-2 transition-all ${v.isHead ? 'border-emerald-500 shadow-xl' : 'border-gray-100 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <button type="button" onClick={() => setHead(idx)} className="transition-transform active:scale-90">
                    {v.isHead ? <CheckCircle2 className="text-emerald-500" size={32} /> : <Circle className="text-gray-300 hover:text-emerald-300" size={32} />}
                  </button>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 tracking-tighter uppercase">{v.isHead ? 'Invoice Head' : `Guest Record #${idx + 1}`}</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Individual Guest Identity Details</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="p-3 bg-gray-50 text-gray-600 rounded-xl cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 border border-gray-100 transition-all flex items-center gap-2 group">
                    <Scan size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Scan ID</span>
                    <input type="file" className="hidden" onChange={(e) => handleScanForVisitor(idx, e)} disabled={isScanning} />
                  </label>
                  {visitors.length > 1 && (
                    <button type="button" onClick={() => removeVisitor(idx)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><User size={12}/> Full Name</label>
                  <input type="text" value={v.name} onChange={e => updateVisitor(idx, {name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 ring-emerald-500 outline-none font-bold" placeholder="Guest Name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><CreditCard size={12}/> ID / Document Number</label>
                  <input type="text" value={v.idNumber} onChange={e => updateVisitor(idx, {idNumber: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 ring-emerald-500 outline-none font-bold" placeholder="ID Number" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12}/> Date of Birth</label>
                  <input type="date" value={v.dob} onChange={e => updateVisitor(idx, {dob: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 ring-emerald-500 outline-none font-bold" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> Age</label>
                    <input type="number" value={v.age} readOnly className="w-full px-4 py-3 bg-gray-200 border-none rounded-xl font-black text-center" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><User size={12}/> Gender</label>
                    <select value={v.gender} onChange={e => updateVisitor(idx, {gender: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 ring-emerald-500 outline-none font-bold" required>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                {v.isHead && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Phone size={12}/> Phone Number</label>
                      <input type="tel" value={v.phone} onChange={e => updateVisitor(idx, {phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 ring-emerald-500 outline-none font-bold" placeholder="+91" required={v.isHead} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={12}/> Residential Address</label>
                      <input type="text" value={v.address} onChange={e => updateVisitor(idx, {address: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 ring-emerald-500 outline-none font-bold" placeholder="Address" required={v.isHead} />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 uppercase tracking-tighter"><Trees className="text-emerald-500" /> Expedition Info</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Briefcase size={14}/> Guide Name</label>
                <input list="guides" value={activity.guideName} onChange={e => setActivity({...activity, guideName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 ring-emerald-500 outline-none font-bold" placeholder="Select or type" />
                <datalist id="guides">{DEFAULT_GUIDES.map(g => <option key={g} value={g} />)}</datalist>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Hotel size={14}/> Stay / Partner</label>
                <input list="stays" value={activity.hotelName} onChange={e => setActivity({...activity, hotelName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 ring-emerald-500 outline-none font-bold" placeholder="Select or type" />
                <datalist id="stays">{DEFAULT_STAYS.map(s => <option key={s} value={s} />)}</datalist>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={14}/> Date</label>
                  <input type="date" value={activity.date} onChange={e => setActivity({...activity, date: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Users size={14}/> Total Pax</label>
                  <input type="number" value={visitors.length} readOnly className="w-full px-4 py-3 bg-gray-200 border-none rounded-xl text-sm font-black text-center" />
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><Calculator size={14} /> Itemized Charges (₹)</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'guideCharges', label: 'Guide Fee' },
                  { key: 'vehicleCharges', label: 'Vehicle Charge' },
                  { key: 'boatCharges', label: 'Boat Charges' },
                  { key: 'boatmenCharges', label: 'Boatmen/Rafting' },
                  { key: 'forestPermission', label: 'Forest Entry' },
                  { key: 'forestGuardCharges', label: 'Forest Guard' },
                  { key: 'communityContribution', label: 'Community Svc' },
                  { key: 'serviceCharges', label: 'Service Charge' },
                ].map((item) => (
                  <div key={item.key} className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase truncate tracking-widest">{item.label}</label>
                    <input type="number" value={costs[item.key as keyof Costs]} onChange={e => setCosts({...costs, [item.key]: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl text-sm font-black" />
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Comm. (%)</label>
                  <input type="number" value={costs.commissionPercentage} onChange={e => setCosts({...costs, commissionPercentage: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl text-sm font-black" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-2xl shadow-black/40 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-800 pb-6">
              <div>
                <p className="text-emerald-500 text-[10px] uppercase font-black tracking-widest mb-1">Total Bill (₹)</p>
                <h4 className="text-4xl font-black">₹{calculations.totalCharge.toLocaleString('en-IN')}</h4>
              </div>
            </div>
            <button type="submit" className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/40">
              <Save size={20} />
              <span>Generate Weaver's Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const Records: React.FC<{ activities: TourismActivity[], onDelete: (id: string) => void, onBulkDelete: (ids: string[]) => void }> = ({ activities, onDelete, onBulkDelete }) => {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = activities.filter(a => {
    const head = a.visitors.find(v => v.isHead) || a.visitors[0];
    return head.name.toLowerCase().includes(search.toLowerCase()) || a.hotelName.toLowerCase().includes(search.toLowerCase());
  });

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(a => a.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Permanently delete ${selectedIds.size} records?`)) {
      onBulkDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const exportCSV = () => {
    const rows = filtered.map(a => {
      const head = a.visitors.find(v => v.isHead) || a.visitors[0];
      return [
        a.date,
        head.name,
        a.visitors.length,
        a.hotelName,
        a.guideName,
        a.visitorCharges,
        a.totalProfit
      ];
    });
    const content = "Date,Head Name,Pax,Partner,Guide,Total Charge,Profit\n" + rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `weavers_nest_records_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportJSON = () => {
    const content = JSON.stringify(filtered, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `weavers_nest_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search Head Name or Partner..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 ring-emerald-500 outline-none shadow-sm transition-all font-medium" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={exportCSV} className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
            <FileSpreadsheet size={18} />
            <span className="text-xs uppercase tracking-widest">CSV</span>
          </button>
          <button onClick={exportJSON} className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
            <FileJson size={18} />
            <span className="text-xs uppercase tracking-widest">JSON Backup</span>
          </button>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-4 rounded-2xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center space-x-4">
            <CheckSquare className="text-emerald-600" size={24} />
            <span className="text-emerald-900 font-black uppercase text-xs tracking-widest">{selectedIds.size} Records Selected</span>
          </div>
          <button onClick={handleDeleteSelected} className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all">
            <Trash2 size={16} />
            <span>Delete Selected</span>
          </button>
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-8 py-5 w-16">
                  <button onClick={toggleSelectAll} className="text-gray-400 hover:text-emerald-600 transition-colors">
                    {selectedIds.size === filtered.length && filtered.length > 0 ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Group Head</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Group Size</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Partner / Guide</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Invoice (₹)</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {filtered.map((a) => {
                const head = a.visitors.find(v => v.isHead) || a.visitors[0];
                const isSelected = selectedIds.has(a.id);
                return (
                  <tr key={a.id} className={`hover:bg-gray-50/80 transition-colors ${isSelected ? 'bg-emerald-50/30' : ''}`}>
                    <td className="px-8 py-6">
                      <button onClick={() => toggleSelect(a.id)} className={`${isSelected ? 'text-emerald-600' : 'text-gray-300'} hover:text-emerald-500 transition-colors`}>
                        {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-600/20">{head.name.charAt(0)}</div>
                        <div><p className="font-black text-gray-900 text-base">{head.name}</p><p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{a.date}</p></div>
                      </div>
                    </td>
                    <td className="px-8 py-6"><div className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-tighter">{a.visitors.length} Pax</div></td>
                    <td className="px-8 py-6"><div><p className="text-sm font-black text-gray-800">{a.hotelName}</p><p className="text-xs text-gray-400 font-bold italic">Guide: {a.guideName}</p></div></td>
                    <td className="px-8 py-6 text-right font-black text-gray-900">₹{a.visitorCharges.toLocaleString('en-IN')}</td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => { if(window.confirm('Delete this record?')) onDelete(a.id) }} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                        <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Reports: React.FC<{ activities: TourismActivity[] }> = ({ activities }) => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const summary = useMemo(() => {
    return {
      totalRevenue: activities.reduce((acc, curr) => acc + curr.visitorCharges, 0),
      totalVisitors: activities.reduce((acc, curr) => acc + curr.visitors.length, 0),
      netProfit: activities.reduce((acc, curr) => acc + curr.totalProfit, 0),
      totalPayouts: activities.reduce((acc, curr) => {
        const { guideCharges, vehicleCharges, boatCharges, boatmenCharges, forestPermission, forestGuardCharges, communityContribution } = curr.costs;
        return acc + guideCharges + vehicleCharges + boatCharges + boatmenCharges + forestPermission + forestGuardCharges + communityContribution;
      }, 0)
    }
  }, [activities]);

  const handleExportPDF = () => {
    const originalTitle = document.title;
    document.title = `Weavers_Nest_Report_${reportType.toUpperCase()}_${new Date().toISOString().split('T')[0]}`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic">Operations Ledger</h2>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-1">Consolidated Reconciliation for Assam Regional Logistics</p>
        </div>
        <div className="flex p-2 bg-white rounded-3xl border border-gray-100 shadow-2xl print:hidden">
          {(['daily', 'weekly', 'monthly'] as const).map(type => (
            <button key={type} onClick={() => setReportType(type)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${reportType === type ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-gray-900'}`}>{type}</button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
        <div className="p-10 flex justify-between items-center border-b border-gray-100 bg-white text-black">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <svg viewBox="0 0 24 24" className="w-20 h-20 text-black transform rotate-[-5deg] absolute -top-12 left-2" fill="currentColor"><path d="M12,2C10.5,2 9,3.5 9,5.5C9,6.5 9.5,7.5 10,8C8.5,8.5 7,9 5,9C3,9 1,10 1,12C1,14 3,15 5,15C7,15 8.5,14.5 10,14C11,15.5 12.5,16.5 14.5,16.5C16.5,16.5 18,15.5 19,14C20.5,14.5 22,15 23,13.5C23.5,12.5 23.5,11.5 23,10.5C22,9 20.5,8.5 19,8C18,6.5 16.5,5.5 14.5,5.5C14,5.5 13.5,5.5 13,5.7C13.2,5.1 13.2,4.5 13,3.9C12.8,3.2 12.4,2.5 12,2ZM14.5,7.5C15.9,7.5 17,8.6 17,10C17,11.4 15.9,12.5 14.5,12.5C13.1,12.5 12,11.4 12,10C12,8.6 13.1,7.5 14.5,7.5Z" /></svg>
              <div className="brush-stroke py-4 px-10 mt-4"><h3 className="text-3xl font-black tracking-tight leading-none logo-font text-white whitespace-nowrap">WEAVERS NEST</h3></div>
              <p className="text-xl tagline-font text-black ml-4 mt-1">Discover Assam Empower Communities</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">BATCH ID: #AS-{new Date().getFullYear()}-WN</p>
            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mt-1">ISSUED: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="p-12 space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Revenue (₹)', value: summary.totalRevenue },
              { label: 'Third-Party Payouts (₹)', value: summary.totalPayouts },
              { label: 'Group Count', value: activities.length },
              { label: 'Operational Gain (₹)', value: summary.netProfit }
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-3xl border border-gray-100 bg-gray-50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900">{typeof stat.value === 'number' && stat.label.includes('₹') ? `₹${stat.value.toLocaleString('en-IN')}` : stat.value}</p>
              </div>
            ))}
          </div>
          <div className="border rounded-[2rem] overflow-hidden border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <tr><th className="px-8 py-5">Partner / Excursion</th><th className="px-8 py-5">Group Head & Size</th><th className="px-8 py-5 text-right">Invoice (₹)</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activities.map((a) => {
                  const head = a.visitors.find(v => v.isHead) || a.visitors[0];
                  return (
                    <tr key={a.id}>
                      <td className="px-8 py-6"><p className="text-sm font-black text-gray-900">{a.hotelName}</p><p className="text-xs text-gray-500 italic font-bold">Guide: {a.guideName}</p></td>
                      <td className="px-8 py-6"><div className="flex items-center space-x-2"><UserCheck size={14} className="text-emerald-600" /><p className="text-sm font-black text-gray-900">{head.name}</p></div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{a.visitors.length} Pax Total</p></td>
                      <td className="px-8 py-6 text-sm font-black text-right text-gray-900">₹{a.visitorCharges.toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-end pt-12 border-t border-gray-100">
            <div className="space-y-6">
              <div className="flex flex-col"><h2 className="font-black text-xl text-gray-900 tracking-tighter logo-font">WEAVERS NEST</h2><p className="tagline-font text-emerald-600 font-bold text-lg">Discover Assam Empower Communities</p></div>
              <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.1em] leading-relaxed"><p>Assam Regional Operations • www.weaversnest.in</p></div>
            </div>
            <div className="flex space-x-4 print:hidden">
              <button onClick={handleExportPDF} className="flex items-center space-x-3 px-8 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-black text-sm transition-all shadow-2xl shadow-emerald-600/20"><FileDown size={20} /><span>EXPORT PDF</span></button>
              <button onClick={() => window.print()} className="flex items-center space-x-3 px-8 py-5 bg-black hover:bg-emerald-600 text-white rounded-[1.5rem] font-black text-sm transition-all shadow-2xl shadow-black/20"><Printer size={20} /><span>PRINT INVOICE</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- App Container ---

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [activities, setActivities] = useState<TourismActivity[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const mockData: TourismActivity[] = [
      {
        id: '1',
        date: '2024-06-10',
        time: '06:30',
        visitors: [
          { name: 'Anjali Sarma', address: 'Guwahati, Assam', phone: '98640-12345', idNumber: 'AS-102938', gender: 'Female', dob: '1992-08-20', age: 31, isHead: true },
          { name: 'Rohan Sarma', address: '', phone: '', idNumber: 'AS-102939', gender: 'Male', dob: '1990-05-15', age: 34, isHead: false }
        ],
        guideName: 'Pranjal Gogoi',
        hotelName: 'Kaziranga Eco Camp',
        visitorCharges: 10500,
        costs: { guideCharges: 2000, vehicleCharges: 3500, boatCharges: 1500, boatmenCharges: 800, forestPermission: 1000, forestGuardCharges: 500, communityContribution: 500, commissionPercentage: 10, serviceCharges: 1200 },
        totalProfit: 2130
      }
    ];
    setActivities(mockData);
  }, []);

  const handleDeleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const handleBulkDelete = (ids: string[]) => {
    setActivities(prev => prev.filter(a => !ids.includes(a.id)));
  };

  const NavItem = ({ icon: Icon, label, view }: { icon: any, label: string, view: ViewState }) => (
    <button onClick={() => setActiveView(view)} className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${activeView === view ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 scale-[1.02]' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
      <Icon size={20} />
      <span className={`${!isSidebarOpen && 'hidden'} md:block font-black text-xs uppercase tracking-widest`}>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      <aside className={`${isSidebarOpen ? 'w-80' : 'w-24'} bg-black border-r border-gray-800 transition-all duration-300 flex flex-col print:hidden`}>
        <div className="p-8">
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 24 24" className="w-16 h-16 text-white mb-[-10px] transform rotate-[-5deg]" fill="currentColor"><path d="M12,2C10.5,2 9,3.5 9,5.5C9,6.5 9.5,7.5 10,8C8.5,8.5 7,9 5,9C3,9 1,10 1,12C1,14 3,15 5,15C7,15 8.5,14.5 10,14C11,15.5 12.5,16.5 14.5,16.5C16.5,16.5 18,15.5 19,14C20.5,14.5 22,15 23,13.5C23.5,12.5 23.5,11.5 23,10.5C22,9 20.5,8.5 19,8C18,6.5 16.5,5.5 14.5,5.5C14,5.5 13.5,5.5 13,5.7C13.2,5.1 13.2,4.5 13,3.9C12.8,3.2 12.4,2.5 12,2ZM14.5,7.5C15.9,7.5 17,8.6 17,10C17,11.4 15.9,12.5 14.5,12.5C13.1,12.5 12,11.4 12,10C12,8.6 13.1,7.5 14.5,7.5Z" /></svg>
            {isSidebarOpen && <div className="flex flex-col items-center w-full"><div className="brush-stroke mt-1"><h1 className="text-white font-black text-2xl tracking-tight logo-font">WEAVERS NEST</h1></div><p className="text-[12px] text-white tagline-font mt-2">Discover Assam Empower Communities</p></div>}
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-4 mt-8">
          <NavItem icon={LayoutDashboard} label="Dashboard" view="dashboard" />
          <NavItem icon={PlusCircle} label="New Entry" view="new-entry" />
          <NavItem icon={History} label="All Records" view="records" />
          <NavItem icon={FileText} label="Reports" view="reports" />
        </nav>
      </aside>
      <main className="flex-1 flex flex-col bg-white rounded-tl-[3rem] overflow-hidden">
        <header className="h-20 border-b border-gray-100 flex items-center justify-between px-10 bg-white/70 backdrop-blur-xl sticky top-0 z-10 print:hidden">
          <div className="flex items-center space-x-6"><button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 hover:bg-gray-100 rounded-2xl text-gray-500 transition-colors">{isSidebarOpen ? <X size={20} /> : <Menu size={20} />}</button><h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{activeView.replace('-', ' ')}</h2></div>
          <div className="flex items-center space-x-8">
            <div className="flex items-center bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse mr-3"></span><p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Live Operations Terminal</p></div>
            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white font-black shadow-xl shadow-black/10">WN</div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-12 bg-gray-50/50 print:p-0 print:m-0 print:bg-white">
          <div className="max-w-7xl mx-auto space-y-12">
            {activeView === 'dashboard' && <Dashboard activities={activities} />}
            {activeView === 'new-entry' && <EntryForm onAdd={(a) => { setActivities([a, ...activities]); setActiveView('records'); }} />}
            {activeView === 'records' && <Records activities={activities} onDelete={handleDeleteActivity} onBulkDelete={handleBulkDelete} />}
            {activeView === 'reports' && <Reports activities={activities} />}
          </div>
        </div>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) ReactDOM.createRoot(rootElement).render(<React.StrictMode><App /></React.StrictMode>);

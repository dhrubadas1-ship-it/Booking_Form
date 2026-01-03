
import React, { useState, useEffect, useMemo } from 'react';
import { 
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
  Loader2,
  Settings,
  Calendar,
  Layers,
  Trees,
  Trash2,
  CheckCircle2,
  Circle,
  FilePlus
} from 'lucide-react';
import { TourismActivity, Visitor, Costs } from '../types';
import { extractVisitorFromDocument } from '../services/geminiService';

interface EntryFormProps {
  onAdd: (activity: TourismActivity) => void;
}

const DEFAULT_GUIDES = ["Pranjal Gogoi", "Nabajyoti Das", "Hemanta Borah"];
const DEFAULT_STAYS = ["Kaziranga Eco Camp", "Majuli Island Homestay", "Manas Tiger Lodge"];

const EntryForm: React.FC<EntryFormProps> = ({ onAdd }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [visitors, setVisitors] = useState<Visitor[]>([
    { name: '', address: '', phone: '', idNumber: '', gender: '', dob: '', age: 0, isHead: true }
  ]);
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
    if (!newVisitors.some(v => v.isHead)) {
      newVisitors[0].isHead = true;
    }
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
      } catch (error) {
        console.error("Scan failed", error);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      visitors,
      ...activity,
      visitorCharges: calculations.totalCharge,
      costs,
      totalProfit: calculations.profit
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">New Excursion Entry</h2>
          <p className="text-gray-500 font-medium">Record every visitor's details and designate the group head for the invoice.</p>
        </div>
        <button 
          type="button"
          onClick={addVisitor}
          className="flex items-center space-x-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
        >
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
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{v.isHead ? 'Primary Contact Person' : 'Individual Details & Document'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="p-3 bg-gray-50 text-gray-600 rounded-xl cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 border border-gray-100 transition-all flex items-center gap-2 group">
                    <Scan size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Scan ID Document</span>
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
                  <input type="text" value={v.name} onChange={e => updateVisitor(idx, {name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 ring-emerald-500 outline-none font-bold" placeholder="As per Identity Card" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><CreditCard size={12}/> ID / Document Number</label>
                  <input type="text" value={v.idNumber} onChange={e => updateVisitor(idx, {idNumber: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:ring-2 ring-emerald-500 outline-none font-bold" placeholder="Aadhar / Passport / Voter ID" required />
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
                      <input type="text" value={v.address} onChange={e => updateVisitor(idx, {address: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 ring-emerald-500 outline-none font-bold" placeholder="State, City, Area" required={v.isHead} />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 uppercase tracking-tighter">
              <Trees className="text-emerald-500" /> Expedition Info
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Briefcase size={14}/> Guide Name (Editable)</label>
                <input 
                  list="guides-list" 
                  value={activity.guideName} 
                  onChange={e => setActivity({...activity, guideName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 ring-emerald-500 outline-none font-bold"
                  placeholder="Select or type guide"
                />
                <datalist id="guides-list">
                  {DEFAULT_GUIDES.map(g => <option key={g} value={g} />)}
                </datalist>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Hotel size={14}/> Stay (Assam Partners)</label>
                <input 
                  list="stays-list" 
                  value={activity.hotelName} 
                  onChange={e => setActivity({...activity, hotelName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 ring-emerald-500 outline-none font-bold"
                  placeholder="Select or type partner"
                />
                <datalist id="stays-list">
                  {DEFAULT_STAYS.map(s => <option key={s} value={s} />)}
                </datalist>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={14}/> Travel Date</label>
                  <input type="date" value={activity.date} onChange={e => setActivity({...activity, date: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Users size={14}/> Group Count</label>
                  <input type="number" value={visitors.length} readOnly className="w-full px-4 py-3 bg-gray-200 border-none rounded-xl text-sm font-black text-center" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <Calculator size={14} /> Itemized Charges (₹)
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'guideCharges', label: 'Guide Fee', icon: Briefcase },
                  { key: 'vehicleCharges', label: 'Vehicle Charge', icon: MapPin },
                  { key: 'boatCharges', label: 'Boat Charges', icon: MapPin },
                  { key: 'boatmenCharges', label: 'Boatmen/Rafting', icon: Users },
                  { key: 'forestPermission', label: 'Forest Entry', icon: Layers },
                  { key: 'communityContribution', label: 'Community SVC', icon: Users },
                  { key: 'serviceCharges', label: 'Service Charge', icon: Settings },
                ].map((item) => (
                  <div key={item.key} className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase truncate tracking-widest">{item.label}</label>
                    <input 
                      type="number" 
                      value={costs[item.key as keyof Costs]}
                      onChange={e => setCosts({...costs, [item.key]: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl text-sm font-black"
                    />
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Comm. (%)</label>
                  <input 
                    type="number" 
                    value={costs.commissionPercentage}
                    onChange={e => setCosts({...costs, commissionPercentage: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-gray-50 border-none rounded-xl text-sm font-black"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-2xl shadow-black/40 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-800 pb-6">
              <div>
                <p className="text-emerald-500 text-[10px] uppercase font-black tracking-widest mb-1">Bill Amount (₹)</p>
                <h4 className="text-4xl font-black">₹{calculations.totalCharge.toLocaleString('en-IN')}</h4>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Earnings</p>
                <h4 className="text-xl font-bold text-emerald-400">₹{calculations.profit.toLocaleString('en-IN')}</h4>
              </div>
            </div>
            <button 
              type="submit"
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/40"
            >
              <Save size={20} />
              <span>Finalize & Record Details</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EntryForm;

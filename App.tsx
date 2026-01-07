
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  FileText, 
  LogOut, 
  Bell,
  Menu,
  X
} from 'lucide-react';
import { ViewState, TourismActivity } from './types';
import Dashboard from './components/Dashboard';
import EntryForm from './components/EntryForm';
import Records from './components/Records';
import Reports from './components/Reports';

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
          { 
            name: 'Anjali Sarma', 
            address: 'Guwahati, Assam', 
            phone: '98640-12345', 
            idNumber: 'AS-102938', 
            gender: 'Female', 
            dob: '1992-08-20', 
            age: 31,
            isHead: true
          },
          {
            name: 'Rohan Sarma',
            address: '',
            phone: '',
            idNumber: 'AS-102939',
            gender: 'Male',
            dob: '1990-05-15',
            age: 34,
            isHead: false
          }
        ],
        guideName: 'Pranjal Gogoi',
        hotelName: 'Kaziranga Eco Camp',
        visitorCharges: 10500,
        costs: { 
          guideCharges: 2000, 
          vehicleCharges: 3500, 
          boatCharges: 1500,
          boatmenCharges: 800,
          forestPermission: 1000, 
          forestGuardCharges: 500,
          communityContribution: 500, 
          commissionPercentage: 10, 
          serviceCharges: 1200 
        },
        totalProfit: 2130
      }
    ];
    setActivities(mockData);
  }, []);

  const handleAddActivity = (newActivity: TourismActivity) => {
    setActivities(prev => [newActivity, ...prev]);
    setActiveView('records');
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const handleBulkDelete = (ids: string[]) => {
    setActivities(prev => prev.filter(a => !ids.includes(a.id)));
  };

  const NavItem = ({ icon: Icon, label, view }: { icon: any, label: string, view: ViewState }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
        activeView === view 
          ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 scale-[1.02]' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className={`${!isSidebarOpen && 'hidden'} md:block font-black text-xs uppercase tracking-widest`}>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      <aside className={`${isSidebarOpen ? 'w-80' : 'w-24'} bg-black border-r border-gray-800 transition-all duration-300 flex flex-col print:hidden`}>
        <div className="p-8">
          <div className="relative mb-6">
            <div className="flex flex-col items-center">
              <svg viewBox="0 0 24 24" className="w-16 h-16 text-white mb-[-10px] transform rotate-[-5deg]" fill="currentColor">
                <path d="M12,2C10.5,2 9,3.5 9,5.5C9,6.5 9.5,7.5 10,8C8.5,8.5 7,9 5,9C3,9 1,10 1,12C1,14 3,15 5,15C7,15 8.5,14.5 10,14C11,15.5 12.5,16.5 14.5,16.5C16.5,16.5 18,15.5 19,14C20.5,14.5 22,15 23,13.5C23.5,12.5 23.5,11.5 23,10.5C22,9 20.5,8.5 19,8C18,6.5 16.5,5.5 14.5,5.5C14,5.5 13.5,5.5 13,5.7C13.2,5.1 13.2,4.5 13,3.9C12.8,3.2 12.4,2.5 12,2ZM14.5,7.5C15.9,7.5 17,8.6 17,10C17,11.4 15.9,12.5 14.5,12.5C13.1,12.5 12,11.4 12,10C12,8.6 13.1,7.5 14.5,7.5Z" />
              </svg>
              
              <div className={`${!isSidebarOpen && 'hidden'} md:flex flex-col items-center w-full`}>
                <div className="brush-stroke mt-1">
                  <h1 className="text-white font-black text-2xl tracking-tight leading-none logo-font whitespace-nowrap">WEAVERS NEST</h1>
                </div>
                <p className="text-[12px] text-white tagline-font mt-2 whitespace-nowrap">Discover Assam Empower Communities</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-4 mt-2">
          <NavItem icon={LayoutDashboard} label="Dashboard" view="dashboard" />
          <NavItem icon={PlusCircle} label="New Entry" view="new-entry" />
          <NavItem icon={History} label="All Records" view="records" />
          <NavItem icon={FileText} label="Reports" view="reports" />
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button className="flex items-center space-x-3 text-gray-400 hover:text-red-400 w-full px-6 py-4 transition-all hover:translate-x-1">
            <LogOut size={20} />
            <span className={`${!isSidebarOpen && 'hidden'} md:block font-black text-xs uppercase tracking-widest`}>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-white rounded-tl-[3rem] overflow-hidden">
        <header className="h-20 border-b border-gray-100 flex items-center justify-between px-10 bg-white/70 backdrop-blur-xl sticky top-0 z-10 print:hidden">
          <div className="flex items-center space-x-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 hover:bg-gray-100 rounded-2xl text-gray-500 transition-colors">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
              {activeView.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center space-x-8">
            <div className="hidden md:flex items-center bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse mr-3"></span>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Assam Operations Center</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-3 text-gray-400 hover:text-emerald-500 relative bg-gray-50 rounded-2xl transition-all">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white font-black cursor-pointer hover:scale-110 transition-transform shadow-xl shadow-black/10">
                WN
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 bg-gray-50/50 print:p-0 print:m-0 print:bg-white">
          <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {activeView === 'dashboard' && <Dashboard activities={activities} />}
            {activeView === 'new-entry' && <EntryForm onAdd={handleAddActivity} />}
            {activeView === 'records' && (
              <Records 
                activities={activities} 
                onDelete={handleDeleteActivity}
                onBulkDelete={handleBulkDelete}
              />
            )}
            {activeView === 'reports' && <Reports activities={activities} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;


import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Compass,
  Map
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
import { TourismActivity } from '../types';

interface DashboardProps {
  activities: TourismActivity[];
}

const Dashboard: React.FC<DashboardProps> = ({ activities }) => {
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

  const chartData = activities.map(a => ({
    name: a.date,
    revenue: a.visitorCharges,
    profit: a.totalProfit
  })).reverse();

  return (
    <div className="space-y-8">
      {/* Banner matching logo identity */}
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
            The heart of Assam. Empowering local communities through sustainable eco-tourism, wildlife exploration, and cultural conservation.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center space-x-3">
              <Compass className="text-emerald-500" size={20} />
              <div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Active Region</p>
                <p className="font-bold text-sm">Kaziranga-Majuli</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center space-x-3">
              <Map className="text-blue-500" size={20} />
              <div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Current Status</p>
                <p className="font-bold text-sm">Peak Season</p>
              </div>
            </div>
          </div>
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
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800">Financial Insights (INR)</h3>
            <div className="flex space-x-2">
               <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-lg">LIVE DATA</span>
            </div>
          </div>
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
          <div className="mt-10 pt-6 border-t border-gray-50">
            <button className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-black/10">
              View Detailed Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

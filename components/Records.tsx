
import React, { useState } from 'react';
// Added 'Users' to the lucide-react imports
import { Search, Download, Filter, MoreVertical, Eye, Users } from 'lucide-react';
import { TourismActivity } from '../types';

interface RecordsProps {
  activities: TourismActivity[];
}

const Records: React.FC<RecordsProps> = ({ activities }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = activities.filter(a => {
    const head = a.visitors.find(v => v.isHead);
    return (
      head?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.guideName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.hotelName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search group head, birders, or resorts..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 ring-emerald-500 outline-none shadow-sm transition-all font-medium"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
            <Filter size={18} />
            <span className="text-xs uppercase tracking-widest">Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
            <Download size={18} />
            <span className="text-xs uppercase tracking-widest">Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Group Head</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Group Size</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Partner / Guide</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Invoice (₹)</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {filtered.map((activity) => {
                const head = activity.visitors.find(v => v.isHead) || activity.visitors[0];
                return (
                  <tr key={activity.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg shadow-emerald-600/20">
                          {head.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-base">{head.name}</p>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{activity.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-tighter">
                        {activity.visitors.length} Pax
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <p className="text-sm font-black text-gray-800">{activity.hotelName}</p>
                        <p className="text-xs text-gray-400 font-bold italic">Guide: {activity.guideName}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-gray-900">
                      ₹{activity.visitorCharges.toLocaleString('en-IN')}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-all" title="View Details">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Users size={48} className="mb-4 opacity-20" />
                      <p className="font-bold tracking-widest uppercase text-xs">No records matching your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Records;

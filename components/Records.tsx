
import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  MoreVertical, 
  Eye, 
  Users, 
  Trash2, 
  CheckSquare, 
  Square, 
  FileJson, 
  FileSpreadsheet 
} from 'lucide-react';
import { TourismActivity } from '../types';

interface RecordsProps {
  activities: TourismActivity[];
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
}

const Records: React.FC<RecordsProps> = ({ activities, onDelete, onBulkDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = activities.filter(a => {
    const head = a.visitors.find(v => v.isHead);
    return (
      head?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.guideName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.hotelName.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
    if (window.confirm(`Permanently delete ${selectedIds.size} selected records?`)) {
      onBulkDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const exportCSV = () => {
    const headers = ["Date", "Time", "Head Visitor", "Group Size", "Partner", "Guide", "Total Bill (INR)", "Profit (INR)"];
    const rows = filtered.map(a => {
      const head = a.visitors.find(v => v.isHead) || a.visitors[0];
      return [
        a.date,
        a.time,
        `"${head.name}"`,
        a.visitors.length,
        `"${a.hotelName}"`,
        `"${a.guideName}"`,
        a.visitorCharges,
        a.totalProfit
      ];
    });
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `weavers_nest_records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(filtered, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
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
          <input 
            type="text" 
            placeholder="Search group head, birders, or resorts..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 ring-emerald-500 outline-none shadow-sm transition-all font-medium"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
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
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-4 rounded-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <CheckSquare size={18} />
            </div>
            <div>
              <p className="text-emerald-900 font-black uppercase text-[10px] tracking-widest">Bulk Actions Enabled</p>
              <p className="text-emerald-700 text-xs font-bold">{selectedIds.size} items selected for management</p>
            </div>
          </div>
          <button 
            onClick={handleDeleteSelected}
            className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
          >
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
                  <button 
                    onClick={toggleSelectAll}
                    className="text-gray-400 hover:text-emerald-600 transition-colors"
                  >
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
              {filtered.map((activity) => {
                const head = activity.visitors.find(v => v.isHead) || activity.visitors[0];
                const isSelected = selectedIds.has(activity.id);
                return (
                  <tr key={activity.id} className={`hover:bg-gray-50/80 transition-colors group ${isSelected ? 'bg-emerald-50/30' : ''}`}>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleSelect(activity.id)}
                        className={`transition-colors ${isSelected ? 'text-emerald-600' : 'text-gray-300 group-hover:text-gray-400'}`}
                      >
                        {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>
                    </td>
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
                        <button 
                          onClick={() => { if(window.confirm('Permanently delete this record?')) onDelete(activity.id) }}
                          className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
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

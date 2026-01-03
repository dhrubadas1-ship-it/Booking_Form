
import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Share2, 
  TrendingUp, 
  ArrowRight,
  Download,
  CheckCircle,
  Layout,
  UserCheck,
  FileDown
} from 'lucide-react';
import { TourismActivity } from '../types';

interface ReportsProps {
  activities: TourismActivity[];
}

type TemplateType = 'professional' | 'modern' | 'classic';

const Reports: React.FC<ReportsProps> = ({ activities }) => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('professional');

  const summary = {
    totalRevenue: activities.reduce((acc, curr) => acc + curr.visitorCharges, 0),
    totalCosts: activities.reduce((acc, curr) => acc + (Object.values(curr.costs) as number[]).reduce((a, b) => a + b, 0), 0),
    totalVisitors: activities.reduce((acc, curr) => acc + curr.visitors.length, 0),
    netProfit: activities.reduce((acc, curr) => acc + curr.totalProfit, 0)
  };

  const templates: { id: TemplateType, name: string, description: string }[] = [
    { id: 'professional', name: 'Weaver Black', description: 'Deep contrast layout with the official brush-stroke branding.' },
    { id: 'modern', name: 'Emerald Nature', description: 'Fresh landscape-inspired minimalist design.' },
    { id: 'classic', name: 'Official Ledger', description: 'High-contrast ink-saver layout for records.' }
  ];

  const handleExportPDF = () => {
    const originalTitle = document.title;
    // Set a clean filename for the PDF download
    document.title = `Weavers_Nest_${reportType.toUpperCase()}_Report_${new Date().toISOString().split('T')[0]}`;
    window.print();
    document.title = originalTitle;
  };

  const ReportCard = ({ title, subtitle, activitiesList, template }: any) => {
    const getHeaderStyles = () => {
      switch (template) {
        case 'modern': return 'bg-emerald-50 text-emerald-900 border-b border-emerald-100';
        case 'classic': return 'bg-white text-gray-900 border-b-4 border-black';
        default: return 'bg-white text-black border-b border-gray-100';
      }
    };

    return (
      <div className={`bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden print:shadow-none print:border-none transition-all duration-300`}>
        {/* Invoice Header with Official Logo Replica */}
        <div className={`p-10 flex justify-between items-center ${getHeaderStyles()}`}>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <svg viewBox="0 0 24 24" className="w-20 h-20 text-black transform rotate-[-5deg] absolute -top-12 left-2 opacity-100 z-10" fill="currentColor">
                <path d="M12,2C10.5,2 9,3.5 9,5.5C9,6.5 9.5,7.5 10,8C8.5,8.5 7,9 5,9C3,9 1,10 1,12C1,14 3,15 5,15C7,15 8.5,14.5 10,14C11,15.5 12.5,16.5 14.5,16.5C16.5,16.5 18,15.5 19,14C20.5,14.5 22,15 23,13.5C23.5,12.5 23.5,11.5 23,10.5C22,9 20.5,8.5 19,8C18,6.5 16.5,5.5 14.5,5.5C14,5.5 13.5,5.5 13,5.7C13.2,5.1 13.2,4.5 13,3.9C12.8,3.2 12.4,2.5 12,2ZM14.5,7.5C15.9,7.5 17,8.6 17,10C17,11.4 15.9,12.5 14.5,12.5C13.1,12.5 12,11.4 12,10C12,8.6 13.1,7.5 14.5,7.5Z" />
              </svg>
              <div className="brush-stroke py-4 px-10 mt-4">
                <h3 className="text-3xl font-black tracking-tight leading-none logo-font text-white whitespace-nowrap">WEAVERS NEST</h3>
              </div>
              <p className="text-xl tagline-font text-black ml-4 mt-1">Discover Assam Empower Communities</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">BATCH ID: #AS-{new Date().getFullYear()}-WN</p>
            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mt-1">ISSUED: {new Date().toLocaleDateString()}</p>
            <div className="mt-6">
               <h4 className="text-2xl font-black uppercase tracking-tighter">{title}</h4>
            </div>
          </div>
        </div>

        <div className="p-12 space-y-12">
          {/* Executive Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Revenue (₹)', value: summary.totalRevenue },
              { label: 'Ops Costs (₹)', value: summary.totalCosts },
              { label: 'Group Count', value: activitiesList.length },
              { label: 'Impact Gain (₹)', value: summary.netProfit }
            ].map((stat, i) => (
              <div key={i} className={`p-6 rounded-3xl border ${template === 'classic' ? 'border-black' : 'bg-gray-50 border-gray-100'}`}>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <p className="text-2xl font-black text-gray-900">
                  {stat.label.includes('₹') ? `₹${stat.value.toLocaleString('en-IN')}` : stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Breakdown Table */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Collective Ledger</h4>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Regional Dispatch</span>
            </div>
            <div className={`border rounded-[2rem] overflow-hidden ${template === 'classic' ? 'border-black' : 'border-gray-50 shadow-sm'}`}>
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <tr>
                    <th className="px-8 py-5">Excursion Site / Partner</th>
                    <th className="px-8 py-5">Group Head & Total Pax</th>
                    <th className="px-8 py-5 text-right">Invoice (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activitiesList.map((a: TourismActivity) => {
                    const head = a.visitors.find(v => v.isHead) || a.visitors[0];
                    return (
                      <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-gray-900">{a.hotelName}</p>
                          <p className="text-xs text-gray-500 italic mt-1 font-bold">Guide: {a.guideName}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-2">
                             <UserCheck size={14} className="text-emerald-600" />
                             <p className="text-sm font-black text-gray-900">{head.name}</p>
                          </div>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Inclusive of {a.visitors.length - 1} others</p>
                        </td>
                        <td className="px-8 py-6 text-sm font-black text-right text-gray-900">₹{a.visitorCharges.toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Branding & Footer */}
          <div className={`flex justify-between items-end pt-12 border-t ${template === 'classic' ? 'border-black' : 'border-gray-100'}`}>
            <div className="space-y-6">
              <div className="flex flex-col">
                <h2 className="font-black text-xl text-gray-900 tracking-tighter logo-font">WEAVERS NEST</h2>
                <p className="tagline-font text-emerald-600 font-bold text-lg">Discover Assam Empower Communities</p>
              </div>
              <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.1em] leading-relaxed">
                <p>Nagaon District • Kaziranga Core Area</p>
                <p>Assam Operations • www.weaversnest.in</p>
                <p className="text-gray-900 mt-2">Verified Community Initiative</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 print:hidden">
              <button 
                onClick={handleExportPDF}
                className="flex items-center space-x-3 px-8 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-black text-sm transition-all shadow-2xl shadow-emerald-600/20"
              >
                <FileDown size={20} />
                <span>EXPORT PDF REPORT</span>
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center space-x-3 px-8 py-5 bg-black hover:bg-gray-800 text-white rounded-[1.5rem] font-black text-sm transition-all shadow-2xl shadow-black/20"
              >
                <Printer size={20} />
                <span>PRINT LEDGER</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic">Operations Ledger</h2>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-1">Financial Reconciliation for Assam Logistics</p>
        </div>
        <div className="flex p-2 bg-white rounded-3xl border border-gray-100 shadow-2xl print:hidden">
          {(['daily', 'weekly', 'monthly'] as const).map(type => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                reportType === type 
                  ? 'bg-black text-white shadow-xl' 
                  : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-8 print:hidden">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-8">
            <h4 className="font-black text-gray-900 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em]">
              <Layout size={18} className="text-emerald-500" />
              Template Style
            </h4>
            <div className="space-y-4">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                    selectedTemplate === t.id 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedTemplate === t.id ? 'text-emerald-900' : 'text-gray-900'}`}>
                      {t.name}
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold italic leading-tight">{t.description}</p>
                  </div>
                  {selectedTemplate === t.id && <CheckCircle size={20} className="text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-emerald-600 p-10 rounded-[2.5rem] text-white space-y-6 shadow-2xl shadow-emerald-600/30 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp size={32} />
                <h4 className="font-black text-xs uppercase tracking-[0.2em]">Impact Analysis</h4>
              </div>
              <p className="text-emerald-50/80 text-sm font-bold leading-relaxed">
                Collective billing shows a 24% efficiency increase in communal fund allocations this quarter.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <ReportCard 
            title={`${reportType.toUpperCase()} FINANCIAL DISPATCH`}
            subtitle={`Consolidated Excursions Ledger • Weavers Nest Regional Operations`}
            activitiesList={activities}
            template={selectedTemplate}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;

import React, { useState } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { X } from 'lucide-react';

interface MetricsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const dataLatency = [
  { time: '09:00', latency: 25 },
  { time: '10:00', latency: 28 },
  { time: '11:00', latency: 45 },
  { time: '12:00', latency: 32 },
  { time: '13:00', latency: 22 },
  { time: '14:00', latency: 35 },
  { time: '15:00', latency: 42 },
];

const dataSuccess = [
  { name: 'Success', value: 95 },
  { name: 'Error', value: 5 },
];

const dataDAU = [
  { day: 'Mon', users: 120 },
  { day: 'Tue', users: 132 },
  { day: 'Wed', users: 101 },
  { day: 'Thu', users: 154 },
  { day: 'Fri', users: 190 },
  { day: 'Sat', users: 230 },
  { day: 'Sun', users: 210 },
];

const COLORS = ['#0088FE', '#FF8042'];

const TEXTS = {
  en: {
    title: "Project Metrics & SLA",
    tabs: ["Technical", "UX / Product", "Business", "SLA"],
    latencyTitle: "Generation Latency (sec)",
    successTitle: "Success Rate (%)",
    dauTitle: "Daily Active Users (DAU)",
    slaTitle: "Service Level Agreement",
    slaTable: [
      { metric: "Availability", target: "95%", current: "98.2%", status: "OK" },
      { metric: "Gen Latency", target: "< 30s", current: "32s", status: "WARN" },
      { metric: "Error Rate", target: "< 5%", current: "2.1%", status: "OK" },
      { metric: "Tunnel Uptime", target: "99%", current: "99.9%", status: "OK" }
    ],
    close: "Close"
  },
  ru: {
    title: "Метрики проекта и SLA",
    tabs: ["Технические", "UX / Продукт", "Бизнес", "SLA"],
    latencyTitle: "Время генерации (сек)",
    successTitle: "Успешность (%)",
    dauTitle: "Активные пользователи (DAU)",
    slaTitle: "Соглашение об уровне сервиса (SLA)",
    slaTable: [
      { metric: "Доступность", target: "95%", current: "98.2%", status: "OK" },
      { metric: "Время генерации", target: "< 30с", current: "32с", status: "WARN" },
      { metric: "Ошибки API", target: "< 5%", current: "2.1%", status: "OK" },
      { metric: "Аптайм туннеля", target: "99%", current: "99.9%", status: "OK" }
    ],
    close: "Закрыть"
  }
};

export default function MetricsDashboard({ isOpen, onClose }: MetricsDashboardProps) {
  const [lang, setLang] = useState<'en' | 'ru'>('ru');
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  const t = TEXTS[lang];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">{t.title}</h2>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setLang('ru')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${lang === 'ru' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
              >
                RU
              </button>
              <button 
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${lang === 'en' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
              >
                EN
              </button>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {t.tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === index ? 'text-[#856c45]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {activeTab === index && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#856c45]" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          
          {/* Tab 0: Technical */}
          {activeTab === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">{t.latencyTitle}</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dataLatency}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="latency" stroke="#856c45" fill="#856c45" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">{t.successTitle}</h3>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataSuccess}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {dataSuccess.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: UX / Product (Placeholder same as Tech for demo, can be different) */}
          {activeTab === 1 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">User Satisfaction (NPS)</h3>
              <div className="h-64 flex items-center justify-center text-gray-400">
                Графики UX (Save Rate, Share Rate) будут здесь...
              </div>
            </div>
          )}

          {/* Tab 2: Business */}
          {activeTab === 2 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">{t.dauTitle}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataDAU}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#856c45" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Tab 3: SLA Table */}
          {activeTab === 3 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600">{lang === 'ru' ? 'Метрика' : 'Metric'}</th>
                    <th className="p-4 font-semibold text-gray-600">{lang === 'ru' ? 'Цель' : 'Target'}</th>
                    <th className="p-4 font-semibold text-gray-600">{lang === 'ru' ? 'Текущее' : 'Current'}</th>
                    <th className="p-4 font-semibold text-gray-600">{lang === 'ru' ? 'Статус' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {t.slaTable.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{row.metric}</td>
                      <td className="p-4 text-gray-600">{row.target}</td>
                      <td className="p-4 font-bold text-gray-800">{row.current}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          row.status === 'OK' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

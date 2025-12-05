import React from 'react';
import { Party, Task } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CalendarClock, PartyPopper, AlertCircle, Smile } from 'lucide-react';

interface DashboardProps {
  parties: Party[];
  tasks: Task[];
}

const COLORS = ['#4ECDC4', '#FF6B6B', '#FFE66D'];

const Dashboard: React.FC<DashboardProps> = ({ parties, tasks }) => {
  // Stats Calculation
  const upcomingPartiesCount = parties.filter(p => new Date(p.date) >= new Date()).length;
  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const completedTasksCount = tasks.filter(t => t.completed).length;
  
  // Data for Chart
  const taskData = [
    { name: 'Feitas', value: completedTasksCount },
    { name: 'Pendentes', value: pendingTasksCount },
  ];

  // Get next immediate party
  const nextParty = parties
    .filter(p => new Date(p.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="p-6 space-y-6 pb-24 overflow-y-auto h-full animate-in fade-in duration-500 font-sans">
      <header className="mb-4 flex flex-col items-center justify-center pt-2">
        <div className="flex items-center gap-2 mb-1">
          <Smile className="text-[#FF69B4] fill-[#FF69B4]" size={32} />
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-[#FF69B4]">Anima</span> <span className="text-[#4ECDC4]">Art</span> <span className="text-[#FFB347]">Animação</span>
          </h1>
        </div>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">Painel de Controle</p>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="bg-purple-100 p-3 rounded-full mb-2">
            <PartyPopper className="text-purple-600" size={24} />
          </div>
          <span className="text-3xl font-bold text-gray-800 mb-0.5">{upcomingPartiesCount}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Festas Futuras</span>
        </div>
        
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="bg-orange-100 p-3 rounded-full mb-2">
            <AlertCircle className="text-orange-600" size={24} />
          </div>
          <span className="text-3xl font-bold text-gray-800 mb-0.5">{pendingTasksCount}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Pendentes</span>
        </div>
      </div>

      {/* Next Party Card */}
      {nextParty ? (
        <div className="bg-gradient-to-r from-primary to-rose-500 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 bg-white/10 w-24 h-24 rounded-full blur-2xl"></div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2 opacity-90">
            <CalendarClock size={20} />
            Próxima Festa
          </h2>
          <div className="space-y-2">
            <div className="font-bold text-2xl">{nextParty.birthdayPerson}</div>
            <div className="opacity-90 text-base font-medium">{new Date(nextParty.date).toLocaleDateString('pt-BR')} às {nextParty.time}</div>
            <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm mt-1 font-medium">
              Tema: {nextParty.theme}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 text-center border border-dashed border-gray-300">
          <p className="text-gray-500 text-base font-medium">Nenhuma festa agendada.</p>
        </div>
      )}

      {/* Tasks Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Produtividade</h3>
        <div className="h-48 w-full">
          {tasks.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium">
              Sem dados de tarefas
            </div>
          )}
        </div>
        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4ECDC4]"></div>
            <span className="text-sm text-gray-600 font-medium">Feitas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF6B6B]"></div>
            <span className="text-sm text-gray-600 font-medium">Pendentes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
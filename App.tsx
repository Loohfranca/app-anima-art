import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TaskBoard from './components/TaskBoard';
import PartyManager from './components/PartyManager';
import CalendarView from './components/CalendarView';
import { ViewState, Task, Party } from './types';

// Mock data for initial load if storage is empty
const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Comprar balões para festa da Maria', completed: false, priority: 'high', dueDate: new Date().toISOString() },
  { id: '2', title: 'Limpar caixa de som', completed: true, priority: 'medium' },
];

const INITIAL_PARTIES: Party[] = [
  { 
    id: '1', 
    clientName: 'Ana Souza', 
    clientPhone: '(11) 99999-8888',
    birthdayPerson: 'Pedro', 
    age: 5, 
    numberOfChildren: 20,
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], // 2 days from now
    time: '14:00', 
    location: 'Av. Paulista, 1000, São Paulo', 
    theme: 'Homem Aranha', 
    workshops: 'Oficina de Slime',
    observations: 'Criança alérgica a amendoim. Levar teia de aranha extra.',
    status: 'confirmed' 
  }
];

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Persistence State
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('recreo_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [parties, setParties] = useState<Party[]>(() => {
    const saved = localStorage.getItem('recreo_parties');
    return saved ? JSON.parse(saved) : INITIAL_PARTIES;
  });

  // Effects to save data
  useEffect(() => {
    localStorage.setItem('recreo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('recreo_parties', JSON.stringify(parties));
  }, [parties]);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard parties={parties} tasks={tasks} />;
      case ViewState.TASKS:
        return <TaskBoard tasks={tasks} setTasks={setTasks} />;
      case ViewState.PARTIES:
        return <PartyManager parties={parties} setParties={setParties} />;
      case ViewState.CALENDAR:
        return <CalendarView parties={parties} />;
      default:
        return <Dashboard parties={parties} tasks={tasks} />;
    }
  };

  return (
    <div className="h-full w-full bg-gray-50 flex flex-col font-sans text-dark">
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>
      <Navigation currentView={currentView} setView={setView} />
    </div>
  );
};

export default App;
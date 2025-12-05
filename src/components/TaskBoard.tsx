import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Trash2, Check, Calendar, Edit2, X, Smile } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, setTasks }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Edit State
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      priority,
      dueDate: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const saveEdit = () => {
    if (!editingTask || !editingTask.title.trim()) return;
    setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
    setEditingTask(null);
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-100 text-red-600 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'low': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 pb-24 relative font-sans">
      <div className="p-6 bg-white shadow-sm z-10">
         <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
                <Smile className="text-[#FF69B4] fill-[#FF69B4]" size={24} />
                <h1 className="text-xl font-bold tracking-tight">
                    <span className="text-[#FF69B4]">Anima</span> <span className="text-[#4ECDC4]">Art</span>
                </h1>
            </div>
            <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
            <h2 className="text-xl font-medium text-gray-600">Tarefas</h2>
         </div>
        
        {/* Input Area */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Ex: Fazer blusa da animação..."
            className="w-full p-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-normal placeholder-gray-400"
          />
          <div className="flex gap-3">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-600 outline-none font-medium"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
            <button
              onClick={addTask}
              className="flex-1 bg-primary text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform text-lg"
            >
              <Plus size={24} /> Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <Check size={64} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhuma tarefa pendente!</p>
          </div>
        )}
        
        {tasks.map(task => (
          <div
            key={task.id}
            className={`group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-all ${task.completed ? 'opacity-60 bg-gray-50' : ''}`}
          >
            <div className="flex items-center gap-4 flex-1 overflow-hidden">
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-8 h-8 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.completed ? 'bg-secondary border-secondary' : 'border-gray-300'
                }`}
              >
                {task.completed && <Check size={18} className="text-white" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <span className={`block font-medium text-lg text-gray-800 truncate mb-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                  {task.title}
                </span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)} uppercase tracking-wider font-bold`}>
                    {task.priority === 'low' ? 'Baixa' : task.priority === 'medium' ? 'Média' : 'Alta'}
                  </span>
                  {task.dueDate && (
                     <span className="text-sm text-gray-400 flex items-center gap-1 font-normal">
                       <Calendar size={14} />
                       {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                     </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 ml-3">
                <button
                onClick={() => setEditingTask(task)}
                className="text-gray-400 hover:text-blue-500 p-2 rounded-full hover:bg-blue-50 transition-colors"
                >
                <Edit2 size={20} />
                </button>
                <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                >
                <Trash2 size={20} />
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Editar Tarefa</h2>
                    <button onClick={() => setEditingTask(null)} className="text-gray-400 hover:text-gray-600">
                        <X size={28} />
                    </button>
                </div>
                
                <div className="space-y-5">
                    <div>
                        <label className="block text-base font-semibold text-gray-500 uppercase mb-2">Título</label>
                        <input 
                            type="text" 
                            value={editingTask.title} 
                            onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                            className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary text-lg font-normal"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-base font-semibold text-gray-500 uppercase mb-2">Prioridade</label>
                        <select
                            value={editingTask.priority}
                            onChange={(e) => setEditingTask({...editingTask, priority: e.target.value as any})}
                            className="w-full p-4 bg-gray-50 rounded-xl outline-none text-lg font-normal"
                        >
                            <option value="low">Baixa</option>
                            <option value="medium">Média</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-base font-semibold text-gray-500 uppercase mb-2">Data</label>
                        <input 
                            type="date" 
                            value={editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => setEditingTask({...editingTask, dueDate: new Date(e.target.value).toISOString()})}
                            className="w-full p-4 bg-gray-50 rounded-xl outline-none text-lg font-normal"
                        />
                    </div>

                    <button 
                        onClick={saveEdit}
                        className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-2 active:scale-95 transition-transform text-lg"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
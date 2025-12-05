import React, { useState, useMemo } from 'react';
import { Party } from '../types';
import { ChevronLeft, ChevronRight, MapPin, PartyPopper, User, Users } from 'lucide-react';

interface CalendarViewProps {
  parties: Party[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ parties }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);

  // Calendar Logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sunday
  
  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const generateCalendarDays = () => {
    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 w-full" />);
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasParty = parties.some(p => p.date === dateString);
      const isSelected = selectedDate === dateString;
      const isToday = dateString === new Date().toISOString().split('T')[0];

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(dateString)}
          className={`h-12 w-full flex flex-col items-center justify-center relative rounded-xl transition-all ${
            isSelected 
              ? 'bg-primary text-white shadow-md transform scale-105 z-10' 
              : hasParty
                ? 'bg-secondary text-white font-bold shadow-sm'
                : isToday 
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-100' 
                  : 'hover:bg-gray-100 text-gray-700 font-medium'
          }`}
        >
          <span className="text-lg">{day}</span>
        </button>
      );
    }
    return days;
  };

  // Filter parties for selected date
  const selectedParties = useMemo(() => {
    if (!selectedDate) return [];
    return parties.filter(p => p.date === selectedDate);
  }, [selectedDate, parties]);

  return (
    <div className="h-full flex flex-col bg-gray-50 pb-24 overflow-hidden font-sans">
      {/* Calendar Header */}
      <div className="p-5 bg-white shadow-sm z-10 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-600">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{monthName}</h1>
          <button onClick={nextMonth} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-600">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 mb-2 text-center">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
            <span key={i} className="text-sm font-semibold text-gray-400">{day}</span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {generateCalendarDays()}
        </div>
      </div>

      {/* Selected Day Details */}
      <div className="flex-1 overflow-y-auto p-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {selectedDate && (
          <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wide mb-4 pl-1">
            {new Date(selectedDate).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
        )}

        {selectedParties.length > 0 ? (
          <div className="space-y-4">
            {selectedParties.map(party => (
              <div key={party.id} className="bg-white p-5 rounded-3xl border-l-8 border-secondary shadow-sm">
                <div className="flex justify-between items-start mb-2">
                     <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-400 uppercase mb-0.5">Aniversariante</span>
                        <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                            {party.birthdayPerson}
                        </h3>
                     </div>
                    <span className="text-base font-medium bg-gray-100 px-3 py-1.5 rounded-xl text-gray-600">{party.time}</span>
                </div>
                
                <div className="mt-3 space-y-2">
                   <div className="flex items-center gap-2 text-lg text-primary font-medium">
                       <PartyPopper size={20} />
                       {party.theme}
                   </div>
                   
                   <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 text-base text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                            <User size={16} /> {party.clientName}
                        </div>
                        {party.numberOfChildren > 0 && (
                            <div className="flex items-center gap-1.5 text-base text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                                <Users size={16} /> {party.numberOfChildren}
                            </div>
                        )}
                   </div>

                   <div className="flex items-start gap-2 text-sm text-gray-500 leading-tight pt-1">
                       <MapPin size={16} className="shrink-0 mt-0.5" /> {party.location}
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : selectedDate ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
             <p className="text-lg font-medium">Nenhuma festa neste dia.</p>
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-10 text-lg font-medium">
            Selecione um dia para ver os detalhes.
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
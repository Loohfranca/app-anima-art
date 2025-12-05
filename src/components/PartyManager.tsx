import React, { useState } from 'react';
import { Party } from '../types';
import { generatePartyIdeas } from '../services/geminiService';
import { Plus, MapPin, Calendar, Clock, User, X, Sparkles, Loader2, PartyPopper, Edit2, Phone, Smile } from 'lucide-react';
import { formatDate, safeDate } from '../utils';

interface PartyManagerProps {
  parties: Party[];
  setParties: React.Dispatch<React.SetStateAction<Party[]>>;
}

const PartyManager: React.FC<PartyManagerProps> = ({ parties, setParties }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string>('');
  
  // Form State
  const [formData, setFormData] = useState<Partial<Party>>({});

  const handleAddNew = () => {
    setFormData({ status: 'pending' });
    setIsFormOpen(true);
  };

  const handleEdit = (party: Party) => {
    setFormData({ ...party });
    setIsFormOpen(true);
    setSelectedParty(null); 
  };

  const handleSave = () => {
    if (!formData.clientName || !formData.date) return;
    
    if (formData.id) {
        // Edit existing
        setParties(parties.map(p => p.id === formData.id ? { ...p, ...formData } as Party : p));
    } else {
        // Create new
        const newParty: Party = {
            id: Date.now().toString(),
            clientName: formData.clientName || '',
            clientPhone: formData.clientPhone || '',
            birthdayPerson: formData.birthdayPerson || '',
            age: formData.age || 0,
            numberOfChildren: formData.numberOfChildren || 0,
            date: formData.date || '',
            time: formData.time || '',
            location: formData.location || '',
            theme: formData.theme || '',
            workshops: formData.workshops || '',
            observations: formData.observations || '',
            status: 'confirmed'
        };
        setParties([...parties, newParty]);
    }

    setIsFormOpen(false);
    setFormData({});
  };

  const handleGenerateIdeas = async (theme: string, age: number) => {
    setAiLoading(true);
    const ideas = await generatePartyIdeas(theme, age);
    setAiSuggestions(ideas);
    setAiLoading(false);
  };

  const openGoogleMaps = (location: string) => {
     const encoded = encodeURIComponent(location);
     window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
  };

  // View: Party Details Modal
  if (selectedParty) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto pb-24 font-sans">
        <div className="relative h-56 bg-secondary">
           <button onClick={() => { setSelectedParty(null); setAiSuggestions(''); }} className="absolute top-4 left-4 bg-white/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 z-20">
             <X size={28} />
           </button>
           
           <button 
             onClick={() => handleEdit(selectedParty)} 
             className="absolute top-4 right-4 bg-white/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 z-20 flex items-center gap-2 px-3"
           >
             <Edit2 size={20} /> <span className="font-medium text-base">Editar</span>
           </button>

           <div className="absolute -bottom-10 left-6">
              <div className="bg-white p-3 rounded-3xl shadow-lg border border-gray-100 flex items-center justify-center w-24 h-24">
                  <PartyPopper size={40} className="text-secondary" />
              </div>
           </div>
           <div className="absolute bottom-6 right-6 text-white text-right">
             <h2 className="text-3xl font-medium">{selectedParty.birthdayPerson}</h2>
             <p className="opacity-90 text-xl font-normal">{selectedParty.age} Anos</p>
           </div>
        </div>

        <div className="mt-14 px-6 space-y-6">
           
           {/* Client Section */}
           <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
              <h3 className="text-blue-800 text-sm font-medium uppercase tracking-wide mb-2 flex items-center gap-2">
                 <User size={18} /> Cliente
              </h3>
              <div className="space-y-1">
                  <p className="font-medium text-2xl text-gray-800">{selectedParty.clientName}</p>
                  {selectedParty.clientPhone && (
                      <p className="font-normal text-xl text-gray-600 flex items-center gap-2">
                          <Phone size={20} className="text-blue-500" />
                          {selectedParty.clientPhone}
                      </p>
                  )}
              </div>
           </div>

           {/* Party Stats */}
           <div className="grid grid-cols-2 gap-4">
               <div className="bg-gray-50 p-4 rounded-2xl">
                   <div className="text-gray-500 font-medium uppercase text-xs mb-1">Crianças</div>
                   <div className="text-2xl font-normal text-gray-800 flex items-center gap-2">
                       <Smile size={24} className="text-primary" />
                       {selectedParty.numberOfChildren || 0}
                   </div>
               </div>
               <div className="bg-gray-50 p-4 rounded-2xl">
                   <div className="text-gray-500 font-medium uppercase text-xs mb-1">Tema</div>
                   <div className="text-xl font-normal text-gray-800 leading-tight">
                       {selectedParty.theme}
                   </div>
               </div>
           </div>

           {/* Date & Time */}
           <div className="flex gap-4">
              <div className="flex-1 bg-gray-50 p-4 rounded-2xl">
                 <div className="flex items-center gap-2 text-gray-500 text-sm font-medium uppercase mb-1">
                   <Calendar size={18} /> Data
                 </div>
                 <p className="font-normal text-xl text-gray-800">{formatDate(selectedParty.date)}</p>
              </div>
              <div className="flex-1 bg-gray-50 p-4 rounded-2xl">
                 <div className="flex items-center gap-2 text-gray-500 text-sm font-medium uppercase mb-1">
                   <Clock size={18} /> Hora
                 </div>
                 <p className="font-normal text-xl text-gray-800">{selectedParty.time}</p>
              </div>
           </div>

           {/* Location */}
           <div>
              <div className="flex justify-between items-end mb-2">
                  <h3 className="text-gray-500 text-base font-medium uppercase tracking-wide">Localização</h3>
                  <button onClick={() => openGoogleMaps(selectedParty.location)} className="text-primary text-sm font-bold flex items-center gap-1">
                      Abrir no Maps <MapPin size={14} />
                  </button>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <p className="font-normal text-gray-800 text-lg flex items-start gap-2">
                        <MapPin size={24} className="text-primary mt-0.5 shrink-0" />
                        {selectedParty.location}
                    </p>
                </div>
                <div className="h-48 w-full bg-gray-200 relative">
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedParty.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                </div>
              </div>
           </div>

            {/* Extras */}
            {(selectedParty.workshops || selectedParty.observations) && (
            <div className="space-y-4 pt-2">
                {selectedParty.workshops && (
                    <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100">
                        <h3 className="text-purple-800 text-sm font-medium uppercase tracking-wide mb-1">Oficinas / Extras</h3>
                        <p className="text-gray-700 text-lg">{selectedParty.workshops}</p>
                    </div>
                )}
                {selectedParty.observations && (
                    <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
                        <h3 className="text-orange-800 text-sm font-medium uppercase tracking-wide mb-1">Observações</h3>
                        <p className="text-gray-700 text-lg">{selectedParty.observations}</p>
                    </div>
                )}
            </div>
            )}
        </div>
      </div>
    );
  }

  if (isFormOpen) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto pb-10 font-sans">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Editar Festa' : 'Nova Festa'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="bg-gray-100 p-2 rounded-full text-gray-600">
                  <X size={24} />
              </button>
          </div>
          
          <div className="p-6 space-y-6">
              <section className="space-y-4">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Cliente</h3>
                  <div className="grid gap-4">
                      <input
                          placeholder="Nome do Cliente"
                          value={formData.clientName || ''}
                          onChange={e => setFormData({...formData, clientName: e.target.value})}
                          className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                      />
                       <input
                          placeholder="Telefone"
                          value={formData.clientPhone || ''}
                          onChange={e => setFormData({...formData, clientPhone: e.target.value})}
                          className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                      />
                  </div>
              </section>

               <section className="space-y-4">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Evento</h3>
                  <div className="grid gap-4">
                      <input
                          placeholder="Aniversariante"
                          value={formData.birthdayPerson || ''}
                          onChange={e => setFormData({...formData, birthdayPerson: e.target.value})}
                          className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div className="flex gap-4">
                           <input
                              type="number"
                              placeholder="Idade"
                              value={formData.age || ''}
                              onChange={e => setFormData({...formData, age: Number(e.target.value)})}
                              className="w-1/3 p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                          />
                           <input
                              type="number"
                              placeholder="Nº Crianças"
                              value={formData.numberOfChildren || ''}
                              onChange={e => setFormData({...formData, numberOfChildren: Number(e.target.value)})}
                              className="w-2/3 p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                          />
                      </div>
                      <div className="flex gap-4">
                           <input
                              type="date"
                              value={formData.date || ''}
                              onChange={e => setFormData({...formData, date: e.target.value})}
                              className="w-1/2 p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                          />
                           <input
                              type="time"
                              value={formData.time || ''}
                              onChange={e => setFormData({...formData, time: e.target.value})}
                              className="w-1/2 p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                          />
                      </div>
                      <input
                          placeholder="Local / Endereço"
                          value={formData.location || ''}
                          onChange={e => setFormData({...formData, location: e.target.value})}
                          className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                      />
                      
                      <div className="space-y-2">
                           <input
                              placeholder="Tema da Festa"
                              value={formData.theme || ''}
                              onChange={e => setFormData({...formData, theme: e.target.value})}
                              className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                          />
                          <button
                              onClick={() => handleGenerateIdeas(formData.theme || '', formData.age || 5)}
                              disabled={aiLoading || !formData.theme}
                              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 rounded-xl font-medium disabled:opacity-50"
                          >
                              {aiLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                              Gerar Ideias de Brincadeiras com IA
                          </button>
                          
                          {aiSuggestions && (
                              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm text-indigo-900 whitespace-pre-line mt-2">
                                  <h4 className="font-bold mb-2 flex items-center gap-2"><Sparkles size={14} className="text-indigo-600" /> Sugestões da IA:</h4>
                                  {aiSuggestions}
                                  <button 
                                      onClick={() => setFormData({...formData, observations: (formData.observations || '') + '\n\nIdeias:\n' + aiSuggestions})}
                                      className="mt-3 text-xs bg-indigo-200 text-indigo-800 px-3 py-1.5 rounded-lg font-bold w-full"
                                  >
                                      Adicionar às Observações
                                  </button>
                              </div>
                          )}
                      </div>

                      <textarea
                          placeholder="Oficinas e Extras"
                          value={formData.workshops || ''}
                          onChange={e => setFormData({...formData, workshops: e.target.value})}
                          className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary h-24"
                      />
                       <textarea
                          placeholder="Observações Gerais"
                          value={formData.observations || ''}
                          onChange={e => setFormData({...formData, observations: e.target.value})}
                          className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-primary h-24"
                      />
                  </div>
               </section>

               <button
                  onClick={handleSave}
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl text-lg shadow-md active:scale-95 transition-transform"
               >
                  Salvar Festa
               </button>
          </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 relative pb-24 font-sans">
       <div className="p-6 bg-white shadow-sm z-10 sticky top-0">
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-1">
                <Smile className="text-[#FF69B4] fill-[#FF69B4]" size={24} />
                <h1 className="text-xl font-bold tracking-tight">
                    <span className="text-[#FF69B4]">Anima</span> <span className="text-[#4ECDC4]">Art</span>
                </h1>
            </div>
             <button 
                onClick={handleAddNew}
                className="bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
             >
                <Plus size={24} />
             </button>
          </div>
          <h2 className="text-xl font-medium text-gray-600">Festas Agendadas</h2>
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {parties.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <PartyPopper size={48} className="mb-2 opacity-30" />
                    <p className="font-medium">Nenhuma festa agendada</p>
                    <p className="text-sm">Clique em + para adicionar</p>
                </div>
            ) : (
                parties
                .sort((a, b) => safeDate(a.date).getTime() - safeDate(b.date).getTime())
                .map(party => (
                    <div 
                        key={party.id}
                        onClick={() => setSelectedParty(party)}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-98 transition-transform cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{party.birthdayPerson}</h3>
                                <p className="text-sm text-gray-500 font-medium">{party.theme}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${safeDate(party.date) < new Date(new Date().setHours(0,0,0,0)) ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'}`}>
                                {safeDate(party.date) < new Date(new Date().setHours(0,0,0,0)) ? 'Realizada' : 'Confirmada'}
                            </span>
                        </div>
                        
                        <div className="space-y-2">
                             <div className="flex items-center gap-2 text-gray-600">
                                 <Calendar size={16} className="text-primary" />
                                 <span className="text-sm font-medium">{formatDate(party.date)}</span>
                                 <span className="text-gray-300">|</span>
                                 <Clock size={16} className="text-primary" />
                                 <span className="text-sm font-medium">{party.time}</span>
                             </div>
                             <div className="flex items-center gap-2 text-gray-600">
                                 <MapPin size={16} className="text-secondary" />
                                 <span className="text-sm truncate font-medium">{party.location}</span>
                             </div>
                        </div>
                    </div>
                ))
            )}
       </div>
    </div>
  );
};

export default PartyManager;
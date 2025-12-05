export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CALENDAR = 'CALENDAR',
  TASKS = 'TASKS',
  PARTIES = 'PARTIES'
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string; // ISO Date string
  priority: 'low' | 'medium' | 'high';
}

export interface Party {
  id: string;
  // Client Info
  clientName: string;
  clientPhone: string;
  
  // Birthday Info
  birthdayPerson: string; // Nome do aniversariante
  age: number;
  numberOfChildren: number;
  
  // Event Info
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  theme: string;
  
  // Extras
  workshops: string; // Oficinas
  observations: string;
  
  status: 'pending' | 'confirmed' | 'completed';
}

export interface PartyStats {
  totalParties: number;
  upcomingParties: number;
  completedTasks: number;
  totalTasks: number;
}
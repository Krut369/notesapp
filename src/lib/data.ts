import type { Note } from './definitions';

// In-memory store for notes
let notes: Note[] = [
  {
    id: '1',
    title: 'Meeting with a client',
    subject: 'Project Alpha',
    person: 'John Doe',
    description: 'Discuss the new requirements for Project Alpha. Prepare the presentation and the demo.',
    createdAt: new Date('2023-10-01T10:00:00Z'),
  },
  {
    id: '2',
    title: 'Brainstorming Session',
    subject: 'New Marketing Campaign',
    person: 'Jane Smith',
    description: 'Generate ideas for the Q4 marketing campaign. Focus on social media and content marketing.',
    createdAt: new Date('2023-10-02T14:30:00Z'),
  },
  {
    id: '3',
    title: 'Dentist Appointment',
    subject: 'Regular Check-up',
    person: 'Dr. Adams',
    description: 'Annual dental check-up and cleaning. Remember to ask about whitening options.',
    createdAt: new Date('2023-10-05T09:00:00Z'),
  },
];

export async function getNotes(): Promise<Note[]> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  return notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function addNote(noteData: Omit<Note, 'id' | 'createdAt'>): Promise<Note> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const newNote: Note = {
    ...noteData,
    id: String(Date.now()),
    createdAt: new Date(),
  };
  notes.unshift(newNote);
  return newNote;
}

export async function updateNote(id: string, noteData: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<Note | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const noteIndex = notes.findIndex(note => note.id === id);
  if (noteIndex === -1) {
    return null;
  }
  notes[noteIndex] = { ...notes[noteIndex], ...noteData };
  return notes[noteIndex];
}

export async function deleteNote(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  notes = notes.filter(note => note.id !== id);
}

import type { Note } from './definitions';
import { supabase } from './supabase';

// The note object from Supabase might have string values for subject and person for old data.
// Using `any` here to handle this inconsistency, ensuring the app always gets a consistent Note type.
function fromSupabase(note: any): Note {
  const parseTags = (tags: any): string[] => {
    if (Array.isArray(tags)) {
      return tags.filter(Boolean).map(String);
    }
    if (typeof tags === 'string') {
      const trimmedTags = tags.trim();
      if (trimmedTags.startsWith('[') && trimmedTags.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmedTags);
          if (Array.isArray(parsed)) {
            return parsed.filter(Boolean).map(String);
          }
        } catch (e) {
          // Fall through to treat as a single tag
        }
      }
      return trimmedTags ? [trimmedTags] : [];
    }
    return [];
  };

  return {
    id: note.id,
    title: note.title,
    subject: parseTags(note.subject),
    person: parseTags(note.person),
    description: note.description,
    createdAt: new Date(note.created_at),
  };
}

export async function getNotes(): Promise<Note[]> {
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error fetching notes:', error.message);
    return [];
  }

  return notes.map(fromSupabase);
}

export async function addNote(noteData: Omit<Note, 'id' | 'createdAt'>): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .insert([
      {
        title: noteData.title,
        subject: noteData.subject,
        person: noteData.person,
        description: noteData.description,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Supabase error adding note:', error.message);
    throw new Error('Failed to add note.');
  }

  return fromSupabase(data);
}

export async function updateNote(id: string, noteData: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<Note | null> {
    const { data, error } = await supabase
    .from('notes')
    .update(noteData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Supabase error updating note:', error.message);
    if (error.code === 'PGRST116') { // No single row was returned
        return null;
    }
    throw new Error('Failed to update note.');
  }
  
  return fromSupabase(data);
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Supabase error deleting note:', error.message);
    throw new Error('Failed to delete note.');
  }
}

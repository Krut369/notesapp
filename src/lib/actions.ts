'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { addNote, updateNote as updateNoteData, deleteNote as deleteNoteData } from './data';

const NoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  subject: z.array(z.string()).min(1, { message: "At least one subject is required." }),
  person: z.array(z.string()).min(1, { message: "At least one person is required." }),
  description: z.string().min(1, { message: "Description is required." }),
});

export type FormState = {
  errors?: {
    title?: string[];
    subject?: string[];
    person?: string[];
    description?: string[];
  };
  message?: string;
} | undefined;

export async function createNote(prevState: FormState, formData: FormData) {
  const validatedFields = NoteSchema.safeParse({
    title: formData.get('title'),
    subject: formData.getAll('subject'),
    person: formData.getAll('person'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Note.',
    };
  }
  
  try {
    await addNote(validatedFields.data);
  } catch (error) {
    return { message: 'Database Error: Failed to Create Note.' };
  }
  
  revalidatePath('/');
  return { message: 'Note created successfully.' };
}

export async function updateNote(id: string, prevState: FormState, formData: FormData) {
  const validatedFields = NoteSchema.safeParse({
    title: formData.get('title'),
    subject: formData.getAll('subject'),
    person: formData.getAll('person'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Note.',
    };
  }

  try {
    await updateNoteData(id, validatedFields.data);
  } catch (error) {
    return { message: 'Database Error: Failed to Update Note.' };
  }

  revalidatePath('/');
  return { message: 'Note updated successfully.' };
}

export async function deleteNote(id: string) {
  try {
    await deleteNoteData(id);
    revalidatePath('/');
    return { message: 'Note deleted.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Note.' };
  }
}

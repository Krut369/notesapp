'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { createNote, updateNote } from '@/lib/actions';
import type { Note } from '@/lib/definitions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const NoteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  person: z.string().min(1, 'Person is required'),
  description: z.string().min(1, 'Description is required'),
});

type NoteFormData = z.infer<typeof NoteSchema>;

type NoteFormProps = {
  note: Note | null;
  onFinished: () => void;
};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto" style={{ backgroundColor: 'var(--primary)'}}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Note')}
    </Button>
  );
}

export function NoteForm({ note, onFinished }: NoteFormProps) {
  const { toast } = useToast();
  const formAction = note ? updateNote.bind(null, note.id) : createNote;
  const [state, dispatch] = useActionState(formAction, undefined);

  const { register, formState: { errors } } = useForm<NoteFormData>({
    resolver: zodResolver(NoteSchema),
    defaultValues: {
      title: note?.title || '',
      subject: note?.subject || '',
      person: note?.person || '',
      description: note?.description || '',
    },
  });

  useEffect(() => {
    if (state?.message && !state.errors) {
        toast({
            title: note ? "Note Updated" : "Note Created",
            description: `Your note has been successfully ${note ? 'updated' : 'created'}.`,
        });
      onFinished();
    }
  }, [state, onFinished, toast, note]);

  return (
    <form action={dispatch} className="grid gap-6 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} />
            {(errors.title || state?.errors?.title) && <p className="text-sm text-destructive">{errors.title?.message || state?.errors?.title?.[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" {...register('subject')} />
            {(errors.subject || state?.errors?.subject) && <p className="text-sm text-destructive">{errors.subject?.message || state?.errors?.subject?.[0]}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="person">Person</Label>
        <Input id="person" {...register('person')} />
        {(errors.person || state?.errors?.person) && <p className="text-sm text-destructive">{errors.person?.message || state?.errors?.person?.[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} className="min-h-[120px]" />
        {(errors.description || state?.errors?.description) && <p className="text-sm text-destructive">{errors.description?.message || state?.errors?.description?.[0]}</p>}
      </div>
       {state?.message && state.errors && (
         <p className="text-sm text-destructive">{state.message}</p>
       )}
      <div className="flex justify-end">
        <SubmitButton isEdit={!!note} />
      </div>
    </form>
  );
}

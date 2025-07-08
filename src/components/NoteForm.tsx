'use client';

import { useEffect, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';

import { createNote, updateNote } from '@/lib/actions';
import type { Note } from '@/lib/definitions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { FormControl } from './ui/form';

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
  subjects: string[];
  people: string[];
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

export function NoteForm({ note, onFinished, subjects, people }: NoteFormProps) {
  const { toast } = useToast();
  const formAction = note ? updateNote.bind(null, note.id) : createNote;
  const [state, dispatch] = useActionState(formAction, undefined);

  const { register, formState: { errors }, control, setValue } = useForm<NoteFormData>({
    resolver: zodResolver(NoteSchema),
    defaultValues: {
      title: note?.title || '',
      subject: note?.subject || '',
      person: note?.person || '',
      description: note?.description || '',
    },
  });

  const [openSubject, setOpenSubject] = useState(false);
  const [searchSubject, setSearchSubject] = useState(note?.subject || '');
  const [openPerson, setOpenPerson] = useState(false);
  const [searchPerson, setSearchPerson] = useState(note?.person || '');


  useEffect(() => {
    if (state?.message && !state.errors) {
        toast({
            title: note ? "Note Updated" : "Note Created",
            description: `Your note has been successfully ${note ? 'updated' : 'created'}.`,
        });
      onFinished();
    }
  }, [state, onFinished, toast, note]);

  const filteredSubjects = subjects.filter(s => s.toLowerCase().includes(searchSubject.toLowerCase()));
  const canCreateSubject = searchSubject && !subjects.some(s => s.toLowerCase() === searchSubject.toLowerCase());

  const filteredPeople = people.filter(p => p.toLowerCase().includes(searchPerson.toLowerCase()));
  const canCreatePerson = searchPerson && !people.some(p => p.toLowerCase() === searchPerson.toLowerCase());


  return (
    <form action={dispatch} className="grid gap-6 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} />
            {(errors.title || state?.errors?.title) && <p className="text-sm text-destructive">{errors.title?.message || state?.errors?.title?.[0]}</p>}
        </div>
        <Controller
            control={control}
            name="subject"
            render={({ field }) => (
                <div className="space-y-2">
                    <Label>Subject</Label>
                    <Popover open={openSubject} onOpenChange={setOpenSubject}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant="outline" role="combobox" className={cn("w-full justify-between font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value || "Select or create..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command shouldFilter={false}>
                                <CommandInput placeholder="Search subject..." value={searchSubject} onValueChange={setSearchSubject}/>
                                <CommandList>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    <CommandGroup>
                                        {canCreateSubject && (
                                            <CommandItem onSelect={() => {
                                                setValue('subject', searchSubject, { shouldValidate: true });
                                                setOpenSubject(false);
                                            }}>
                                                <span className="mr-2"></span> Create "{searchSubject}"
                                            </CommandItem>
                                        )}
                                        {filteredSubjects.map((subject) => (
                                            <CommandItem value={subject} key={subject} onSelect={() => {
                                                setValue('subject', subject, { shouldValidate: true });
                                                setOpenSubject(false);
                                                setSearchSubject(subject);
                                            }}>
                                                <Check className={cn("mr-2 h-4 w-4", subject === field.value ? "opacity-100" : "opacity-0")}/>
                                                {subject}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {(errors.subject || state?.errors?.subject) && <p className="text-sm text-destructive">{errors.subject?.message || state?.errors?.subject?.[0]}</p>}
                </div>
            )}
        />
      </div>
      <Controller
        control={control}
        name="person"
        render={({ field }) => (
            <div className="space-y-2">
                <Label>Person</Label>
                <Popover open={openPerson} onOpenChange={setOpenPerson}>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button variant="outline" role="combobox" className={cn("w-full justify-between font-normal", !field.value && "text-muted-foreground")}>
                                {field.value || "Select or create..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command shouldFilter={false}>
                            <CommandInput placeholder="Search person..." value={searchPerson} onValueChange={setSearchPerson}/>
                            <CommandList>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup>
                                    {canCreatePerson && (
                                        <CommandItem onSelect={() => {
                                            setValue('person', searchPerson, { shouldValidate: true });
                                            setOpenPerson(false);
                                        }}>
                                            <span className="mr-2"></span> Create "{searchPerson}"
                                        </CommandItem>
                                    )}
                                    {filteredPeople.map((person) => (
                                        <CommandItem value={person} key={person} onSelect={() => {
                                            setValue('person', person, { shouldValidate: true });
                                            setOpenPerson(false);
                                            setSearchPerson(person);
                                        }}>
                                            <Check className={cn("mr-2 h-4 w-4", person === field.value ? "opacity-100" : "opacity-0")}/>
                                            {person}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {(errors.person || state?.errors?.person) && <p className="text-sm text-destructive">{errors.person?.message || state?.errors?.person?.[0]}</p>}
            </div>
        )}
      />
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

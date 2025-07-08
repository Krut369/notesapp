'use client';

import { useEffect, useActionState, useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { createNote, updateNote } from '@/lib/actions';
import type { Note } from '@/lib/definitions';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X, ChevronDown, PlusCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Form } from './ui/form';
import { Badge } from './ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const NoteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.array(z.string()).min(1, 'At least one subject is required'),
  person: z.array(z.string()).min(1, 'At least one person is required'),
  description: z.string().min(1, 'Description is required'),
});

type NoteFormData = z.infer<typeof NoteSchema>;

type NoteFormProps = {
  note: Note | null;
  onFinished: () => void;
  subjects: string[];
  people: string[];
};

function SubmitButton({ isEdit, isPending }: { isEdit: boolean; isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending} className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90">
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isPending ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Note')}
    </Button>
  );
}

const MultiSelectCombobox = ({
    options,
    selected,
    onChange,
    placeholder,
    name
}: {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder: string;
    name: string;
}) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleRemove = (item: string) => {
        onChange(selected.filter((s) => s !== item));
    };
    
    const handleToggle = (item: string) => {
        setInputValue('');
        setOpen(false);
        onChange(
            selected.includes(item)
                ? selected.filter((s) => s !== item)
                : [...selected, item]
        );
    }

    const handleCreate = (item: string) => {
        if (!selected.includes(item)) {
            onChange([...selected, item]);
        }
        setInputValue('');
        setOpen(false);
    }
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue) {
            e.preventDefault();
            const exists = [...options, ...selected].some(
              (o) => o.toLowerCase() === inputValue.toLowerCase()
            );
            if (!exists) {
                handleCreate(inputValue);
            }
        } else if (e.key === 'Backspace' && !inputValue && selected.length > 0) {
            handleRemove(selected[selected.length - 1]);
        }
    };
    
    const allOptions = [...new Set([...options, ...selected])].sort();

    const displayedOptions = allOptions.filter(option => 
        option.toLowerCase().includes(inputValue.toLowerCase())
    );

    const canCreate = inputValue && !allOptions.find(o => o.toLowerCase() === inputValue.toLowerCase());

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-between font-normal min-h-10 h-auto cursor-pointer"
                    )}
                    role="combobox"
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                >
                    <div className="flex flex-wrap gap-1">
                        {selected.length > 0 ? (
                             selected.map((item) => (
                                <Badge
                                    key={item}
                                    variant="secondary"
                                    className="gap-1.5 pr-1"
                                >
                                    {item}
                                    <button
                                        type="button"
                                        aria-label={`Remove ${item}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(item);
                                        }}
                                        className="rounded-full bg-muted-foreground/20 p-0.5 hover:bg-destructive hover:text-destructive-foreground"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground">{placeholder}</span>
                        )}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command onKeyDown={handleKeyDown}>
                    <CommandInput 
                        placeholder="Search or create..." 
                        value={inputValue}
                        onValueChange={setInputValue}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {canCreate && (
                                <CommandItem
                                    onSelect={() => handleCreate(inputValue)}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create "{inputValue}"
                                </CommandItem>
                            )}
                            {displayedOptions.map((option) => (
                                <CommandItem
                                    key={option}
                                    onSelect={() => {
                                        handleToggle(option);
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <Checkbox
                                        id={`checkbox-${name}-${option}`}
                                        checked={selected.includes(option)}
                                    />
                                    <label htmlFor={`checkbox-${name}-${option}`} className="w-full cursor-pointer">{option}</label>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export function NoteForm({ note, onFinished, subjects, people }: NoteFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const formAction = note ? updateNote.bind(null, note.id) : createNote;
  const [state, dispatch] = useActionState(formAction, undefined);

  const form = useForm<NoteFormData>({
    resolver: zodResolver(NoteSchema),
    defaultValues: {
      title: note?.title || '',
      subject: note?.subject || [],
      person: note?.person || [],
      description: note?.description || '',
    },
  });

  const { handleSubmit, control, reset, formState: { errors } } = form;

  useEffect(() => {
    reset({
      title: note?.title || '',
      subject: note?.subject || [],
      person: note?.person || [],
      description: note?.description || '',
    });
  }, [note, reset]);


  useEffect(() => {
    if (state?.message && !state.errors) {
        toast({
            title: note ? "Note Updated" : "Note Created",
            description: `Your note has been successfully ${note ? 'updated' : 'created'}.`,
        });
      onFinished();
    }
  }, [state, onFinished, toast, note]);


  const processForm = (data: NoteFormData) => {
    startTransition(() => {
        const formData = new FormData();
        formData.append('title', data.title);
        data.subject.forEach(s => formData.append('subject', s));
        data.person.forEach(p => formData.append('person', p));
        formData.append('description', data.description);
        dispatch(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(processForm)} className="grid gap-6 py-4">
        <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} />
            {(errors.title || state?.errors?.title) && <p className="text-sm text-destructive">{errors.title?.message || state?.errors?.title?.[0]}</p>}
        </div>

        <Controller
            control={control}
            name="subject"
            render={({ field }) => (
                <div className="space-y-2">
                    <Label>Subject</Label>
                    <MultiSelectCombobox
                        options={subjects}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Select or create subjects..."
                        name="subject"
                    />
                     {(errors.subject || state?.errors?.subject) && <p className="text-sm text-destructive">{errors.subject?.message || state?.errors?.subject?.[0]}</p>}
                </div>
            )}
        />
        <Controller
            control={control}
            name="person"
            render={({ field }) => (
                <div className="space-y-2">
                    <Label>Person</Label>
                    <MultiSelectCombobox
                        options={people}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Select or create people..."
                        name="person"
                    />
                    {(errors.person || state?.errors?.person) && <p className="text-sm text-destructive">{errors.person?.message || state?.errors?.person?.[0]}</p>}
                </div>
            )}
        />
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...form.register('description')} className="min-h-[120px]" />
          {(errors.description || state?.errors?.description) && <p className="text-sm text-destructive">{errors.description?.message || state?.errors?.description?.[0]}</p>}
        </div>
         {state?.message && state.errors && (
           <p className="text-sm text-destructive">{state.message}</p>
         )}
        <div className="flex justify-end">
          <SubmitButton isEdit={!!note} isPending={isPending} />
        </div>
      </form>
    </Form>
  );
}

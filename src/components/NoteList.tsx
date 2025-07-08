'use client';

import { useState } from 'react';
import type { Note } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, Filter, X } from 'lucide-react';
import NoteCard from './NoteCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NoteForm } from './NoteForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { deleteNote } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NoteView } from './NoteView';

export default function NoteList({ notes }: { notes: Note[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { toast } = useToast();

  const [subjectFilter, setSubjectFilter] = useState('');
  const [personFilter, setPersonFilter] = useState('');

  const subjects = [...new Set(notes.map((note) => note.subject))].sort();
  const people = [...new Set(notes.map((note) => note.person))].sort();

  const handleCreate = () => {
    setSelectedNote(null);
    setDialogOpen(true);
  };

  const handleEdit = (note: Note) => {
    setSelectedNote(note);
    setDialogOpen(true);
  };

  const handleView = (note: Note) => {
    setSelectedNote(note);
    setViewDialogOpen(true);
  };

  const handleDeleteRequest = (note: Note) => {
    setSelectedNote(note);
    setDeleteDialogOpen(true);
  }

  const handleDeleteConfirm = async () => {
    if (!selectedNote) return;
    setIsDeleting(true);
    const result = await deleteNote(selectedNote.id);
    if(result.message) {
      toast({
        title: "Success",
        description: result.message,
      });
    }
    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setSelectedNote(null);
  }

  const clearFilters = () => {
    setSubjectFilter('');
    setPersonFilter('');
  };

  const filteredNotes = notes.filter((note) => {
    const subjectMatch = subjectFilter ? note.subject === subjectFilter : true;
    const personMatch = personFilter ? note.person === personFilter : true;
    return subjectMatch && personMatch;
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold font-headline tracking-tight">Your Notes</h2>
        <Button onClick={handleCreate} style={{ backgroundColor: 'var(--primary)' }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Note
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              {subjectFilter || 'Filter by Subject'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Subject</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={subjectFilter} onValueChange={setSubjectFilter}>
              {subjects.map((subject) => (
                <DropdownMenuRadioItem key={subject} value={subject}>
                  {subject}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              {personFilter || 'Filter by Person'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Person</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={personFilter} onValueChange={setPersonFilter}>
              {people.map((person) => (
                <DropdownMenuRadioItem key={person} value={person}>
                  {person}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {(subjectFilter || personFilter) && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {filteredNotes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={handleEdit} onDelete={handleDeleteRequest} onView={handleView} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-medium">
            {notes.length > 0 ? "No matching notes" : "No notes yet"}
          </h3>
          <p className="text-muted-foreground mt-2">
            {notes.length > 0 ? "Try adjusting your filters." : "Create your first note to get started."}
          </p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-2xl bg-background">
          <DialogHeader>
            <DialogTitle>{selectedNote ? 'Edit Note' : 'Create a new note'}</DialogTitle>
          </DialogHeader>
          <NoteForm note={selectedNote} onFinished={() => setDialogOpen(false)} subjects={subjects} people={people} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-2xl lg:max-w-3xl bg-background">
           <NoteView note={selectedNote} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note titled &quot;{selectedNote?.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

'use client';

import { useState } from 'react';
import type { Note } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import NoteCard from './NoteCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NoteForm } from './NoteForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { deleteNote } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

export default function NoteList({ notes }: { notes: Note[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { toast } = useToast();

  const handleCreate = () => {
    setSelectedNote(null);
    setDialogOpen(true);
  };

  const handleEdit = (note: Note) => {
    setSelectedNote(note);
    setDialogOpen(true);
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

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold font-headline tracking-tight">Your Notes</h2>
        <Button onClick={handleCreate} style={{ backgroundColor: 'var(--primary)' }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Note
        </Button>
      </div>

      {notes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={handleEdit} onDelete={handleDeleteRequest} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-medium">No notes yet</h3>
          <p className="text-muted-foreground mt-2">Create your first note to get started.</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-2xl bg-background">
          <DialogHeader>
            <DialogTitle>{selectedNote ? 'Edit Note' : 'Create a new note'}</DialogTitle>
          </DialogHeader>
          <NoteForm note={selectedNote} onFinished={() => setDialogOpen(false)} />
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

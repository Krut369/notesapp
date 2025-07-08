'use client';

import { useState, useEffect } from 'react';
import type { Note } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Pencil, Trash2, User, Book, Calendar, Eye } from "lucide-react";
import { format } from "date-fns";

type NoteCardProps = { 
    note: Note; 
    onEdit: (note: Note) => void; 
    onDelete: (note: Note) => void; 
    onView: (note: Note) => void; 
};

export default function NoteCard({ note, onEdit, onDelete, onView }: NoteCardProps) {
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    // Format date only on the client-side to avoid hydration mismatch
    setFormattedDate(format(new Date(note.createdAt), "PPP"));
  }, [note.createdAt]);

  return (
    <Card className="flex flex-col h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="font-headline">{note.title}</CardTitle>
        <CardDescription className="flex items-center gap-4 pt-2">
            <span className="flex items-center gap-1 text-xs"><Book className="w-3 h-3"/> {note.subject}</span>
            <span className="flex items-center gap-1 text-xs"><User className="w-3 h-3"/> {note.person}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-4">{note.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-4">
        <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1.5" />
            <span>{formattedDate || '...'}</span>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onView(note)}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View Note</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(note)}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit Note</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(note)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete Note</span>
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
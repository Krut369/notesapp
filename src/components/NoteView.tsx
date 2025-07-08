'use client';

import type { Note } from "@/lib/definitions";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User, Book, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "./ui/badge";

export function NoteView({ note }: { note: Note | null }) {
  if (!note) return null;

  return (
    <div className="flex flex-col gap-4">
        <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-headline text-primary">{note.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
                <Book className="w-4 h-4 text-primary mt-1 shrink-0" />
                <span className="font-medium">Subject:</span>
                <div className="flex flex-wrap gap-1">
                  {note.subject.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                </div>
            </div>
            <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-primary mt-1 shrink-0" />
                <span className="font-medium">Person:</span>
                 <div className="flex flex-wrap gap-1">
                  {note.person.map(p => <Badge key={p} variant="secondary">{p}</Badge>)}
                </div>
            </div>
        </div>
        <Separator />
        <ScrollArea className="max-h-[50vh] pr-4">
            <p className="text-base leading-relaxed whitespace-pre-wrap">
                {note.description}
            </p>
        </ScrollArea>
        <div className="flex justify-end items-center text-xs text-muted-foreground pt-4 border-t">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Created on {format(new Date(note.createdAt), "PPPp")}</span>
        </div>
    </div>
  );
}

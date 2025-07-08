import { getNotes } from "@/lib/data";
import { Header } from "@/components/Header";
import NoteList from "@/components/NoteList";

export default async function Home() {
  const notes = await getNotes();

  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <NoteList notes={notes} />
        </div>
      </main>
    </div>
  );
}

import { getSession } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

export async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold font-headline text-primary">NoteNest</h1>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {session?.username}</span>
            <LogoutButton />
        </div>
      </div>
    </header>
  );
}

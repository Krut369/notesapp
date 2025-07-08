import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-headline text-primary">NoteNest</h1>
            <p className="text-muted-foreground mt-2">Welcome back! Please sign in.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

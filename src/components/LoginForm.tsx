'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} style={{ backgroundColor: 'var(--primary)' }}>
      {pending ? 'Signing In...' : 'Sign In'}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(login, undefined);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          {state?.message && (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {state.message}
                </AlertDescription>
             </Alert>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" type="text" placeholder="admin" required defaultValue="admin" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required defaultValue="admin123" />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}

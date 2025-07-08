'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE_NAME = 'session';

export type Session = {
  username: string;
};

export async function getSession() {
  const session = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  try {
    return JSON.parse(session) as Session;
  } catch (error) {
    return null;
  }
}

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (username !== 'admin' || password !== 'admin123') {
    return { message: 'Invalid username or password.' };
  }

  const session: Session = { username };

  cookies().set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/',
  });

  redirect('/');
}

export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME);
  redirect('/login');
}

'use server';
import { APITester } from './ApiTester';
import { redirect } from 'next/navigation';

export default async function ApiTestingPage() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  // check if environment is not development
  if (!isDevelopment) {
    redirect('/');
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <APITester />
    </div>
  );
}

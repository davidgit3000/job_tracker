'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { ButtonSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, create the user account
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, firstName }),
      });

      const signupData = await signupResponse.json();

      if (signupResponse.ok) {
        // Account created successfully, now sign them in
        const result = await signIn('credentials', {
          username,
          firstName,
          redirect: false
        });

        if (result?.ok) {
          toast.success('Account created successfully! Welcome to JobTracker!');
          router.push('/dashboard');
        } else {
          toast.error('Account created but login failed. Please try logging in manually.');
        }
      } else {
        if (signupResponse.status === 409) {
          toast.error('Username already exists. Please choose a different username.');
        } else {
          toast.error(signupData.error || 'Signup failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Logo size="md" showText={true} />
          </div>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Create your account to start tracking job applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Choose a unique username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Enter your first name"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !username || !firstName}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <ButtonSpinner size="sm" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

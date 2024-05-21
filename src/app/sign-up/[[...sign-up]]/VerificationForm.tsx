import * as React from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

function VerificationForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState('');
  const router = useRouter();

  // 👉 Handles the verification process once the user has entered the validation code from email
  async function handleVerification(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded && !signUp) return null;

    try {
      // 👉 Use the code provided by the user and attempt verification
      const signInAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // 👉 If verification was completed, set the session to active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push('/after-sign-up');
      } else {
        // 👉 If the status is not complete. User may need to complete further steps.
      }
    } catch (err) {
      // 👉 Something went wrong...
    }
  }

  return (
    <div className='flex items-center justify-center mt-20'>
      <form onSubmit={handleVerification}>
        <Card className="w-full sm:w-96">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Welcome! Please fill in the details to get started.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-y-4">
            <div>
              <Label htmlFor="code">Enter your verification code</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                id="code"
                name="code"
                required />
            </div>
          </CardContent>
          <CardFooter>
            <div className="grid w-full gap-y-4">
              <Button type="submit" disabled={!isLoaded}>
                Verify
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

export default VerificationForm
'use client';

import * as React from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import SignUpForm from './SignUpForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from "@stripe/react-stripe-js";

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState('');
  const router = useRouter();
  const options = {
    appearance: {
      theme: 'stripe'
    },
  };

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

  // Handles the sign-up process, including storing the card token and price id into the users metadata
  async function handleSubmit(email: string, cardToken: string, priceId: string) {
    if (!isLoaded && !signUp) return null;

    try {
      // Start the sign-up process using the phone number method
      await signUp.create({
        emailAddress: email,
        unsafeMetadata: {
          cardToken,
          priceId
        }
      });

      // Start the verification - a SMS message will be sent to the
      // number with a one-time code
      await signUp.prepareEmailAddressVerification();

      // Set verifying to true to display second form and capture the OTP code
      setVerifying(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Error:', JSON.stringify(err, null, 2));
    }
  }

  // Handles the verification process once the user has entered the validation code from email
  async function handleVerification(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded && !signUp) return null;

    try {
      // Use the code provided by the user and attempt verification
      const signInAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });

        router.push('/after-sign-up');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(signInAttempt);
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Error:', JSON.stringify(err, null, 2));
    }
  }

  // Renders the form showing
  if (verifying) {
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
    );
  }

  return (
    <div className='flex items-center justify-center mt-20'>
      {/* @ts-ignore */}
      <Elements options={options} stripe={stripePromise}>
        <SignUpForm onSubmit={handleSubmit} />
      </Elements>
    </div>
  );
}
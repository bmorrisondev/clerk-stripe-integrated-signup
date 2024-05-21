'use client';

import * as React from 'react';
import { useState } from 'react';
import SignUpForm from './SignUpForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from "@stripe/react-stripe-js";
import VerificationForm from './VerificationForm';

export default function Page() {
  const [verifying, setVerifying] = useState(false);
  const options = {
    appearance: {
      theme: 'stripe'
    },
  };
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

  // 👉 Render the verification form, meaning OTP email has been set
  if (verifying) {
    return <VerificationForm />
  }

  // 👉 Render the signup form by default
  return (
    <div className='flex items-center justify-center mt-20'>
      {/* @ts-ignore */}
      <Elements options={options} stripe={stripePromise}>
        <SignUpForm setVerifying={setVerifying} />
      </Elements>
    </div>
  );
}
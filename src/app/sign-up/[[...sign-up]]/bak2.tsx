'use client';
import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { loadStripe } from '@stripe/stripe-js';
import { AddressElement, CardElement, Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from 'react';
import SignUpForm from './SignUpForm';

export default function SignUpPage() {
  const options = {
    // clientSecret,
    appearance: {
      theme: 'stripe'
    },
  };

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      {/* @ts-ignore */}
      <Elements options={options} stripe={stripePromise}>
        <SignUpForm />
      </Elements>
    </div>
  );
}

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  async function tokenize(e: any) {
    e.preventDefault();
    if(!elements || !stripe) {
      return
    }

    const cardEl = elements?.getElement("card")
    if(cardEl) {
      const res = await stripe?.createToken(cardEl)
      console.log(res)
    }
  }

  return (
    <div>
      {/* <AddressElement /> */}
      <CardElement />
    </div>
  )
}
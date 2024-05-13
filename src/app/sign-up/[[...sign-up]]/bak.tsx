'use client';

import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';
import { loadStripe } from '@stripe/stripe-js';
import { AddressElement, CardElement, Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from 'react';
import CheckoutForm from '@/app/components/CheckoutForm';

export default function SignUpPage() {
  // const stripe = useStripe();
  // const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  // const [cardElRef, setCardElRef] = useRef(null);

  useEffect(() => {

  }, [])

  // useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  //   fetch("/api/create-payment-intent", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setClientSecret(data.clientSecret));
  // }, []);

  const options = {
    // clientSecret,
    appearance: {
      theme: 'stripe'
    },
  };

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

  async function doSomething() {
    console.log("yay!")
  }

  async function tokenize() {
    console.log(":asdlkfjasdf")
  }

  return (
    <div className="grid w-full flex-grow items-center bg-black px-4 sm:justify-center">
      <SignUp.Root>
        <SignUp.Step
          name="start"
          className="w-full space-y-6 rounded-2xl bg-neutral-900 bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 sm:w-96 sm:px-8"
        >
          <header className="text-center">
            <h1 className="mt-4 text-xl font-medium tracking-tight text-white">Create an account</h1>
          </header>
          <Clerk.GlobalError className="block text-sm text-red-400" />
          <div className="space-y-4">
            <Clerk.Field name="emailAddress" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-white">Email address</Clerk.Label>
              <Clerk.Input
                type="text"
                required
                className="w-full rounded-md bg-neutral-900 px-3.5 py-2 text-sm text-white outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
          </div>

          {/* @ts-ignore */}
          <Elements options={options} stripe={stripePromise}>
            <PaymentForm />
          </Elements>

          <SignUp.Action
            onClick={doSomething}
            submit
            className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10"
          >
            Sign Up
          </SignUp.Action>
          <p className="text-center text-sm text-zinc-400">
            Have an account?{' '}
            <a
              href="#"
              className="font-medium text-white decoration-white/20 underline-offset-4 outline-none hover:underline focus-visible:underline"
            >
              Sign in
            </a>
          </p>
        </SignUp.Step>
        <SignUp.Step
          name="verifications"
          className="w-full space-y-6 rounded-2xl bg-neutral-900 bg-[radial-gradient(circle_at_50%_0%,theme(colors.white/10%),transparent)] px-4 py-10 ring-1 ring-inset ring-white/5 sm:w-96 sm:px-8"
        >
          <header className="text-center">
            <h1 className="mt-4 text-xl font-medium tracking-tight text-white">Verify email code</h1>
          </header>
          <Clerk.GlobalError className="block text-sm text-red-400" />
          <SignUp.Strategy name="email_code">
            <Clerk.Field name="code" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-white">Email code</Clerk.Label>
              <Clerk.Input
                required
                className="w-full rounded-md bg-neutral-900 px-3.5 py-2 text-sm text-white outline-none ring-1 ring-inset ring-zinc-700 hover:ring-zinc-600 focus:bg-transparent focus:ring-[1.5px] focus:ring-blue-400 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
            <SignUp.Action
              submit
              className="relative isolate w-full rounded-md bg-blue-500 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow-[0_1px_0_0_theme(colors.white/10%)_inset,0_0_0_1px_theme(colors.white/5%)] outline-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-white/5 before:opacity-0 hover:before:opacity-100 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:text-white/70 active:before:bg-black/10"
            >
              Finish registration
            </SignUp.Action>
          </SignUp.Strategy>
          <p className="text-center text-sm text-zinc-400">
            Have an account?{' '}
            <a
              href="#"
              className="font-medium text-white decoration-white/20 underline-offset-4 outline-none hover:underline focus-visible:underline"
            >
              Sign in
            </a>
          </p>
        </SignUp.Step>
      </SignUp.Root>
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
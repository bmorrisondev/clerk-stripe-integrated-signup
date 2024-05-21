'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSignUp } from '@clerk/nextjs';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Props = {
  setVerifying: (val: boolean) => void
}

function SignUpForm({ setVerifying }: Props) {
  const { isLoaded, signUp } = useSignUp();
  const stripe = useStripe();
  const elements = useElements();
  const [priceId, setPriceId] = useState('')
  const [email, setEmail] = useState('')

  // 👉 Handles the sign-up process, including storing the card token and price id into the users metadata
  async function onSubmit() {
    if (!isLoaded && !signUp) return null;

    try {
      if(!elements || !stripe) {
        return
      }

      let cardToken = ''
      const cardEl = elements?.getElement("card")
      if(cardEl) {
        const res = await stripe?.createToken(cardEl)
        cardToken = res?.token?.id || ''
      }

      await signUp.create({
        emailAddress: email,
        unsafeMetadata: {
          cardToken,
          priceId
        }
      });

      // 👉 Start the verification - an email will be sent with an OTP code
      await signUp.prepareEmailAddressVerification();

      // 👉 Set verifying to true to display second form and capture the OTP code
      setVerifying(true);
    } catch (err) {
      // 👉 Something went wrong...
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Card className="w-full sm:w-96">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Welcome! Please fill in the details to get started.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-y-4">

          {/* // 👉  Email input */}
          <div>
            <Label htmlFor="emailAddress">Email address</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="emailAddress"
              name="emailAddress"
              required />
          </div>

          {/* // 👉 Product selection radio group */}
          <div>
            <Label>Select tier</Label>
            <RadioGroup defaultValue="option-one" className='mt-2'
              value={priceId} onValueChange={e => setPriceId(e)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price_1PG1OcF35z7flJq7p803vcEP" id="option-one" />
                <Label htmlFor="option-one">Pro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price_1PG1UwF35z7flJq7vRUrnOiv" id="option-two" />
                <Label htmlFor="option-two">Enterprise</Label>
              </div>
            </RadioGroup>
          </div>

          {/* // 👉 Use Stripe Elements to render the card capture form */}
          <Label>Payment details</Label>
          <div className='border rounded p-2'>
            <CardElement />
          </div>

        </CardContent>

        <CardFooter>
          <div className="grid w-full gap-y-4">
            <Button type="submit" disabled={!isLoaded}>
              Sign up for trial
            </Button>
            <Button variant="link" size="sm" asChild>
              <Link href="/sign-in">Already have an account? Sign in</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}

export default SignUpForm
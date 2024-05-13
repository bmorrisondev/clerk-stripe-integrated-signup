'use client';
import * as Clerk from '@clerk/elements/common';
import * as SignUp from '@clerk/elements/sign-up';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSignUp } from '@clerk/nextjs';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Props = {
  onSubmit: (email: string, cardToken: string, priceId: string) => void;
}

function SignUpForm({ onSubmit }: Props) {
  const { isLoaded } = useSignUp();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('')
  const [email, setEmail] = useState('')

  // tokenize the thing and store it with the user account
  async function _onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if(!elements || !stripe) {
      return
    }

    const cardEl = elements?.getElement("card")
    if(cardEl) {
      const res = await stripe?.createToken(cardEl)
      console.log(res)
      onSubmit(email, res?.token?.id || '', selectedProduct)
    }
  }

  return (
    <form onSubmit={_onSubmit}>
      <Card className="w-full sm:w-96">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Welcome! Please fill in the details to get started.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-y-4">
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
          <div>
            <RadioGroup defaultValue="option-one"
              value={selectedProduct} onValueChange={e => setSelectedProduct(e)}>
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

          <CardElement />

        </CardContent>

        <CardFooter>
          <div className="grid w-full gap-y-4">
            <Button type="submit" disabled={!isLoaded}>
              {isLoading ? <Icons.spinner className="size-4 animate-spin" /> : 'Sign up for trial'}
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
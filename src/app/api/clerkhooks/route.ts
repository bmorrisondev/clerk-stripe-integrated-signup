import { createWebhooksHandler } from '@brianmmdev/clerk-webhooks-handler'
import { Stripe } from "stripe";
import { clerkClient } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const handler = createWebhooksHandler({
  onUserCreated: async (user) => {
    const { cardToken, priceId } = user.unsafe_metadata
    if(!cardToken || !priceId) {
      // TODO: Throw and handle error
      return
    }

    // Create a payment method from the card token
    const pm = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: cardToken as string
      }
    })

    // Create a customer record in Stripe
    const customer = await stripe.customers.create({
      email: 'brian@brianmorrison.me',
      payment_method: pm.id,
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      default_payment_method: pm.id,
      trial_period_days: 14,
      items: [
        {
          price: priceId as string,
        },
      ],
    });

    // Update user metadata
    await clerkClient.users.updateUser(user.id, {
      publicMetadata: {
        stripeCustomerId: customer.id,
        stripeSubscriptionId: subscription.id
      }
    })
  },
  onUserUpdated: async (user) => {
    console.log("User updated", user)
  },
  onUserDeleted: async (user) => {
    console.log("User deleted", user)
  }
})

export const POST = handler.POST
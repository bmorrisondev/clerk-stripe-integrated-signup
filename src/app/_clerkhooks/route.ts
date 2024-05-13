import { createWebhooksHandler } from '@brianmmdev/clerk-webhooks-handler'
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const handler = createWebhooksHandler({
  onUserCreated: async (user) => {
    const { cardToken, priceId } = user.unsafe_metadata
    if(!cardToken || !priceId) {
      // TODO: Throw and handle error
      return
    }

    const pm = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: cardToken as string
      }
    })

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
  }
})

export const POST = handler.POST
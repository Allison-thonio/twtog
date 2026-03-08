import Stripe from 'stripe'

// We use a dummy key for build-time compatibility to prevent the Stripe 
// constructor from throwing an error during Next.js static analysis.
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeKey, {
    // @ts-ignore - Bypass version literal type mismatch
    apiVersion: '2025-01-27.acacia',
    typescript: true,
})

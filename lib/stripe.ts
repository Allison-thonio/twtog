import Stripe from 'stripe'

const stripeKey = process.env.STRIPE_SECRET_KEY || '';

if (!stripeKey) {
    console.warn("STRIPE_SECRET_KEY is missing. Stripe functionality will be unavailable.");
}

export const stripe = new Stripe(stripeKey, {
    // @ts-ignore - Bypass version literal type mismatch
    apiVersion: '2025-01-27.acacia',
    typescript: true,
})

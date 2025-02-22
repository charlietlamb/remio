import { env } from '@remio/env'
import { Plan } from '@remio/hono/lib/types'

export type PricingTier = {
  title: string
  price: number
  description: string
  features: string[]
  buttonText: string
  priceId: string
  plan: Plan
}

export const pricingTiers: PricingTier[] = [
  {
    title: 'Basic',
    price: 30,
    description: 'Essential features for small projects',
    features: ['Analytic Reports', 'Email', 'Schedule Mediations'],
    buttonText: 'Get Started',
    priceId: env.NEXT_PUBLIC_STRIPE_PLAN_1_PRICE_ID,
    plan: 'basic',
  },
  {
    title: 'Pro',
    price: 50,
    description: 'Advanced features for mediations',
    features: [
      'Analytic Reports',
      'Email',
      'Note Editor',
      'Schedule Mediations',
      'Calendar Integrations',
      'Stripe Payments',
    ],
    buttonText: 'Upgrade to Pro',
    priceId: env.NEXT_PUBLIC_STRIPE_PLAN_2_PRICE_ID,
    plan: 'pro',
  },
  {
    title: 'Enterprise',
    price: 99,
    description: 'Contact Sales for Custom Features',
    features: ['Custom Features'],
    buttonText: 'Contact Sales',
    priceId: env.NEXT_PUBLIC_STRIPE_PLAN_3_PRICE_ID,
    plan: 'enterprise',
  },
]

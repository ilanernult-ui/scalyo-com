

## Problem

The user has a `plan: "datadiag"` in their Supabase profile but no `stripe_subscription_id`. The current `getButtonState` logic treats them as if they have a paid plan — marking "datadiag" as "Votre plan actuel" (disabled) and lower plans as disabled too. This blocks them from actually purchasing.

## Plan

### 1. Fix button logic in `src/pages/Tarifs.tsx`

Update `getButtonState` to check if the user has a real paid subscription (`stripeSubscriptionId` exists). If no `stripeSubscriptionId`, treat the user as having no plan — all buttons should be active with "Choisir ce plan" label.

```typescript
const hasPaidSubscription = !!stripeSubscriptionId && !isExpired;

const getButtonState = (targetPlan: PlanType) => {
  const targetLevel = planHierarchy[targetPlan];
  if (!isLoggedIn) return { label: "Commencer l'essai gratuit", disabled: false, variant: "default" as const };
  
  // No paid subscription = all plans available
  if (!hasPaidSubscription) {
    return { label: `Choisir ce plan — ${STRIPE_PLANS[targetPlan].monthly}€/mois`, disabled: false, variant: "default" as const };
  }
  
  // Has paid subscription - existing logic
  if (targetPlan === currentPlan) return { label: "Votre plan actuel", disabled: true, variant: "secondary" as const };
  if (targetLevel < currentLevel) return { label: "Plan inférieur", disabled: true, variant: "secondary" as const };
  return { label: `Choisir ce plan — ${STRIPE_PLANS[targetPlan].monthly}€/mois`, disabled: false, variant: "default" as const };
};
```

Also update `currentLevel` usage and card styling (opacity, "Votre plan actuel" badge) to only apply when `hasPaidSubscription` is true.

### 2. Reset user profile in Supabase

Use the insert tool to set `plan = 'datadiag'`, `plan_status = 'active'`, `stripe_subscription_id = NULL`, `stripe_customer_id = NULL` for the current user so they start clean.

### 3. Edge Function `create-checkout` — no changes needed

It already handles existing vs new Stripe customers correctly (lines check `customers.list` by email).


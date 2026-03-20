

## Summary

Two changes needed:

1. **Fix Stripe checkout blank page** — Update `Tarifs.tsx` to also return `sessionId` from the edge function, use `@stripe/stripe-js` `redirectToCheckout` as primary method with `window.open` as fallback, and show a visible error if redirect fails. Update `create-checkout` edge function to return `sessionId` alongside `url`.

2. **Make Navbar auth-aware** — Add `useAuth` to `Navbar.tsx` so logged-in users see their email/name and a "Se deconnecter" button instead of "Connexion" / "Demarrer gratuitement".

Note: The Auth page (`/auth`) and DashboardSidebar logout button already exist and match all requirements from PROMPT 1. No changes needed there.

---

## Technical Details

### 1. Fix Stripe checkout (2 files)

**`supabase/functions/create-checkout/index.ts`**
- Return `{ url: session.url, sessionId: session.id }` instead of just `{ url }`

**`src/pages/Tarifs.tsx`**
- Install and import `loadStripe` from `@stripe/stripe-js`
- In `handleChoosePlan`: after receiving `data.sessionId`, use `stripe.redirectToCheckout({ sessionId })` as primary redirect method
- Fallback to `window.open(data.url, '_self')` if `redirectToCheckout` fails
- Show a toast with the Stripe URL as a clickable link if all redirects fail, so the user can manually navigate

### 2. Auth-aware Navbar (`src/components/landing/Navbar.tsx`)

- Import `useAuth` to get `user` and `signOut`
- When `user` is logged in (desktop):
  - Hide "Connexion" and "Demarrer gratuitement"
  - Show user email (truncated) and a "Se deconnecter" button using `DropdownMenu`
- When `user` is logged in (mobile):
  - Replace "Connexion"/"Demarrer" buttons with "Se deconnecter"
- On sign out: call `signOut()` and navigate to `/auth`


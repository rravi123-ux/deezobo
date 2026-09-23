# Dee Zobo

A lightweight React + TypeScript + Vite skeleton for Ruth's made-to-order hibiscus
beverage website. Includes the six requested pages, reusable component files,
and account/admin outlines. Most components are deliberately TODO placeholders.

## Run locally

Requires Node.js 22.12+ and npm.

```sh
npm install
npm run dev
```

No credentials are required to view the scaffold. Copy `.env.example` to
`.env.local` only when implementing Supabase. The SDK and backend are not connected.

```sh
npm run typecheck
npm run build
npm run preview
```

## Pages

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `HomePage.tsx` | Brand introduction, featured drinks and promos |
| `/order` | `OrderPage.tsx` | Menu, product gallery/details, ingredients, sizes and quantities |
| `/cart` | `CartPage.tsx` | Cart, promotions, fulfillment and checkout sections |
| `/contact` | `ContactPage.tsx` | Contact links, messages, event inquiries and public pop-up map |
| `/login` | `LoginPage.tsx` | Sign-in, signup and password recovery |
| `/about` | `AboutPage.tsx` | Ruth's story and brand values |
| `/account` | `AccountPage.tsx` | Future customer profile and order history |
| `/admin` | `AdminPage.tsx` | Future owner order, catalog, promotion and inquiry management |
| Any other path | `NotFoundPage.tsx` | Missing-page fallback |

The account and admin pages expose static placeholders only. They are **not**
authenticated or authorized yet. Add route guards and backend permissions before
loading private data or enabling changes.

## Structure

```text
src/
  App.tsx                Route definitions
  main.tsx               React entry point
  pages/                 The six main pages plus account, admin and 404
  components/
    layout/              Navigation, footer and page layout
    common/              Page heading and temporary placeholder
    home/                Hero, featured products and fulfillment overview
    products/            Grid, card, details, gallery, nutrition and options
    cart/                Line items, totals and promotion code
    checkout/            Fulfillment form and payment section
    contact/             Contact links/forms, event request and map
    auth/                Login, signup and password recovery
    about/               Founder story and values
    account/             Profile and order history
    admin/               Orders, products, promotions, inbox, events, settings
  context/               Cart/session provider TODOs
  data/                  Supplied public business details
  lib/                   Supabase client TODO
  services/              API integration TODOs
  styles/                Small responsive scaffold stylesheet
  types/                 Minimal shared domain types
  assets/                Future imported logos and images
public/images/           Future approved public images
supabase/
  migrations/            Empty migration directory
  functions/             Checkout and Square webhook TODO modules
docs/
  requirements.md        Scope and decisions still needed
  schema.md              Reduced Supabase table outline
```

## What works now

Navigation, responsive placeholder layouts, and the supplied email/Instagram links.
There are no sample products, prices, live forms, stored orders, real authentication,
payments, or database migrations. Function TODO files are not deployable handlers.
The temporary colors are not a claimed match to the Instagram branding.

## Suggested build order

1. Confirm brand assets, products, prices, nutrition and fulfillment rules with Ruth.
2. Build the menu and cart components; add proper empty/loading/error states.
3. Implement Supabase schema/RLS, AuthContext and account/admin route guards.
4. Connect contact intake and admin order/product management.
5. Implement server-validated promotions, fulfillment and idempotent Square checkout.
6. Test owner workflows, mobile accessibility, cross-account isolation and payment failure paths.

Follow the later meeting note: there are no confirmed retail stockists yet. Never
publish the home pickup address. See [requirements](docs/requirements.md) and the
[small schema plan](docs/schema.md).

For eventual hosting, configure SPA fallback to `index.html` so direct links work.
Remove the development notice and noindex metadata only when preparing a real launch.

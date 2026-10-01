# Dee Zobo

A React + TypeScript + Vite site for Ruth's made-to-order hibiscus infusions and
mocktails. The `feature/fwwill` branch adapts the shared features of
[f-wwithwill](https://github.com/rravi123-ux/f-wwithwill) to Dee Zobo using the updated
2026 brochure.

## Run

Node.js 22.12+ and npm:

```sh
npm ci
npm run dev
```

Public pages work without credentials using the bundled brochure menu. To enable
Google admin sign-in and editable catalog/gallery data, follow
[admin setup](docs/admin-setup.md). Supabase credentials stay in ignored
`.env.local` or `.env`; `.env.example` contains names only.

## Pages

| Route    | Purpose                                                         |
| -------- | --------------------------------------------------------------- |
| /        | Welcome, featured drinks, introduction and occasion options     |
| /order   | Search/filter drinks, browse sizes/prices, open product details |
| /gallery | Filter images and open accessible image previews                |
| /about   | Ruth's story, mission and values (replaces Newsletter)          |
| /contact | Contact channels and event/general email draft form             |
| /cart    | Locally saved selection and an order-request email draft        |
| /login   | Google sign-in for authorized administrators                    |
| /admin   | Protected drink/gallery editor                                  |
| /account | Customer-order support handoff; order history is deferred       |

Compatibility routes: `/products` → `/order`, `/contacts` → `/contact`,
`/signin` → `/login`, `/newsletter` → `/about`.

## Boundaries

- No payment or order is created by the website yet. Email drafts must be sent
  in the user's email app. Final price, availability and fulfillment are confirmed
  directly by Ruth.
- Admin permissions are enforced by RLS and a protected role table. A successful
  Google sign-in does not make an ordinary customer an admin.
- The migration and brochure seed are supplied, not applied to a live project.
- Images are extracted from the supplied brochure. Unknown nutrition/allergen
  data, supermarket locations and delivery promises are not invented.
- Future order, payment, promotion and customer-account modules remain scaffolded.

See [adaptation map and content sources](docs/fwwill-adaptation.md),
[database scope](docs/schema.md) and [remaining requirements](docs/requirements.md).

## Checks

```sh
npm test
npm run build
# Start npm run dev in another terminal, then:
npx playwright install chromium
npm run test:browser
```

For an installed Chrome browser: `BROWSER_CHANNEL=chrome npm run test:browser`.
Browser checks use mocked backend responses and a fresh browser profile; no
messages are sent and no live database writes are made. Unit tests include
in-memory PostgreSQL RLS checks. Screenshots go to `/tmp/deezobo-qa`.

For hosting, configure SPA fallback to `index.html`. No deployment is made by
this branch. The existing noindex tag remains until the owner approves launch.

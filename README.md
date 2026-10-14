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
Google sign-in, editable catalog/gallery data, and image uploads, follow
[admin setup](docs/admin-setup.md). Supabase credentials stay in ignored
`.env.local` or `.env`; `.env.example` contains the public project URL and
variable names, without credentials.

## Pages

| Route    | Purpose                                                         |
| -------- | --------------------------------------------------------------- |
| /        | Welcome, featured drinks, introduction and occasion options     |
| /order   | Search/filter drinks, browse sizes/prices, open product details |
| /gallery | Filter images and open accessible image previews                |
| /about   | Ruth's story, mission and values (replaces Newsletter)          |
| /contact | Contact channels and event/general email draft form             |
| /cart    | Locally saved selection and an order-request email draft        |
| /login   | Google sign-in for customers and authorized administrators      |
| /admin   | Protected drink, gallery, and image-upload manager              |
| /account | Signed-in customer account links                                |

Compatibility routes: `/products` → `/order`, `/contacts` → `/contact`,
`/signin` → `/login`, `/newsletter` → `/about`.

## Boundaries

- No payment or order is created by the website yet. Email drafts must be sent
  in the user's email app. Final price, availability, and fulfillment are
  confirmed directly by Ruth.
- Admin permissions are enforced by RLS and a protected role table. A successful
  Google sign-in does not make an ordinary customer an admin.
- Supabase migrations are supplied in the repository; follow the setup guide to
  apply them to the target project.
- Images are extracted from the supplied brochure. Unknown nutrition/allergen
  data, supermarket locations and delivery promises are not invented.
- Online ordering, promotions, delivery pricing, taxes, and automated fulfillment
  remain future work.

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

For future hosting, configure the SPA to fall back to `index.html`. The existing
noindex tag remains until the owner approves launch.

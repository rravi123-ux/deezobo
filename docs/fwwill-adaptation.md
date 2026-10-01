# fwwill → Dee Zobo

Reference: [rravi123-ux/f-wwithwill](https://github.com/rravi123-ux/f-wwithwill),
commit `7ab621d`. Adapted into the existing Dee Zobo React 19/Vite application;
the reference project's independent React app and server are not copied wholesale.

| Reference element                                                | Dee Zobo adaptation                                                                  |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Home welcome, featured products, maker introduction, contact CTA | Hibiscus welcome page, featured infusions, Ruth's story, occasion CTA                |
| Products search, cards, detail modal                             | Search/category filters, flavor notes, bottle/gallon selection, quote-only mocktails |
| Gallery, selectable image preview                                | Brochure imagery, filters and keyboard-accessible lightbox                           |
| Newsletter navigation                                            | About us page; /newsletter redirects to /about                                       |
| Contact information and mailto form                              | Dee Zobo contact channels, event details, explicit email-draft flow                  |
| Google admin sign-in                                             | Supabase PKCE with a server-managed role check and protected route                   |
| Admin products/gallery                                           | Create/edit, publish/unpublish, feature drinks, set sizes/prices and gallery order   |
| Cart context                                                     | Namespaced local selection with stable IDs and validation; request quote by email    |
| Responsive navigation/footer                                     | Dee Zobo palette and wordmark, menu toggle and selection count                       |

Source content: user-provided **Dee Zobo Brochure (Updated 2026).pdf**, 9 pages.

- pp. 1–2: brand, mission and botanical/fruit imagery.
- p. 3: Tropical Sunset infusion, Ginger Hibiscus, Mixed Spice; 8 oz $5, 12 oz $7.
- p. 4: 1 gallon (3.8 L) $40, 2 gallons (7.6 L) $55, 3 gallons (11.4 L) $60.
- pp. 6–7: mocktails; no prices supplied, so request a quote.
- p. 8: (301) 256-8049, Instagram @dee_zobo, info.deezobo@gmail.com.
- p. 9 has a different email; the user explicitly selected info.deezobo@gmail.com.
- Earlier meeting notes supply Ruth's history and the 2024/March 2026 dates.

Tropical Sunset appears both as a hibiscus infusion (p. 3) and as a mango/grenadine
mocktail (p. 7); keep them as separate category-specific products. Brochure images
are illustrations/photos supplied by the business; descriptions avoid claiming
each image depicts the exact bottle variant.

Flavor notes are not a full recipe or allergen declaration. Numeric nutrition is
not supplied. Promotional medical benefit claims on p. 5 are not presented as
verified nutrition or used in site copy. No stockists, pickup address, delivery
guarantees, or discounts are invented.

Original embedded images were extracted from the brochure without generation or
retouching. The full brochure and its alternate email/QR-code page are not published.
Image provenance is listed in `public/images/brochure/README.md`.

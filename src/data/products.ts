import type { Beverage, GalleryImage, SizeOption } from '../types/catalog';

const image = (name: string) => '/images/brochure/' + name;
// Prices transcribed from pages 3–4. Display prices only; no payment is collected.
const infusionOptions: SizeOption[] = [
  { id: '8oz', label: '8 oz bottle', priceMinor: 500 },
  { id: '12oz', label: '12 oz bottle', priceMinor: 700 },
  { id: '1gal', label: '1 gallon · 3.8 L', priceMinor: 4000 },
  { id: '2gal', label: '2 gallons · 7.6 L', priceMinor: 5500 },
  { id: '3gal', label: '3 gallons · 11.4 L', priceMinor: 6000 },
];
export const brochureProducts: Beverage[] = [
  {
    id: 'tropical-sunset-infusion',
    name: 'Tropical Sunset',
    category: 'infusions',
    description:
      'A vibrant blend of hibiscus, pineapple, orange, ginger, and a touch of cinnamon for a bold tropical finish.',
    flavorNotes: ['Hibiscus', 'Pineapple', 'Orange', 'Ginger', 'Cinnamon'],
    imageUrl: image('infusion-pouches.png'),
    imageAlt:
      'Dee Zobo hibiscus infusions in clear pouches, surrounded by fruit and flowers',
    options: infusionOptions,
    featured: true,
    active: true,
  },
  {
    id: 'ginger-hibiscus',
    name: 'Ginger Hibiscus',
    category: 'infusions',
    description:
      'A refreshing hibiscus infusion with ginger, orange, and a bright citrus lift.',
    flavorNotes: ['Hibiscus', 'Ginger', 'Orange'],
    imageUrl: image('signature-zobo.png'),
    imageAlt:
      'Brochure illustration of a ruby hibiscus drink with citrus and ginger',
    options: infusionOptions,
    featured: true,
    active: true,
  },
  {
    id: 'mixed-spice',
    name: 'Mixed Spice',
    category: 'infusions',
    description:
      'A warm, aromatic hibiscus blend infused with ginger, orange, cinnamon, and layered spice notes.',
    flavorNotes: ['Hibiscus', 'Ginger', 'Orange', 'Cinnamon', 'Spices'],
    imageUrl: image('bottled-zobo.jpg'),
    imageAlt: 'Three freshly filled Dee Zobo bottles',
    options: infusionOptions,
    featured: true,
    active: true,
  },
  {
    id: 'tropical-sunset-mocktail',
    name: 'Tropical Sunset',
    category: 'mocktails',
    description:
      'A layered blend of mango juice and grenadine syrup. Sweet, vibrant, and tropical.',
    flavorNotes: ['Mango', 'Grenadine'],
    imageUrl: image('tropical-sunset.png'),
    imageAlt:
      'Orange and red Tropical Sunset mocktail from the Dee Zobo brochure',
    options: [],
    featured: false,
    active: true,
  },
  {
    id: 'signature-zobo',
    name: 'Dee Zobo Signature',
    category: 'mocktails',
    description:
      'Our signature hibiscus infusion, brewed with cinnamon, ginger, oranges, and pineapple.',
    flavorNotes: ['Hibiscus', 'Cinnamon', 'Ginger', 'Orange', 'Pineapple'],
    imageUrl: image('signature-zobo.png'),
    imageAlt: 'Ruby-red Dee Zobo signature mocktail',
    options: [],
    featured: false,
    active: true,
  },
  {
    id: 'green-apple',
    name: 'Green Apple Sparkling Cider',
    category: 'mocktails',
    description:
      'Crisp green apple juice with a splash of lemon and sparkling cider. Light, bubbly, and refreshing.',
    flavorNotes: ['Green apple', 'Lemon', 'Sparkling cider'],
    imageUrl: image('green-apple.jpg'),
    imageAlt: 'Green Apple Sparkling Cider with a dried citrus garnish',
    options: [],
    featured: false,
    active: true,
  },
  {
    id: 'strawberry-kiss',
    name: 'Strawberry Kiss',
    category: 'mocktails',
    description:
      'A sweet blend of strawberry puree, lemon juice, and a touch of fizz.',
    flavorNotes: ['Strawberry', 'Lemon', 'Fizz'],
    imageUrl: image('strawberry-kiss.jpg'),
    imageAlt: 'Strawberry Kiss mocktail with a berry garnish',
    options: [],
    featured: false,
    active: true,
  },
];
export const brochureGallery: GalleryImage[] = [
  {
    id: 'bottles',
    imageUrl: image('bottled-zobo.jpg'),
    caption: 'Freshly brewed. Ready to share.',
    category: 'infusions',
    displayOrder: 0,
    published: true,
  },
  {
    id: 'sunset',
    imageUrl: image('tropical-sunset.png'),
    caption: 'Tropical Sunset',
    category: 'mocktails',
    displayOrder: 1,
    published: true,
  },
  {
    id: 'pouches',
    imageUrl: image('infusion-pouches.png'),
    caption: 'A little culture, wherever you go.',
    category: 'infusions',
    displayOrder: 2,
    published: true,
  },
  {
    id: 'apple',
    imageUrl: image('green-apple.jpg'),
    caption: 'Green Apple Sparkling Cider',
    category: 'mocktails',
    displayOrder: 3,
    published: true,
  },
  {
    id: 'strawberry',
    imageUrl: image('strawberry-kiss.jpg'),
    caption: 'Strawberry Kiss',
    category: 'mocktails',
    displayOrder: 4,
    published: true,
  },
  {
    id: 'collection',
    imageUrl: image('mocktail-collection.jpg'),
    caption: 'Made for your next celebration.',
    category: 'moments',
    displayOrder: 5,
    published: true,
  },
];

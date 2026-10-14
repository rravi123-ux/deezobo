import { supabase } from '../lib/supabase';
import type { Beverage, GalleryImage } from '../types/catalog';
import { safeImageUrl } from '../lib/catalog';

type ProductRow = {
  id: string;
  name: string;
  category: Beverage['category'];
  description: string;
  flavor_notes: string[];
  image_url: string;
  image_alt: string;
  options: Beverage['options'];
  featured: boolean;
  active: boolean;
};
type GalleryRow = {
  id: string;
  image_url: string;
  caption: string;
  category: GalleryImage['category'];
  display_order: number;
  published: boolean;
};
const productFromRow = (r: ProductRow): Beverage => ({
  id: r.id,
  name: r.name,
  category: r.category,
  description: r.description,
  flavorNotes: r.flavor_notes,
  imageUrl: r.image_url,
  imageAlt: r.image_alt,
  options: r.options,
  featured: r.featured,
  active: r.active,
});
const galleryFromRow = (r: GalleryRow): GalleryImage => ({
  id: r.id,
  imageUrl: r.image_url,
  caption: r.caption,
  category: r.category,
  displayOrder: r.display_order,
  published: r.published,
});
export async function fetchCatalog(admin = false) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const productsQuery = supabase.from('products').select('*').order('name');
  const galleryQuery = supabase
    .from('gallery_items')
    .select('*')
    .order('display_order')
    .order('id');
  const [products, gallery] = await Promise.all([
    admin ? productsQuery : productsQuery.eq('active', true),
    admin ? galleryQuery : galleryQuery.eq('published', true),
  ]);
  if (products.error || gallery.error)
    throw new Error(
      'The catalog is unavailable. Check the catalog migration and database permissions.',
    );
  return {
    products: (products.data as ProductRow[]).map(productFromRow),
    gallery: (gallery.data as GalleryRow[]).map(galleryFromRow),
  };
}
export async function saveProduct(product: Beverage) {
  if (!supabase) throw new Error('Supabase is not configured.');
  if (
    !product.name.trim() ||
    !product.description.trim() ||
    !safeImageUrl(product.imageUrl)
  )
    throw new Error('A name, description and valid image URL are required.');
  if (
    product.options.some(
      (o) =>
        !o.label.trim() || !Number.isInteger(o.priceMinor) || o.priceMinor < 0,
    )
  )
    throw new Error('Every size needs a label and a nonnegative price.');
  const { error } = await supabase.from('products').upsert({
    id: product.id,
    name: product.name.trim(),
    description: product.description.trim(),
    category: product.category,
    flavor_notes: product.flavorNotes,
    image_url: product.imageUrl,
    image_alt: product.imageAlt,
    options: product.options,
    featured: product.featured,
    active: product.active,
  });
  if (error)
    throw new Error(
      'Product was not saved. Check your admin access and try again.',
    );
}
export async function saveGalleryImage(image: GalleryImage) {
  if (!supabase) throw new Error('Supabase is not configured.');
  if (
    !safeImageUrl(image.imageUrl) ||
    !image.caption.trim() ||
    !Number.isInteger(image.displayOrder) ||
    image.displayOrder < 0
  )
    throw new Error(
      'Add a valid image URL, caption and nonnegative display order.',
    );
  const { error } = await supabase.from('gallery_items').upsert({
    id: image.id,
    image_url: image.imageUrl,
    caption: image.caption.trim(),
    category: image.category,
    display_order: image.displayOrder,
    published: image.published,
  });
  if (error)
    throw new Error(
      'Image was not saved. Check your admin access and try again.',
    );
}

export async function deleteProduct(id: string) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error)
    throw new Error(
      'The drink could not be deleted. It may be used by an order.',
    );
}

export async function deleteGalleryImage(id: string) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { error } = await supabase.from('gallery_items').delete().eq('id', id);
  if (error) throw new Error('The gallery image could not be deleted.');
}

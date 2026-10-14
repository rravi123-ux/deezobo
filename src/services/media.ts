import { supabase } from '../lib/supabase';

const extensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function uploadCatalogImage(
  file: File,
  scope: 'products' | 'gallery',
) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const extension = extensions[file.type];
  if (!extension) throw new Error('Use a JPG, PNG, WebP, or GIF image.');
  if (file.size > 8 * 1024 * 1024)
    throw new Error('Images must be 8 MB or smaller.');
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user)
    throw new Error('Sign in again before uploading an image.');
  const path = `${scope}/${userData.user.id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from('catalog-media')
    .upload(path, file, { cacheControl: '3600', contentType: file.type });
  if (error)
    throw new Error('The image upload failed. Check storage and try again.');
  const { data } = supabase.storage.from('catalog-media').getPublicUrl(path);
  return data.publicUrl;
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { Beverage, GalleryImage } from '../types/catalog';
import { brochureProducts, brochureGallery } from '../data/products';
import { fetchCatalog } from '../services/products';
import { supabase } from '../lib/supabase';

type Catalog = {
  products: Beverage[];
  gallery: GalleryImage[];
  source: 'brochure' | 'database';
  refresh: () => Promise<void>;
};
const CatalogContext = createContext<Catalog>({
  products: brochureProducts,
  gallery: brochureGallery,
  source: 'brochure',
  refresh: async () => {},
});
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState({
    products: brochureProducts,
    gallery: brochureGallery,
    source: 'brochure' as Catalog['source'],
  });
  const refresh = useCallback(async () => {
    if (!supabase) return;
    try {
      const catalog = await fetchCatalog();
      setData({ ...catalog, source: 'database' });
    } catch {
      // Keep the documented brochure catalog available if no live catalog is ready.
      setData({
        products: brochureProducts,
        gallery: brochureGallery,
        source: 'brochure',
      });
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return (
    <CatalogContext.Provider value={{ ...data, refresh }}>
      {children}
    </CatalogContext.Provider>
  );
}
export function useCatalog() {
  return useContext(CatalogContext);
}

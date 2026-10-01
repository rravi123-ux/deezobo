import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import { signOut } from '../services/auth';
import { fetchCatalog } from '../services/products';
import type { Beverage, GalleryImage } from '../types/catalog';
import ProductEditor from '../components/admin/ProductEditor';
import GalleryEditor from '../components/admin/GalleryEditor';

export default function AdminPage() {
  const { session } = useAuth();
  const { refresh } = useCatalog();
  const [products, setProducts] = useState<Beverage[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [tab, setTab] = useState<'products' | 'gallery'>('products');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Beverage | null>(null);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  async function load() {
    setLoading(true);
    setError('');
    try {
      const result = await fetchCatalog(true);
      setProducts(result.products);
      setGallery(result.gallery);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load catalog.');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function saved() {
    setEditingProduct(null);
    setEditingImage(null);
    setMessage('Saved successfully.');
    await Promise.all([load(), refresh()]);
  }
  async function logout() {
    try {
      await signOut();
    } catch {
      setError('Sign-out failed. Please try again.');
    }
  }
  return (
    <div className="page-shell page-width">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Dee Zobo studio</p>
          <h1>Welcome back.</h1>
          <p>{session?.user.email}</p>
        </div>
        <button className="button button-outline" onClick={logout}>
          Sign out
        </button>
      </div>
      <div className="admin-toolbar">
        <div className="filter-pills" role="group" aria-label="Manage content">
          <button
            className={tab === 'products' ? 'selected' : ''}
            aria-pressed={tab === 'products'}
            onClick={() => setTab('products')}
          >
            Drinks
          </button>
          <button
            className={tab === 'gallery' ? 'selected' : ''}
            aria-pressed={tab === 'gallery'}
            onClick={() => setTab('gallery')}
          >
            Gallery
          </button>
        </div>
        <Link
          className="text-link"
          to={tab === 'products' ? '/order' : '/gallery'}
        >
          View public page ↗
        </Link>
      </div>
      {message && (
        <p className="success" role="status">
          {message}
        </p>
      )}
      {error && (
        <div className="notice" role="alert">
          <p>{error}</p>
          <p>
            First-time setup is documented in <code>docs/admin-setup.md</code>.
          </p>
          <button className="button button-outline" onClick={() => void load()}>
            Try again
          </button>
        </div>
      )}
      {loading ? (
        <p role="status">Loading your content…</p>
      ) : (
        !error && (
          <>
            <div className="section-heading">
              <h2>{tab === 'products' ? 'Your drinks' : 'Your gallery'}</h2>
              <button
                className="button"
                onClick={() => {
                  setMessage('');
                  if (tab === 'products')
                    setEditingProduct({
                      id: crypto.randomUUID(),
                      name: '',
                      category: 'infusions',
                      description: '',
                      flavorNotes: [],
                      imageUrl: '',
                      imageAlt: '',
                      options: [],
                      featured: false,
                      active: false,
                    });
                  else
                    setEditingImage({
                      id: crypto.randomUUID(),
                      imageUrl: '',
                      caption: '',
                      category: 'moments',
                      displayOrder: gallery.length,
                      published: false,
                    });
                }}
              >
                + Add {tab === 'products' ? 'drink' : 'image'}
              </button>
            </div>
            <div className="admin-grid">
              {tab === 'products'
                ? products.map((p) => (
                    <article className="admin-card" key={p.id}>
                      <img src={p.imageUrl} alt={p.imageAlt} />
                      <div>
                        <span className="eyebrow">
                          {p.active ? 'Published' : 'Draft'}
                          {p.featured ? ' · Featured' : ''}
                        </span>
                        <h3>{p.name}</h3>
                        <button
                          className="text-link"
                          onClick={() => {
                            setMessage('');
                            setEditingProduct(p);
                          }}
                        >
                          Edit drink →
                        </button>
                      </div>
                    </article>
                  ))
                : gallery.map((i) => (
                    <article className="admin-card" key={i.id}>
                      <img src={i.imageUrl} alt={i.caption} />
                      <div>
                        <span className="eyebrow">
                          {i.published ? 'Published' : 'Draft'} · Position{' '}
                          {i.displayOrder}
                        </span>
                        <h3>{i.caption}</h3>
                        <button
                          className="text-link"
                          onClick={() => {
                            setMessage('');
                            setEditingImage(i);
                          }}
                        >
                          Edit image →
                        </button>
                      </div>
                    </article>
                  ))}
            </div>
            {!(tab === 'products' ? products : gallery).length && (
              <p className="empty-state">
                No content yet. Add your first{' '}
                {tab === 'products' ? 'drink' : 'image'}.
              </p>
            )}
          </>
        )
      )}
      {editingProduct && (
        <ProductEditor
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSaved={() => void saved()}
        />
      )}
      {editingImage && (
        <GalleryEditor
          image={editingImage}
          onClose={() => setEditingImage(null)}
          onSaved={() => void saved()}
        />
      )}
    </div>
  );
}

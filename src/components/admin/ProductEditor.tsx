import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Beverage } from '../../types/catalog';
import { saveProduct } from '../../services/products';
import Modal from '../common/Modal';
export default function ProductEditor({
  product,
  onClose,
  onSaved,
}: {
  product: Beverage;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState(product);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const patch = (values: Partial<Beverage>) =>
    setDraft((p) => ({ ...p, ...values }));
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await saveProduct(draft);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save product.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={product.name ? 'Edit ' + product.name : 'Add a drink'}
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <form className="admin-form" onSubmit={save}>
        <fieldset disabled={busy}>
          <div className="form-grid">
            <div>
              <label htmlFor="product-name">Name</label>
              <input
                id="product-name"
                required
                maxLength={120}
                value={draft.name}
                onChange={(e) => patch({ name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="product-category">Category</label>
              <select
                id="product-category"
                value={draft.category}
                onChange={(e) =>
                  patch({ category: e.target.value as Beverage['category'] })
                }
              >
                <option value="infusions">Herbal infusion</option>
                <option value="mocktails">Mocktail</option>
              </select>
            </div>
          </div>
          <label htmlFor="product-description">Description</label>
          <textarea
            id="product-description"
            required
            rows={3}
            maxLength={2000}
            value={draft.description}
            onChange={(e) => patch({ description: e.target.value })}
          />
          <label htmlFor="product-image">Image URL or /images/ path</label>
          <input
            id="product-image"
            required
            value={draft.imageUrl}
            onChange={(e) => patch({ imageUrl: e.target.value })}
          />
          <label htmlFor="product-alt">Image description</label>
          <input
            id="product-alt"
            required
            maxLength={300}
            value={draft.imageAlt}
            onChange={(e) => patch({ imageAlt: e.target.value })}
          />
          <label htmlFor="product-flavors">
            Flavor notes, separated by commas
          </label>
          <input
            id="product-flavors"
            value={draft.flavorNotes.join(', ')}
            onChange={(e) =>
              patch({
                flavorNotes: e.target.value.split(',').map((v) => v.trim()),
              })
            }
          />
          <h3>Sizes and display prices</h3>
          <p className="fine-print">
            Leave empty for quote-only drinks. Prices are in USD.
          </p>
          {draft.options.map((o, index) => (
            <div className="size-editor" key={o.id}>
              <div>
                <label htmlFor={'size-' + o.id}>Size</label>
                <input
                  id={'size-' + o.id}
                  required
                  value={o.label}
                  onChange={(e) =>
                    patch({
                      options: draft.options.map((v, i) =>
                        i === index ? { ...v, label: e.target.value } : v,
                      ),
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor={'price-' + o.id}>Price ($)</label>
                <input
                  id={'price-' + o.id}
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={o.priceMinor / 100}
                  onChange={(e) =>
                    patch({
                      options: draft.options.map((v, i) =>
                        i === index
                          ? {
                              ...v,
                              priceMinor: Math.round(
                                e.target.valueAsNumber * 100,
                              ),
                            }
                          : v,
                      ),
                    })
                  }
                />
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label={'Remove size ' + o.label}
                onClick={() =>
                  patch({
                    options: draft.options.filter((_, i) => i !== index),
                  })
                }
              >
                ×
              </button>
            </div>
          ))}
          <button
            className="text-link"
            type="button"
            onClick={() =>
              patch({
                options: [
                  ...draft.options,
                  { id: crypto.randomUUID(), label: '', priceMinor: 0 },
                ],
              })
            }
          >
            + Add a size
          </button>
          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => patch({ active: e.target.checked })}
              />{' '}
              Published
            </label>
            <label>
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => patch({ featured: e.target.checked })}
              />{' '}
              Featured on welcome page
            </label>
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="button" disabled={busy}>
            {busy ? 'Saving…' : 'Save drink'}
          </button>
        </fieldset>
      </form>
    </Modal>
  );
}

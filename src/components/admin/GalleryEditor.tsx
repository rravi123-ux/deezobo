import { useState } from 'react';
import type { FormEvent } from 'react';
import type { GalleryImage } from '../../types/catalog';
import { saveGalleryImage } from '../../services/products';
import Modal from '../common/Modal';
export default function GalleryEditor({
  image,
  onClose,
  onSaved,
}: {
  image: GalleryImage;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState(image);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await saveGalleryImage(draft);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save image.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={image.caption ? 'Edit gallery image' : 'Add gallery image'}
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <form onSubmit={save}>
        <fieldset disabled={busy}>
          <label htmlFor="gallery-url">Image URL or /images/ path</label>
          <input
            id="gallery-url"
            required
            value={draft.imageUrl}
            onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
          />
          <label htmlFor="gallery-caption">Caption and image description</label>
          <input
            id="gallery-caption"
            required
            maxLength={300}
            value={draft.caption}
            onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
          />
          <div className="form-grid">
            <div>
              <label htmlFor="gallery-category">Category</label>
              <select
                id="gallery-category"
                value={draft.category}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    category: e.target.value as GalleryImage['category'],
                  })
                }
              >
                <option value="infusions">Infusions</option>
                <option value="mocktails">Mocktails</option>
                <option value="moments">Celebrations</option>
              </select>
            </div>
            <div>
              <label htmlFor="gallery-position">Display order</label>
              <input
                id="gallery-position"
                type="number"
                min="0"
                step="1"
                required
                value={draft.displayOrder}
                onChange={(e) =>
                  setDraft({ ...draft, displayOrder: e.target.valueAsNumber })
                }
              />
            </div>
          </div>
          <div className="checkbox-row">
            <label>
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) =>
                  setDraft({ ...draft, published: e.target.checked })
                }
              />{' '}
              Published in gallery
            </label>
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="button" disabled={busy}>
            {busy ? 'Saving…' : 'Save image'}
          </button>
        </fieldset>
      </form>
    </Modal>
  );
}

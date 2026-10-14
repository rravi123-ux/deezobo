import { useState } from 'react';
import PageHeading from '../components/common/PageHeading';
import Modal from '../components/common/Modal';
import { useCatalog } from '../context/CatalogContext';
import type { GalleryImage } from '../types/catalog';
export default function GalleryPage() {
  const { gallery } = useCatalog();
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const images = gallery.filter(
    (i) => i.published && (category === 'all' || i.category === category),
  );
  return (
    <div className="page-shell page-width">
      <PageHeading
        eyebrow="A look inside"
        title="Made to be shared."
        description="Our infusions, our mocktails, and the little details that make every pour special. A collection from the Dee Zobo brochure."
      />
      <div
        className="filter-pills gallery-filters"
        role="group"
        aria-label="Gallery category"
      >
        {[
          ['all', 'Everything'],
          ['infusions', 'Infusions'],
          ['mocktails', 'Mocktails'],
          ['moments', 'Celebrations'],
        ].map(([id, label]) => (
          <button
            key={id}
            aria-pressed={category === id}
            className={category === id ? 'selected' : ''}
            onClick={() => setCategory(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {images.map((item, i) => (
          <button
            className={'gallery-tile tile-' + (i % 3)}
            key={item.id}
            onClick={() => setSelected(item)}
            aria-label={'View ' + item.caption}
          >
            <img src={item.imageUrl} alt={item.caption} loading="lazy" />
            <span>
              {item.caption}
              <span aria-hidden="true">↗</span>
            </span>
          </button>
        ))}
      </div>
      {!images.length && (
        <p className="empty-state">No images in this collection yet.</p>
      )}
      {selected && (
        <Modal title={selected.caption} onClose={() => setSelected(null)}>
          <img
            className="lightbox-image"
            src={selected.imageUrl}
            alt={selected.caption}
          />
        </Modal>
      )}
    </div>
  );
}

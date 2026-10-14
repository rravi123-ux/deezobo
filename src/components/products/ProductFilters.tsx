import type { Category } from '../../types/catalog';
type Props = {
  query: string;
  category: Category | 'all';
  onQuery: (v: string) => void;
  onCategory: (v: Category | 'all') => void;
};
export default function ProductFilters({
  query,
  category,
  onQuery,
  onCategory,
}: Props) {
  return (
    <div className="catalog-toolbar">
      <div className="filter-pills" role="group" aria-label="Drink category">
        {(
          [
            ['all', 'All drinks'],
            ['infusions', 'Herbal infusions'],
            ['mocktails', 'Mocktails'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            aria-pressed={category === id}
            className={category === id ? 'selected' : ''}
            onClick={() => onCategory(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="search-field">
        <label className="sr-only" htmlFor="drink-search">
          Search drinks
        </label>
        <input
          id="drink-search"
          type="search"
          placeholder="Search a drink or flavor…"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
        />
        <span aria-hidden="true">⌕</span>
      </div>
    </div>
  );
}

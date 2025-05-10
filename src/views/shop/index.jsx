import { AppliedFilters, ProductGrid, ProductList } from '@/components/product';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import { selectFilter } from '@/selectors/selector';

// Define your categories here
const categories = [
  { key: 'all', label: 'All' },
  { key: 'wheels', label: 'Wheels' },
  { key: 'tyres', label: 'Tyres' },
  { key: 'engine', label: 'Engine' },
  { key: 'air-filters', label: 'Air Filters' },
  // Add more categories as needed
];

const Shop = () => {
  useDocumentTitle('Shop | AVJ MOTORSPORTS');
  useScrollTop();

   const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Read search term from URL
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('search') || '');
  }, [location.search]);

  const store = useSelector((state) => ({
    filteredProducts: selectFilter(state.products.items, state.filter),
    products: state.products,
    requestStatus: state.app.requestStatus,
    isLoading: state.app.loading
  }), shallowEqual);

  // Filter products by category
  const filteredByCategory = selectedCategory === 'all'
    ? store.filteredProducts
    : store.filteredProducts.filter(product => product.category === selectedCategory);

  // Further filter by search term (case-insensitive, matches name)
  const filteredBySearch = filteredByCategory.filter(product =>
    (product.name || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  console.log('Products:', store.filteredProducts);
  console.log('Filtered by category:', filteredByCategory);
  console.log('Filtered by search:', filteredBySearch);

 // Clear search handler
  const clearSearch = () => {
    const params = new URLSearchParams(location.search);
    params.delete('search');
    window.history.replaceState({}, '', `${location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
    setSearchTerm('');
  };

  return (
    <main className="content">
      {/* Search box removed, now handled by navigation bar */}
      <section className="product-list-wrapper">
        <AppliedFilters filteredProductsCount={filteredBySearch.length} />
        {searchTerm && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button
              className="button button-small"
              style={{
                background: '#eee',
                color: '#222',
                borderRadius: '2rem',
                padding: '0.5rem 1.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={clearSearch}
            >
              Clear Search
            </button>
          </div>
        )}
        <ProductList {...store}>
          <ProductGrid products={filteredBySearch} />
        </ProductList>
      </section>
    </main>
  );
};

export default Shop;

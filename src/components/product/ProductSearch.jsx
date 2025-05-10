import { Filters } from '@/components/common';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { clearRecentSearch, removeSelectedRecent, setTextFilter } from '@/redux/actions/filterActions';
import firebase from '@/services/firebase';

const ProductSearch = () => {
  const history = useHistory();

  const {
    filter, isLoading
  } = useSelector((state) => ({
    filter: state.filter,
    isLoading: state.app.loading
  }));
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [firestoreResults, setFirestoreResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    searchInput.current.focus();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFirestoreResults([]);
      return;
    }
    setLoading(true);
    // Example: search by name_lowercase (make sure you have this field in your Firestore documents)
    firebase.firestore()
      .collection('products')
      .where('name_lowercase', '>=', searchTerm.toLowerCase())
      .where('name_lowercase', '<=', searchTerm.toLowerCase() + '\uf8ff')
      .get()
      .then(snapshot => {
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFirestoreResults(results);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchTerm]);

  const onSearchChange = (e) => {
    const val = e.target.value.trim();
    setSearchTerm(val);
    dispatch(setTextFilter(val));
  };

  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      // Optionally, you can trigger search here if you want to only search on Enter
      // setSearchTerm(searchInput.current.value.trim());
    }
  };

  const onClearRecentSearch = () => {
    dispatch(clearRecentSearch());
  };

  return (
    <div className="product-search">
      <div className="product-search-header">
        <h3 onClick={history.goBack} role="presentation">
          <i className="fa fa-chevron-left" />
        </h3>
        <div className="product-search-wrapper">
          <input
            className="product-search-input"
            onChange={onSearchChange}
            onKeyUp={onKeyUp}
            placeholder="Search for product..."
            ref={searchInput}
            type="text"
            value={searchTerm}
          />
          <div className="searchbar-icon" />
        </div>
      </div>
      <div className="product-search-body">
        <div className="product-search-recent">
          <div className="product-search-recent-header">
            <h5>Recent Searches</h5>
            <h5 onClick={onClearRecentSearch} style={{ color: 'red' }} role="presentation">
              Clear
            </h5>
          </div>
          {filter.recent.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className="pill-wrapper" key={`${item}${index}`}>
              <div className="pill padding-right-l">
                <h5
                  className="pill-content margin-0"
                  onClick={() => {
                    dispatch(setTextFilter(item));
                    setSearchTerm(item);
                  }}
                  role="presentation"
                >
                  {item}
                </h5>
                <div
                  className="pill-remove"
                  onClick={() => dispatch(removeSelectedRecent(item))}
                  role="presentation"
                >
                  <h5 className="text-subtle margin-0"><i className="fa fa-times-circle" /></h5>
                </div>
              </div>
            </div>
          ))}
          {filter.recent.length === 0 && (
            <h5 className="text-subtle">No recent searches</h5>
          )}
        </div>
        <div className="product-search-filter">
          <h5 className="margin-0">Choose Filters</h5>
        </div>
        <div className="product-search-filter-sub">
          <Filters
            dispatch={dispatch}
            filter={filter}
            isLoading={isLoading}
            products={firestoreResults}
            productsLength={firestoreResults.length}
          />
        </div>
        <div>
          <h5>Search Results</h5>
          {loading ? (
            <div>Loading...</div>
          ) : firestoreResults.length === 0 ? (
            <div>No product found</div>
          ) : (
            firestoreResults.map(product => (
              <div key={product.id}>{product.name}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;

/* eslint-disable react/no-array-index-key */
import { SearchOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { clearRecentSearch, removeSelectedRecent } from '@/redux/actions/filterActions';

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState('');
  const { filter, isLoading } = useSelector((state) => ({
    filter: state.filter,
    isLoading: state.app.loading
  }));
  const searchbarRef = useRef(null);
  const history = useHistory();

  const dispatch = useDispatch();
  const isMobile = window.screen.width <= 800;

  const onSearchChange = (e) => {
    const val = e.target.value.trimStart();
    setSearchInput(val);
  };

  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      e.target.blur();
      searchbarRef.current.classList.remove('is-open-recent-search');

      // Go to shop page with search query
      if (searchInput.trim()) {
        history.push(`/shop?search=${encodeURIComponent(searchInput.trim().toLowerCase())}`);
      } else {
        history.push('/shop');
      }
    }
  };

  // Clear search handler
  const clearSearch = (e) => {
    e.preventDefault();
    setSearchInput('');
    history.push('/shop');
  };

  const recentSearchClickHandler = (e) => {
    const searchBar = e.target.closest('.searchbar');

    if (!searchBar) {
      searchbarRef.current.classList.remove('is-open-recent-search');
      document.removeEventListener('click', recentSearchClickHandler);
    }
  };

  const onFocusInput = (e) => {
    e.target.select();

    if (filter.recent.length !== 0) {
      searchbarRef.current.classList.add('is-open-recent-search');
      document.addEventListener('click', recentSearchClickHandler);
    }
  };

  const onClickRecentSearch = (keyword) => {
    searchbarRef.current.classList.remove('is-open-recent-search');
    history.push(`/shop?search=${encodeURIComponent(keyword.trim().toLowerCase())}`);
  };

  const onClearRecent = () => {
    dispatch(clearRecentSearch());
  };

  return (
    <>
      <div className="searchbar" ref={searchbarRef} style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderRadius: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        padding: '0.2rem 1.2rem',
        minWidth: 300,
        maxWidth: 420,
        width: '100%',
        position: 'relative'
      }}>
        <SearchOutlined className="searchbar-icon" style={{ fontSize: 22, color: '#888', marginRight: 8 }} />
        <input
          className="search-input searchbar-input"
          onChange={onSearchChange}
          onKeyUp={onKeyUp}
          onFocus={onFocusInput}
          placeholder="Search product..."
          readOnly={isLoading}
          type="text"
          value={searchInput}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '1.1rem',
            flex: 1,
            padding: '0.7rem 0',
            color: '#222'
          }}
        />
        {searchInput && (
          <button
            className="clear-search-btn"
            onClick={clearSearch}
            aria-label="Clear search"
            style={{
              background: '#f2f2f2',
              border: 'none',
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 6,
              cursor: 'pointer',
              fontSize: 18,
              color: '#888',
              transition: 'background 0.2s'
            }}
            type="button"
          >
            ×
          </button>
        )}
        {filter.recent.length !== 0 && (
          <div className="searchbar-recent">
            <div className="searchbar-recent-header">
              <h5>Recent Search</h5>
              <h5
                className="searchbar-recent-clear text-subtle"
                onClick={onClearRecent}
                role="presentation"
              >
                Clear
              </h5>
            </div>
            {filter.recent.map((item, index) => (
              <div
                className="searchbar-recent-wrapper"
                key={`search-${item}-${index}`}
              >
                <h5
                  className="searchbar-recent-keyword margin-0"
                  onClick={() => onClickRecentSearch(item)}
                  role="presentation"
                >
                  {item}
                </h5>
                <span
                  className="searchbar-recent-button text-subtle"
                  onClick={() => dispatch(removeSelectedRecent(item))}
                  role="presentation"
                >
                  X
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;

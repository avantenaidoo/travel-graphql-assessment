import React, { useState } from 'react';
import { TbCloudSearch } from 'react-icons/tb';
import '../styles/components/a11y.css';
import '../styles/components/searchBar.css';

type SearchBarProps = {
  onSearch: (city: string) => void;
  loading: boolean;
};

const SearchBar = ({ onSearch, loading }: SearchBarProps) => {
  const [city, setCity] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (error) {
      setCity('');
      setError(null);
    } else {
      setCity(value);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Check for empty string or string with only spaces
    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    } 
    // Check for invalid characters or multiple spaces
    if (/[^a-zA-Z\s]/.test(city) || /\s{2,}/.test(city)) {
      setError('Only letters and single spaces.');
      return;
    }
    onSearch(city);  
    setCity('');
  };


  return (
    <form onSubmit={handleSubmit} role="search" className="search-form relative items-center">
      <label className="offscreen" htmlFor="search">Enter a city name:</label>

      <input
        id="search"
        type="text"
        value={city}
        onChange={handleInputChange}
        placeholder={error ? '' : 'Enter city name'}
        className={`placeholder focus:outline-none pl-3 pr-8 ${error ? 'border-2 border-gray-400' : 'border-2 border-gray-300'}`}
        role="searchbox"
        autoComplete="off"
      />

      <button type="submit" className="search-button flex items-center transform translate-x-[-6px]" aria-label="Submit Search">
        <TbCloudSearch
          className={`button stroke-[1.5] ${loading ? 'animate-spinScaleFade' : ''}`}
          size={40}
        />
      </button>

      {error && (
        <div className="display-alert text-bold absolute left-6 transform -translate-y-[calc(3rem-2rem)] text-lg text-nowrap ml-1" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
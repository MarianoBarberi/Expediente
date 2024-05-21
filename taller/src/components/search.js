import { useState } from 'react';

const useSearch = (data, searchKey) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data
    ? data.filter((item) =>
        item[searchKey].toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return { searchTerm, handleSearch, filteredData };
};

export default useSearch;

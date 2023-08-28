import React, { useState, useEffect } from 'react';
// import { Toaster } from 'react-hot-toast';
import { fetchImages } from 'api';
import { Gallery } from './Gallery/ImageGallery/ImageGallery';
import { Pagination } from './Gallery/LoadMore/LoadMore';
import { Wrapper } from './App.styled';
import { Loader } from './Gallery/Loader/Loader';
import {
  notifyInfo,
  notifyInputQuerry,
  success,
} from './Gallery/Notify/Notify';
import { Searchbar } from './Gallery/SearchBar/SearchBar';

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const changeQuery = newQuery => {
    setQuery(`${Date.now()}/${newQuery}`);
    setImages([]);
    setPage(1);
  };

  useEffect(() => {
    const loadResult = async () => {
      try {
        setLoading(true);
        const img = await fetchImages(query, page);
        if (img.length) {
          setImages(prevImages => (page > 1 ? [...prevImages, ...img] : img));
          success(query);
          setLoading(false);
        } else {
          notifyInfo();
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    if (query && page) {
      loadResult();
    }
  }, [query, page]);

  const handleSubmit = evt => {
    evt.preventDefault();
    if (evt.target.elements.query.value.trim() === '') {
      notifyInputQuerry();
      return;
    }
    changeQuery(evt.target.elements.query.value);
    evt.target.reset();
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <Wrapper>
      <Searchbar onSubmit={handleSubmit} />
      {loading && <Loader />}
      {images.length > 0 && <Gallery imgItems={images} />}
      {images.length > 0 && (
        <Pagination onClick={handleLoadMore}>Load More</Pagination>
      )}
    </Wrapper>
  );
};

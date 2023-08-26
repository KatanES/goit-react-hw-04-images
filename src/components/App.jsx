import React, { Component } from 'react';
import { Toaster } from 'react-hot-toast';
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

export class App extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    loading: false,
  };

  changeQuery = newQuery => {
    this.setState({
      query: `${Date.now()}/${newQuery}`,
      images: [],
      page: 1,
    });
  };

  componentDidUpdate = async (prevProps, prevState) => {
    const prevQuery = prevState.query;
    const searchQuery = this.state.query;
    const prevPage = prevState.page;
    const nexPage = this.state.page;

    if (prevQuery !== searchQuery || prevPage !== nexPage) {
      this.loadResult();
    }
  };

  loadResult = async () => {
    const searchQuery = this.state.query;
    const nexPage = this.state.page;

    try {
      this.setState({ loading: true });
      const img = await fetchImages(searchQuery, nexPage);
      if (img.length) {
        this.setState(prevState => ({
          images: this.state.page > 1 ? [...prevState.images, ...img] : img,
        }));
        success(searchQuery);
        this.setState({ loading: false });
      } else {
        notifyInfo();
        this.setState({ loading: false });
      }
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  };

  handleSubmit = evt => {
    evt.preventDefault();
    if (evt.target.elements.query.value.trim() === '') {
      notifyInputQuerry();
      return;
    }
    this.changeQuery(evt.target.elements.query.value);

    evt.target.reset();
  };

  handleLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { loading, images } = this.state;
    return (
      <Wrapper>
        <Searchbar onSubmit={this.handleSubmit} />
        {loading && <Loader />}
        {images.length > 0 && <Gallery imgItems={images} />}
        {images.length > 0 && (
          <Pagination onClick={this.handleLoadMore}>Load More</Pagination>
        )}
        <Toaster position="top-right" reverseOrder={true} />
      </Wrapper>
    );
  }
}

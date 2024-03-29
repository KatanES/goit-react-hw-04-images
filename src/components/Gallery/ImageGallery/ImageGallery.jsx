import { GalleryImage } from '../ImageGalleryItem/ImageGalleryItem';
import { ImageGallery, ImageGalleryItem } from './ImageGallery.styled';

export const Gallery = ({ imgItems }) => {
  return (
    <div>
      <ImageGallery>
        {imgItems.map(item => (
          <ImageGalleryItem key={item.id}>
            <GalleryImage
              webformatURL={item.webformatURL}
              tags={item.tags}
              largeImageURL={item.largeImageURL}
            />
          </ImageGalleryItem>
        ))}
      </ImageGallery>
    </div>
  );
};
console.log(Gallery);

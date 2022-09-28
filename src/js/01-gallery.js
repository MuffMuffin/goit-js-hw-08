// Add imports above this line
import { galleryItems } from './gallery-items';
// Change code below this line
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// HTML population:
const galleryHTML = document.querySelector('.gallery');

const galleryArray = galleryItems.map(({ preview, original, description }) => {
  return `<a class="gallery__item" href="${original}">
  <img
  class="gallery__image"
  src=""
  alt="${description}" />
</a>`;
});

galleryHTML.innerHTML = galleryArray.join('');

// LazyLoad execution:
const galleryImgRef = document.querySelectorAll('.gallery img');

const onEntry = observerEntries => {
  observerEntries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) {
      let source = target.parentNode.href;
      target.src = source;
    }
  });
};

const observer = new IntersectionObserver(onEntry);

galleryImgRef.forEach(element => observer.observe(element));

// Lightbox generation:
let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
gallery.on('show.simplelightbox');

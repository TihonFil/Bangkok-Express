import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  #sliders;
  #elem;
  constructor(sliders) {
    this.#sliders = sliders;
    this.#elem = createElement(this.#template);
    this.initCarousel();
  }

  get elem() {
    return this.#elem;
  }

  get #template() {
    return `
      <div class="carousel">
        <div class="carousel__arrow carousel__arrow_right">
          <img src="./assets/images/icons/angle-icon.svg" alt="icon">
        </div>
        <div class="carousel__arrow carousel__arrow_left">
          <img src="./assets/images/icons/angle-left-icon.svg" alt="icon">
        </div>
    
        <div class="carousel__inner">
          ${this.#sliders
            .map(
              (slide) => `
            <div class="carousel__slide" data-id="${slide.id}">
              <img src="./assets/images/carousel/${
                slide.image
              }" class="carousel__img" alt="slide">
              <div class="carousel__caption">
                <span class="carousel__price">€${slide.price.toFixed(2)}</span>
                <div class="carousel__title">${slide.name}</div>
                <button type="button" class="carousel__button">
                  <img src="./assets/images/icons/plus-icon.svg" alt="icon">
                </button>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  initCarousel() {
    this.#initSlide();
    this.#customClick();
  }

  #initSlide() {
    const carouselArrowRight = this.#elem.querySelector(
      '.carousel__arrow_right'
    );
    const carouselArrowLeft = this.#elem.querySelector('.carousel__arrow_left');

    const carouselInner = this.#elem.querySelector('.carousel__inner');
    const carrouselSlides = this.#elem.querySelectorAll('.carousel__slide');

    let currentPosition = 0;

    carouselArrowLeft.style.display = 'none';

    const slideTo = (position) => {
      const carrouselSlides = this.#elem.querySelectorAll('.carousel__slide');
      const carouselSlideWidth = carrouselSlides[0].offsetWidth;

      carouselInner.style.transform = `translateX(-${
        position * carouselSlideWidth
      }px)`;
      currentPosition = position;

      // проверяем, является ли текущий слайд крайним справа
      if (currentPosition === carrouselSlides.length - 1) {
        carouselArrowRight.style.display = 'none';
      } else {
        carouselArrowRight.style.display = '';
      }

      // проверяем, является ли текущий слайд крайним слева
      if (currentPosition === 0) {
        carouselArrowLeft.style.display = 'none';
      } else {
        carouselArrowLeft.style.display = '';
      }
    };

    carouselArrowRight.addEventListener('click', () => {
      if (currentPosition < carrouselSlides.length - 1) {
        slideTo(currentPosition + 1);
      }
    });

    carouselArrowLeft.addEventListener('click', () => {
      if (currentPosition > 0) {
        slideTo(currentPosition - 1);
      }
    });
  }

  #customClick() {
    let buttonAll = this.#elem.querySelectorAll('.carousel__button');

    for (let button of buttonAll) {
      button.addEventListener('click', () => {
        const event = new CustomEvent('product-add', {
          detail: button.closest('.carousel__slide').dataset.id,
          bubbles: true,
        });
        this.#elem.dispatchEvent(event);
      });
    }
  }
}

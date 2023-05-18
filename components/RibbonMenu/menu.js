import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  #elem;
  #categories;

  constructor(categories) {
    this.#categories = categories;
    this.#elem = createElement(this.#template);
    this.initRibbonMenu();
  }

  get elem() {
    return this.#elem;
  }

  get #template() {
    return `
      <div class="ribbon">
        <button class="ribbon__arrow ribbon__arrow_left">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
    
        <nav class="ribbon__inner">
          ${this.#categories.map(item => `
            <a href="#" class="ribbon__item" data-id="${item.id}">${item.name}</a>
          `).join('')}
        </nav>
    
        <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
          <img src="/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
      </div>
    `
  }

  initRibbonMenu() {
    this.#scrollingRibbonMenu();
    this.#selectItemMenu();
  }

  #scrollingRibbonMenu() {
    const ribbonInner = this.#elem.querySelector('.ribbon__inner');

    const btnLeft = this.#elem.querySelector('.ribbon__arrow_left');
    const btnRight = this.#elem.querySelector('.ribbon__arrow_right');

    function calculateScrolling() {
      const scroll = {};
      const scrollLeft = ribbonInner.scrollLeft; // ширина оставшейся невидимой области слева
      const scrollWidth = ribbonInner.scrollWidth; // общая ширина прокрутки
      const clientWidth = ribbonInner.clientWidth; // видимая ширина элемента
      const scrollRight = scrollWidth - scrollLeft - clientWidth; // ширина оставшейся невидимой области справа

      scroll.scrollLeft = scrollLeft;
      scroll.scrollWidth = scrollWidth;
      scroll.clientWidth = clientWidth;
      scroll.scrollRight = scrollRight;

      return scroll;
    }

    btnLeft.addEventListener('click', () => {

      ribbonInner.scrollBy(-350, 0);

      ribbonInner.addEventListener('scroll', function () {
        const scrollLeft = calculateScrolling().scrollLeft;

        if (scrollLeft !== 0) {
          btnRight.classList.add('ribbon__arrow_visible');
        };

        if (scrollLeft < 1) {
          btnLeft.classList.remove('ribbon__arrow_visible');
        };
      })

    })

    btnRight.addEventListener('click', () => {

      ribbonInner.scrollBy(350, 0);

      ribbonInner.addEventListener('scroll', function () {
        const scrollRight = calculateScrolling().scrollRight;

        if (scrollRight !== 0) {
          btnLeft.classList.add('ribbon__arrow_visible');
        };

        if (scrollRight < 1) {
          btnRight.classList.remove('ribbon__arrow_visible');
        };
      })
    })
  }

  #selectItemMenu() {
    const ribbonInner = this.elem.querySelector('.ribbon__inner');
    const ribbonItem = this.#elem.querySelectorAll('.ribbon__item');

    ribbonInner.addEventListener('click', (event) => {
      event.preventDefault();

      ribbonItem.forEach(item => {
        item.classList.remove('ribbon__item_active');
      })

      event.target.classList.add('ribbon__item_active');

      this.#elem.dispatchEvent(new CustomEvent("ribbon-select", {
        detail: event.target.dataset.id,
        bubbles: true,
      }))
    });
  }
}

import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  #elem;
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.segments = steps - 1;
    this.#elem = createElement(this.#template());

    this.initStepSlider();
    this.setValue(value);
  }

  get elem() {
    return this.#elem;
  }

  #template() {
    return `
      <div class="slider">
        <div class="slider__thumb">
          <span class="slider__value"></span>
        </div>
        <div class="slider__progress"></div>
        <div class="slider__steps">
          ${'<span></span>'.repeat(this.steps)}
        </div>
      </div>
    `;
  }

  #sub(ref) {
    return this.elem.querySelector(`.slider__${ref}`);
  }

  setValue(value) {
    this.value = value;

    let valuePercents = (value / this.segments) * 100;

    this.#sub('thumb').style.left = `${valuePercents}%`;
    this.#sub('progress').style.width = `${valuePercents}%`;

    this.#sub('value').textContent = value;

    if (this.#sub('step-active')) {
      this.#sub('step-active').classList.remove('slider__step-active');
    }

    this.#sub('steps').children[this.value].classList.add(
      'slider__step-active'
    );
  }

  calcLeftByEvent(event) {
    let newLeft =
      (event.clientX - this.#elem.getBoundingClientRect().left) /
      this.#elem.offsetWidth;

    if (newLeft < 0) {
      newLeft = 0;
    }
    if (newLeft > 1) {
      newLeft = 1;
    }

    return newLeft;
  }

  initStepSlider() {
    this.#elem.addEventListener('click', this.onClick);
    this.#sub('thumb').addEventListener('pointerdown', this.onPointerDown);
    this.#sub('thumb').ondragstart = () => false;
  }

  onClick = (event) => {
    let newLeft =
      (event.clientX - this.#elem.getBoundingClientRect().left) /
      this.#elem.offsetWidth;

    this.setValue(Math.round(this.segments * newLeft));

    this.#elem.dispatchEvent(
      new CustomEvent('slider-change', {
        detail: this.value,
        bubbles: true,
      })
    );
  };

  onPointerDown = (event) => {
    event.preventDefault();

    this.#elem.classList.add('slider_dragging');

    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  };

  onPointerMove = (event) => {
    event.preventDefault();

    let newLeft = this.calcLeftByEvent(event);

    this.#sub('thumb').style.left = `${newLeft * 100}%`;
    this.#sub('progress').style.width = `${newLeft * 100}%`;

    this.value = Math.round(this.segments * newLeft);
    this.#sub('value').textContent = this.value;

    if (this.#sub('step-active')) {
      this.#sub('step-active').classList.remove('slider__step-active');
    }

    this.#sub('steps').children[this.value].classList.add(
      'slider__step-active'
    );
  };

  onPointerUp = () => {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);

    this.#elem.classList.remove('slider_dragging');

    this.#sub('thumb').style.left = `${(this.value / this.segments) * 100}%`;
    this.#sub('progress').style.width = `${
      (this.value / this.segments) * 100
    }%`;

    this.#elem.dispatchEvent(
      new CustomEvent('slider-change', {
        detail: this.value,
        bubbles: true,
      })
    );
  };
}

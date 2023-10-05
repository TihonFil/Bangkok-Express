import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this.modal = createElement(this.#template());

    this.buttonClose();
    this.keydownClose();
  }

  #template() {
    return `
      <div class="container">
        <div class="modal">
          <div class="modal__overlay"></div>

          <div class="modal__inner">
            <div class="modal__header">

              <button type="button" class="modal__close">
                <img src="./assets/images/icons/cross-icon.svg" alt="close-icon" />
              </button>

              <h3 class="modal__title">
                Вот сюда нужно добавлять заголовок
              </h3>
            </div>

            <div class="modal__body">
              A сюда нужно добавлять содержимое тела модального окна
            </div>
          </div>

        </div>
      </div>
    `;
  }

  open() {
    document.body.insertAdjacentElement('afterbegin', this.modal);
    document.body.classList.add('is-modal-open');
  }

  close() {
    this.modal.remove();
    document.body.classList.remove('is-modal-open');
  }

  setTitle(title) {
    let modalTitile = this.modal.querySelector('.modal__title');
    modalTitile.textContent = title;
  }

  setBody(body) {
    let modalBody = this.modal.querySelector('.modal__body');
    modalBody.innerHTML = '';
    modalBody.insertAdjacentElement('afterbegin', body);
  }

  buttonClose() {
    let btnModalClose = this.modal.querySelector('.modal__close');
    btnModalClose.addEventListener('click', () => {
      this.close();
    });
  }

  keydownClose() {
    document.addEventListener('keydown', (evt) => {
      if (evt.code === 'Escape') {
        this.close();
      }
    });
  }
}

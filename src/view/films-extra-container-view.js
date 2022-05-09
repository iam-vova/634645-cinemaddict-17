import {createElement} from '../render.js';

const createFilmsExtraContainerTemplate = (title) => (
  `<section class="films-list films-list--extra">
     <h2 class="films-list__title">${title}</h2>
     <div class="films-list__container"></div>
   </section>`
);

export default class FilmsExtraContainerView {
  #element = null;
  #title = null;

  constructor(title) {
    this.#title = title;
  }

  get template() {
    return createFilmsExtraContainerTemplate(this.#title);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

import {createElement} from '../render';

const createEmptyFilmsListTemplate = (title) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${title}</h2>
    </section>
  </section>`
);

export default class EmptyFilmsListView {
  #element = null;
  #title = null;

  constructor(title) {
    this.#title = title;
  }

  get template() {
    return createEmptyFilmsListTemplate(this.#title);
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

import {createElement} from '../render.js';

const createFilmsExtraContainerTemplate = (title) => (
  `<section class="films-list films-list--extra">
     <h2 class="films-list__title">${title}</h2>
     <div class="films-list__container"></div>
   </section>`
);

export default class FilmsExtraContainerView {
  constructor(title) {
    this.title = title;
  }

  getTemplate() {
    return createFilmsExtraContainerTemplate(this.title);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

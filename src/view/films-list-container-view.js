import AbstractView from '../framework/view/abstract-view';

const createFilmsListContainerTemplate = (title, isExtra, isEmpty) => (
  `<section class="films-list ${isExtra ? 'films-list--extra' : ''}">
    <h2 class="films-list__title ${isEmpty || isExtra ? '' : 'visually-hidden'}">${title}</h2>
    ${isEmpty ? '' : '<div class="films-list__container"></div>'}
   </section>`
);

export default class FilmsListContainerView extends AbstractView {
  #title = null;
  #isEmpty = false;
  #isExtra = false;

  constructor(title, isExtra = false, isEmpty = false) {
    super();
    this.#title = title;
    this.#isEmpty = isEmpty;
    this.#isExtra = isExtra;
  }

  getFilmsContainer() {
    if (!this.#isEmpty) {
      return this.element.querySelector('.films-list__container');
    }
  }

  get template() {
    return createFilmsListContainerTemplate(this.#title, this.#isExtra, this.#isEmpty);
  }
}

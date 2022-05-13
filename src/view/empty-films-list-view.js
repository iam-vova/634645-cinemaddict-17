import AbstractView from '../framework/view/abstract-view';

const createEmptyFilmsListTemplate = (title) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${title}</h2>
    </section>
  </section>`
);

export default class EmptyFilmsListView extends AbstractView {
  #title = null;

  constructor(title) {
    super();
    this.#title = title;
  }

  get template() {
    return createEmptyFilmsListTemplate(this.#title);
  }
}

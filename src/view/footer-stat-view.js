import AbstractView from '../framework/view/abstract-view';

const createFooterStatTemplate = (filmsCount) => (
  `<p>${filmsCount} movies inside</p>`
);

export default class FooterStatView extends AbstractView {
  #filmsCount = null;

  constructor(filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createFooterStatTemplate(this.#filmsCount);
  }
}

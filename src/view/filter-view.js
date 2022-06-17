import AbstractView from '../framework/view/abstract-view';
import {FilterType} from '../constants';

const createFilterMarkup = (filter, currentFilterType) => {
  const {name, count} = filter;
  const filterLink = Object.keys(FilterType).find((item) => FilterType[item] === name).toLowerCase();

  return (
    `<a
      href="#${filterLink}"
      class="main-navigation__item ${name === currentFilterType ? 'main-navigation__item--active' : ''}"
      data-filter-name="${name}"
    >
      ${name}
      ${name === FilterType.ALL ? '' : `<span class="main-navigation__item-count">${count}</span>`}
    </a>`
  );
};

const createFilterTemplate = (filters, currentFilterType) => (
  `<nav class="main-navigation">
    ${filters.map((filter) => createFilterMarkup(filter, currentFilterType)).join('\n')}
  </nav>`
);

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterName);
  };
}

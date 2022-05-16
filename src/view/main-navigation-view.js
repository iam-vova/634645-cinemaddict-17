import AbstractView from '../framework/view/abstract-view';
import {FilterTypes} from '../constants';

const createFilterMarkup = (filter, isChecked) => {
  const {name, count} = filter;
  const filterLink = Object.keys(FilterTypes).find((item) => FilterTypes[item] === name).toLowerCase();

  return (
    `<a href="#${filterLink}" class="main-navigation__item ${isChecked ? 'main-navigation__item--active' : ''}">
      ${name}
      ${name === FilterTypes.ALL ? '' : `<span class="main-navigation__item-count">${count}</span>`}
    </a>`
  );
};

const createMainNavigationTemplate = (filters) => (
  `<nav class="main-navigation">
    ${filters.map((filter, index) => createFilterMarkup(filter, index === 0)).join('\n')}
  </nav>`
);

export default class MainNavigationView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createMainNavigationTemplate(this.#filters);
  }
}

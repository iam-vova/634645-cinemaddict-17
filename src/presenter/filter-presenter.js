import {render, replace, remove} from '../framework/render';
import FilterView from '../view/filter-view';
import {filter} from '../utils/filter.js';
import {FilterTypes, UpdateTypes} from '../constants';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        name: FilterTypes.ALL,
        count: filter[FilterTypes.ALL](films).length,
      },
      {
        name: FilterTypes.WATCHLIST,
        count: filter[FilterTypes.WATCHLIST](films).length,
      },
      {
        name: FilterTypes.HISTORY,
        count: filter[FilterTypes.HISTORY](films).length,
      },
      {
        name: FilterTypes.FAVORITES,
        count: filter[FilterTypes.FAVORITES](films).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateTypes.MAJOR, filterType);
  };
}

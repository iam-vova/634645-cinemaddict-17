import AbstractView from '../framework/view/abstract-view';
import {SortType} from '../constants';

const createSortTemplate = (currentSortType) => (
  `<ul class="sort">
    <li>
      <a
        href="#"
        data-sort-type="${SortType.DEFAULT}"
        class="sort__button ${currentSortType === SortType.DEFAULT ? 'sort__button--active' : ''}"
      >
        Sort by default
      </a>
    </li>
    <li>
      <a
        href="#"
        data-sort-type="${SortType.DATE}"
        class="sort__button ${currentSortType === SortType.DATE ? 'sort__button--active' : ''}"
      >
        Sort by date
      </a>
    </li>
    <li>
      <a
        href="#"
        data-sort-type="${SortType.RATE}"
        class="sort__button ${currentSortType === SortType.RATE ? 'sort__button--active' : ''}"
      >
        Sort by rating
      </a>
    </li>
  </ul>`
);

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}

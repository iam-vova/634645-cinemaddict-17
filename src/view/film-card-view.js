import {getTimeFromMins} from '../utils/film';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const createFilmCardTemplate = (film) => {
  const commentsCount = film.comments.length;
  const {isDisabled} = film;
  const {title, poster, totalRating, release, runtime, genre, description} = film.filmInfo;
  const {watchlist, isWatched, isFavorite} = film.userDetails;
  const filmDescription = description.length > 140 ? description.substr(0, 139).concat('...') : description;
  const controlBtnClassName = (control) => control ? 'film-card__controls-item--active' : '';

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${release.date.getFullYear()}</span>
          <span class="film-card__duration">${getTimeFromMins(runtime)}</span>
          <span class="film-card__genre">${genre[0]}</span>
        </p>
        <img src="./${poster}" alt="Постер фильма '${title}'" class="film-card__poster">
        <p class="film-card__description">${filmDescription}</p>
        <span class="film-card__comments">${commentsCount} comments</span>
      </a>
      <div class="film-card__controls">
        <button
            ${isDisabled ? 'disabled' : ''}
            class="film-card__controls-item film-card__controls-item--add-to-watchlist ${controlBtnClassName(watchlist)}"
            type="button"
        >
            Add to watchlist
        </button>
        <button
            ${isDisabled ? 'disabled' : ''}
            class="film-card__controls-item film-card__controls-item--mark-as-watched ${controlBtnClassName(isWatched)}"
            type="button"
        >
            Mark as watched
        </button>
        <button
            ${isDisabled ? 'disabled' : ''}
            class="film-card__controls-item film-card__controls-item--favorite ${controlBtnClassName(isFavorite)}"
            type="button"
          >
            Mark as favorite
        </button>
      </div>
    </article>`
  );
};

export default class FilmCardView extends AbstractStatefulView {
  constructor(film) {
    super();
    this._state = FilmCardView.parseFilmToState(film);
  }

  get template() {
    return createFilmCardTemplate(this._state);
  }

  static parseFilmToState = (film) => ({
    ...film,
    isDisabled: false,
  });

  static parseStateToFilm = (state) => {
    const film = {...state};
    delete film.isDisabled;

    return film;
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick  = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick  = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick  = callback;
    this.element.querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(FilmCardView.parseStateToFilm(this._state));
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick(FilmCardView.parseStateToFilm(this._state));
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick(FilmCardView.parseStateToFilm(this._state));
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick(FilmCardView.parseStateToFilm(this._state));
  };

  _restoreHandlers = () => {
    this.setClickHandler(this._callback.click);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };
}

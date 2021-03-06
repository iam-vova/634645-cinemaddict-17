import {getTimeFromMins, humanizeFilmDate} from '../utils/film';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const createFilmDetailsPopupTemplate = (film) => {
  const commentsCount = film.comments.length;
  const {
    title,
    alternativeTitle,
    totalRating,
    poster,
    ageRating,
    director,
    writers,
    actors,
    release,
    runtime,
    genre,
    description,
    isDisabled,
  } = film.filmInfo;
  const {watchlist, isWatched, isFavorite} = film.userDetails;

  const getControlBtnClassName = (isActive) => isActive ? 'film-details__control-button--active' : '';

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${poster}" alt="Постер фильма '${title}'">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${humanizeFilmDate(release.date)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${getTimeFromMins(runtime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
                  <td class="film-details__cell">
                    <span class="film-details__genre">
                      ${genre.map((item) => (`<span class="film-details__genre">${item}</span>`)).join('')}
                    </span>
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button
              ${isDisabled ? 'disabled' : ''}
              type="button"
              class="film-details__control-button film-details__control-button--watchlist ${getControlBtnClassName(watchlist)}"
              id="watchlist"
              name="watchlist"
            >
                Add to watchlist
            </button>
            <button
              ${isDisabled ? 'disabled' : ''}
              type="button"
              class="film-details__control-button film-details__control-button--watched ${getControlBtnClassName(isWatched)}"
              id="watched"
              name="watched"
            >
                Already watched
            </button>
            <button
              ${isDisabled ? 'disabled' : ''}
              type="button"
              class="film-details__control-button film-details__control-button--favorite ${getControlBtnClassName(isFavorite)}"
              id="favorite"
              name="favorite"
            >
                Add to favorites
            </button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

            <ul class="film-details__comments-list">

            </ul>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetailsPopupView extends AbstractStatefulView {
  constructor(film) {
    super();
    this._state = FilmDetailsPopupView.parseFilmToState(film);
  }

  get template() {
    return createFilmDetailsPopupTemplate(this._state);
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

  setCloseClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeClickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick  = callback;
    this.element.querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick  = callback;
    this.element.querySelector('.film-details__control-button--watched')
      .addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick  = callback;
    this.element.querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this.#favoriteClickHandler);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(FilmDetailsPopupView.parseStateToFilm(this._state));
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick(FilmDetailsPopupView.parseStateToFilm(this._state));
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick(FilmDetailsPopupView.parseStateToFilm(this._state));
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick(FilmDetailsPopupView.parseStateToFilm(this._state));
  };

  _restoreHandlers = () => {
    this.setCloseClickHandler(this._callback.click);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  getCommentsContainer = () => this.element.querySelector('.film-details__comments-wrap');

  getCommentsListContainer = () => this.element.querySelector('.film-details__comments-list');
}

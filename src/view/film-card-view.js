import {createElement} from '../render';
import {getTimeFromMins} from '../utils';

const createFilmCardTemplate = (film) => {
  const commentsCount = film.comments.length;
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
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${controlBtnClassName(watchlist)}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${controlBtnClassName(isWatched)}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${controlBtnClassName(isFavorite)}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCardView {
  #element = null;
  #film = null;

  constructor(film) {
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

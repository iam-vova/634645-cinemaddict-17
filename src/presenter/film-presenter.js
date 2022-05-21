import {render} from '../framework/render';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import FilmCardView from '../view/film-card-view';
import CommentView from '../view/comment-view';

export default class FilmPresenter {
  #filmsContainer = null;
  #film = null;
  #filmComponent = null;
  #filmDetailsPopup = null;
  #filmComments = [];
  #siteBodyElement = document.querySelector('body');

  constructor(filmsContainer) {
    this.#filmsContainer = filmsContainer;
  }

  init = (film, filmComments) => {
    this.#film = film;
    this.#filmComponent = new FilmCardView(film);
    this.#filmComments = filmComments;
    this.#filmComponent.setClickHandler(this.#handleFilmClick);

    render(this.#filmComponent, this.#filmsContainer);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetailsPopupView();
    }
  };

  #renderFilmDetailsPopupView = (film) => {
    this.#filmDetailsPopup = new FilmDetailsPopupView(film);
    this.#siteBodyElement.classList.add('hide-overflow');
    render(this.#filmDetailsPopup, this.#siteBodyElement);

    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#filmDetailsPopup.setCloseClickHandler(this.#removeFilmDetailsPopupView);
    this.#renderComments(film);
  };

  #removeFilmDetailsPopupView = () => {
    if (this.#filmDetailsPopup) {
      this.#filmDetailsPopup.element.remove();
      this.#filmDetailsPopup.removeElement();
      this.#siteBodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #renderComments() {
    const commentsContainer = this.#filmDetailsPopup.getCommentsContainer();

    for (const comment of this.#filmComments) {
      render(new CommentView(comment), commentsContainer);
    }
  }

  #handleFilmClick = () => {
    this.#removeFilmDetailsPopupView();
    this.#renderFilmDetailsPopupView(this.#film);
  };
}


import {render, replace, remove} from '../framework/render';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import FilmCardView from '../view/film-card-view';
import CommentView from '../view/comment-view';

const Mode = {
  DEFAULT: 'default',
  DETAILS: 'details',
};

export default class FilmPresenter {
  #filmsContainer = null;
  #film = null;
  #filmComponent = null;
  #filmDetailsPopup = null;
  #filmComments = [];
  #changeData = null;
  #changeMode = null;
  #siteBodyElement = document.querySelector('body');
  #mode = Mode.DEFAULT;

  constructor(filmsContainer, changeData, changeMode) {
    this.#filmsContainer = filmsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film, filmComments) => {
    this.#film = film;
    this.#filmComments = filmComments;

    const prevFilmComponent = this.#filmComponent;
    const prevFilmDetailsPopupComponent = this.#filmDetailsPopup;

    this.#filmComponent = new FilmCardView(this.#film);
    this.#filmDetailsPopup = new FilmDetailsPopupView(this.#film);

    this.#filmComponent.setClickHandler(this.#handleFilmClick);
    this.#filmComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmComponent === null || prevFilmDetailsPopupComponent === null) {
      render(this.#filmComponent, this.#filmsContainer);
      return;
    }

    if (this.#filmsContainer.contains(prevFilmComponent.element)) {
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#siteBodyElement.contains(prevFilmDetailsPopupComponent.element)) {
      replace(this.#filmDetailsPopup, prevFilmDetailsPopupComponent);
      this.#addPopupHandlers();
    }

    remove(prevFilmComponent);
    remove(prevFilmDetailsPopupComponent);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetailsPopupView();
    }
  };

  #renderFilmDetailsPopupView = () => {
    this.#changeMode();
    this.#renderComments();
    render(this.#filmDetailsPopup, this.#siteBodyElement);
    this.#addPopupHandlers();
    this.#siteBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DETAILS;
  };

  #addPopupHandlers = () => {
    this.#filmDetailsPopup.setCloseClickHandler(this.#removeFilmDetailsPopupView);
    this.#filmDetailsPopup.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmDetailsPopup.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmDetailsPopup.setFavoriteClickHandler(this.#handleFavoriteClick);
  };

  #removeFilmDetailsPopupView = () => {
    this.#filmDetailsPopup.element.remove();
    this.#filmDetailsPopup.removeElement();
    this.#siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #renderComments() {
    const commentsContainer = this.#filmDetailsPopup.getCommentsContainer();

    for (const comment of this.#filmComments) {
      render(new CommentView(comment), commentsContainer);
    }
  }

  #handleFilmClick = () => {
    if(this.#filmDetailsPopup) {
      this.#removeFilmDetailsPopupView();
    }
    this.#renderFilmDetailsPopupView();
  };

  #handleWatchlistClick = () => {
    this.#changeData(
      {...this.#film,
        userDetails:
          {
            ...this.#film.userDetails,
            watchlist: !this.#film.userDetails.watchlist
          }
      });
  };

  #handleWatchedClick = () => {
    this.#changeData(
      {...this.#film,
        userDetails:
          {
            ...this.#film.userDetails,
            isWatched: !this.#film.userDetails.isWatched
          }
      });
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      {...this.#film,
        userDetails:
          {
            ...this.#film.userDetails,
            isFavorite: !this.#film.userDetails.isFavorite
          }
      });
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#removeFilmDetailsPopupView();
    }
  };

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmDetailsPopup);
  };
}


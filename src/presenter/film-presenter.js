import {render, replace, remove} from '../framework/render';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import FilmCardView from '../view/film-card-view';
import CommentView from '../view/comment-view';
import CommentAddView from '../view/comment-add-view';
import {UpdateTypes} from '../constants';

const Mode = {
  DEFAULT: 'default',
  DETAILS: 'details',
};

export default class FilmPresenter {
  #filmsContainer = null;
  #film = null;
  #filmComponent = null;
  #filmDetailsPopup = null;
  #commentAddComponent = null;
  #filmComments = [];
  #changeData = null;
  #changeMode = null;
  #siteBodyElement = document.querySelector('body');
  #mode = Mode.DEFAULT;
  #scrollPosition = 0;

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
    this.#commentAddComponent = new CommentAddView();

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
      this.#renderComments();
      this.#renderCommentAddView();
      this.#addPopupHandlers();
    }

    this.#filmDetailsPopup.element.scroll({
      top : this.#scrollPosition,
    });

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
    this.#renderCommentAddView();
    render(this.#filmDetailsPopup, this.#siteBodyElement);
    this.#addPopupHandlers();
    this.#siteBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DETAILS;
    this.#filmDetailsPopup.element.scrollTop = this.#scrollPosition;
  };

  #addPopupHandlers = () => {
    this.#filmDetailsPopup.setCloseClickHandler(this.#removeFilmDetailsPopupView);
    this.#filmDetailsPopup.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmDetailsPopup.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmDetailsPopup.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#commentAddComponent.setCommentAddHandler(this.#handleCommentAdd);
  };

  #removeFilmDetailsPopupView = () => {
    this.#filmDetailsPopup.element.remove();
    this.#filmDetailsPopup.removeElement();
    this.#siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #renderComments() {
    const commentsListContainer = this.#filmDetailsPopup.getCommentsListContainer();
    for (const comment of this.#filmComments) {
      render(new CommentView(comment), commentsListContainer);
    }
  }

  #renderCommentAddView() {
    const commentsContainer = this.#filmDetailsPopup.getCommentsContainer();
    render (this.#commentAddComponent, commentsContainer);
  }

  #handleCommentAdd = (newComment) => {
    this.#updateScrollPosition();
    this.#film.comments.push(newComment.id);
    this.#changeData(UpdateTypes.COMMENT_ADD, this.#film, newComment);
  };

  #handleFilmClick = () => {
    if(this.#filmDetailsPopup) {
      this.#removeFilmDetailsPopupView();
    }
    this.#renderFilmDetailsPopupView();
  };

  #handleWatchlistClick = () => {
    this.#updateScrollPosition();
    this.#changeData(
      UpdateTypes.USER_DETAILS,
      {...this.#film,
        userDetails:
          {
            ...this.#film.userDetails,
            watchlist: !this.#film.userDetails.watchlist
          }
      });
  };

  #handleWatchedClick = () => {
    this.#updateScrollPosition();
    this.#changeData(
      UpdateTypes.USER_DETAILS,
      {...this.#film,
        userDetails:
          {
            ...this.#film.userDetails,
            isWatched: !this.#film.userDetails.isWatched
          }
      });
  };

  #handleFavoriteClick = () => {
    this.#updateScrollPosition();
    this.#changeData(
      UpdateTypes.USER_DETAILS,
      {...this.#film,
        userDetails:
          {
            ...this.#film.userDetails,
            isFavorite: !this.#film.userDetails.isFavorite
          }
      });
  };

  #updateScrollPosition = () => {
    this.#scrollPosition = this.#filmDetailsPopup.element.scrollTop;
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


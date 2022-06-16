import {render, replace, remove} from '../framework/render';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import FilmCardView from '../view/film-card-view';
import CommentView from '../view/comment-view';
import CommentAddView from '../view/comment-add-view';
import {UserActions, UpdateTypes} from '../constants';

const Mode = {
  DEFAULT: 'default',
  DETAILS: 'details',
};

export default class FilmPresenter {
  #filmsContainer = null;
  #film = null;
  #filmComponent = null;
  #filmDetailsPopup = null;
  #commentAddComponent = new CommentAddView();
  #filmComments = [];
  #commentsModel = null;
  #filmCommentsView = new Map();
  #changeData = null;
  #changeMode = null;
  #siteBodyElement = document.querySelector('body');
  #mode = Mode.DEFAULT;
  #scrollPosition = 0;

  constructor(filmsContainer, changeData, changeMode, commentsModel) {
    this.#filmsContainer = filmsContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;
  }

  init = (film) => {
    this.#film = film;
    this.#filmComments = this.#commentsModel.comments;

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

  #renderFilmDetailsPopupView = async () => {
    this.#filmComments = await this.#commentsModel.getCommentsByFilmId(this.#film.id);
    this.#renderComments();
    this.#changeMode();
    this.#renderCommentAddView();
    this.#siteBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DETAILS;
    this.#filmDetailsPopup.element.scrollTop = this.#scrollPosition;
    render(this.#filmDetailsPopup, this.#siteBodyElement);
    this.#addPopupHandlers();
  };

  #addPopupHandlers = () => {
    this.#filmDetailsPopup.setCloseClickHandler(this.#removeFilmDetailsPopupView);
    this.#filmDetailsPopup.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmDetailsPopup.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmDetailsPopup.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#commentAddComponent.setCommentAddHandler(this.#handleCommentAdd);
    this.#filmCommentsView.forEach(
      (commentView) => commentView.setCommentDelClickHandler(this.#handleCommentDel)
    );
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
      const commentView = new CommentView(comment);
      this.#filmCommentsView.set(comment.id, commentView);
      render(commentView, commentsListContainer);
    }
  }

  #renderCommentAddView() {
    const commentsContainer = this.#filmDetailsPopup.getCommentsContainer();
    render (this.#commentAddComponent, commentsContainer);
  }

  setUpdating = () => {
    if (this.#mode === Mode.DETAILS) {
      this.#filmDetailsPopup.updateElement({
        isDisabled: true,
      });
    }

    if (this.#mode === Mode.DEFAULT) {
      this.#filmComponent.updateElement({
        isDisabled: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DETAILS) {
      const resetFormState = () => {
        this.#filmDetailsPopup.updateElement({
          isDisabled: false,
        });
      };

      this.#filmDetailsPopup.shake(resetFormState);
    }

    if (this.#mode === Mode.DEFAULT) {
      const resetFormState = () => {
        this.#filmComponent.updateElement({
          isDisabled: false,
        });
      };

      this.#filmComponent.shake(resetFormState);
    }
  };

  setCommentDeleting = (comment) => {
    if (this.#mode === Mode.DETAILS) {
      this.#filmCommentsView.get(comment.id).updateElement({
        isDisabled: true,
      });
    }
  };

  setCommentDelAborting = (comment) => {
    const component = this.#filmCommentsView.get(comment.id);
    const resetFormState = () => {
      component.updateElement({
        isDisabled: false,
      });
    };

    component.shake(resetFormState);
  };

  setCommentAdding = () => {
    if (this.#mode === Mode.DETAILS) {
      this.#commentAddComponent.updateElement({
        isDisabled: true,
      });
    }
  };

  setCommentAddAborting = () => {
    const resetFormState = () => {
      this.#commentAddComponent.updateElement({
        isDisabled: false,
      });
    };

    this.#commentAddComponent.shake(resetFormState);
  };

  #handleCommentAdd = (comment) => {
    this.#updateScrollPosition();
    this.#changeData(
      UserActions.COMMENT_ADD,
      UpdateTypes.PATCH,
      this.#film,
      comment
    );
    this.#commentAddComponent.reset();
  };

  #handleCommentDel = (comment) => {
    this.#updateScrollPosition();
    this.#changeData(
      UserActions.COMMENT_DEL,
      UpdateTypes.PATCH,
      this.#film,
      comment,
    );
    this.#filmCommentsView.delete(comment.id);
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
      UserActions.USER_DETAILS,
      this.#mode === Mode.DETAILS ? UpdateTypes.PATCH : UpdateTypes.MINOR,
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
      UserActions.USER_DETAILS,
      this.#mode === Mode.DETAILS ? UpdateTypes.PATCH : UpdateTypes.MINOR,
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
      UserActions.USER_DETAILS,
      this.#mode === Mode.DETAILS ? UpdateTypes.PATCH : UpdateTypes.MINOR,
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
      this.#commentAddComponent.reset();
      this.#removeFilmDetailsPopupView();
    }
  };

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmDetailsPopup);
  };
}


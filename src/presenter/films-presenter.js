import FilmsContainerView from '../view/films-container-view';
import FilmsListContainerView from '../view/films-list-container-view';
import MainNavigationView from '../view/main-navigation-view';
import SortView from '../view/sort-view';
import FilmCardView from '../view/film-card-view';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import CommentView from '../view/comment-view';
import {FilmsContainerTitles} from '../constants';
import {render} from '../framework/render';

const FILMS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #mainContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #films = [];
  #comments = [];
  #filmDetailsPopup = null;
  #siteBodyElement = document.querySelector('body');
  #filmsContainer = new FilmsContainerView();
  #filmsListContainer = null;
  #showMoreButtonComponent = new ShowMoreButtonView();
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;

  constructor(mainContainer, filmsModel, commentsModel) {
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];
    this.#comments = [...this.#commentsModel.comments];
    this.#renderPage();
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetailsPopupView();
    }
  };

  #onShowMoreButtonClick = () => {
    this.#films
      .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film));

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #removeFilmDetailsPopupView = () => {
    if (this.#filmDetailsPopup) {
      this.#filmDetailsPopup.element.remove();
      this.#filmDetailsPopup.removeElement();
      this.#siteBodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #renderFilm(film, container = this.#filmsListContainer.getFilmsContainer()) {
    const filmComponent = new FilmCardView(film);

    filmComponent.setClickHandler(() => {
      this.#removeFilmDetailsPopupView();
      this.#renderFilmDetailsPopupView(film);
    });

    render(filmComponent, container);
  }

  #renderExtraContainer(title, films, container) {
    const extraContainer = new FilmsListContainerView(title, true);
    render(extraContainer, container);
    for (const film of films) {
      this.#renderFilm(film, extraContainer.getFilmsContainer());
    }
  }

  #renderFilmDetailsPopupView(film) {
    this.#filmDetailsPopup = new FilmDetailsPopupView(film);
    this.#siteBodyElement.classList.add('hide-overflow');
    render(this.#filmDetailsPopup, this.#siteBodyElement);
    const commentsContainer = this.#filmDetailsPopup.element.querySelector('.film-details__comments-list');

    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#filmDetailsPopup.setCloseClickHandler(this.#removeFilmDetailsPopupView);

    for (const comment of film.comments) {
      render(new CommentView(this.#comments[comment]), commentsContainer);
    }
  }

  #renderPage() {
    render(new MainNavigationView(), this.#mainContainer);

    if (this.#films.length === 0) {
      render(this.#filmsContainer, this.#mainContainer);
      render(new FilmsListContainerView(FilmsContainerTitles.NO_MOVIES, false, true), this.#filmsContainer.element);
    } else {
      this.#filmsListContainer = new FilmsListContainerView(FilmsContainerTitles.ALL_MOVIES);
      render(new SortView(), this.#mainContainer);
      render(this.#filmsContainer, this.#mainContainer);
      render(this.#filmsListContainer, this.#filmsContainer.element);

      for (let i = 0; i < Math.min(this.#films.length, FILMS_COUNT_PER_STEP); i++) {
        this.#renderFilm(this.#films[i]);
      }

      if (this.#films.length > FILMS_COUNT_PER_STEP) {
        render(this.#showMoreButtonComponent, this.#filmsListContainer.element);
        this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClick);
      }

      const filmsSortByRate = this.#films.slice().sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
      const filmsSortByComments = this.#films.slice().sort((a, b) => b.comments.length - a.comments.length);
      this.#renderExtraContainer(FilmsContainerTitles.TOP_RATED, filmsSortByRate.slice(0, 2), this.#filmsContainer.element);
      this.#renderExtraContainer(FilmsContainerTitles.MOST_COMMENTED, filmsSortByComments.slice(0, 2), this.#filmsContainer.element);
    }
  }
}

import FilmsContainerView from '../view/films-container-view';
import MainNavigationView from '../view/main-navigation-view';
import SortView from '../view/sort-view';
import FilmCardView from '../view/film-card-view';
import FilmsExtraContainerView from '../view/films-extra-container-view';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import CommentView from '../view/comment-view';
import EmptyFilmsListView from '../view/empty-films-list-view';
import {filmsContainerTitles} from '../constants';
import {render} from '../render';

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
  #filmsSectionElement = this.#filmsContainer.element;
  #filmsListElement = this.#filmsSectionElement.querySelector('.films-list');
  #filmsListContainerElement = this.#filmsListElement.querySelector('.films-list__container');

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

  #onShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#films
      .slice(this.#renderedFilmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => this.#renderFilm(film));

    this.#renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this.#renderedFilmsCount >= this.#films.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #removeFilmDetailsPopupView() {
    if (this.#filmDetailsPopup) {
      this.#filmDetailsPopup.element.remove();
      this.#filmDetailsPopup.removeElement();
      this.#siteBodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }

  #renderFilm(film, container = this.#filmsListContainerElement) {
    const filmComponent = new FilmCardView(film);

    filmComponent.element.querySelector('.film-card__link')
      .addEventListener('click', () => {
        this.#removeFilmDetailsPopupView();
        this.#renderFilmDetailsPopupView(film);
      });

    render(filmComponent, container);
  }

  #renderExtraContainer(title, films, container) {
    const extraContainer = new FilmsExtraContainerView(title);
    render(extraContainer, container);
    const extraFilmsContainer = extraContainer.element.querySelector('.films-list__container');
    for (const film of films) {
      this.#renderFilm(film, extraFilmsContainer);
    }
  }

  #renderFilmDetailsPopupView(film) {
    this.#filmDetailsPopup = new FilmDetailsPopupView(film);
    this.#siteBodyElement.classList.add('hide-overflow');
    render(this.#filmDetailsPopup, this.#siteBodyElement);
    const commentsContainer = this.#filmDetailsPopup.element.querySelector('.film-details__comments-list');

    document.addEventListener('keydown', this.#onEscKeyDown);

    this.#filmDetailsPopup.element.querySelector('.film-details__close-btn')
      .addEventListener('click', () => {
        this.#removeFilmDetailsPopupView();
      });

    for (const comment of film.comments) {
      render(new CommentView(this.#comments[comment]), commentsContainer);
    }
  }

  #renderPage() {
    render(new MainNavigationView(), this.#mainContainer);

    if (this.#films.length === 0) {
      render(new EmptyFilmsListView(filmsContainerTitles.noMovies), this.#mainContainer);
    } else {
      render(new SortView(), this.#mainContainer);
      render(this.#filmsContainer, this.#mainContainer);

      for (let i = 0; i < Math.min(this.#films.length, FILMS_COUNT_PER_STEP); i++) {
        this.#renderFilm(this.#films[i]);
      }

      if (this.#films.length > FILMS_COUNT_PER_STEP) {
        render(this.#showMoreButtonComponent, this.#filmsListElement);
        this.#showMoreButtonComponent.element.addEventListener('click', this.#onShowMoreButtonClick);
      }

      const filmsSortByRate = this.#films.slice().sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
      const filmsSortByComments = this.#films.slice().sort((a, b) => b.comments.length - a.comments.length);
      this.#renderExtraContainer(filmsContainerTitles.topRated, filmsSortByRate.slice(0, 2), this.#filmsSectionElement);
      this.#renderExtraContainer(filmsContainerTitles.mostCommented, filmsSortByComments.slice(0, 2), this.#filmsSectionElement);
    }
  }
}

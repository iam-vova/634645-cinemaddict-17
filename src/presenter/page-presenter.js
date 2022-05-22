import FilmsContainerView from '../view/films-container-view';
import FilmsListContainerView from '../view/films-list-container-view';
import MainNavigationView from '../view/main-navigation-view';
import SortView from '../view/sort-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import {FilmsContainerTitles} from '../constants';
import FilmPresenter from './film-presenter';
import {generateFilters} from '../mock/filter';
import {render, remove} from '../framework/render';
import {updateItem} from '../utils/common';

const FILMS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #mainContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #films = [];
  #comments = [];
  #filmsContainer = new FilmsContainerView();
  #filmsListContainer = null;
  #showMoreButtonComponent = new ShowMoreButtonView();
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #filmPresenter = new Map();

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

  #getFilmComments = (film) => this.#comments.filter((item) => film.comments.includes(item.id));

  #renderFilm(film, container = this.#filmsListContainer.getFilmsContainer()) {
    const filmComponent = new FilmPresenter(container, this.#handleFilmChange, this.#handleModeChange);

    filmComponent.init(film, this.#getFilmComments(film));
    this.#filmPresenter.set(film.id, filmComponent);
  }

  #renderFilters() {
    const filters = generateFilters(this.#films);
    render(new MainNavigationView(filters), this.#mainContainer);
  }

  #renderSort() {
    render(new SortView(), this.#mainContainer);
  }

  #renderFilmsContainer() {
    render(this.#filmsContainer, this.#mainContainer);
  }

  #renderShowMoreButton(container) {
    render(this.#showMoreButtonComponent, container);
    this.#showMoreButtonComponent.setClickHandler(this.#onShowMoreButtonClick);
  }

  #renderFilmsListContainer() {
    this.#filmsListContainer = new FilmsListContainerView(FilmsContainerTitles.ALL_MOVIES);
    render(this.#filmsListContainer, this.#filmsContainer.element);

    for (let i = 0; i < Math.min(this.#films.length, FILMS_COUNT_PER_STEP); i++) {
      this.#renderFilm(this.#films[i]);
    }

    if (this.#films.length > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton(this.#filmsListContainer.element);
    }
  }

  #renderNoFilms() {
    this.#renderFilmsContainer();
    render(new FilmsListContainerView(FilmsContainerTitles.NO_MOVIES, false, true), this.#filmsContainer.element);
  }

  #renderExtraContainer(title, films, container) {
    const extraContainer = new FilmsListContainerView(title, true);
    render(extraContainer, container);

    for (const film of films) {
      this.#renderFilm(film, extraContainer.getFilmsContainer());
    }
  }

  #renderExtraContainers() {
    const filmsSortByRate = this.#films
      .slice()
      .sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    const filmsSortByComments = this.#films
      .slice()
      .sort((a, b) => b.comments.length - a.comments.length);
    this.#renderExtraContainer(
      FilmsContainerTitles.TOP_RATED, filmsSortByRate.slice(0, 2), this.#filmsContainer.element
    );
    this.#renderExtraContainer(
      FilmsContainerTitles.MOST_COMMENTED, filmsSortByComments.slice(0, 2), this.#filmsContainer.element
    );
  }

  #clearFilmsList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm, this.#getFilmComments(updatedFilm));
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPage() {
    this.#renderFilters();

    if (this.#films.length === 0) {
      this.#renderNoFilms();
    } else {
      this.#renderSort();
      this.#renderFilmsContainer();
      this.#renderFilmsListContainer();
      this.#renderExtraContainers();
    }
  }
}

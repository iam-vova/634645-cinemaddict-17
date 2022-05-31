import FilmsContainerView from '../view/films-container-view';
import FilmsListContainerView from '../view/films-list-container-view';
import MainNavigationView from '../view/main-navigation-view';
import SortView from '../view/sort-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import {FilmsContainerTitles, UpdateTypes} from '../constants';
import FilmPresenter from './film-presenter';
import {generateFilters} from '../mock/filter';
import {render} from '../framework/render';
import {updateItem} from '../utils/common';
import {SortType} from '../constants';

const FILMS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #mainContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #films = [];
  #sourcedFilms = [];
  #comments = [];
  #filmsContainer = new FilmsContainerView();
  #filmsListContainer = null;
  #sortComponent = null;
  #showMoreButtonComponent = new ShowMoreButtonView();
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(mainContainer, filmsModel, commentsModel) {
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  init = () => {
    this.#films = [...this.#filmsModel.films];
    this.#sourcedFilms = [...this.#filmsModel.films];
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

  #pushPresenter = (id, presenter) => this.#filmPresenter.has(id)
    ? this.#filmPresenter.get(id).push(presenter)
    : this.#filmPresenter.set(id, [presenter]);

  #getPresenters = (id) => this.#filmPresenter.get(id);

  #renderFilm(film, container = this.#filmsListContainer.getFilmsContainer()) {
    const filmPresenter = new FilmPresenter(
      container,
      this.#handleFilmChange,
      this.#handleModeChange,
    );
    filmPresenter.init(film, this.#getFilmComments(film));
    this.#pushPresenter(film.id, filmPresenter);
  }

  #renderFilters() {
    const filters = generateFilters(this.#films);
    render(new MainNavigationView(filters), this.#mainContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView();
    render(this.#sortComponent, this.#mainContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
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

    this.#renderFilms();
  }

  #renderFilms() {
    for (let i = 0; i < Math.min(this.#films.length, this.#renderedFilmsCount); i++) {
      this.#renderFilm(this.#films[i]);
    }

    if (this.#films.length > this.#renderedFilmsCount) {
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
    const topRatedFilms = this.#sortFilms(SortType.RATE, this.#films.slice());
    this.#renderExtraContainer(
      FilmsContainerTitles.TOP_RATED, topRatedFilms.slice(0, 2), this.#filmsContainer.element
    );

    const mostCommentedFilms = this.#sortFilms(SortType.COMMENTS, this.#films.slice());
    this.#renderExtraContainer(
      FilmsContainerTitles.MOST_COMMENTED, mostCommentedFilms.slice(0, 2), this.#filmsContainer.element
    );
  }

  #clearFilmsList = () => {
    this.#filmPresenter.forEach(
      (presenters) => presenters.forEach(
        (presenter) => presenter.destroy()
      )
    );
    this.#filmPresenter.clear();
  };

  #sortFilms = (sortType, films = this.#films) => {
    this.#currentSortType = sortType;

    switch (sortType) {
      case SortType.DATE:
        return films.sort((a, b) => b.filmInfo.release.date - a.filmInfo.release.date);
      case SortType.RATE:
        return films.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
      case SortType.COMMENTS:
        return films.sort((a, b) => b.comments.length - a.comments.length);
      default:
        return this.#films = [...this.#sourcedFilms];
    }
  };

  #handleFilmChange = (updateType, updatedFilm, newComment) => {
    switch (updateType) {
      case UpdateTypes.USER_DETAILS:
        this.#films = updateItem(this.#films, updatedFilm);
        this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
        break;
      case UpdateTypes.COMMENT_ADD:
        this.#comments.push(newComment);
        break;
    }

    this.#getPresenters(updatedFilm.id).forEach(
      (presenter) => presenter.init(updatedFilm, this.#getFilmComments(updatedFilm))
    );
  };

  #handleModeChange = () => {
    this.#filmPresenter.forEach(
      (presenters) => presenters.forEach(
        (presenter) => presenter.resetView()
      )
    );
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmsList();
    this.#renderFilms();
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

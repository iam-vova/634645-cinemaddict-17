import FilmsContainerView from '../view/films-container-view';
import FilmsListContainerView from '../view/films-list-container-view';
import MainNavigationView from '../view/main-navigation-view';
import SortView from '../view/sort-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import {FilmsContainerTitles, SortType, UserActions, UpdateTypes} from '../constants';
import FilmPresenter from './film-presenter';
import {generateFilters} from '../mock/filter';
import {remove, render, RenderPosition} from '../framework/render';
import {updateItem} from '../utils/common';
import {sortFilmsByDate, sortFilmsByRate, sortFilmsByComments} from '../utils/film';

const FILMS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #mainContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  // #films = [];
  // #sourcedFilms = [];
  #comments = [];
  #filmsContainer = new FilmsContainerView();
  #filmsListContainer = null;
  #sortComponent = null;
  #showMoreButtonComponent = new ShowMoreButtonView();
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #filmsPresenters = new Map();
  #filmsMostCommentedPresenters = new Map();
  #filmsTopRatedPresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(mainContainer, filmsModel, commentsModel) {
    this.#mainContainer = mainContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#filmsModel.films].sort(sortFilmsByDate);
      case SortType.RATE:
        return [...this.#filmsModel.films].sort(sortFilmsByRate);
      case SortType.COMMENTS:
        return [...this.#filmsModel.films].sort(sortFilmsByComments);
    }

    return this.#filmsModel.films;
  }

  init = () => {
    // this.#films = [...this.#filmsModel.films];
    // this.#sourcedFilms = [...this.#filmsModel.films];
    this.#comments = [...this.#commentsModel.comments];
    this.#renderPage();
  };

  #handleShowMoreButtonClick = () => {
    const filmsCount = this.films.length;
    const newRenderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount + FILMS_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmsCount, newRenderedFilmsCount);

    this.#renderFilmsList(films);
    this.#renderedFilmsCount = newRenderedFilmsCount;

    if (this.#renderedFilmsCount >= this.films.length) {
      remove(this.#showMoreButtonComponent);
    }
  };

  #getFilmComments = (film) => this.#comments.filter((item) => film.comments.includes(item.id));

  #pushPresenter = (id, presenter, extraContainer) => {
    switch (extraContainer) {
      case FilmsContainerTitles.TOP_RATED:
        this.#filmsTopRatedPresenters.set(id, presenter);
        break;
      case FilmsContainerTitles.MOST_COMMENTED:
        this.#filmsMostCommentedPresenters.set(id, presenter);
        break;
      default:
        this.#filmsPresenters.set(id, presenter);
    }
  };

  #getPresenters = (id) => {
    const presenters = [];

    if(this.#filmsPresenters.has(id)) {
      presenters.push(this.#filmsPresenters.get(id));
    }
    if(this.#filmsTopRatedPresenters.has(id)) {
      presenters.push(this.#filmsTopRatedPresenters.get(id));
    }
    if(this.#filmsMostCommentedPresenters.has(id)) {
      presenters.push(this.#filmsMostCommentedPresenters.get(id));
    }

    return presenters;
  };

  #renderFilm(film, container = this.#filmsListContainer.getFilmsContainer(), extraContainer) {
    const filmPresenter = new FilmPresenter(
      container,
      this.#handleViewAction,
      this.#handleModeChange,
    );
    filmPresenter.init(film, this.#getFilmComments(film));
    this.#pushPresenter(film.id, filmPresenter, extraContainer);
  }

  #renderFilters() {
    const filters = generateFilters(this.films);
    render(new MainNavigationView(filters), this.#mainContainer);
  }

  #renderFilmsContainer() {
    render(this.#filmsContainer, this.#mainContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#filmsContainer.element, RenderPosition.BEFOREBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderShowMoreButton() {
    render(this.#showMoreButtonComponent, this.#filmsListContainer.element);
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderFilmsListContainer() {
    this.#filmsListContainer = new FilmsListContainerView(FilmsContainerTitles.ALL_MOVIES);
    render(this.#filmsListContainer, this.#filmsContainer.element);
  }

  #renderFilmsList(films) {
    films.forEach((film) => this.#renderFilm(film));
  }

  #renderNoFilms() {
    this.#renderFilmsContainer();
    render(new FilmsListContainerView(FilmsContainerTitles.NO_MOVIES, false, true), this.#filmsContainer.element);
  }

  #renderExtraContainer(title, films, container) {
    const extraContainer = new FilmsListContainerView(title, true);
    render(extraContainer, container);

    for (const film of films) {
      this.#renderFilm(film, extraContainer.getFilmsContainer(), title);
    }
  }

  #renderExtraContainers() {
    const topRatedFilms = [...this.#filmsModel.films].sort(sortFilmsByRate).slice(0, 2);
    this.#renderExtraContainer(
      FilmsContainerTitles.TOP_RATED, topRatedFilms, this.#filmsContainer.element
    );

    const mostCommentedFilms = [...this.#filmsModel.films].sort(sortFilmsByComments).slice(0, 2);
    this.#renderExtraContainer(
      FilmsContainerTitles.MOST_COMMENTED, mostCommentedFilms, this.#filmsContainer.element
    );
  }

  #clearFilmsList = () => {
    this.#filmsPresenters.forEach(
      (presenters) => presenters.destroy()
    );
    this.#filmsPresenters.clear();
    this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
  };

  // #handleFilmChange = (updateType, updatedFilm, newComment) => {
  //   switch (updateType) {
  //     case UserActions.USER_DETAILS:
  //       // this.#films = updateItem(this.#films, updatedFilm);
  //       // this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
  //       break;
  //     case UserActions.COMMENT_ADD:
  //       this.#comments.push(newComment);
  //       break;
  //   }
  //
  //   this.#getPresenters(updatedFilm.id).forEach(
  //     (presenter) => presenter.init(updatedFilm, this.#getFilmComments(updatedFilm))
  //   );
  // };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserActions.USER_DETAILS:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserActions.COMMENT_ADD:
        this.#comments.push(update.newComment);
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserActions.COMMENT_DEL:

        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateTypes.PATCH:
        this.#getPresenters(data.id).forEach(
              (presenter) => presenter.init(data, this.#getFilmComments(data))
            );
        break;
      case UpdateTypes.MINOR:
        this.#getPresenters(data.id).forEach(
          (presenter) => presenter.init(data, this.#getFilmComments(data))
        );
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateTypes.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  };

  #handleModeChange = () => {
    this.#filmsPresenters.forEach(
      (presenters) => presenters.resetView()
    );
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    const films = this.films;
    const filmsCount = films.length;

    this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this.#clearFilmsList();
    remove(this.#sortComponent);
    this.#renderSort();

    this.#renderFilmsList(films.slice(0, Math.min(filmsCount, this.#renderedFilmsCount)));
    if (filmsCount > this.#renderedFilmsCount) {
      this.#renderShowMoreButton();
    }
  };

  #renderPage() {
    const films = this.films;
    const filmsCount = films.length;

    this.#renderFilters();

    if (filmsCount === 0) {
      this.#renderNoFilms()
      return;
    }

    this.#renderFilmsContainer();
    this.#renderSort();
    this.#renderFilmsListContainer();
    this.#renderFilmsList(films.slice(0, Math.min(filmsCount, this.#renderedFilmsCount)));
    if (filmsCount > this.#renderedFilmsCount) {
      this.#renderShowMoreButton();
    }

    this.#renderExtraContainers();
  }
}

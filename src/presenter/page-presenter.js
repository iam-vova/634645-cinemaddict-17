import FilmsContainerView from '../view/films-container-view';
import FilmsListContainerView from '../view/films-list-container-view';
import FilterPresenter from './filter-presenter';
import SortView from '../view/sort-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import {
  FilmsContainerTitles,
  SortType,
  UserActions,
  UpdateTypes,
  FilterTypes,
  FilmsEmptyContainerTitles
} from '../constants';
import FilmPresenter from './film-presenter';
import {remove, render, RenderPosition} from '../framework/render';
import {sortFilmsByDate, sortFilmsByRate, sortFilmsByComments} from '../utils/film';
import {filter} from '../utils/filter';
import UserRankView from '../view/user-rank-view';

const FILMS_COUNT_PER_STEP = 5;

export default class FilmsPresenter {
  #userRankView = null;
  #mainContainer = null;
  #filterModel = null;
  #filmsModel = null;
  #commentsModel = null;
  #filmsContainer = new FilmsContainerView();
  #filmsListContainer = null;
  #filmsEmptyListContainer = null;
  #filmsTopRatedContainer = null;
  #filmsMostCommentedContainer = null;
  #sortComponent = null;
  #showMoreButtonComponent = new ShowMoreButtonView();
  #renderedFilmsCount = FILMS_COUNT_PER_STEP;
  #filmsPresenters = new Map();
  #filmsMostCommentedPresenters = new Map();
  #filmsTopRatedPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterTypes.ALL;
  #siteHeaderElement = document.querySelector('.header');

  constructor(mainContainer, filterModel, filmsModel, commentsModel) {
    this.#mainContainer = mainContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsByDate);
      case SortType.RATE:
        return filteredFilms.sort(sortFilmsByRate);
      case SortType.COMMENTS:
        return filteredFilms.sort(sortFilmsByComments);
    }

    return filteredFilms;
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = () => {
    this.#renderFilters();
    this.#renderPage({renderExtraContainers: true, renderUserRank: true});
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

  #getFilmComments = (film) => this.comments.filter((item) => film.comments.includes(item.id));

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

  #renderUserRank() {
    const filmsWatched = filter[FilterTypes.HISTORY](this.films).length;
    if (filmsWatched > 0) {
      this.#userRankView = new UserRankView(filmsWatched);
      render(this.#userRankView, this.#siteHeaderElement);
    }
  }

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
    const filterPresenter = new FilterPresenter(this.#mainContainer, this.#filterModel, this.#filmsModel);
    filterPresenter.init();
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
    render(this.#filmsListContainer, this.#filmsContainer.element, RenderPosition.AFTERBEGIN);
  }

  #renderFilmsList(films) {
    films.forEach((film) => this.#renderFilm(film));
  }

  #renderNoFilms() {
    this.#filmsEmptyListContainer = new FilmsListContainerView(FilmsEmptyContainerTitles[this.#filterType], false, true);
    render(this.#filmsEmptyListContainer, this.#filmsContainer.element, RenderPosition.AFTERBEGIN);
  }

  #renderTopRatedContainer() {
    const topRatedFilms = [...this.#filmsModel.films].sort(sortFilmsByRate).slice(0, 2);
    this.#filmsTopRatedContainer = new FilmsListContainerView(FilmsContainerTitles.TOP_RATED, true);
    render(this.#filmsTopRatedContainer, this.#filmsContainer.element, RenderPosition.BEFOREEND);
    for (const film of topRatedFilms) {
      this.#renderFilm(film, this.#filmsTopRatedContainer.getFilmsContainer(), FilmsContainerTitles.TOP_RATED);
    }
  }

  #renderMostCommentedContainer() {
    const mostCommentedFilms = [...this.#filmsModel.films].sort(sortFilmsByComments).slice(0, 2);
    this.#filmsMostCommentedContainer = new FilmsListContainerView(FilmsContainerTitles.MOST_COMMENTED, true);
    render(this.#filmsMostCommentedContainer, this.#filmsContainer.element, RenderPosition.BEFOREEND);
    for (const film of mostCommentedFilms) {
      this.#renderFilm(film, this.#filmsMostCommentedContainer.getFilmsContainer(), FilmsContainerTitles.MOST_COMMENTED);
    }
  }

  #clearFilmsList = (resetRenderedFilmsCount = false) => {
    this.#filmsPresenters.forEach(
      (presenters) => presenters.destroy()
    );
    this.#filmsPresenters.clear();
    if (resetRenderedFilmsCount) {
      this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserActions.USER_DETAILS:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserActions.COMMENT_ADD:
        this.#commentsModel.addComment(updateType, update.newComment);
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserActions.COMMENT_DEL:
        this.#commentsModel.deleteComment(updateType, update);
        this.#filmsModel.updateFilm(updateType, update);
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
        this.#clearPage({resetExtraContainers: true, resetUserRank: true});
        this.#renderPage({renderExtraContainers: true, renderUserRank: true});
        break;
      case UpdateTypes.MAJOR:
        this.#clearPage({resetRenderedFilmsCount: true, resetSortType: true, resetExtraContainers: true});
        this.#renderPage({renderExtraContainers: true});
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
    this.#clearFilmsList(true);
    remove(this.#sortComponent);
    this.#renderSort();

    this.#renderFilmsList(films.slice(0, Math.min(filmsCount, this.#renderedFilmsCount)));
    if (filmsCount > this.#renderedFilmsCount) {
      this.#renderShowMoreButton();
    }
  };

  #clearPage = (
    {
      resetRenderedFilmsCount = false,
      resetSortType = false,
      resetExtraContainers = false,
      resetUserRank = false,
    } = {}) => {
    const filmsCount = this.films.length;

    this.#clearFilmsList();
    remove(this.#sortComponent);
    remove(this.#filmsListContainer);
    remove(this.#showMoreButtonComponent);

    if (resetUserRank) {
      remove(this.#userRankView);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if (resetRenderedFilmsCount) {
      this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      this.#renderedFilmsCount = Math.min(filmsCount, this.#renderedFilmsCount);
    }

    if (this.#filmsEmptyListContainer) {
      remove(this.#filmsEmptyListContainer);
    }

    if (resetExtraContainers) {
      remove(this.#filmsTopRatedContainer);
      remove(this.#filmsMostCommentedContainer);
    }
  };

  #renderPage({renderExtraContainers = false, renderUserRank = false} = {}) {
    const films = this.films;
    const filmsCount = films.length;

    if (renderUserRank) {
      this.#renderUserRank();
    }

    this.#renderFilmsContainer();
    if (renderExtraContainers && this.#filmsModel.films.length > 0) {
      this.#renderTopRatedContainer();
      this.#renderMostCommentedContainer();
    }

    if (filmsCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();
    this.#renderFilmsListContainer();

    this.#renderFilmsList(films.slice(0, Math.min(filmsCount, this.#renderedFilmsCount)));

    if (filmsCount > this.#renderedFilmsCount) {
      this.#renderShowMoreButton();
    }
  }
}

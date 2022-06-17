import FilmsContainerView from '../view/films-container-view';
import FilmsListContainerView from '../view/films-list-container-view';
import FilterPresenter from './filter-presenter';
import SortView from '../view/sort-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import {
  FilmContainerTitle,
  SortType,
  UserAction,
  UpdateType,
  FilterType,
  FilmEmptyContainerTitle
} from '../constants';
import FilmPresenter from './film-presenter';
import {remove, render, RenderPosition} from '../framework/render';
import {sortFilmsByDate, sortFilmsByRate, sortFilmsByComments} from '../utils/film';
import {filter} from '../utils/filter';
import UserRankView from '../view/user-rank-view';
import FooterStatView from '../view/footer-stat-view';
import LoadingView from '../view/loading-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const FILMS_COUNT_PER_STEP = 5;
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class FilmsPresenter {
  #userRankView = null;
  #mainContainer = null;
  #filterModel = null;
  #filmsModel = null;
  #commentsModel = null;
  #loadingComponent = new LoadingView();
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
  #filterType = FilterType.ALL;
  #siteHeaderElement = document.querySelector('.header');
  #siteFooterStatElement = document.querySelector('.footer__statistics');
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

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

  #pushPresenter = (id, presenter, extraContainer) => {
    switch (extraContainer) {
      case FilmContainerTitle.TOP_RATED:
        this.#filmsTopRatedPresenters.set(id, presenter);
        break;
      case FilmContainerTitle.MOST_COMMENTED:
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

  #renderUserRank = () => {
    const filmsWatched = filter[FilterType.HISTORY](this.#filmsModel.films).length;
    if (filmsWatched > 0) {
      this.#userRankView = new UserRankView(filmsWatched);
      render(this.#userRankView, this.#siteHeaderElement);
    }
  };

  #renderFooterStat = (filmsCount) => {
    render(new FooterStatView(filmsCount), this.#siteFooterStatElement);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#mainContainer);
  };

  #renderFilm = (film, container = this.#filmsListContainer.getFilmsContainer(), extraContainer) => {
    const filmPresenter = new FilmPresenter(
      container,
      this.#handleViewAction,
      this.#handleModeChange,
      this.#commentsModel,
    );
    filmPresenter.init(film);
    this.#pushPresenter(film.id, filmPresenter, extraContainer);
  };

  #renderFilters = () => {
    const filterPresenter = new FilterPresenter(this.#mainContainer, this.#filterModel, this.#filmsModel);
    filterPresenter.init();
  };

  #renderFilmsContainer = () => {
    render(this.#filmsContainer, this.#mainContainer);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#filmsContainer.element, RenderPosition.BEFOREBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderShowMoreButton = () => {
    render(this.#showMoreButtonComponent, this.#filmsListContainer.element);
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  };

  #renderFilmsListContainer = () => {
    this.#filmsListContainer = new FilmsListContainerView(FilmContainerTitle.ALL_MOVIES);
    render(this.#filmsListContainer, this.#filmsContainer.element, RenderPosition.AFTERBEGIN);
  };

  #renderFilmsList = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  };

  #renderNoFilms = () => {
    this.#filmsEmptyListContainer = new FilmsListContainerView(FilmEmptyContainerTitle[this.#filterType], false, true);
    render(this.#filmsEmptyListContainer, this.#filmsContainer.element, RenderPosition.AFTERBEGIN);
  };

  #renderTopRatedContainer = () => {
    const topRatedFilms = [...this.#filmsModel.films].sort(sortFilmsByRate).slice(0, 2);
    if (topRatedFilms[0].filmInfo.totalRating > 0) {
      this.#filmsTopRatedContainer = new FilmsListContainerView(FilmContainerTitle.TOP_RATED, true);
      render(this.#filmsTopRatedContainer, this.#filmsContainer.element, RenderPosition.BEFOREEND);
      for (const film of topRatedFilms) {
        this.#renderFilm(film, this.#filmsTopRatedContainer.getFilmsContainer(), FilmContainerTitle.TOP_RATED);
      }
    }
  };

  #renderMostCommentedContainer = () => {
    const mostCommentedFilms = [...this.#filmsModel.films].sort(sortFilmsByComments).slice(0, 2);

    if (mostCommentedFilms[0].comments.length > 0) {
      this.#filmsMostCommentedContainer = new FilmsListContainerView(FilmContainerTitle.MOST_COMMENTED, true);
      render(this.#filmsMostCommentedContainer, this.#filmsContainer.element, RenderPosition.BEFOREEND);
      for (const film of mostCommentedFilms) {
        this.#renderFilm(film, this.#filmsMostCommentedContainer.getFilmsContainer(), FilmContainerTitle.MOST_COMMENTED);
      }
    }
  };

  #clearFilmsList = (resetRenderedFilmsCount = false) => {
    this.#filmsPresenters.forEach(
      (presenters) => presenters.destroy()
    );
    this.#filmsPresenters.clear();
    if (resetRenderedFilmsCount) {
      this.#renderedFilmsCount = FILMS_COUNT_PER_STEP;
    }
  };

  #handleViewAction = async (actionType, updateType, update, comment) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.USER_DETAILS:
        this.#getPresenters(update.id).forEach((presenter) => presenter.setUpdating());
        try {
          await this.#filmsModel.updateFilm(updateType, update);
        } catch(err) {
          this.#getPresenters(update.id).forEach((presenter) => presenter.setAborting());
        }
        break;
      case UserAction.COMMENT_ADD:
        this.#getPresenters(update.id).forEach((presenter) => presenter.setCommentAdding());
        try {
          await this.#commentsModel.addComment(updateType, comment, update.id);
          await this.#filmsModel.updateFilm(updateType, update);
        } catch(err) {
          this.#getPresenters(update.id).forEach((presenter) => presenter.setCommentAddAborting());
        }
        break;
      case UserAction.COMMENT_DEL:
        this.#getPresenters(update.id).forEach((presenter) => presenter.setCommentDeleting(comment));
        try {
          await this.#commentsModel.deleteComment(updateType, comment);
          await this.#filmsModel.updateFilm(updateType, update);
        } catch(err) {
          this.#getPresenters(update.id).forEach((presenter) => presenter.setCommentDelAborting(comment));
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#getPresenters(data.id).forEach(
          (presenter) => presenter.init(data)
        );
        break;
      case UpdateType.MINOR:
        this.#clearPage({resetExtraContainers: true, resetUserRank: true});
        this.#renderPage({renderExtraContainers: true, renderUserRank: true});
        break;
      case UpdateType.MAJOR:
        this.#clearPage({resetRenderedFilmsCount: true, resetSortType: true, resetExtraContainers: true});
        this.#renderPage({renderExtraContainers: true});
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderPage({renderExtraContainers: true, renderUserRank: true});
        this.#renderFooterStat(this.films.length);
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
    remove(this.#loadingComponent);
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

  #renderPage = ({renderExtraContainers = false, renderUserRank = false} = {}) => {
    const films = this.films;
    const filmsCount = films.length;

    this.#renderFilmsContainer();

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (renderExtraContainers && this.#filmsModel.films.length > 0) {
      this.#renderTopRatedContainer();
      this.#renderMostCommentedContainer();
    }

    if (renderUserRank) {
      this.#renderUserRank();
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
  };
}

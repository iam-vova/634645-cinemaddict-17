import FilmsContainerView from '../view/films-container-view';
import MainNavigationView from '../view/main-navigation-view';
import SortView from '../view/sort-view';
import FilmCardView from '../view/film-card-view';
import FilmsExtraContainerView from '../view/films-extra-container-view';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import CommentView from '../view/comment-view';
import {render} from '../render';

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #films = [];
  #comments = [];
  #filmsComponent = new FilmsContainerView();
  #filmDetailsPopup = null;
  #siteBodyElement = document.querySelector('body');

  init = (filmsContainer, filmsModel, commentsModel) => {
    this.#filmsContainer = filmsContainer;
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#films = [...this.#filmsModel.films];
    this.#comments = [...this.#commentsModel.comments];

    render(new MainNavigationView(), this.#filmsContainer);
    render(new SortView(), this.#filmsContainer);
    render(this.#filmsComponent, this.#filmsContainer);

    const filmsSectionElement = this.#filmsComponent.element;
    const filmsListElement = filmsSectionElement.querySelector('.films-list');
    const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

    for (const film of this.#films) {
      this.#renderFilm(film, filmsListContainerElement);
    }

    render(new ShowMoreButtonView(), filmsListElement);

    const filmsSortByRate = this.#films.slice().sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    const filmsSortByComments = this.#films.slice().sort((a, b) => b.comments.length - a.comments.length);
    this.#renderExtraContainer('Top rated', filmsSortByRate.slice(0, 2), filmsSectionElement);
    this.#renderExtraContainer('Most commented', filmsSortByComments.slice(0, 2), filmsSectionElement);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removeFilmDetailsPopupView(this.#filmDetailsPopup);
      this.#siteBodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #renderFilm(film, container) {
    const filmComponent = new FilmCardView(film);

    filmComponent.element.querySelector('.film-card__link')
      .addEventListener('click', () => {
        if (this.#filmDetailsPopup) {
          this.#removeFilmDetailsPopupView(this.#filmDetailsPopup);
        }

        this.#renderFilmDetailsPopupView(film);
        document.addEventListener('keydown', this.#onEscKeyDown);
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

  #removeFilmDetailsPopupView(film) {
    film.element.remove();
    film.removeElement();
  }

  #renderFilmDetailsPopupView(film) {
    this.#filmDetailsPopup = new FilmDetailsPopupView(film);
    this.#siteBodyElement.classList.add('hide-overflow');
    render(this.#filmDetailsPopup, this.#siteBodyElement);
    const commentsContainer = this.#filmDetailsPopup.element.querySelector('.film-details__comments-list');

    this.#filmDetailsPopup.element.querySelector('.film-details__close-btn')
      .addEventListener('click', () => {
        this.#removeFilmDetailsPopupView(this.#filmDetailsPopup);
        this.#siteBodyElement.classList.remove('hide-overflow');
        document.removeEventListener('keydown', this.#onEscKeyDown);
      });

    for (const comment of film.comments) {
      render(new CommentView(this.#comments[comment]), commentsContainer);
    }
  }
}

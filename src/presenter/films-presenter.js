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
  init = (filmsContainer, filmsModel, commentsModel) => {
    this.filmsContainer = filmsContainer;
    this.filmsModel = filmsModel;
    this.commentsModel = commentsModel;
    this.films = [...this.filmsModel.getFilms()];
    this.comments = [...this.commentsModel.getComments()];
    const popupFilm = this.films[0];

    render(new MainNavigationView(), this.filmsContainer);
    render(new SortView(), this.filmsContainer);
    render(new FilmsContainerView(), this.filmsContainer);

    const filmsSectionElement = this.filmsContainer.querySelector('.films');
    const filmsListElement = filmsSectionElement.querySelector('.films-list');
    const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');

    for (const film of this.films) {
      render(new FilmCardView(film), filmsListContainerElement);
    }

    render(new ShowMoreButtonView(), filmsListElement);

    const filmsSortByRate = this.films.slice().sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    const filmsSortByComments = this.films.slice().sort((a, b) => b.comments.length - a.comments.length);
    this.renderExtraContainer('Top rated', filmsSortByRate.slice(0, 2), filmsSectionElement);
    this.renderExtraContainer('Most commented', filmsSortByComments.slice(0, 2), filmsSectionElement);

    this.renderFilmDetailsPopupView(popupFilm);
  };

  renderExtraContainer(title, films, container) {
    const extraContainer = new FilmsExtraContainerView(title);
    render(extraContainer, container);
    const extraFilmsContainer = extraContainer.getElement().querySelector('.films-list__container');
    for (const film of films) {
      render(new FilmCardView(film), extraFilmsContainer);
    }
  }

  renderFilmDetailsPopupView(popupFilm) {
    const siteBodyElement = document.querySelector('body');
    const filmDetailsPopup = new FilmDetailsPopupView(popupFilm);
    siteBodyElement.classList.add('hide-overflow');
    render(filmDetailsPopup, siteBodyElement);
    const commentsContainer = filmDetailsPopup.getElement().querySelector('.film-details__comments-list');

    for (const comment of popupFilm.comments) {
      render(new CommentView(this.comments[comment]), commentsContainer);
    }
  }
}

import FilmsContainerView from '../view/films-container-view';
import MainNavigationView from '../view/main-navigation-view';
import SortView from '../view/sort-view';
import FilmCardView from '../view/film-card-view';
import FilmsExtraContainerView from '../view/films-extra-container-view';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import CommentView from '../view/comment-view';
import {render} from '../render';

const FILMS_EXTRA_CARDS_COUNT = 2;
const extraContainers = ['Top rated', 'Most commented'];

export default class FilmsPresenter {
  init = (filmsContainer, filmsModel, commentsModel) => {
    this.filmsContainer = filmsContainer;
    this.filmsModel = filmsModel;
    this.commentsModel = commentsModel;
    this.films = [...this.filmsModel.getFilms()];
    this.comments = [...this.commentsModel.getComments()];

    render(new MainNavigationView(), this.filmsContainer);
    render(new SortView(), this.filmsContainer);
    render(new FilmsContainerView(), this.filmsContainer);

    const filmsSectionElement = this.filmsContainer.querySelector('.films');
    const filmsListElement = filmsSectionElement.querySelector('.films-list');
    const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');
    const siteBodyElement = document.querySelector('body');

    for (let i = 0; i < this.films.length; i++) {
      render(new FilmCardView(this.films[i]), filmsListContainerElement);
    }

    render(new ShowMoreButtonView(), filmsListElement);

    const filmsCopy = this.films.slice();
    for (const container of extraContainers) {
      const extraContainer = new FilmsExtraContainerView(container);
      render(extraContainer, filmsSectionElement);
      const extraFilmsContainer = extraContainer.getElement().querySelector('.films-list__container');

      if (container === 'Top rated') {
        filmsCopy.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
      } else if (container === 'Most commented') {
        filmsCopy.sort((a, b) => b.comments.length - a.comments.length);
      }

      for (let i = 0; i < FILMS_EXTRA_CARDS_COUNT; i++) {
        render(new FilmCardView(filmsCopy[i]), extraFilmsContainer);
      }
    }

    const filmDetailsPopup = new FilmDetailsPopupView(this.films[0]);
    siteBodyElement.classList.add('hide-overflow');
    render(filmDetailsPopup, siteBodyElement);
    const commentsContainer = filmDetailsPopup.getElement().querySelector('.film-details__comments-list');

    for (let i = 0; i < this.films[0].comments.length; i++) {
      render(new CommentView(this.comments[this.films[0].comments[i]]), commentsContainer);
    }
  };
}

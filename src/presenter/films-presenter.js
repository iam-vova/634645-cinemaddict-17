import FilmsContainerView from '../view/films-container-view';
import MainNavigationView from '../view/main-navigation-view';
import SortView from '../view/sort-view';
import FilmCardView from '../view/film-card-view';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import {render} from '../render';

export default class FilmsPresenter {
  init = (filmsContainer) => {
    this.filmsContainer = filmsContainer;

    const FILMS_CARDS_COUNT = 5;
    const FILMS_EXTRA_CARDS_COUNT = 2;
    render(new MainNavigationView(), this.filmsContainer);
    render(new SortView(), this.filmsContainer);
    render(new FilmsContainerView(), this.filmsContainer);

    const filmsSectionElement = this.filmsContainer.querySelector('.films');
    const filmsListElement = filmsSectionElement.querySelector('.films-list');
    const filmsListContainerElement = filmsListElement.querySelector('.films-list__container');
    const siteBodyElement = document.querySelector('body');

    for (let i = 0; i < FILMS_CARDS_COUNT; i++) {
      render(new FilmCardView(), filmsListContainerElement);
    }

    render(new ShowMoreButtonView(), filmsListElement);

    const filmsListExtraContainerElement = filmsSectionElement.querySelectorAll('.films-list--extra .films-list__container');
    filmsListExtraContainerElement.forEach((container) => {
      for (let i = 0; i < FILMS_EXTRA_CARDS_COUNT; i++) {
        render(new FilmCardView(), container);
      }
    });

    render(new FilmDetailsPopupView(), siteBodyElement);
  };
}

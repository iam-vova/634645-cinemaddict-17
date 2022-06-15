import AbstractView from '../framework/view/abstract-view';
import {UserRank} from '../constants';

const getUserRank = (filmsWatched) => {
  if (filmsWatched > 0 && filmsWatched <= 10) {
    return UserRank.NOVICE;
  } else if (filmsWatched > 10 && filmsWatched <= 20) {
    return UserRank.FAN;
  } else if (filmsWatched > 20) {
    return UserRank.MOVIE_BUFF;
  }
};

const createUserRankTemplate = (filmsWatched) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getUserRank(filmsWatched)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserRankView extends AbstractView {
  #filmsWatched = null;

  constructor(filmsWatched) {
    super();
    this.#filmsWatched = filmsWatched;
  }

  get template() {
    return createUserRankTemplate(this.#filmsWatched);
  }
}

import AbstractView from '../framework/view/abstract-view';
import {UserRank} from '../constants';

const UserRankMap = {
  [UserRank.NOVICE]: [0, 10],
  [UserRank.FAN]: [11, 20],
  [UserRank.MOVIE_BUFF]: [21, Infinity],
};

const getUserRank = (filmsWatched) => {
  if (filmsWatched > UserRankMap[UserRank.NOVICE][0] && filmsWatched <= UserRankMap[UserRank.NOVICE][1]) {
    return UserRank.NOVICE;
  } else if (filmsWatched >= UserRankMap[UserRank.FAN][0] && filmsWatched <= UserRankMap[UserRank.FAN][1]) {
    return UserRank.FAN;
  } else if (filmsWatched >= UserRankMap[UserRank.MOVIE_BUFF][0]) {
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

import Observable from '../framework/observable';
import {UpdateTypes} from '../constants';

export default class FilmsModel extends Observable {
  #api = null;
  #films = [];

  constructor(api) {
    super();
    this.#api = api;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#api.getFilms();
      this.#films = films.map(this.#adaptToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateTypes.INIT);
  };

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#api.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  };

  #adaptToClient = (film) => {
    const adaptedFilm = {
      ...film,
      filmInfo: {...film.film_info,
        ageRating: film.film_info.age_rating,
        alternativeTitle: film.film_info.alternative_title,
        totalRating: film.film_info.total_rating,
        release: {
          date: film.film_info.release.date !== null ? new Date(film.film_info.release.date) : film.film_info.release.date,
          releaseCountry: film.film_info.release.release_country
        }
      },
      userDetails: {...film.user_details,
        isWatched: film.user_details.already_watched,
        isFavorite: film.user_details.favorite,
        watchingDate: film.user_details.watching_date !== null ? new Date(film.user_details.watching_date) : film.user_details.watching_date
      }
    };

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;
    delete adaptedFilm.filmInfo.age_rating;
    delete adaptedFilm.filmInfo.alternative_title;
    delete adaptedFilm.filmInfo.total_rating;
    delete adaptedFilm.userDetails.already_watched;
    delete adaptedFilm.userDetails.watching_date;
    delete adaptedFilm.userDetails.favorite;

    return adaptedFilm;
  };
}

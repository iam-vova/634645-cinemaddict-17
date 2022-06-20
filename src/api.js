import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export default class Api extends ApiService {
  getFilms = () => this._load({url: 'movies'})
    .then(ApiService.parseResponse);

  getComments = (filmId) => this._load({url: `comments/${filmId}`})
    .then(ApiService.parseResponse);

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  addComment = async (comment, filmId) => {
    const response = await this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  deleteComment = async (commentId) => await this._load({
    url: `comments/${commentId}`,
    method: Method.DELETE,
  });

  #adaptToServer = (film) => {
    const adaptedFilm = {
      ...film,
      'film_info': {...film.filmInfo,
        'age_rating': film.filmInfo.ageRating,
        'alternative_title': film.filmInfo.alternativeTitle,
        'total_rating': film.filmInfo.totalRating,
        release: {
          date: film.filmInfo.release.date instanceof Date
            ? film.filmInfo.release.date.toISOString()
            : film.filmInfo.release.date,
          'release_country': film.filmInfo.release.releaseCountry
        }
      },
      'user_details': {...film.userDetails,
        favorite: film.userDetails.isFavorite,
        'already_watched': film.userDetails.isWatched,
        'watching_date': film.userDetails.watchingDate instanceof Date
          ? film.userDetails.watchingDate.toISOString()
          : film.filmInfo.release.date
      }
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;
    delete adaptedFilm.film_info.ageRating;
    delete adaptedFilm.film_info.alternativeTitle;
    delete adaptedFilm.film_info.totalRating;
    delete adaptedFilm.user_details.isWatched;
    delete adaptedFilm.user_details.watchingDate;
    delete adaptedFilm.user_details.isFavorite;

    return adaptedFilm;
  };
}

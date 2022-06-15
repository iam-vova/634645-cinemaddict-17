import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments = (filmId) => {
    return this._load({url: `comments/${filmId}`})
      .then(ApiService.parseResponse)
  }

  updateFilm = async (movie) => {
    const response = await this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (film) => {
    const adaptedFilm = {
      ...film,
      'film_info': {...film.filmInfo,
        'age_rating': film.filmInfo.ageRating,
        'alternative_title': film.filmInfo.alternativeTitle,
        'total_rating': film.filmInfo.totalRating,
        release: {
          date: film.filmInfo.release.date instanceof Date ? film.filmInfo.release.date.toISOString() : null,
          'release_country': film.filmInfo.release.releaseCountry
        }
      },
      'user_details': {...film.userDetails,
        'already_watched': film.user_details.isWatched,
        'watching_date': film.user_details.watchingDate instanceof Date ? film.user_details.watchingDate.toISOString() : null
      }
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;
    delete adaptedFilm.filmInfo.ageRating;
    delete adaptedFilm.filmInfo.alternativeTitle;
    delete adaptedFilm.filmInfo.totalRating;
    delete adaptedFilm.userDetails.isWatched;
    delete adaptedFilm.userDetails.watchingDate;

    return adaptedFilm;
  };
}

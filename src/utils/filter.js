import {FilterType} from '../constants';

const getWatchlistFilms = (films) => films.filter((film) => film.userDetails.watchlist);

const getWatchedFilms = (films) => films.filter((film) => film.userDetails.isWatched);

const getFavoritesFilms = (films) => films.filter((film) => film.userDetails.isFavorite);

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => getWatchlistFilms(films),
  [FilterType.HISTORY]: (films) => getWatchedFilms(films),
  [FilterType.FAVORITES]: (films) => getFavoritesFilms(films),
};

export {filter};

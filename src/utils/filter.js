import {FilterTypes} from '../constants';

const getWatchlistFilms = (films) => films.filter((film) => film.userDetails.watchlist);

const getWatchedFilms = (films) => films.filter((film) => film.userDetails.isWatched);

const getFavoritesFilms = (films) => films.filter((film) => film.userDetails.isFavorite);

const filter = {
  [FilterTypes.ALL]: (films) => films,
  [FilterTypes.WATCHLIST]: (films) => getWatchlistFilms(films),
  [FilterTypes.HISTORY]: (films) => getWatchedFilms(films),
  [FilterTypes.FAVORITES]: (films) => getFavoritesFilms(films),
};

export {filter};

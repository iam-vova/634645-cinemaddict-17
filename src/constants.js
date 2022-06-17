const emojiNames = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];

const FilmContainerTitle = {
  ALL_MOVIES: 'All movies. Upcoming',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const FilmEmptyContainerTitle = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATE: 'rate',
  COMMENTS: 'comments',
};

const UserAction = {
  USER_DETAILS: 'userDetails',
  COMMENT_ADD: 'commentAdd',
  COMMENT_DEL: 'commentDel',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const UserRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

export {
  emojiNames,
  FilmContainerTitle,
  FilmEmptyContainerTitle,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  UserRank,
};

const emojiNames = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];

const commentsCount = 3;

const FilmsContainerTitles = {
  ALL_MOVIES: 'All movies. Upcoming',
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

const FilterTypes = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const FilmsEmptyContainerTitles = {
  [FilterTypes.ALL]: 'There are no movies in our database',
  [FilterTypes.WATCHLIST]: 'There are no movies to watch now',
  [FilterTypes.HISTORY]: 'There are no watched movies now',
  [FilterTypes.FAVORITES]: 'There are no favorite movies now',
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATE: 'rate',
  COMMENTS: 'comments',
};

const UserActions = {
  USER_DETAILS: 'userDetails',
  COMMENT_ADD: 'commentAdd',
  COMMENT_DEL: 'commentDel',
};

const UpdateTypes = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const UserRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

export {
  emojiNames,
  commentsCount,
  FilmsContainerTitles,
  FilmsEmptyContainerTitles,
  FilterTypes,
  SortType,
  UserActions,
  UpdateTypes,
  UserRank,
};

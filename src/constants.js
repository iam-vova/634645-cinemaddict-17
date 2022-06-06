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
  NO_MOVIES: 'There are no movies in our database',
  NO_WATCHLIST: 'There are no movies to watch now',
  NO_HISTORY: 'There are no watched movies now',
  NO_FAVORITES: 'There are no favorite movies now',
};

const FilterTypes = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
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

export {
  emojiNames,
  commentsCount,
  FilmsContainerTitles,
  FilterTypes,
  SortType,
  UserActions,
  UpdateTypes,
};

const emojiNames = [
  'smile',
  'sleeping',
  'puke',
  'angry'
];

const commentsCount = 40;

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
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
}

export {
  emojiNames,
  commentsCount,
  FilmsContainerTitles,
  FilterTypes,
};

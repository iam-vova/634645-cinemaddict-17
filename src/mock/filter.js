import {filter} from '../utils/filter';

export const generateFilters = (films) => Object.entries(filter).map(
  ([filterName, filterFilms]) => ({
    name: filterName,
    count: filterFilms(films).length,
  }),
);


import {filter} from '../utils/filter';

export const generateFilters = (films) => Object.entries(filter).map(
  ([filterName, filterTasks]) => ({
    name: filterName,
    count: filterTasks(films).length,
  }),
);


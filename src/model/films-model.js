import Observable from '../framework/observable';
import {generateFilms} from '../mock/film';

export default class FilmsModel extends Observable {
  #filmsApiService = null;
  #films = generateFilms();

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
    this.#filmsApiService.films.then((films) => {
      console.log(films);
    });
  }
  get films() {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}

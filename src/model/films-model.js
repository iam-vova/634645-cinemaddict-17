import {generateFilm} from '../mock/film';

export default class FilmsModel  {
  films = Array.from({length: 5}, (value, index) => generateFilm(index));

  getFilms = () => this.films;
}

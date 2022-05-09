export default class FilmsModel  {
  #films = null;

  constructor(films) {
    this.#films = films;
  }

  get films() {
    return this.#films;
  }
}

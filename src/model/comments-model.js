import Observable from '../framework/observable';

export default class CommentsModel extends Observable {
  #filmsApiService = null;
  #comments = [];

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
    this.getCommentsByFilmId(0).then((comments) => {
      console.log(this.#comments);
    });
  }

  get comments() {
    return this.#comments;
  }

  getCommentsByFilmId = async (filmId) => {
    try {
      this.#comments = await this.#filmsApiService.getComments(filmId);
    } catch {
      this.#comments = [];
      throw new Error('Can\'t get comments');
    }

    return this.#comments;
  };

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.comment.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}

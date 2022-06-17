import Observable from '../framework/observable';

export default class CommentsModel extends Observable {
  #api = null;
  #comments = [];

  constructor(api) {
    super();
    this.#api = api;
  }

  get comments() {
    return this.#comments;
  }

  getCommentsByFilmId = async (filmId) => {
    try {
      this.#comments = await this.#api.getComments(filmId);
    } catch {
      this.#comments = [];
      throw new Error('Can\'t get comments');
    }

    return this.#comments;
  };

  addComment = async (updateType, comment, filmId) => {
    try {
      const response = await this.#api.addComment(comment, filmId);
      this.#comments = [...response.comments];
      this._notify(updateType, comment);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      this.#api.deleteComment(update.id);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };
}

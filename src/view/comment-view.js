import AbstractView from '../framework/view/abstract-view';
import he from 'he';
import {humanizeCommentDate} from '../utils/film';

const createCommentTemplate = (item) => {
  const {author, comment, date, emotion} = item || {};

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${humanizeCommentDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

export default class CommentView extends AbstractView {
  #comment = null;

  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }

  #commentDelHandler = (evt) => {
    evt.preventDefault();
    this._callback.commentDel(this.#comment);
  };

  setCommentDelClickHandler = (callback) => {
    this._callback.commentDel = callback;
    this.element.querySelector('.film-details__comment-delete')
      .addEventListener('click', this.#commentDelHandler);
  };
}

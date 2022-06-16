import he from 'he';
import {humanizeCommentDate} from '../utils/film';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

const createCommentTemplate = (data) => {
  const {author, comment, date, emotion, isDisabled} = data || {};

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
          <button ${isDisabled ? 'disabled' : ''} class="film-details__comment-delete">${isDisabled ? 'Deleting...' : 'Delete'}</button>
        </p>
      </div>
    </li>`
  );
};

export default class CommentView extends AbstractStatefulView {
  constructor(comment) {
    super();
    this._state = CommentView.parseCommentToState(comment);
  }

  get template() {
    return createCommentTemplate(this._state);
  }

  static parseCommentToState = (comment) => ({
    ...comment,
    isDisabled: false,
  });

  static parseStateToComment = (state) => {
    const comment = {...state};
    delete comment.isDisabled;

    return comment;
  };

  #commentDelHandler = (evt) => {
    evt.preventDefault();
    this._callback.commentDel(CommentView.parseStateToComment(this._state));
  };

  setCommentDelClickHandler = (callback) => {
    this._callback.commentDel = callback;
    this.element.querySelector('.film-details__comment-delete')
      .addEventListener('click', this.#commentDelHandler);
  };

  _restoreHandlers = () => {
    this.setCommentDelClickHandler(this._callback.commentDel);
  };
}

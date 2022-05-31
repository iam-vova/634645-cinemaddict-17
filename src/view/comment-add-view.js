import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {commentsCount, emojiNames} from '../constants';
import {generateRandomDate} from '../utils/common';

const createCommentAddTemplate = (comment) => {
  const {emotion, text} = comment;

  return (
    `<div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">
            ${emotion.length > 0 ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : ''}
        </div>
        <label class="film-details__comment-label">
            <textarea
              class="film-details__comment-input"
              placeholder="Select reaction below and write comment here"
              name="comment"
              >${text}</textarea>
        </label>
        <div class="film-details__emoji-list">
            ${emojiNames.map((item) => (
              `<input
                class="film-details__emoji-item visually-hidden"
                name="comment-emoji"
                type="radio"
                id="emoji-${item}"
                value="${item}"
                ${emotion.toString() === item ? 'checked' : ''}
              >
                <label class="film-details__emoji-label" for="emoji-${item}">
                <img src="./images/emoji/${item}.png" width="30" height="30" alt="emoji">
               </label>`)).join('')}
        </div>
    </div>`
  );
};

const BLANK_COMMENT = {
  id: new Date().getTime(),
  author: 'Random name',
  date: generateRandomDate(),
  emotion: new Array(),
  text: '',
}
export default class CommentAddView extends AbstractStatefulView {
  constructor(comment = BLANK_COMMENT) {
    super();
    this._state = CommentAddView.parseCommentToState(comment);
    this.#setInnerHandlers();
  }

  get template() {
    return createCommentAddTemplate(this._state);
  }

  static parseCommentToState = (comment) => ({
    ...comment
  });

  static parseStateToComment = (state) => {
    const comment = {...state};
    return comment;
  }

  setCommentAddHandler = (callback) => {
    this._callback.addComment = callback;
    document.addEventListener('keydown', this.#commentAddHandler);
  };


  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      text: evt.target.value,
    });
  };

  #emojiClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      emotion: [evt.target.value],
    });
  };

  #commentAddHandler = (evt) => {
    if ((evt.ctrlKey || evt.metaKey) && (evt.key === 'Enter')) {
      evt.preventDefault();
      if (this._state.emotion.length > 0 && this._state.text) {
        this._callback.addComment(CommentAddView.parseStateToComment(this._state));
        this._state = CommentAddView.parseCommentToState(BLANK_COMMENT)
      }
    };
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('change', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentInputHandler);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCommentAddHandler(this._callback.addComment);
  };
}

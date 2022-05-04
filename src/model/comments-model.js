import {generateComment} from '../mock/comment';

export default class CommentsModel {
  films = Array.from({length: 40}, (value, index) => generateComment(index));

  getComments = () => this.films;
}

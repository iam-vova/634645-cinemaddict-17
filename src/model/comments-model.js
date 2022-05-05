export default class CommentsModel {
  constructor(comments) {
    this.comments = comments;
  }

  getComments = () => this.comments;
}

import UserRankView from './view/user-rank-view';
import FilmsPresenter from './presenter/films-presenter';
import {generateFilm} from './mock/film';
import {generateComment} from './mock/comment';
import {render} from './render';

let filmId = 0
const COMMENTS_COUNT = 40;
let commentId = 0;

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const filmsPresenter = new FilmsPresenter();

render(new UserRankView(), siteHeaderElement);

filmsPresenter.init(siteMainElement);

console.log(generateFilm(filmId, COMMENTS_COUNT));
console.log(generateComment(commentId));

import UserRankView from './view/user-rank-view';
import FilmsPresenter from './presenter/films-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import {render} from './framework/render';
import {generateFilms} from './mock/film';
import {generateComments} from './mock/comment';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const films = generateFilms();
const filmsModel = new FilmsModel(films);
const comments = generateComments();
const commentsModel = new CommentsModel(comments);
const filmsPresenter = new FilmsPresenter(siteMainElement, filmsModel, commentsModel);

render(new UserRankView(), siteHeaderElement);

filmsPresenter.init();


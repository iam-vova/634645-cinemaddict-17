import UserRankView from './view/user-rank-view';
import PagePresenter from './presenter/page-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import {render} from './framework/render';
import {generateComments} from './mock/comment';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const filmsModel = new FilmsModel();
const comments = generateComments();
const commentsModel = new CommentsModel(comments);
const filmsPresenter = new PagePresenter(siteMainElement, filmsModel, commentsModel);

render(new UserRankView(), siteHeaderElement);

filmsPresenter.init();

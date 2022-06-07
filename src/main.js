import UserRankView from './view/user-rank-view';
import PagePresenter from './presenter/page-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import {render} from './framework/render';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const filmsModel = new FilmsModel();
const comments = new CommentsModel();
const commentsModel = new CommentsModel(comments);
const filmsPresenter = new PagePresenter(siteMainElement, filmsModel, commentsModel);

render(new UserRankView(), siteHeaderElement);

filmsPresenter.init();

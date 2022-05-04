import UserRankView from './view/user-rank-view';
import FilmsPresenter from './presenter/films-presenter';
import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import {render} from './render';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filmsPresenter = new FilmsPresenter();

render(new UserRankView(), siteHeaderElement);

filmsPresenter.init(siteMainElement, filmsModel, commentsModel);


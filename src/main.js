import PagePresenter from './presenter/page-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import CommentsModel from './model/comments-model';

const siteMainElement = document.querySelector('.main');

const filterModel = new FilterModel();
const filmsModel = new FilmsModel();
const comments = new CommentsModel();
const commentsModel = new CommentsModel(comments);
const filmsPresenter = new PagePresenter(siteMainElement, filterModel, filmsModel, commentsModel);

filmsPresenter.init();

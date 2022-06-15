import PagePresenter from './presenter/page-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import CommentsModel from './model/comments-model';
import Api from './api';

const AUTHORIZATION = 'Basic er666jdzbdw';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';
const api = new Api(END_POINT, AUTHORIZATION);

const siteMainElement = document.querySelector('.main');

const filterModel = new FilterModel();
const filmsModel = new FilmsModel(api);
const commentsModel = new CommentsModel(api);
const filmsPresenter = new PagePresenter(siteMainElement, filterModel, filmsModel, commentsModel);

filmsPresenter.init();
filmsModel.init();

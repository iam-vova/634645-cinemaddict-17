import PagePresenter from './presenter/page-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import CommentsModel from './model/comments-model';
import FilmsApiService from './films-api-service';

const AUTHORIZATION = 'Basic er883jdzbdw';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteMainElement = document.querySelector('.main');

const filterModel = new FilterModel();
const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const comments = new CommentsModel();
const commentsModel = new CommentsModel(comments);
const filmsPresenter = new PagePresenter(siteMainElement, filterModel, filmsModel, commentsModel);

filmsPresenter.init();

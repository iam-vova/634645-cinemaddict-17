import UserRankView from './view/user-rank-view';
import FilmsPresenter from './presenter/films-presenter';
import {render} from './render';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const filmsPresenter = new FilmsPresenter();

render(new UserRankView(), siteHeaderElement);

filmsPresenter.init(siteMainElement);

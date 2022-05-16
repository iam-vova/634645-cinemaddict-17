import AbstractView from '../framework/view/abstract-view';

const createFilmsContainerTemplate = () => (
  '<section class="films"></section>'
);

export default class FilmsContainerView extends AbstractView {
  get template() {
    return createFilmsContainerTemplate();
  }
}

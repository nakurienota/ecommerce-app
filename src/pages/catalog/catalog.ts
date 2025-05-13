import HtmlCreator from '@utils/html';

import ButtonBackCreator from '../../components/button/button-back';

export default class CatalogPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const catalogWrapper = HtmlCreator.create('div', undefined, 'catalog', 'catalog__wrapper');
    const catalogText = HtmlCreator.create('p', undefined, 'catalog__txt');
    catalogText.textContent = 'ТУТ БУДЕТ КАТАЛОГ';

    const buttonBack = new ButtonBackCreator('НАЗАД', ['catalog__btn', 'button-back'], undefined, '/main').render();

    this.container.append(catalogWrapper);
    catalogWrapper.append(catalogText, buttonBack);

    return this.container;
  }
}

import HtmlCreator from '@utils/html';

import ButtonBackCreator from '../../components/button/button-back';

export default class NotFoundPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const notFoundWrapper = HtmlCreator.create('div', undefined, 'not-found', 'not-found__wrapper');
    const notFoundText = HtmlCreator.create('p', undefined, 'not-found__txt');
    notFoundText.textContent = 'Извините, по Вашему запросу ничего не найдено...';

    const buttonBack = new ButtonBackCreator('НАЗАД', ['not-found__btn', 'button-back'], undefined, '/main').render();

    this.container.append(notFoundWrapper);
    notFoundWrapper.append(notFoundText, buttonBack);

    return this.container;
  }
}

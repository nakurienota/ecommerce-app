import HtmlCreator from '@utils/html';

import ButtonBackCreator from '../../components/button/button-back';

export default class SalesPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const salesWrapper = HtmlCreator.create('div', undefined, 'sales', 'sales__wrapper');
    const salesText = HtmlCreator.create('p', undefined, 'sales__txt');
    salesText.textContent = 'ТУТ БУДЕТ СТРАНИЦА СО СКИДКАМИ';

    const buttonBack = new ButtonBackCreator('НАЗАД', ['sales__btn', 'button-back'], undefined, '/main').render();

    this.container.append(salesWrapper);
    salesWrapper.append(salesText, buttonBack);

    return this.container;
  }
}

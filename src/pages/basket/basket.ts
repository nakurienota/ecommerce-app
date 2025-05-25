import HtmlCreator from '@utils/html';
import { AppRoutes } from '@utils/router';

import ButtonBackCreator from '../../components/button/button-back';

export default class BasketPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const basketWrapper = HtmlCreator.create('div', undefined, 'basket', 'basket__wrapper');
    const basketText = HtmlCreator.create('p', undefined, 'basket__txt');
    basketText.textContent = 'ТУТ БУДЕТ КОРЗИНА';

    const buttonBack = new ButtonBackCreator('НАЗАД', ['basket__btn'], undefined, AppRoutes.MAIN).render();

    this.container.append(basketWrapper);
    basketWrapper.append(basketText, buttonBack);

    return this.container;
  }
}

import HtmlCreator from '@utils/html';

import ButtonBackCreator from '../../components/button/button-back';

export default class MainPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const mainWrapper = HtmlCreator.create('div', undefined, 'main-page', 'main-page__wrapper');
    const mainText = HtmlCreator.create('p', undefined, 'main-page__txt');
    mainText.textContent = 'ТУТ БУДЕТ ГЛАВНАЯ СТРАНИЦА';

    const buttonBack = new ButtonBackCreator('НАЗАД', ['main-page__btn', 'button-back'], undefined, '/main').render();

    this.container.append(mainWrapper);
    mainWrapper.append(mainText, buttonBack);

    return this.container;
  }
}

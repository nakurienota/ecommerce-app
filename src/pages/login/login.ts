import HtmlCreator from '@utils/html';

import ButtonBackCreator from '../../components/button/button-back';

export default class LogingPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const loginWrapper = HtmlCreator.create('div', undefined, 'login', 'login__wrapper');
    const loginText = HtmlCreator.create('p', undefined, 'login__txt');
    loginText.textContent = 'ТУТ БУДЕТ СТРАНИЦА ВХОДА';

    const buttonBack = new ButtonBackCreator('НАЗАД', ['login__btn', 'button-back'], undefined, '/main').render();

    this.container.append(loginWrapper);
    loginWrapper.append(loginText, buttonBack);

    return this.container;
  }
}

import HtmlCreator from '@utils/html';

export default class ProfilePassword {
  public container: HTMLDivElement;
  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'profile__password');
  }

  public getHTML(): HTMLDivElement {
    const textPassword = HtmlCreator.create('p', undefined, 'profile__orders-txt');
    textPassword.textContent = 'Тут будут отображаться смена пароля';

    this.container.append(textPassword);
    return this.container;
  }
}

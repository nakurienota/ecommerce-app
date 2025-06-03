import HtmlCreator from '@utils/html';

export default class ProfileOrders {
  public container: HTMLDivElement;
  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'profile__orders');
  }

  public getHTML(): HTMLDivElement {
    const textOrders = HtmlCreator.create('p', undefined, 'profile__orders-txt');
    textOrders.textContent = 'Тут будут отображаться ваши заказы...';

    this.container.append(textOrders);

    return this.container;
  }
}

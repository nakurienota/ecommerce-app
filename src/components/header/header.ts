import HtmlCreator from '@utils/html';
import { router } from '@utils/router';

export default class Header {
  public header: HTMLElement;
  constructor() {
    this.header = HtmlCreator.create('header', undefined, 'header');
  }

  public getHTML(): HTMLElement {
    const container = HtmlCreator.create('div', undefined, 'container');
    const headerWrapper = HtmlCreator.create('div', undefined, 'header__wrapper');
    const headerTitleLink = HtmlCreator.create('a', undefined, 'header__title');
    headerTitleLink.setAttribute('href', '/main');
    headerTitleLink.textContent = 'MyBOOK';

    headerTitleLink.addEventListener('click', (event) => {
      const target = event.target;

      if (target instanceof HTMLAnchorElement) {
        event.preventDefault();
        router.navigate(target.href);
      }
    });

    const headerNav = HtmlCreator.create('nav', undefined, 'header__nav');
    const headerList = HtmlCreator.create('ul', undefined, 'header__list', 'list-reset');

    const headerNavigation = [
      { textLink: 'Каталог', href: '/catalog' },
      { textLink: 'О нас', href: '/about' },
      { textLink: 'Скидки', href: '/sales' },
      { textLink: 'Контакты', href: '/contacts' },
    ];

    headerNavigation.forEach(({ textLink, href }) => {
      const listItem = HtmlCreator.create('li', undefined, 'header__item');
      const linkItem = HtmlCreator.create('a', undefined, 'header__item-link');
      linkItem.textContent = textLink;
      linkItem.setAttribute('href', href);

      linkItem.addEventListener('click', (event) => {
        const target = event.target;

        if (target instanceof HTMLAnchorElement) {
          event.preventDefault();
          router.navigate(target.href);
        }
      });

      listItem.append(linkItem);
      headerList.append(listItem);
    });

    const headerButtonWrapper = HtmlCreator.create('div', undefined, 'header__btn-wrapper');

    const headerButtons = [
      { textLink: 'Вход', href: '/login' },
      { textLink: 'Регистрация', href: '/registration' },
      { textLink: 'Корзина', href: '/basket' },
    ];

    headerButtons.forEach(({ textLink, href }) => {
      const listItem = HtmlCreator.create('a', undefined, 'header__btn', 'header__btn-login');
      listItem.textContent = textLink;
      listItem.setAttribute('href', href);

      listItem.addEventListener('click', (event) => {
        const target = event.target;

        if (target instanceof HTMLAnchorElement) {
          event.preventDefault();
          router.navigate(target.href);
        }
      });

      headerButtonWrapper.append(listItem);
    });

    this.header.append(container);
    container.append(headerWrapper);
    headerWrapper.append(headerTitleLink);
    headerWrapper.append(headerTitleLink, headerNav, headerButtonWrapper);
    headerNav.append(headerList);

    return this.header;
  }
}

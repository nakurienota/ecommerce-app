import HtmlCreator from '@utils/html';
import { AppRoutes, router } from '@utils/router';
import { clearCurrentLoggedInUser, userLoggedIn } from '@utils/security';

export default class Header {
  public header: HTMLElement;
  constructor() {
    this.header = HtmlCreator.create('header', undefined, 'header');
  }

  public getHTML(): HTMLElement {
    const container = HtmlCreator.create('div', undefined, 'container');
    const headerWrapper = HtmlCreator.create('div', undefined, 'header__wrapper');
    const headerTitleLink = HtmlCreator.create('a', undefined, 'header__title');
    headerTitleLink.setAttribute('href', AppRoutes.MAIN);
    headerTitleLink.textContent = 'MyBOOK';

    headerTitleLink.addEventListener('click', (event) => {
      const target = event.target;

      if (target instanceof HTMLAnchorElement) {
        event.preventDefault();
        router.navigate(target.href);
      }
    });

    const headerNav = HtmlCreator.create('nav', undefined, 'header__nav');
    const headerList = HtmlCreator.create('ul', undefined, 'header__list');
    headerList.addEventListener('click', () => {
      if (headerList.classList.contains('active')) {
        headerList.classList.remove('active');
      }
    });
    globalThis.addEventListener('resize', () => {
      const winWidth = window.innerWidth;
      if (headerList.classList.contains('active') && winWidth > 1024) {
        headerList.classList.remove('active');
      }
    });

    const headerNavigation = [
      { textLink: 'Каталог', href: AppRoutes.CATALOG },
      { textLink: 'О нас', href: AppRoutes.ABOUT },
      { textLink: 'Скидки', href: AppRoutes.SALES },
      { textLink: 'Контакты', href: AppRoutes.CONTACTS },
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
      userLoggedIn()
        ? { textLink: 'Выход', href: AppRoutes.LOGIN, img: 'url(../../assets/images/log_out.png)' }
        : { textLink: 'Вход', href: AppRoutes.LOGIN, img: 'url(../../assets/images/sing_in.png)' },
      { textLink: 'Регистрация', href: AppRoutes.REGISTRATION, img: 'url(../../assets/images/reg_icon.png)' },
      { textLink: 'Корзина', href: AppRoutes.BASKET, img: 'url(../../assets/images/busket.png)' },
    ];

    headerButtons.forEach(({ textLink, href, img }) => {
      const listItem = HtmlCreator.create('a', undefined, 'header__btn', 'header__btn-login');
      listItem.textContent = textLink;
      listItem.setAttribute('href', href);
      listItem.style.backgroundImage = img;
      if (href === AppRoutes.LOGIN) listItem.dataset.role = 'auth';

      listItem.addEventListener('click', (event) => {
        const target = event.target;

        if (target instanceof HTMLAnchorElement) {
          if (target.textContent === 'Выход' && userLoggedIn()) {
            target.textContent = 'Вход';
            target.style.backgroundImage = 'url(../../assets/images/sing_in.png)';
            clearCurrentLoggedInUser();
          }
          event.preventDefault();
          router.navigate(target.href);
        }
      });

      headerButtonWrapper.append(listItem);
    });

    const headerBurger = HtmlCreator.create('div', undefined, 'header__burger');
    const headerBurgerTop = HtmlCreator.create('span', undefined, 'header__burger-icon');
    const headerBurgerBottom = HtmlCreator.create('span', undefined, 'header__burger-icon');
    headerBurger.addEventListener('click', () => {
      if (headerList.classList.contains('active')) {
        headerList.classList.remove('active');
      } else {
        headerList.classList.add('active');
      }
    });

    headerBurger.append(headerBurgerTop, headerBurgerBottom);
    headerButtonWrapper.append(headerBurger);

    this.header.append(container);
    container.append(headerWrapper);
    headerWrapper.append(headerTitleLink, headerNav, headerButtonWrapper);
    headerNav.append(headerList);

    return this.header;
  }
}

import HtmlCreator from '@utils/html';
import { AppRoutes, router } from '@utils/router';

export default class Footer {
  public footer: HTMLElement;
  constructor() {
    this.footer = HtmlCreator.create('footer', undefined, 'footer');
  }

  public getHTML(): HTMLElement {
    const container = HtmlCreator.create('div', undefined, 'container');
    const footerWrapper = HtmlCreator.create('div', undefined, 'footer__wrapper');
    const footerDescription = HtmlCreator.create('div', undefined, 'footer__description');
    const footerTitleLink = HtmlCreator.create('h3', undefined, 'footer__title');
    footerTitleLink.textContent = 'Книжный интернет-магазин MyBOOK';
    const footerTxt = HtmlCreator.create('p', undefined, 'footer__txt');
    footerTxt.textContent =
      'MyBOOK - это крупный интернет-магазин книг. В нём вы можете заказывать книги в любое время 24 часа в сутки.';

    const footerNav = HtmlCreator.create('nav', undefined, 'footer__nav');
    const footerList = HtmlCreator.create('ul', undefined, 'footer__list');
    const footerNavigation = [
      { textLink: 'Каталог', href: AppRoutes.CATALOG },
      { textLink: 'О нас', href: AppRoutes.ABOUT },
      { textLink: 'Скидки', href: AppRoutes.SALES },
      { textLink: 'Контакты', href: AppRoutes.CONTACTS },
    ];

    footerNavigation.forEach(({ textLink, href }) => {
      const listItem = HtmlCreator.create('li', undefined, 'footer__item');
      const linkItem = HtmlCreator.create('a', undefined, 'footer__item-link');
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
      footerList.append(listItem);
    });

    const footerNavSocial = HtmlCreator.create('nav', undefined, 'footer__nav-social');
    const footerListSocial = HtmlCreator.create('ul', undefined, 'footer__list-social');
    const socialLinks = [
      { href: 'https://vk.com/', imgSrc: '../assets/icons/vk.svg', alt: 'Вконтакте' },
      { href: 'https://ok.ru/', imgSrc: '../assets/icons/ok.svg', alt: 'Одноклассники' },
      { href: 'https://web.telegram.org/k/', imgSrc: '../assets/icons/tg.svg', alt: 'Телеграмм' },
    ];

    socialLinks.forEach(({ href, imgSrc, alt }) => {
      const listItem = HtmlCreator.create('li', undefined, 'footer__item-social');
      const linkItem = HtmlCreator.create('a', undefined, 'footer__item-social-link');
      linkItem.setAttribute('href', href);
      linkItem.setAttribute('target', '_blank');

      const imageItem = HtmlCreator.create('img', undefined, 'footer__item-image');
      imageItem.setAttribute('src', imgSrc);
      imageItem.setAttribute('alt', alt);

      linkItem.append(imageItem);
      listItem.append(linkItem);
      footerListSocial.append(listItem);
    });

    this.footer.append(container);
    container.append(footerWrapper);
    footerWrapper.append(footerDescription, footerNavSocial, footerNav);
    footerDescription.append(footerTitleLink, footerTxt);
    footerNav.append(footerList);
    footerNavSocial.append(footerListSocial);

    return this.footer;
  }
}

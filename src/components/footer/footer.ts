import HtmlCreator from '@utils/html';
import { router } from '@utils/router';

export default class Footer {
  public footer: HTMLElement;
  constructor() {
    this.footer = HtmlCreator.create('footer', undefined, 'footer');
  }

  public getHTML(): HTMLElement {
    const container = HtmlCreator.create('div', undefined, 'container');
    const footerWrapper = HtmlCreator.create('div', undefined, 'footer__wrapper');
    const footerDscr = HtmlCreator.create('div', undefined, 'footer__dscr');
    const footerTitleLink = HtmlCreator.create('h3', undefined, 'footer__title');
    footerTitleLink.textContent = 'Книжный интернет-магазин MyBOOK';
    const footerTxt = HtmlCreator.create('p', undefined, 'footer__txt');
    footerTxt.textContent =
      'MyBOOK - это крупный интернет-магазин книг. В нём вы можете заказывать книги в любое время 24 часа в сутки.';

    const footerNav = HtmlCreator.create('nav', undefined, 'footer__nav');
    const footerList = HtmlCreator.create('ul', undefined, 'footer__list', 'list-reset');
    const footerItemCatalog = HtmlCreator.create('li', undefined, 'footer__item');
    const footerItemAbout = HtmlCreator.create('li', undefined, 'footer__item');
    const footerItemSale = HtmlCreator.create('li', undefined, 'footer__item');
    const footerItemContacts = HtmlCreator.create('li', undefined, 'footer__item');

    const footerItemCatalogLink = HtmlCreator.create('a', undefined, 'footer__item-link');
    footerItemCatalogLink.textContent = 'Каталог';
    footerItemCatalogLink.setAttribute('href', '/catalog');
    footerItemCatalogLink.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        event.preventDefault();
        router.navigate(target.href);
      }
    });

    const footerItemAboutLink = HtmlCreator.create('a', undefined, 'footer__item-link');
    footerItemAboutLink.textContent = 'О нас';
    footerItemAboutLink.setAttribute('href', '/about');
    footerItemAboutLink.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        event.preventDefault();
        router.navigate(target.href);
      }
    });

    const footerItemSaleLink = HtmlCreator.create('a', undefined, 'footer__item-link');
    footerItemSaleLink.textContent = 'Скидки';
    footerItemSaleLink.setAttribute('href', '/sales');
    footerItemSaleLink.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        event.preventDefault();
        router.navigate(target.href);
      }
    });

    const footerItemContactsLink = HtmlCreator.create('a', undefined, 'footer__item-link');
    footerItemContactsLink.textContent = 'Контакты';
    footerItemContactsLink.setAttribute('href', '/contacts');
    footerItemContactsLink.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        event.preventDefault();
        router.navigate(target.href);
      }
    });

    const footerNavSocial = HtmlCreator.create('nav', undefined, 'footer__nav-social');
    const footerListSocial = HtmlCreator.create('ul', undefined, 'footer__list-social', 'list-reset');
    const footerItemVk = HtmlCreator.create('li', undefined, 'footer__item-social');
    const footerItemOk = HtmlCreator.create('li', undefined, 'footer__item-social');
    const footerItemTg = HtmlCreator.create('li', undefined, 'footer__item-social');
    const footerItemVkLink = HtmlCreator.create('a', undefined, 'footer__item-social-link');
    footerItemVkLink.setAttribute('href', 'https://vk.com/');
    footerItemVkLink.setAttribute('target', '_blanck');
    const footerItemOkLink = HtmlCreator.create('a', undefined, 'footer__item-social-link');
    footerItemOkLink.setAttribute('href', 'https://ok.ru/');
    footerItemOkLink.setAttribute('target', '_blanck');
    const footerItemTgLink = HtmlCreator.create('a', undefined, 'footer__item-social-link');
    footerItemTgLink.setAttribute('href', 'https://web.telegram.org/k/');
    footerItemTgLink.setAttribute('target', '_blanck');
    const footerItemVkLinkImage = HtmlCreator.create('img', undefined, 'footer__item-image');
    footerItemVkLinkImage.setAttribute('src', '../assets/icons/vk.svg');
    footerItemVkLinkImage.setAttribute('alt', 'Вконтакте');
    const footerItemOkLinkImage = HtmlCreator.create('img', undefined, 'footer__item-image');
    footerItemOkLinkImage.setAttribute('src', '../assets/icons/ok.svg');
    footerItemOkLinkImage.setAttribute('alt', 'Одноклассники');
    const footerItemTgLinkImage = HtmlCreator.create('img', undefined, 'footer__item-image');
    footerItemTgLinkImage.setAttribute('src', '../assets/icons/tg.svg');
    footerItemTgLinkImage.setAttribute('alt', 'Телеграмм');

    this.footer.append(container);
    container.append(footerWrapper);
    footerWrapper.append(footerDscr, footerNavSocial, footerNav);

    footerDscr.append(footerTitleLink, footerTxt);

    footerNav.append(footerList);
    footerList.append(footerItemCatalog, footerItemAbout, footerItemSale, footerItemContacts);
    footerNavSocial.append(footerListSocial);
    footerListSocial.append(footerItemOk, footerItemVk, footerItemTg);

    footerItemCatalog.append(footerItemCatalogLink);
    footerItemAbout.append(footerItemAboutLink);
    footerItemSale.append(footerItemSaleLink);
    footerItemContacts.append(footerItemContactsLink);

    footerItemOk.append(footerItemOkLink);
    footerItemVk.append(footerItemVkLink);
    footerItemTg.append(footerItemTgLink);
    footerItemOkLink.append(footerItemOkLinkImage);
    footerItemVkLink.append(footerItemVkLinkImage);
    footerItemTgLink.append(footerItemTgLinkImage);

    return this.footer;
  }
}

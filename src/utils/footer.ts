import HtmlCreator from './html';
import { router } from './router';

export default class Footer {
  public footer: HTMLElement;
  constructor() {
    this.footer = HtmlCreator.create('footer', undefined, 'footer');
  }

  public getHTML(): HTMLElement {
    const container = HtmlCreator.create('div', undefined, 'container');
    const footerWrapper = HtmlCreator.create('div', undefined, 'footer__wrapper');
    const footerTitleLink = HtmlCreator.create('a', undefined, 'footer__title');
    footerTitleLink.setAttribute('href', '/main');
    footerTitleLink.textContent = 'MyBOOK';

    // footerTitleLink.addEventListener('click', (event) => {
    //   const target = event.target;
    //   if (target instanceof HTMLAnchorElement) {
    //     event.preventDefault();
    //     router.navigate(target.href);
    //   }
    // });

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

    this.footer.append(container);
    container.append(footerWrapper);
    footerWrapper.append(footerTitleLink);
    footerWrapper.append(footerTitleLink, footerNav);

    footerNav.append(footerList);
    footerList.append(footerItemCatalog, footerItemAbout, footerItemSale, footerItemContacts);

    footerItemCatalog.append(footerItemCatalogLink);
    footerItemAbout.append(footerItemAboutLink);
    footerItemSale.append(footerItemSaleLink);
    footerItemContacts.append(footerItemContactsLink);

    return this.footer;
  }
}

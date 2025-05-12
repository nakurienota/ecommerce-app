import HtmlCreator from './html';
// import '_header.scss';

export default class Header {
  public header: HTMLElement;
  constructor() {
    this.header = HtmlCreator.create('header', undefined, 'header');
  }

  public getHTML(): HTMLElement {
    const container = HtmlCreator.create('div', undefined, 'container');
    const headerWrapper = HtmlCreator.create('div', undefined, 'header__wrapper');
    const headerTitleLink = HtmlCreator.create('a', undefined, 'header__link');
    headerTitleLink.setAttribute('href', '/main');
    const headerTitle = HtmlCreator.create('h1', undefined, 'header__title');
    headerTitle.textContent = 'MyBOOK';

    const headerNav = HtmlCreator.create('nav', undefined, 'header__nav');
    const headerList = HtmlCreator.create('ul', undefined, 'header__list', 'list-reset');
    const headerItemCatalog = HtmlCreator.create('li', undefined, 'header__item');
    const headerItemAbout = HtmlCreator.create('li', undefined, 'header__item');
    const headerItemSale = HtmlCreator.create('li', undefined, 'header__item');
    const headerItemContacts = HtmlCreator.create('li', undefined, 'header__item');

    const headerItemCatalogLink = HtmlCreator.create('a', undefined, 'header__item-link');
    headerItemCatalogLink.textContent = 'Каталог';
    headerItemCatalogLink.setAttribute('href', '/catalog');
    const headerItemAboutLink = HtmlCreator.create('a', undefined, 'header__item-link');
    headerItemAboutLink.textContent = 'О нас';
    headerItemAboutLink.setAttribute('href', '/about');
    const headerItemSaleLink = HtmlCreator.create('a', undefined, 'header__item-link');
    headerItemSaleLink.textContent = 'Скидки';
    headerItemSaleLink.setAttribute('href', '/sales');
    const headerItemContactsLink = HtmlCreator.create('a', undefined, 'header__item-link');
    headerItemContactsLink.textContent = 'Контакты';
    headerItemContactsLink.setAttribute('href', '/contacts');

    const headerButtonWrapper = HtmlCreator.create('div', undefined, 'header__btn-wrapper');
    const headerButtonLogin = HtmlCreator.create('a', undefined, 'header__btn', 'header__btn-login');
    headerButtonLogin.textContent = 'Вход';
    headerButtonLogin.setAttribute('href', '/login');
    const headerButtonReg = HtmlCreator.create('a', undefined, 'header__btn', 'header__btn-registration');
    headerButtonReg.textContent = 'Регистрация';
    headerButtonReg.setAttribute('href', '/registration');
    const headerButtonBasket = HtmlCreator.create('a', undefined, 'header__btn', 'header__btn-basket');
    headerButtonBasket.textContent = 'Корзина';
    headerButtonBasket.setAttribute('href', '/basket');

    this.header.append(container);
    container.append(headerWrapper);
    headerWrapper.append(headerTitleLink);
    headerWrapper.append(headerTitleLink, headerNav, headerButtonWrapper);
    headerTitleLink.append(headerTitle);

    headerNav.append(headerList);
    headerList.append(headerItemCatalog, headerItemAbout, headerItemSale, headerItemContacts);

    headerItemCatalog.append(headerItemCatalogLink);
    headerItemAbout.append(headerItemAboutLink);
    headerItemSale.append(headerItemSaleLink);
    headerItemContacts.append(headerItemContactsLink);

    headerButtonWrapper.append(headerButtonLogin, headerButtonReg, headerButtonBasket);

    return this.header;
  }
}

import HtmlCreator from '@utils/html';

import ProfileAccountEdit from '../../components/edit-profile/edit-profile';
import ProfileAccount from '../../components/profile-account/profile-account';
import ProfileAddress from '../../components/profile-address/profile-address';
import ProfileOrders from '../../components/profile-orders/profile-orders';
import ProfilePassword from '../../components/profile-password.ts/profile-password';

export default class ProfilePage {
  public container: HTMLElement;
  public mainContent: HTMLElement | undefined;
  private contents = {
    account: ProfileAccount,
    accountEdit: ProfileAccountEdit,
    addresses: ProfileAddress,
    orders: ProfileOrders,
    password: ProfilePassword,
  };

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const profileWrapper = HtmlCreator.create('div', undefined, 'profile', 'profile__wrapper');
    const profileBody = HtmlCreator.create('div', undefined, 'profile__body');
    const profileTitle = HtmlCreator.create('h2', undefined, 'profile__title');
    const sidebar = HtmlCreator.create('aside', undefined, 'profile__sidebar');
    profileTitle.textContent = 'Личный кабинет';
    const sidebarList = HtmlCreator.create('ul', undefined, 'profile__list');

    const sidebarItems = [
      { sidebarTitle: 'Мой аккаунт', dataPage: 'account' },
      { sidebarTitle: 'Редактировать аккаунт', dataPage: 'accountEdit' },
      { sidebarTitle: 'Мои адреса', dataPage: 'addresses' },
      { sidebarTitle: 'Мои заказы', dataPage: 'orders' },
      { sidebarTitle: 'Смена пароля', dataPage: 'password' },
    ];

    const sidebarElements: HTMLElement[] = [];

    sidebarItems.forEach(({ sidebarTitle, dataPage }) => {
      const sidebarItem = HtmlCreator.create('li', undefined, 'profile__item');
      const sidebarLink = HtmlCreator.create('a', undefined, 'profile__link');
      sidebarItem.dataset.page = dataPage;
      sidebarLink.textContent = sidebarTitle;
      sidebarElements.push(sidebarItem);

      sidebarItem.addEventListener('click', (event) => {
        event.preventDefault();
        const page = sidebarItem.dataset.page;

        type ContentKey = keyof typeof this.contents;

        const isContentKey = (key: string | undefined): key is ContentKey => {
          return key !== undefined && key in this.contents;
        };

        if (page && isContentKey(page) && this.mainContent) {
          this.mainContent.replaceChildren();
          const activePage = this.contents[page];
          this.mainContent.append(new activePage().getHTML());

          sidebarElements.forEach((element) => element.classList.remove('profile__item-active'));
          sidebarItem.classList.add('profile__item-active');
        }
      });

      sidebarItem.append(sidebarLink);
      sidebarList.append(sidebarItem);
    });

    this.mainContent = HtmlCreator.create('div', undefined, 'profile__content');
    this.container.append(profileWrapper);
    profileWrapper.append(profileTitle, profileBody);
    profileBody.append(sidebar, this.mainContent);
    sidebar.append(sidebarList);

    if (sidebarElements.length > 0 && this.mainContent) {
      const firstItem = sidebarElements[0];
      const firstPage = this.contents.account;

      firstItem.classList.add('profile__item-active');

      this.mainContent.append(new firstPage().getHTML());
    }

    return this.container;
  }
}

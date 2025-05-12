import ErrorPage from '../pages/404/404';
import AboutPage from '../pages/about/about';
import BasketPage from '../pages/basket/basket';
import CatalogPage from '../pages/catalog/catalog';
import ContactsPage from '../pages/contaсts/contacts';
import LoginPage from '../pages/login/login';
import MainPage from '../pages/main/main';
import RegistrationPage from '../pages/registration/registration';
import SalesPage from '../pages/sales/sales';

import HtmlCreator from './html';

type RoutesType = {
  [path: string]: HTMLElement;
};

export const routes: RoutesType = {
  '/': new MainPage().getHTML(),
  '/about': new AboutPage().getHTML(),
  '/basket': new BasketPage().getHTML(),
  '/catalog': new CatalogPage().getHTML(),
  '/contacts': new ContactsPage().getHTML(),
  '/login': new LoginPage().getHTML(),
  '/main': new MainPage().getHTML(),
  '/registration': new RegistrationPage().getHTML(),
  '/sales': new SalesPage().getHTML(),
  '/404': new ErrorPage().getHTML(),
};

export default class Router {
  public routes: RoutesType;
  public container: HTMLElement;

  constructor(routes: RoutesType) {
    this.container = HtmlCreator.create('main', undefined, 'main');
    this.routes = routes;

    globalThis.addEventListener('popstate', () => {
      this.render();
    });
  }

  public render(): HTMLElement {
    this.container.replaceChildren();

    const path = globalThis.location.pathname;
    const route = routes[path] || routes['/404'];

    this.container.append(route);

    return this.container;
  }

  public navigate(path: string): HTMLElement {
    globalThis.history.pushState({}, '', path);
    return this.render();
  }
}

export const router = new Router(routes);

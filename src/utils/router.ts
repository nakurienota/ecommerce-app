import { authRequestMatcher, validTokenExists } from '@utils/security';

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

export enum AppRoutes {
  ROOT = '/',
  ABOUT = '/about',
  BASKET = '/basket',
  CATALOG = '/catalog',
  CONTACTS = '/contacts',
  LOGIN = '/login',
  MAIN = '/main',
  REGISTRATION = '/registration',
  SALES = '/sales',
  NOT_FOUND = '/404',
}

export const routes: RoutesType = {
  [AppRoutes.ROOT]: new MainPage().getHTML(),
  [AppRoutes.ABOUT]: new AboutPage().getHTML(),
  [AppRoutes.BASKET]: new BasketPage().getHTML(),
  [AppRoutes.CATALOG]: new CatalogPage().getHTML(),
  [AppRoutes.CONTACTS]: new ContactsPage().getHTML(),
  [AppRoutes.LOGIN]: new LoginPage().getHTML(),
  [AppRoutes.MAIN]: new MainPage().getHTML(),
  [AppRoutes.REGISTRATION]: new RegistrationPage().getHTML(),
  [AppRoutes.SALES]: new SalesPage().getHTML(),
  [AppRoutes.NOT_FOUND]: new ErrorPage().getHTML(),
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
    let path: string = globalThis.location.pathname;

    if (validTokenExists() && path === AppRoutes.LOGIN) {
      path = AppRoutes.MAIN;
      globalThis.history.replaceState({}, '', path);
    }

    if (!validTokenExists() && authRequestMatcher(path)) {
      path = AppRoutes.LOGIN;
      globalThis.history.replaceState({}, '', path);
    }

    const route: HTMLElement = this.routes[path] || this.routes[AppRoutes.NOT_FOUND];
    this.container.append(route);

    return this.container;
  }

  public navigate(path: string): HTMLElement {
    globalThis.history.pushState({}, '', path);
    return this.render();
  }
}

export const router = new Router(routes);

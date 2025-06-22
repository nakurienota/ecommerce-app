import { authRequestMatcher, userLoggedIn } from '@utils/security';

import ErrorPage from '../pages/404/404';
import AboutPage from '../pages/about/about';
import BasketPage from '../pages/basket/basket';
import CatalogPage from '../pages/catalog/catalog';
import ContactsPage from '../pages/contaсts/contacts';
import LoginPage from '../pages/login/login';
import MainPage from '../pages/main/main';
import ProductPage from '../pages/product/product';
import ProfilePage from '../pages/profile/profile';
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
  PRODUCT = '/product/',
  PROFILE = '/profile',
}

export const routes: RoutesType = {
  [AppRoutes.ROOT]: new MainPage().getHTML(),
  [AppRoutes.ABOUT]: new AboutPage().getHTML(),
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

  private static async matchPageDynamicData(path: string): Promise<HTMLElement | null> {
    const match: RegExpMatchArray | null = new RegExp(/^\/product\/([^/]+)$/).exec(path);
    if (match) {
      const key: string = decodeURIComponent(match[1]);
      return await new ProductPage().getHTMLAsync(key);
    }
    const matchBasket: RegExpMatchArray | null = new RegExp(/^\/basket\/?$/).exec(path);
    if (matchBasket) return await new BasketPage().getHTMLAsync();

    const matchCatalog: RegExpMatchArray | null = new RegExp(/^\/catalog\/?$/).exec(path);
    if (matchCatalog) return await new CatalogPage().getHTMLAsync();
    return null;
  }

  public async render(): Promise<HTMLElement> {
    this.container.replaceChildren();
    let path: string = globalThis.location.pathname;

    if (userLoggedIn() && path === AppRoutes.LOGIN) {
      path = AppRoutes.MAIN;
      globalThis.history.replaceState({}, '', path);
    }

    if (!userLoggedIn() && authRequestMatcher(path)) {
      path = AppRoutes.LOGIN;
      globalThis.history.replaceState({}, '', path);
    }

    const dynamicPage: HTMLElement | null = await Router.matchPageDynamicData(path);
    if (dynamicPage) {
      this.container.append(dynamicPage);
      return this.container;
    }

    if (!userLoggedIn() && path === AppRoutes.PROFILE) {
      path = AppRoutes.LOGIN;
      globalThis.history.replaceState({}, '', path);
    }

    if (userLoggedIn() && path === AppRoutes.PROFILE) {
      const dynamicProfilePage: HTMLElement = new ProfilePage().getHTML();
      this.container.append(dynamicProfilePage);
      return this.container;
    }

    const route: HTMLElement = this.routes[path] || this.routes[AppRoutes.NOT_FOUND];
    this.container.append(route);

    return this.container;
  }

  public async navigate(path: string): Promise<HTMLElement> {
    globalThis.history.pushState({}, '', path);
    return await this.render();
  }
}

export const router = new Router(routes);

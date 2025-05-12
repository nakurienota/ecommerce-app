import LoginPage from '../pages/login/login';
import MainPage from '../pages/main/main';

import HtmlCreator from './html';

type RoutesType = {
  [path: string]: HTMLElement;
};

export const routes: RoutesType = {
  '/': new MainPage().getHTML(),
  '/login': new LoginPage().getHTML(),
  '/main': new MainPage().getHTML(),
};

export default class Router {
  public routes: RoutesType;
  public container: HTMLElement;

  constructor(routes: RoutesType) {
    this.container = HtmlCreator.create('main', 'main');
    this.routes = routes;

    globalThis.addEventListener('popstate', () => {
      this.render();
    });
  }

  public render(): HTMLElement {
    this.container.replaceChildren();

    const path = globalThis.location.pathname;
    const route = routes[path];
    console.log(route);

    this.container.append(route);

    return this.container;
  }

  public navigate(path: string): HTMLElement {
    globalThis.history.pushState({}, '', path);
    return this.render();
  }
}

export const router = new Router(routes);

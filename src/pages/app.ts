import { router } from '@utils/router';

import Footer from '../components/footer/footer';
import Header from '../components/header/header';

export default class App {
  public container: HTMLElement;
  constructor() {
    this.container = document.body;
  }

  public async render(): Promise<HTMLElement> {
    this.container.append(new Header().getHTML(), await router.render(), new Footer().getHTML());

    return this.container;
  }
}

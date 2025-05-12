import Footer from '@utils/footer';
import Header from '@utils/header';
import { router } from '@utils/router';

export default class App {
  public container: HTMLElement;
  constructor() {
    this.container = document.body;
  }

  public render(): HTMLElement {
    this.container.append(new Header().getHTML(), router.render(), new Footer().getHTML());
    return this.container;
  }
}

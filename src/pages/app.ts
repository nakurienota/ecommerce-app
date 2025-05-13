import Footer from '@utils/footer';
import Header from '@utils/header';
import { router } from '@utils/router';

import type { Resthandler } from '../service/rest/resthandler';

export default class App {
  public container: HTMLElement;
  public restHandler: Resthandler;

  constructor(restHandler: Resthandler) {
    this.container = document.body;
    this.restHandler = restHandler;
  }

  public render(): HTMLElement {
    this.container.append(new Header().getHTML(), router.render(), new Footer().getHTML());
    return this.container;
  }
}

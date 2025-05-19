import HtmlCreator from '@utils/html';
import { AppRoutes, router } from '@utils/router';

export default class MainPage {
  public container: HTMLElement;
  private bannerBtn: HTMLButtonElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
    this.bannerBtn = HtmlCreator.create('button', undefined, 'button', 'banner__btn');
    this.bannerBtn.addEventListener('click', (event) => {
      event.preventDefault();
      router.navigate(AppRoutes.CATALOG);
    });
  }

  public getHTML(): HTMLElement {
    this.container.append(this.getBanner());
    return this.container;
  }

  private getBanner(): HTMLElement {
    const banner = HtmlCreator.create('section', undefined, 'section', 'banner');
    const bannerWrap = HtmlCreator.create('div', undefined, 'banner__wrapper');
    const h1 = HtmlCreator.create('h1', undefined, 'banner__heading');
    h1.textContent = 'Книжная вселенная';
    const bannerText = HtmlCreator.create('p', undefined, 'banner__text');
    bannerText.textContent = 'Огромный ассортимент книг. Ваш идеальный экземпляр уже ждет вас!';
    this.bannerBtn.textContent = 'Посмотреть книги';
    const round = HtmlCreator.create('div', undefined, 'banner__round');
    const bannerImg = HtmlCreator.create('img', undefined, 'banner__img');
    bannerImg.src = '../../assets/images/bunner.png';
    round.append(bannerImg);
    bannerWrap.append(h1, bannerText, this.bannerBtn);
    banner.append(bannerWrap, round);
    return banner;
  }
}

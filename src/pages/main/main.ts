import HtmlCreator from '@utils/html';
import { AppRoutes, router } from '@utils/router';

export default class MainPage {
  public container: HTMLElement;
  private bannerBtn: HTMLButtonElement;
  private about: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
    this.bannerBtn = HtmlCreator.create('button', undefined, 'button', 'banner__btn');
    this.bannerBtn.addEventListener('click', (event) => {
      event.preventDefault();
      router.navigate(AppRoutes.CATALOG);
    });
    this.about = HtmlCreator.create('section', undefined, 'section', 'about');
    this.createAbout();
  }

  public getHTML(): HTMLElement {
    this.container.append(this.getBanner(), this.about);
    return this.container;
  }

  private getBanner(): HTMLElement {
    const banner = HtmlCreator.create('section', undefined, 'section', 'banner');
    const bannerWrap = HtmlCreator.create('div', undefined, 'banner__wrapper');
    const h1 = HtmlCreator.create('h1', undefined, 'banner__heading');
    h1.textContent = 'MyBOOK - книжная вселенная';
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

  private createAbout(): void {
    const aboutHeading = HtmlCreator.create('h2', undefined, 'about__heading');
    aboutHeading.textContent = 'Почему выбирают именно наши книги? ';
    const aboutContent = HtmlCreator.create('div', undefined, 'about__content');
    const aboutData = [
      {
        title: 'Их много',
        text: 'Огромный выбор различных книг по психологи, развитию, мотивации.',
        link: 'many_img',
      },
      {
        title: 'Они интересны',
        text: 'Отзывы о каждой книге, не меньше 4,8 баллов.',
        link: 'interesting_img',
      },
      {
        title: 'Доступная цена',
        text: 'Максимальная цена книги - 10000 р.',
        link: 'available_img',
      },
    ];
    for (const item of aboutData) {
      const aboutWrap = HtmlCreator.create('div', undefined, 'about__wrapper');
      const aboutImg = HtmlCreator.create('div', undefined, 'about__img');
      aboutImg.style.backgroundImage = `url(../../assets/images/${item.link}.png)`;
      const aboutTitle = HtmlCreator.create('h3', undefined, 'about__title');
      aboutTitle.textContent = item.title;
      const aboutText = HtmlCreator.create('p', undefined, 'about__text');
      aboutText.textContent = item.text;
      aboutWrap.append(aboutImg, aboutTitle, aboutText);
      aboutContent.append(aboutWrap);
    }
    this.about.append(aboutHeading, aboutContent);
  }
}

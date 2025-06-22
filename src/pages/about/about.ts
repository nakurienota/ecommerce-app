import HtmlCreator from '@utils/html';

export default class AboutPage {
  public container: HTMLElement;

  constructor() {
    this.container = HtmlCreator.create('div', undefined, 'container');
  }

  public getHTML(): HTMLElement {
    const aboutWrapper = HtmlCreator.create('div', undefined, 'team', 'team__wrapper');
    const aboutTitle = HtmlCreator.create('h2', undefined, 'team__title');
    aboutTitle.textContent = 'Наша команда';

    const teamContent = HtmlCreator.create('div', undefined, 'team__content');
    const teamList = HtmlCreator.create('ul', undefined, 'team__list');

    const team = [
      {
        member: 'Сергей',
        role: 'Team Lead',
        bio: 'Студент RSSchool. Действующий Java разработчик, расширяет свои профессиональные горизонты и изучает Frontend',
        img: '../../assets/images/team-Sergey.png',
        contribution:
          'В рамках данного задания курировал направление работы команды, помогал в решении сложных технических вопросов. Реализованный функционал: страница логина, карточка товара и все что с ней связано',
        collaboration:
          'Создал и настроил репозиторий для работы, отслеживал ведение доски, описание ПР, назначал созвоны, занимался приоритизаций текущих задач в рамках спринтов',
        git: 'https://github.com/nakurienota',
      },
      {
        member: 'Ольга',
        role: 'Frontend-разработчик',
        bio: 'Студент RSSchool. Имеет глубокие теоретические знания, но не всегда успевает их применять, так как сроки немного сжаты)',
        img: '../../assets/images/team-Olga.jpg',
        contribution:
          'Охотно бралась за задачи и с радостью их выполняла. Реализованный функционал: конфигурации для проекта, каталог товаров, адаптивный дизайн страниц',
        collaboration:
          'Активно применяла инструменты совместной работы — системы контроля версий Git и коммуникационные платформы, например Telegram и Discord, что обеспечивало прозрачность процессов и удобство обмена информацией',
        git: 'https://github.com/olga-ter',
      },
      {
        member: 'Иван',
        role: 'Frontend-разработчик',
        bio: 'Студент RSSchool. Пытается научиться и понять, как нужно программировать у более опытных коллег',
        img: '../../assets/images/team-Ivan.jpg',
        contribution: 'Реализованный функционал: роутинг проекта, страница регистрации, страница профиля',
        collaboration: 'Познавал инструменты командной разработки, писал в общем чате и личных сообщениях свои вопросы',
        git: 'https://github.com/IvanK9',
      },
      {
        member: 'Денис',
        role: 'Гуру, ментор и просто замечательный человек',
        bio: 'Действующий Frontend-разработчик, который не против поделиться своим опытом и рассказать интересные истории',
        img: '../../assets/images/sing_in.webp',
        contribution: 'Проверял Pull Request и проводил качественное code-review',
        collaboration:
          'Активно участвовал в созвонах и общем чате, давал рекомендации по коду и просто отвечал на все вопросы',
        git: 'https://github.com/degusar',
      },
    ];

    function createWrapper(label: string, content: string): HTMLDivElement {
      const itemWrapper = HtmlCreator.create('div', undefined, 'team__item-wrapper');
      const itemLabel = HtmlCreator.create('label', undefined, 'team__item-label');
      itemLabel.textContent = label;
      const itemContent = HtmlCreator.create('span', undefined, 'team__item-content');
      itemContent.textContent = content;

      itemWrapper.append(itemLabel, itemContent);

      return itemWrapper;
    }

    team.forEach(({ member, role, bio, img, contribution, collaboration, git }) => {
      const item = HtmlCreator.create('li', undefined, 'team__item');
      const itemImage = HtmlCreator.create('div', undefined, 'team__item-img');
      itemImage.style.backgroundImage = `url('${img}')`;
      const itemBox = HtmlCreator.create('div', undefined, 'team__item-box');
      const itemMember = createWrapper('Член команды', member);
      const itemRole = createWrapper('Роль', role);
      const itemBio = createWrapper('Биография', bio);
      const itemСontribution = createWrapper('Основной вклад', contribution);
      const itemCollaboration = createWrapper('Сотрудничество', collaboration);
      const itemLink = HtmlCreator.create('a', undefined, 'team__item-link');
      itemLink.href = git;
      itemLink.textContent = 'GitHub';

      item.append(itemImage, itemBox);
      itemBox.append(itemMember, itemRole, itemBio, itemСontribution, itemCollaboration, itemLink);
      teamList.append(item);
    });

    const footer = HtmlCreator.create('footer', undefined, 'team__footer');
    const footerWrapper = HtmlCreator.create('div', undefined, 'team__footer-wrapper');
    const footerText = HtmlCreator.create('p', undefined, 'team__footer-text');
    footerText.textContent =
      'Если хотите собрать такую же крутую команду, Вы можете просто кликнуть на логотип ниже и узнать все подробности';
    const footerLink = HtmlCreator.create('a', undefined, 'team__footer-link');
    footerLink.href = 'https://rs.school/courses/javascript-ru';
    footerLink.target = '_blank';
    const footerImg = HtmlCreator.create('img', undefined, 'team__footer-img');
    footerImg.src = '../../assets/images/rs-school-logo.svg';

    this.container.append(aboutWrapper);
    aboutWrapper.append(aboutTitle, teamContent, footer);
    teamContent.append(teamList);
    footer.append(footerWrapper);
    footerWrapper.append(footerText, footerLink);
    footerLink.append(footerImg);

    return this.container;
  }
}

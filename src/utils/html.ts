const HtmlCreator = {
  create<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    id?: string,
    ...classNames: string[]
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);

    if (id) {
      element.id = id;
    }

    if (classNames?.length > 0) {
      element.classList.add(...classNames);
    }

    return element;
  },
};

export function showNotification(message: string, type: 'success' | 'error' = 'success'): void {
  const notification: HTMLDivElement = HtmlCreator.create('div', undefined, 'notification-modal');
  notification.textContent = message;

  Object.assign(notification.style, {
    backgroundColor: type === 'success' ? '$primary-blue' : '#f44336',
  });

  document.body.append(notification);

  requestAnimationFrame(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 1000);
}

export default HtmlCreator;

class HtmlCreator {
    static create<K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        id?: string,
        ...classNames: string[]
    ): HTMLElementTagNameMap[K] {
        const element = document.createElement(tagName);
        if (id) element.id = id;
        if (classNames) element.classList.add(...classNames);
        return element;
    }
}

export default HtmlCreator;

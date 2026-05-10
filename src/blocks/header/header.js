import { BaseComponent } from '../../base-component.js';

export class Header extends BaseComponent {
  constructor() {
    super({ 
      logo: '🏆 BRACKET.GG',
      navItems: [
        { path: 'tournaments', label: 'Турниры' },
        { path: 'rating', label: 'Рейтинг' },
        { path: 'about', label: 'О нас' }
      ]
    });
    this.isMenuOpen = false;
  }

  render() {
    this.element = document.createElement('header');
    this.element.className = 'header';
    
    // Получаем текущий хэш без символа #
    const currentHash = window.location.hash.slice(1) || 'tournaments';

    const navItemsHtml = this.props.navItems.map(item => `
      <li class="header__item">
        <a href="#${item.path}" 
           class="header__link ${item.path === currentHash ? 'active' : ''}" 
           data-path="${item.path}">
          ${item.label}
        </a>
      </li>
    `).join('');

    this.element.innerHTML = `
      <div class="header__container">
        <a href="#tournaments" class="header__logo">${this.props.logo}</a>
        
        <button class="header__burger" aria-label="Меню">
          <span></span><span></span><span></span>
        </button>

        <nav class="header__nav ${this.isMenuOpen ? 'header__nav--active' : ''}">
          <ul class="header__list">${navItemsHtml}</ul>
        </nav>
      </div>
    `;

    this.attachEvents();
    return this.element;
  }

  attachEvents() {
    const burger = this.element.querySelector('.header__burger');
    const nav = this.element.querySelector('.header__nav');
    
    // Бургер меню
    if (burger) {
      burger.addEventListener('click', () => {
        this.isMenuOpen = !this.isMenuOpen;
        nav.classList.toggle('header__nav--active', this.isMenuOpen);
        burger.classList.toggle('header__burger--active', this.isMenuOpen);
      });
    }

    // Слушаем изменение хэша во всем окне
    window.addEventListener('hashchange', () => {
      this.updateActiveLink();
    });

    // Сразу обновляем при инициализации (на случай если хэш уже есть в URL)
    this.updateActiveLink();
  }

  // Метод для переключения активного класса
  updateActiveLink() {
    const currentHash = window.location.hash.slice(1) || 'tournaments';
    const links = this.element.querySelectorAll('.header__link');
    
    links.forEach(link => {
      // Если путь ссылки совпадает с текущим хэшем - добавляем класс active, иначе убираем
      if (link.dataset.path === currentHash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}
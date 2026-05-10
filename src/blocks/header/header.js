// src/blocks/header/header.js
import { BaseComponent } from '../../base-component.js';

export class Header extends BaseComponent {
  constructor(router) {
    super({
      logoText: '🏆 BRACKET.GG',
      navItems: [
        { path: 'tournaments', label: 'Турниры' },
        { path: 'rating', label: 'Рейтинг' },
        { path: 'about', label: 'О нас' }
      ]
    });
    this.router = router;
    this.isMenuOpen = false;
  }

  render() {
    this.element = document.createElement('header');
    this.element.className = 'header';
    
    const currentHash = window.location.hash.slice(1) || 'tournaments';

    const navItemsHtml = this.props.navItems.map(item => `
      <li class="header__item">
        <a href="#${item.path}" 
           class="header__link ${item.path === currentHash ? 'header__link--active' : ''}" 
           data-path="${item.path}">
          ${item.label}
        </a>
      </li>
    `).join('');

    this.element.innerHTML = `
      <div class="header__container">
        <a href="#tournaments" class="header__logo">${this.props.logoText}</a>
        
        <button class="header__burger" aria-label="Открыть меню" aria-expanded="${this.isMenuOpen}">
          <span class="header__burger-line"></span>
        </button>
        
        <nav class="header__nav ${this.isMenuOpen ? 'header__nav--active' : ''}">
          <ul class="header__list">${navItemsHtml}</ul>
          <a href="#tournaments" class="header__auth-btn">Создать турнир</a>
        </nav>
      </div>
    `;

    this.attachEvents();
    return this.element;
  }

  attachEvents() {
    const burger = this.element.querySelector('.header__burger');
    const nav = this.element.querySelector('.header__nav');
    const links = this.element.querySelectorAll('.header__link');

    // Бургер-меню
    burger.addEventListener('click', () => {
      this.isMenuOpen = !this.isMenuOpen;
      nav.classList.toggle('header__nav--active', this.isMenuOpen);
      burger.classList.toggle('header__burger--active', this.isMenuOpen);
      burger.setAttribute('aria-expanded', this.isMenuOpen);
    });

    // Закрытие меню при клике на ссылку
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        if (this.isMenuOpen) {
          this.isMenuOpen = false;
          nav.classList.remove('header__nav--active');
          burger.classList.remove('header__burger--active');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Обновление активного состояния при изменении роута
    window.addEventListener('hashchange', () => {
      this.updateActiveLink();
    });
  }

  updateActiveLink() {
    const currentHash = window.location.hash.slice(1) || 'tournaments';
    this.element.querySelectorAll('.header__link').forEach(link => {
      link.classList.toggle('header__link--active', link.dataset.path === currentHash);
    });
  }
}
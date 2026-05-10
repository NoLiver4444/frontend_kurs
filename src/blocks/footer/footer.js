// src/blocks/footer/footer.js
import { BaseComponent } from '../../base-component.js';

export class Footer extends BaseComponent {
  constructor() {
    super();
    this.year = new Date().getFullYear();
  }

  render() {
    this.element = document.createElement('footer');
    this.element.className = 'footer';
    
    this.element.innerHTML = `
      <div class="footer__container">
        <div class="footer__top">
          <div class="footer__brand">
            <a href="#tournaments" class="footer__logo">🏆 BRACKET.GG</a>
            <p class="footer__desc">Клиентская часть веб-приложения для ведения турнирных сеток</p>
          </div>
          
          <div class="footer__nav">
            <h4 class="footer__title">Навигация</h4>
            <ul class="footer__list">
              <li><a href="#tournaments">Турниры</a></li>
              <li><a href="#rating">Рейтинг</a></li>
              <li><a href="#about">О проекте</a></li>
            </ul>
          </div>

          <div class="footer__tech">
            <h4 class="footer__title">Технологии</h4>
            <ul class="footer__list">
              <li>JavaScript ES6+</li>
              <li>CSS3 / Flexbox / Grid</li>
              <li>PandaScore API</li>
              <li>Vite Build</li>
            </ul>
          </div>
        </div>
        
        <div class="footer__bottom">
          <p>© ${this.year} Bracket.GG. Курсовая работа.</p>
          <p>Powered by <a href="https://pandascore.co" target="_blank">PandaScore API</a></p>
        </div>
      </div>
    `;

    return this.element;
  }
}
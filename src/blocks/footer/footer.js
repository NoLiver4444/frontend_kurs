// src/blocks/footer/footer.js
import { BaseComponent } from '../../base-component.js';

export class Footer extends BaseComponent {
  constructor(props = {}) {
    super(props);
  }

  render() {
    this.element = document.createElement('footer');
    this.element.className = 'footer';

    this.element.innerHTML = `
      <div class="footer__container">
        <div class="footer__main">
          <div class="footer__brand">
            <span class="footer__logo">🏆 BRACKET.GG</span>
            <p class="footer__description">
              Клиентская часть веб-приложения для автоматизированного ведения турнирных сеток.
              Разработано в рамках курсовой работы по дисциплине «Фронтенд-разработка».
            </p>
          </div>
          
          <div class="footer__links">
            <div class="footer__links-group">
              <h4 class="footer__links-title">Навигация</h4>
              <ul class="footer__links-list">
                <li><a href="#tournaments">Турниры</a></li>
                <li><a href="#bracket">Сетка</a></li>
                <li><a href="#rating">Рейтинг</a></li>
                <li><a href="#about">О нас</a></li>
              </ul>
            </div>
            <div class="footer__links-group">
              <h4 class="footer__links-title">Дисциплины</h4>
              <ul class="footer__links-list">
                <li><a href="#tournaments" data-game="cs-2">CS2</a></li>
                <li><a href="#tournaments" data-game="dota-2">Dota 2</a></li>
                <li><a href="#tournaments" data-game="lol">LoL</a></li>
                <li><a href="#tournaments" data-game="valorant">Valorant</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer__bottom">
          <p class="footer__copyright">© <span id="current-year"></span> Bracket.GG. Курсовая работа Никифоров Д.А.</p>
          <p class="footer__powered">Powered by <a href="https://pandascore.co" target="_blank" rel="noopener">PandaScore API</a></p>
        </div>
      </div>
    `;

    return this.element;
  }
}
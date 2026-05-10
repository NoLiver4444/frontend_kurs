// src/blocks/about/about.js
import { BaseComponent } from '../../base-component.js';

export class About extends BaseComponent {
  constructor() {
    super();
  }

  render() {
    this.element = document.createElement('section');
    this.element.className = 'about-page';

    this.element.innerHTML = `
      <div class="about__container">
        <h1 class="about__title">О проекте Bracket.GG</h1>
        
        <div class="about__intro">
          <p class="about__text">
            Это клиентское веб-приложение для автоматизированного ведения турнирных сеток киберспортивных дисциплин. 
            Проект разработан в рамках курсовой работы и демонстрирует навыки работы с современными веб-технологиями и внешними API.
          </p>
        </div>

        <div class="about__features">
          <div class="feature-card">
            <div class="feature-icon">🎮</div>
            <h3>Мультплатформенность</h3>
            <p>Поддержка CS2, Dota 2, League of Legends, Valorant и StarCraft 2.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Real-time данные</h3>
            <p>Интеграция с PandaScore API для получения актуальной статистики.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Умный рейтинг</h3>
            <p>Алгоритм ранжирования команд на основе результатов матчей и тира турниров.</p>
          </div>
        </div>

        <div class="about__stack">
          <h2 class="about__section-title">Использованный стек технологий</h2>
          <div class="tech-grid">
            <div class="tech-item">JavaScript (ES6+)</div>
            <div class="tech-item">CSS3 (Grid, Flex, Animations)</div>
            <div class="tech-item">Vite Build Tool</div>
            <div class="tech-item">REST API (Fetch)</div>
            <div class="tech-item">OOP Architecture</div>
            <div class="tech-item">BEM Methodology</div>
          </div>
        </div>

        <div class="about__author">
          <h2 class="about__section-title">Разработчик</h2>
          <div class="author-card">
            <div class="author-avatar">👨‍💻</div>
            <div class="author-info">
              <h3>Никифоров Дмитрий Александрович</h3>
              <p>Группа: ИКБО-14-24</p>
              <p>Университет: РТУ МИРЭА</p>
              <p>Дисциплина: Фронтенд-разработка</p>
            </div>
          </div>
        </div>
      </div>
    `;

    return this.element;
  }
}
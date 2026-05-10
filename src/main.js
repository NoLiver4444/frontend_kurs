// src/main.js
import './index.css';
import './blocks/header/header.css';
import './blocks/bracket/bracket.css';
import './blocks/rating/rating.css';
import './blocks/footer/footer.css'; // <-- Подключили стили футера
import './blocks/about/about.css';    // <-- Подключили стили "О нас"

import { Header } from './blocks/header/header.js';
import { Footer } from './blocks/footer/footer.js'; // <-- Импорт
import { Bracket } from './blocks/bracket/bracket.js';
import { Rating } from './blocks/rating/rating.js';
import { About } from './blocks/about/about.js';    // <-- Импорт

document.addEventListener('DOMContentLoaded', () => {
  const headerContainer = document.querySelector('.header-container');
  const footerContainer = document.querySelector('.footer-container');
  const appContainer = document.getElementById('app');

  // 1. Рендерим Хедер
  if (headerContainer) {
    const header = new Header();
    headerContainer.appendChild(header.render());
  }

  // 2. Рендерим Футер (ОДИН РАЗ при старте)
  if (footerContainer) {
    const footer = new Footer();
    footerContainer.appendChild(footer.render());
  }

  // 3. Роутинг
  const renderPage = () => {
    appContainer.innerHTML = ''; // Очищаем только контент
    const hash = window.location.hash.slice(1) || 'tournaments';

    if (hash === 'rating') {
      const ratingPage = new Rating();
      appContainer.appendChild(ratingPage.render());
      ratingPage.init();
    } else if (hash === 'about') {
      // <-- Добавили страницу About
      const aboutPage = new About();
      appContainer.appendChild(aboutPage.render());
    } else {
      const bracketPage = new Bracket();
      bracketPage.init();
      appContainer.appendChild(bracketPage.element);
    }
  };

  window.addEventListener('hashchange', renderPage);
  renderPage();
});
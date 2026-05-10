import './index.css';
import './blocks/header/header.css';
import './blocks/bracket/bracket.css';

import { Header } from './blocks/header/header.js';
import { Bracket } from './blocks/bracket/bracket.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Динамический год в футере
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Рендер хедера
  const headerContainer = document.querySelector('.header-container');
  if (headerContainer) {
    const header = new Header();
    headerContainer.appendChild(header.render());
  }

  // 3. Рендер турнирной сетки (ИСПРАВЛЕНО)
  const appContainer = document.getElementById('app');
  if (appContainer) {
    const bracket = new Bracket();
    
    // ✅ СНАЧАЛА инициализируем (создаем элемент внутри init)
    bracket.init(); 
    
    // ✅ ПОТОМ вставляем в DOM (когда элемент уже существует)
    bracket.appendTo(appContainer);
  }
});
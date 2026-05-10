// src/blocks/rating/rating.js
import { BaseComponent } from '../../base-component.js';
import { fetchTeamsByGame } from '../../api/api.js';

export class Rating extends BaseComponent {
  constructor() {
    super();
    this.teams = [];
    this.isLoading = false;
    this.activeGame = 'cs2';
  }

  async init() {
    console.log('🚀 Rating.init() для:', this.activeGame);
    this.isLoading = true;
    
    // Показываем лоадер
    if (!this.element) {
      this.element = this.render();
    } else {
      this.updateContent(); // Обновляем существующий
    }
    
    try {
      const teamsData = await fetchTeamsByGame(this.activeGame);
      console.log('✅ Получено команд:', teamsData.length);
      this.teams = teamsData || [];
    } catch (err) {
      console.error('❌ Ошибка:', err);
      this.teams = [];
    }

    this.isLoading = false;
    this.updateContent(); // Обновляем с данными
  }

  // Новый метод для обновления контента
  updateContent() {
    if (!this.element) {
      this.element = this.render();
      return this.element;
    }

    // Находим контейнер с таблицей и обновляем его
    const filtersHtml = `
      <div class="rating__filters">
        <button class="filter-btn ${this.activeGame === 'cs2' ? 'active' : ''}" data-game="cs2">CS2</button>
        <button class="filter-btn ${this.activeGame === 'dota-2' ? 'active' : ''}" data-game="dota-2">Dota 2</button>
        <button class="filter-btn ${this.activeGame === 'lol' ? 'active' : ''}" data-game="lol">LoL</button>
        <button class="filter-btn ${this.activeGame === 'valorant' ? 'active' : ''}" data-game="valorant">Valorant</button>
        <button class="filter-btn ${this.activeGame === 'starcraft-2' ? 'active' : ''}" data-game="starcraft-2">StarCraft 2</button>      
    </div>
    `;

    let contentHtml = '';

    if (this.isLoading) {
      contentHtml = `<div class="loader">Загрузка рейтинга...</div>`;
    } else if (!this.teams || this.teams.length === 0) {
      contentHtml = `
        <div class="empty-state">
          <p>Нет данных по командам для "${this.activeGame}"</p>
          <button class="retry-btn" data-action="retry">🔄 Обновить</button>
        </div>
      `;
    } else {
      const rows = this.teams.map(team => `
        <tr class="rating__row">
          <td class="rating__cell rating__cell--rank">
            <span class="rank-badge ${team.rank <= 3 ? 'rank-badge--top' : ''}">${team.rank}</span>
          </td>
          <td class="rating__cell rating__cell--team">
            <div class="team-info">
              ${team.logo ? `<img src="${team.logo}" alt="${team.name}" class="team-logo">` : ''}
              <span class="team-name">${team.name}</span>
            </div>
          </td>
          <td class="rating__cell rating__cell--points">${team.points}</td>
          <td class="rating__cell rating__cell--winrate">
            <div class="progress-bar">
              <div class="progress-bar__fill" style="width: ${team.winrate}%"></div>
            </div>
            <span class="winrate-text">${team.winrate}%</span>
          </td>
        </tr>
      `).join('');

      contentHtml = `
        <div class="rating__table-wrapper">
          <table class="rating__table">
            <thead>
              <tr>
                <th class="rating__th">#</th>
                <th class="rating__th">Команда</th>
                <th class="rating__th">Очки</th>
                <th class="rating__th">Винрейт</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `;
    }

    // Обновляем содержимое элемента
    this.element.innerHTML = `
      <h1 class="rating__title">Мировой Рейтинг Команд</h1>
      ${filtersHtml}
      ${contentHtml}
    `;

    // Навешиваем события на кнопки
    this.element.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const game = e.target.dataset.game;
        if (game && game !== this.activeGame) {
          this.activeGame = game;
          await this.init();
        }
      });
    });

    // Кнопка повторной попытки
    const retryBtn = this.element.querySelector('[data-action="retry"]');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => this.init());
    }

    return this.element;
  }

  render() {
    console.log('🎨 Rating.render() вызван');
    this.element = document.createElement('section');
    this.element.className = 'rating';
    return this.updateContent();
  }
}
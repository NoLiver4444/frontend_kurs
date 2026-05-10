import { BaseComponent } from '../../base-component.js';
import { fetchTournaments, fetchTournamentMatches } from '../../api/api.js';

export class Bracket extends BaseComponent {
  constructor() {
    super({ title: 'Активные турниры', filter: 'cs-2' });
    this.tournaments = [];
    this.currentTournament = null;
    this.matches = [];
    this.isLoading = false;
    this.error = null;
    this.viewMode = 'list'; // 'list' или 'bracket'
  }

  async init() {
    this.isLoading = true;
    this.render();
    
    try {
      if (this.viewMode === 'list') {
        this.tournaments = await fetchTournaments(this.props.filter);
      } else if (this.viewMode === 'bracket' && this.currentTournament) {
        this.matches = await fetchTournamentMatches(this.currentTournament.id);
      }
      this.error = null;
    } catch (err) {
      this.error = err.message || 'Не удалось загрузить данные';
      console.error(err);
    }
    
    this.isLoading = false;
    this.render();
  }

  async showTournamentBracket(tournament) {
    this.currentTournament = tournament;
    this.viewMode = 'bracket';
    await this.init();
  }

  showTournamentsList() {
    this.currentTournament = null;
    this.matches = [];
    this.viewMode = 'list';
    this.render();
    this.init();
  }

  render() {
    if (!this.element) {
      this.element = document.createElement('section');
      this.element.className = 'bracket';
    }

    if (this.isLoading && (this.viewMode === 'list' ? this.tournaments.length === 0 : this.matches.length === 0)) {
      this.element.innerHTML = '<div class="loader">Загрузка...</div>';
      return this.element;
    }

    if (this.error) {
      this.element.innerHTML = `
        <div class="error-msg">❌ ${this.error}</div>
        <button class="retry-btn" data-action="retry">🔄 Повторить</button>
      `;
      this.element.querySelector('.retry-btn').addEventListener('click', () => this.init());
      return this.element;
    }

    if (this.viewMode === 'bracket' && this.currentTournament) {
      return this.renderBracketView();
    } else {
      return this.renderTournamentsList();
    }
  }

  renderTournamentsList() {
    const filtersHtml = `
      <div class="bracket__filters">
        <button class="filter-btn ${this.props.filter === 'cs-2' ? 'active' : ''}" data-game="cs-2">CS2</button>
        <button class="filter-btn ${this.props.filter === 'dota-2' ? 'active' : ''}" data-game="dota-2">Dota 2</button>
        <button class="filter-btn ${this.props.filter === 'lol' ? 'active' : ''}" data-game="lol">LoL</button>
        <button class="filter-btn ${this.props.filter === 'valorant' ? 'active' : ''}" data-game="valorant">Valorant</button>
        <button class="filter-btn ${this.props.filter === 'starcraft-2' ? 'active' : ''}" data-game="starcraft-2">StarCraft 2</button>
      </div>
    `;

    let html = `<h2 class="bracket__title">${this.props.title}</h2>${filtersHtml}`;

    if (this.tournaments.length === 0) {
      html += `<div class="empty-state">Нет активных турниров для выбранной игры</div>`;
    } else {
      html += `<div class="tournaments-grid">`;
      this.tournaments.forEach(t => {
        const statusClass = {
          running: 'status--live',
          completed: 'status--done',
          pending: 'status--upcoming'
        }[t.status] || 'status--upcoming';
        
        const statusText = {
          running: '🔴 LIVE',
          completed: '✅ Завершён',
          pending: '⏳ Скоро'
        }[t.status] || t.status;

        const prize = t.prizepool ? `🏆 ${t.prizepool}` : '';

        html += `
          <article class="tournament-card">
            <div class="card__header">
              <h3 class="card__name">${t.name}</h3>
              <span class="card__status ${statusClass}">${statusText}</span>
            </div>
            <div class="card__game">🎮 ${t.game} ${t.league ? `• ${t.league}` : ''}</div>
            <div class="card__meta">
              <span>👥 ${t.teams_count} команд</span>
              ${t.begin_at ? `<span>📅 ${new Date(t.begin_at).toLocaleDateString('ru-RU')}</span>` : ''}
            </div>
            ${prize ? `<div class="card__prize">${prize}</div>` : ''}
            <button class="card__btn" data-action="view-bracket" data-id="${t.id}" ${!t.has_bracket ? 'disabled' : ''}>
              ${t.has_bracket ? 'Открыть сетку' : 'Сетка скоро'}
            </button>
          </article>
        `;
      });
      html += `</div>`;
    }

    this.element.innerHTML = html;

    // Фильтры
    this.element.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const game = e.target.dataset.game;
        if (game && game !== this.props.filter) {
          this.props.filter = game;
          this.init();
        }
      });
    });

    // Кнопки просмотра сетки
    this.element.querySelectorAll('[data-action="view-bracket"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        const tournament = this.tournaments.find(t => t.id == id);
        if (tournament && tournament.has_bracket) {
          await this.showTournamentBracket(tournament);
        }
      });
    });

    return this.element;
  }

  renderBracketView() {
    // Группируем матчи по раундам
    const rounds = this.groupMatchesByRound(this.matches);
    
    // Определяем названия раундов
    const roundNames = {
      'quarterfinals': 'Четвертьфинал',
      'semifinals': 'Полуфинал',
      'finals': 'Финал',
      'grand_final': 'Гранд-финал',
      'round_1': 'Раунд 1',
      'round_2': 'Раунд 2'
    };

    let html = `
      <div class="bracket-header">
        <h1 class="bracket-title">${this.currentTournament.name}</h1>
        <div class="bracket-info">
          <span>🎮 ${this.currentTournament.game}</span>
          ${this.currentTournament.prizepool ? `<span>🏆 ${this.currentTournament.prizepool}</span>` : ''}
          ${this.currentTournament.league ? `<span>🏅 ${this.currentTournament.league}</span>` : ''}
        </div>
      </div>
      
      <button class="back-btn" data-action="back">← Назад к турнирам</button>
      
      <div class="bracket-tree">
    `;

    if (rounds.length === 0) {
      html += `<div class="empty-state">Сетка матчей ещё не сформирована</div>`;
    } else {
      rounds.forEach((roundMatches, roundIndex) => {
        const roundKey = Object.keys(this.groupMatchesByRound(this.matches))[roundIndex];
        const roundName = roundNames[roundKey] || `Раунд ${roundIndex + 1}`;
        
        html += `
          <div class="bracket-round">
            <div class="bracket-round__title">${roundName}</div>
        `;
        
        roundMatches.forEach(match => {
          const team1 = match.opponents?.[0]?.opponent;
          const team2 = match.opponents?.[1]?.opponent;
          const score1 = match.results?.[0]?.score ?? '-';
          const score2 = match.results?.[1]?.score ?? '-';
          const isFinished = match.status === 'finished' || match.status === 'completed';
          const isLive = match.status === 'running' || match.status === 'live';
          
          const winnerId = match.winner_id;
          const team1Winner = winnerId && team1 && winnerId === team1.id;
          const team2Winner = winnerId && team2 && winnerId === team2.id;

          html += `
            <div class="bracket-match ${isLive ? 'bracket-match--live' : ''}">
              ${isLive ? '<div class="bracket-match__status bracket-match__status--live">🔴 LIVE</div>' : ''}
              
              <div class="bracket-team ${team1Winner ? 'bracket-team--winner' : team1Winner === false ? 'bracket-team--loser' : ''}">
                <span class="bracket-team__name">
                  ${team1?.image_url ? `<img src="${team1.image_url}" alt="" class="bracket-team__logo">` : ''}
                  ${team1?.name || team1?.acronym || 'TBD'}
                </span>
                <span class="bracket-team__score">${score1}</span>
              </div>
              
              <div class="bracket-team ${team2Winner ? 'bracket-team--winner' : team2Winner === false ? 'bracket-team--loser' : ''}">
                <span class="bracket-team__name">
                  ${team2?.image_url ? `<img src="${team2.image_url}" alt="" class="bracket-team__logo">` : ''}
                  ${team2?.name || team2?.acronym || 'TBD'}
                </span>
                <span class="bracket-team__score">${score2}</span>
              </div>
              
              ${match.begin_at ? `<div class="bracket-match__time">🕐 ${new Date(match.begin_at).toLocaleString('ru-RU')}</div>` : ''}
            </div>
          `;
        });

        html += `</div>`;
      });
    }
    
    html += `</div>`;

    this.element.innerHTML = html;

    // Кнопка "Назад"
    this.element.querySelector('[data-action="back"]')?.addEventListener('click', () => {
      this.showTournamentsList();
    });

    return this.element;
  }

  groupMatchesByRound(matches) {
    const rounds = {};
    matches.forEach(match => {
      const key = match.serie_id || match.name || 'default';
      if (!rounds[key]) rounds[key] = [];
      rounds[key].push(match);
    });
    return Object.values(rounds);
  }
}
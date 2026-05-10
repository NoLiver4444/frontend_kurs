// src/blocks/bracket/bracket.js
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
    this.viewMode = 'list';
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

    if (this.isLoading) {
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

  // ... (renderTournamentsList остается без изменений, см. предыдущий ответ) ...
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

    this.element.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const game = e.target.dataset.game;
        if (game && game !== this.props.filter) {
          this.props.filter = game;
          this.init();
        }
      });
    });

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

  // === НОВАЯ ЛОГИКА ДЛЯ ПОЛНОЙ СЕТКИ ===
  renderBracketView() {
    // Сортируем матчи по дате
    const sortedMatches = [...this.matches].sort((a, b) => 
      new Date(a.begin_at || 0) - new Date(b.begin_at || 0)
    );
    
    // Группируем по стадиям (сериям)
    const rounds = this.groupMatchesByRound(sortedMatches);

    let html = `
      <div class="bracket-header">
        <button class="back-btn" data-action="back">← Назад к турнирам</button>
        <h1 class="bracket-title">${this.currentTournament.name}</h1>
        
        <div class="bracket-info">
          <span>🎮 ${this.currentTournament.game}</span>
          ${this.currentTournament.prizepool ? `<span>🏆 ${this.currentTournament.prizepool}</span>` : ''}
          ${this.currentTournament.league ? `<span>🏅 ${this.currentTournament.league}</span>` : ''}
        </div>
      </div>
    `;

    if (!rounds || rounds.length === 0) {
      html += `<div class="empty-state">Сетка матчей ещё не сформирована</div>`;
    } else {
      html += `<div class="bracket-tree">`;
      
      rounds.forEach((roundData, index) => {
        // Проверка на наличие matches
        const roundMatches = (roundData && Array.isArray(roundData.matches)) ? roundData.matches : [];
        const roundName = (roundData && roundData.name) ? roundData.name : `Раунд ${index + 1}`;
        
        if (roundMatches.length === 0) return; // Пропускаем пустые раунды
        
        html += `
          <div class="bracket-round">
            <div class="bracket-round__title">${roundName}</div>
            <div class="bracket-round__matches">
        `;
        
        roundMatches.forEach(match => {
          // Безопасное получение данных
          const opponents = match.opponents || [];
          const results = match.results || [];
          
          const team1 = opponents[0]?.opponent || null;
          const team2 = opponents[1]?.opponent || null;
          
          const score1 = results[0]?.score ?? '-';
          const score2 = results[1]?.score ?? '-';
          
          const isFinished = match.status === 'finished' || match.status === 'completed';
          const isLive = match.status === 'running' || match.status === 'live';
          
          const winnerId = match.winner_id;
          const team1Winner = winnerId && team1 && winnerId === team1.id;
          const team2Winner = winnerId && team2 && winnerId === team2.id;

          html += `
            <div class="match-wrapper ${isFinished ? 'match-card--finished' : ''}">
              <div class="match-card ${isLive ? 'match-card--live' : ''}">
                ${isLive ? '<div class="match-status match-status--live">🔴 LIVE</div>' : ''}
                
                <div class="match-team ${team1Winner ? 'winner' : ''} ${team1Winner === false ? 'loser' : ''}">
                  <span class="team-name">${team1?.name || team1?.acronym || 'TBD'}</span>
                  <span class="team-score">${score1}</span>
                </div>
                
                <div class="match-divider"></div>
                
                <div class="match-team ${team2Winner ? 'winner' : ''} ${team2Winner === false ? 'loser' : ''}">
                  <span class="team-name">${team2?.name || team2?.acronym || 'TBD'}</span>
                  <span class="team-score">${score2}</span>
                </div>
                
                ${match.begin_at ? `<div class="match-time">${new Date(match.begin_at).toLocaleDateString('ru-RU')}</div>` : ''}
              </div>
              ${index < rounds.length - 1 ? '<div class="connector-line"></div>' : ''}
            </div>
          `;
        });

        html += `</div></div>`;
      });
      
      html += `</div>`;
    }

    this.element.innerHTML = html;

    const backBtn = this.element.querySelector('[data-action="back"]');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.showTournamentsList();
      });
    }

    return this.element;
  }

  // Улучшенная группировка: сохраняем название стадии из API
  groupMatchesByRound(matches) {
    console.log('📊 Группировка матчей. Всего матчей:', matches.length);
    
    if (!matches || !Array.isArray(matches) || matches.length === 0) {
      console.warn('⚠️ Матчей нет или они невалидны');
      return [];
    }
    
    const roundsMap = new Map();
    
    matches.forEach((match, index) => {
      console.log(`Матч ${index}:`, {
        id: match.id,
        name: match.name,
        serie_id: match.serie_id,
        serie: match.serie,
        status: match.status
      });
      
      // Безопасное получение serie
      const serie = match.serie || {};
      const key = match.serie_id || serie.slug || `round_${index}`;
      const name = serie.name || serie.full_name || `Раунд ${roundsMap.size + 1}`;
      
      if (!roundsMap.has(key)) {
        roundsMap.set(key, { name, matches: [], order: serie.order || index });
      }
      
      const roundData = roundsMap.get(key);
      if (roundData && Array.isArray(roundData.matches)) {
        roundData.matches.push(match);
      }
    });

    // Сортируем раунды по порядку
    const roundsArray = Array.from(roundsMap.values());
    roundsArray.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    console.log('✅ Сгруппировано раундов:', roundsArray.length);
    roundsArray.forEach((round, idx) => {
      console.log(`Раунд ${idx + 1}: ${round.name} - ${round.matches.length} матчей`);
    });
    
    return roundsArray;
  }

// Метод renderBracketView - с дополнительной проверкой
renderBracketView() {
  console.log('🎨 Рендер сетки турнира:', this.currentTournament);
  console.log('📋 Матчей для отображения:', this.matches.length);
  
  // Сортируем матчи по дате
  const sortedMatches = [...this.matches].sort((a, b) => 
    new Date(a.begin_at || 0) - new Date(b.begin_at || 0)
  );
  
  // Группируем по стадиям (сериям)
  const rounds = this.groupMatchesByRound(sortedMatches);

  let html = `
    <div class="bracket-header">
      <button class="back-btn" data-action="back">← Назад к турнирам</button>
      <h1 class="bracket-title">${this.currentTournament.name}</h1>
      
      <div class="bracket-info">
        <span>🎮 ${this.currentTournament.game}</span>
        ${this.currentTournament.prizepool ? `<span>🏆 ${this.currentTournament.prizepool}</span>` : ''}
        ${this.currentTournament.league ? `<span>🏅 ${this.currentTournament.league}</span>` : ''}
      </div>
    </div>
  `;

  if (!rounds || rounds.length === 0) {
    console.warn('⚠️ Раунды пустые!');
    html += `<div class="empty-state">Сетка матчей ещё не сформирована</div>`;
  } else {
    html += `<div class="bracket-tree">`;
    
    rounds.forEach((roundData, index) => {
      // Проверка на наличие matches
      const roundMatches = (roundData && Array.isArray(roundData.matches)) ? roundData.matches : [];
      const roundName = (roundData && roundData.name) ? roundData.name : `Раунд ${index + 1}`;
      
      console.log(`Рендер раунда ${index}: ${roundName}, матчей: ${roundMatches.length}`);
      
      if (roundMatches.length === 0) {
        console.warn(`Раунд ${index} пустой!`);
        return; // Пропускаем пустые раунды
      }
      
      html += `
        <div class="bracket-round">
          <div class="bracket-round__title">${roundName}</div>
          <div class="bracket-round__matches">
      `;
      
      roundMatches.forEach((match, matchIndex) => {
        console.log(`Рендер матча ${matchIndex}:`, match);
        
        // Безопасное получение данных
        const opponents = match.opponents || [];
        const results = match.results || [];
        
        const team1 = opponents[0]?.opponent || null;
        const team2 = opponents[1]?.opponent || null;
        
        const score1 = results[0]?.score ?? '-';
        const score2 = results[1]?.score ?? '-';
        
        const isFinished = match.status === 'finished' || match.status === 'completed';
        const isLive = match.status === 'running' || match.status === 'live';
        
        const winnerId = match.winner_id;
        const team1Winner = winnerId && team1 && winnerId === team1.id;
        const team2Winner = winnerId && team2 && winnerId === team2.id;

        html += `
          <div class="match-wrapper ${isFinished ? 'match-card--finished' : ''}">
            <div class="match-card ${isLive ? 'match-card--live' : ''}">
              ${isLive ? '<div class="match-status match-status--live">🔴 LIVE</div>' : ''}
              
              <div class="match-team ${team1Winner ? 'winner' : ''} ${team1Winner === false ? 'loser' : ''}">
                <span class="team-name">${team1?.name || team1?.acronym || 'TBD'}</span>
                <span class="team-score">${score1}</span>
              </div>
              
              <div class="match-divider"></div>
              
              <div class="match-team ${team2Winner ? 'winner' : ''} ${team2Winner === false ? 'loser' : ''}">
                <span class="team-name">${team2?.name || team2?.acronym || 'TBD'}</span>
                <span class="team-score">${score2}</span>
              </div>
              
              ${match.begin_at ? `<div class="match-time">${new Date(match.begin_at).toLocaleDateString('ru-RU')}</div>` : ''}
            </div>
            ${index < rounds.length - 1 ? '<div class="connector-line"></div>' : ''}
          </div>
        `;
      });

      html += `</div></div>`;
    });
    
    html += `</div>`;
  }

  this.element.innerHTML = html;
  console.log('HTML вставлен в DOM');

  const backBtn = this.element.querySelector('[data-action="back"]');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      this.showTournamentsList();
    });
  }

  return this.element;
}

  getRoundName(index, totalRounds) {
    if (index === totalRounds - 1) return 'Финал';
    if (index === totalRounds - 2) return 'Полуфинал';
    return `Раунд ${index + 1}`;
  }
}
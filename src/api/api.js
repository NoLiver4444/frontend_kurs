const PANDASCORE_TOKEN = 'VVmjz97l-DKiaJ4OJuRmsEE-kN2OV9HW2oA2qpsqQ9VCQIgb-cg';
const API_BASE = 'https://api.pandascore.co';

export async function fetchTournaments(gameSlug = null, limit = 20) {
  try {
    console.log('🔄 Загрузка турниров...');
    
    // 1. Запрашиваем все турниры без фильтра в URL
    const params = new URLSearchParams({
      'per_page': '50',
      'sort': '-begin_at'
    });

    const url = `${API_BASE}/tournaments?${params.toString()}`;
    console.log('📡 Запрос к API:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PANDASCORE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Статус:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const tournaments = await response.json();
    console.log(`✅ Получено с сервера: ${tournaments.length} турниров`);

    // 2. Клиентская фильтрация - ОБЯЗАТЕЛЬНО объявляем переменную
    let filtered = tournaments;
    
    if (gameSlug) {
      const target = gameSlug.toLowerCase();
      filtered = tournaments.filter(t => {
        const vgSlug = (t.videogame?.slug || '').toLowerCase();
        const vgtSlug = (t.videogame_title?.slug || '').toLowerCase();
        const vgName = (t.videogame?.name || '').toLowerCase();
        const vgtName = (t.videogame_title?.name || '').toLowerCase();
        
        return vgSlug.includes(target) || 
               vgtSlug.includes(target) ||
               vgName.includes(target) ||
               vgtName.includes(target);
      });
      console.log(`🔍 Отфильтровано для "${gameSlug}": ${filtered.length}`);
    }

    // 3. Маппинг данных
    return filtered.slice(0, limit).map(t => {
      const gameInfo = t.videogame_title || t.videogame || {};
      
      return {
        id: t.id,
        name: t.name || 'Tournament',
        status: t.status === 'running' ? 'running' : 
                t.status === 'finished' ? 'completed' : 'pending',
        game: gameInfo.name || 'Esports',
        gameSlug: gameInfo.slug || 'unknown',
        prizepool: t.prizepool,
        begin_at: t.begin_at,
        end_at: t.end_at,
        league: t.league?.name,
        teams_count: t.teams?.length || t.expected_roster?.length || 0,
        has_bracket: t.has_bracket
      };
    });

  } catch (error) {
    console.error('🔴 Ошибка API:', error);
    throw error;
  }
}

/**
 * Тестовые данные (fallback)
 */
function getMockTournaments(game, limit) {
  const gamesMap = {
    csgo: { name: 'CS2', slug: 'csgo' },
    dota2: { name: 'Dota 2', slug: 'dota2' },
    lol: { name: 'League of Legends', slug: 'lol' },
    valorant: { name: 'Valorant', slug: 'valorant' }
  };
  
  const targetGame = gamesMap[game] || gamesMap.csgo;
  
  const allMockTournaments = [
    { id: 1, name: 'IEM Katowice 2026', game: gamesMap.csgo, status: 'running', participants: 16, prizePool: '$1,000,000', startDate: '15.02.2026' },
    { id: 2, name: 'The International 2026', game: gamesMap.dota2, status: 'pending', participants: 20, prizePool: '$40,000,000', startDate: '15.06.2026' },
    { id: 3, name: 'Worlds 2026', game: gamesMap.lol, status: 'completed', participants: 24, prizePool: '$2,250,000', startDate: '10.04.2026' },
    { id: 4, name: 'VCT Champions 2026', game: gamesMap.valorant, status: 'running', participants: 16, prizePool: '$1,500,000', startDate: '20.03.2026' },
    { id: 5, name: 'BLAST Premier Spring', game: gamesMap.csgo, status: 'pending', participants: 12, prizePool: '$425,000', startDate: '01.03.2026' },
    { id: 6, name: 'ESL One Stockholm', game: gamesMap.dota2, status: 'running', participants: 16, prizePool: '$1,000,000', startDate: '10.05.2026' },
    { id: 7, name: 'LCK Spring 2026', game: gamesMap.lol, status: 'completed', participants: 10, prizePool: '$300,000', startDate: '15.01.2026' },
    { id: 8, name: 'VCT Masters Madrid', game: gamesMap.valorant, status: 'pending', participants: 12, prizePool: '$500,000', startDate: '01.04.2026' },
  ];
  
  // Фильтруем по игре
  let filtered = game 
    ? allMockTournaments.filter(t => t.game.slug === game)
    : allMockTournaments;
  
  return filtered.slice(0, limit);
}

/**
 * Получение матчей конкретного турнира
 */
export async function fetchTournamentMatches(tournamentId) {
  try {
    console.log(`📡 Загрузка матчей турнира #${tournamentId}`);
    
    if (!PANDASCORE_TOKEN || PANDASCORE_TOKEN === 'ваш_токен_здесь') {
      throw new Error('API токен не установлен!');
    }

    const url = `${API_BASE}/tournaments/${tournamentId}/matches?per_page=50`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PANDASCORE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const matches = Array.isArray(data) ? data : [];
    
    console.log(`✅ Получено матчей: ${matches.length}`);
    
    return matches.map(match => ({
      id: match.id,
      name: match.name || `Match #${match.id}`,
      status: match.status,
      begin_at: match.begin_at,
      opponents: match.opponents || [],
      results: match.results || [],
      winner_id: match.winner_id,
      serie_id: match.serie_id,
      serie: match.serie || null
    }));

  } catch (error) {
    console.error('🔴 Ошибка загрузки матчей:', error);
    throw error;
  }
}

/**
 * Тестовые матчи (fallback)
 */
function getMockMatches(tournamentId) {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Match ${i + 1}`,
    status: i % 2 === 0 ? 'running' : 'not_started',
    beginAt: new Date().toISOString(),
    opponents: [
      { opponent: { id: 1, name: `Team A${i + 1}` } },
      { opponent: { id: 2, name: `Team B${i + 1}` } }
    ],
    results: [
      { score: Math.floor(Math.random() * 3) },
      { score: Math.floor(Math.random() * 3) }
    ],
    winner_id: i % 2 === 0 ? 1 : 2
  }));
}

/**
 * Получение деталей турнира
 */
export async function fetchTournamentDetails(tournamentId) {
  try {
    const url = `${API_BASE}/tournaments/${tournamentId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PANDASCORE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ошибка: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('🔴 Ошибка загрузки деталей турнира:', error);
    throw error;
  }
}

/**
 * Получение списка игр
 */
export async function fetchGames() {
  try {
    const url = `${API_BASE}/games`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PANDASCORE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ошибка: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('🔴 Ошибка загрузки списка игр:', error);
    return [];
  }
}
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

export async function fetchTeamsByGame(gameSlug) {
  try {
    console.log(`🏆 Загрузка рейтинга для: ${gameSlug}`);
    
    const targetSlug = gameSlug === 'cs2' ? 'cs-2' : gameSlug;
    console.log(`🎮 Ищем игры: ${targetSlug}`);

    // Запрашиваем больше турниров
    const tournamentsUrl = `${API_BASE}/tournaments?per_page=100&sort=-begin_at`;
    
    const tournamentsResponse = await fetch(tournamentsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PANDASCORE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!tournamentsResponse.ok) {
      console.warn('⚠️ Не удалось получить турниры');
      return getMockTeamsByGame(gameSlug);
    }

    const allTournaments = await tournamentsResponse.json();
    console.log(`📦 Всего турниров: ${allTournaments.length}`);
    
    // Фильтруем по игре, году И ТИРУ (A и S)
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    let filteredTournaments = allTournaments.filter(tournament => {
      const vgSlug = (tournament.videogame?.slug || '').toLowerCase();
      const vgtSlug = (tournament.videogame_title?.slug || '').toLowerCase();
      const vgName = (tournament.videogame?.name || '').toLowerCase();
      const vgtName = (tournament.videogame_title?.name || '').toLowerCase();
      
      // Проверка игры
      let isCorrectGame = false;
      if (targetSlug === 'lol') {
        isCorrectGame = vgSlug === 'lol' || vgtSlug === 'lol' || 
                      vgName.includes('league') || vgtName.includes('league');
      } else if (targetSlug === 'cs-2') {
        isCorrectGame = vgSlug === 'cs-2' || vgtSlug === 'cs-2' ||
                      vgSlug === 'cs-go' || vgtSlug === 'cs-go';
      } else if (targetSlug === 'starcraft-2') { // ← ДОБАВЛЕНО
        isCorrectGame = vgSlug === 'starcraft-2' || vgtSlug === 'starcraft-2' ||
                      vgName.includes('starcraft') || vgtName.includes('sc2');
      } else {
        isCorrectGame = vgSlug === targetSlug || vgtSlug === targetSlug;
      }
      
      // Проверка года
      const beginYear = tournament.begin_at ? new Date(tournament.begin_at).getFullYear() : 0;
      const isCorrectYear = beginYear >= lastYear && beginYear <= currentYear + 1;
      
      // 🔥 ПРОВЕРКА ПО ТИРУ (только A и S)
      const tier = (tournament.tier || '').toLowerCase();
      const isCorrectTier = tier === 'a' || tier === 's';
      
      return isCorrectGame && isCorrectYear && isCorrectTier;
    });
    
    console.log(`✅ Отфильтровано (A-S тир, ${lastYear}-${currentYear}): ${filteredTournaments.length}`);
    
    if (filteredTournaments.length === 0) {
      return getMockTeamsByGame(gameSlug);
    }

    // Берем больше турниров для обработки
    const tournamentsToProcess = filteredTournaments.slice(0, 15);
    
    const teamsMap = new Map();
    let processedMatches = 0;
    let processedTournaments = 0;

    for (const tournament of tournamentsToProcess) {
      try {
        console.log(`📥 [${processedTournaments + 1}/15] ${tournament.name} (Tier: ${tournament.tier}, ID: ${tournament.id})`);
        
        const matchesUrl = `${API_BASE}/tournaments/${tournament.id}/matches?per_page=50&include=opponents,teams`;
        
        const matchesResponse = await fetch(matchesUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${PANDASCORE_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });

        if (!matchesResponse.ok) continue;
        
        const data = await matchesResponse.json();
        const matches = Array.isArray(data) ? data : (data.data || []);
        
        if (matches.length === 0) continue;
        
        processedMatches += matches.length;
        processedTournaments++;

        matches.forEach((match) => {
          const opponents = match.opponents || [];
          const results = match.results || [];
          const winnerId = match.winner_id;

          opponents.forEach((oppObj, oppIdx) => {
            const team = oppObj?.opponent || oppObj;
            
            if (!team || !team.id) return;

            const result = results[oppIdx] || {};
            const isWinner = winnerId === team.id;
            const score = result.score || 0;

            if (!teamsMap.has(team.id)) {
              teamsMap.set(team.id, {
                id: team.id,
                name: team.name || team.acronym || 'Unknown',
                acronym: team.acronym || '',
                logo: team.image_url,
                country: team.location || 'INT',
                matches: 0,
                wins: 0,
                totalScore: 0,
                points: 0,
                tournaments: new Set(),
                tierBonus: tournament.tier === 's' ? 1.5 : 1.0 // Бонус за S-тир
              });
            }

            const teamData = teamsMap.get(team.id);
            teamData.matches++;
            teamData.tournaments.add(tournament.id);
            teamData.totalScore += score;
            
            // Увеличенные очки за победы в A-S тир турнирах
            if (isWinner) {
              teamData.wins++;
              teamData.points += 300 * teamData.tierBonus; // S-тир = 450 очков
            } else {
              teamData.points += 75 * teamData.tierBonus;  // S-тир = 112.5 очков
            }
            teamData.points += score * 20 * teamData.tierBonus;
          });
        });
      } catch (err) {
        console.error(`❌ Ошибка турнира ${tournament.id}:`, err);
      }
    }

    console.log(`📊 Обработано турниров: ${processedTournaments}`);
    console.log(`📊 Матчей: ${processedMatches}`);
    console.log(`📊 Команд: ${teamsMap.size}`);

    if (teamsMap.size === 0) {
      return getMockTeamsByGame(gameSlug);
    }

    // Сортируем
    const teamsArray = Array.from(teamsMap.values()).map(team => ({
      ...team,
      tournamentsCount: team.tournaments.size
    }));
    
    teamsArray.sort((a, b) => {
      const aWR = a.matches > 0 ? a.wins / a.matches : 0;
      const bWR = b.matches > 0 ? b.wins / b.matches : 0;
      
      // Приоритет: очки > винрейт > турниры > матчи
      if (b.points !== a.points) return b.points - a.points;
      if (bWR !== aWR) return bWR - aWR;
      if (b.tournamentsCount !== a.tournamentsCount) {
        return b.tournamentsCount - a.tournamentsCount;
      }
      return b.matches - a.matches;
    });

    const result = teamsArray.slice(0, 20).map((team, index) => ({
      rank: index + 1,
      name: team.name,
      acronym: team.acronym,
      logo: team.logo,
      country: team.country,
      points: Math.round(team.points),
      winrate: team.matches > 0 ? Math.round((team.wins / team.matches) * 100) : 0,
      matches: team.matches,
      wins: team.wins,
      tournaments: team.tournamentsCount
    }));

    console.log('✅ ВОЗВРАЩАЕМ:', result.length, 'команд');
    return result;

  } catch (error) {
    console.error('🔴 Ошибка:', error);
    return getMockTeamsByGame(gameSlug);
  }
}

/**
 * Fallback данные (если API не вернул результаты)
 */
function getMockTeamsByGame(gameSlug) {
  const mockData = {
    'cs2': [
      { rank: 1, name: 'Natus Vincere', acronym: 'NAVI', country: '🇺🇦', points: 1000, winrate: 88, logo: null },
      { rank: 2, name: 'Vitality', acronym: 'VIT', country: '🇫🇷', points: 950, winrate: 85, logo: null },
      { rank: 3, name: 'FaZe Clan', acronym: 'FaZe', country: '🇪🇺', points: 920, winrate: 82, logo: null },
      { rank: 4, name: 'G2 Esports', acronym: 'G2', country: '🇪🇺', points: 890, winrate: 79, logo: null },
      { rank: 5, name: 'MOUZ', acronym: 'MOUZ', country: '🇩🇪', points: 860, winrate: 76, logo: null },
    ],
    'dota-2': [
      { rank: 1, name: 'Team Spirit', acronym: 'TS', country: '🇷🇺', points: 1200, winrate: 85, logo: null },
      { rank: 2, name: 'Gaimin Gladiators', acronym: 'GG', country: '🇪🇺', points: 1150, winrate: 82, logo: null },
      { rank: 3, name: 'Tundra Esports', acronym: 'TUN', country: '🇪🇺', points: 1100, winrate: 79, logo: null },
      { rank: 4, name: 'Team Liquid', acronym: 'TL', country: '🇪🇺', points: 1050, winrate: 76, logo: null },
      { rank: 5, name: 'BetBoom Team', acronym: 'BBT', country: '🇷🇺', points: 1000, winrate: 73, logo: null },
    ],
    'lol': [
      { rank: 1, name: 'T1', acronym: 'T1', country: '🇰🇷', points: 2100, winrate: 88, logo: null },
      { rank: 2, name: 'Gen.G', acronym: 'GEN', country: '🇰🇷', points: 2050, winrate: 85, logo: null },
      { rank: 3, name: 'JD Gaming', acronym: 'JDG', country: '🇨🇳', points: 1900, winrate: 82, logo: null },
      { rank: 4, name: 'Bilibili Gaming', acronym: 'BLG', country: '🇨🇳', points: 1850, winrate: 79, logo: null },
      { rank: 5, name: 'G2 Esports', acronym: 'G2', country: '🇪🇺', points: 1600, winrate: 76, logo: null },
    ],
    'valorant': [
      { rank: 1, name: 'Sentinels', acronym: 'SEN', country: '🇺🇸', points: 1400, winrate: 85, logo: null },
      { rank: 2, name: 'Paper Rex', acronym: 'PRX', country: '🇸🇬', points: 1350, winrate: 82, logo: null },
      { rank: 3, name: 'DRX', acronym: 'DRX', country: '🇰🇷', points: 1300, winrate: 79, logo: null },
      { rank: 4, name: 'Fnatic', acronym: 'FNC', country: '🇪🇺', points: 1250, winrate: 76, logo: null },
      { rank: 5, name: 'LOUD', acronym: 'LOUD', country: '🇧🇷', points: 1100, winrate: 73, logo: null },
    ],
    'starcraft-2': [
      { rank: 1, name: 'Maru', acronym: 'MARU', country: '🇰🇷', points: 1500, winrate: 92, logo: null },
      { rank: 2, name: 'Dark', acronym: 'DRK', country: '🇰🇷', points: 1450, winrate: 89, logo: null },
      { rank: 3, name: 'Cure', acronym: 'CURE', country: '🇰', points: 1400, winrate: 87, logo: null },
      { rank: 4, name: 'Reynor', acronym: 'REY', country: '🇮🇹', points: 1350, winrate: 85, logo: null },
      { rank: 5, name: 'Serral', acronym: 'SER', country: '🇫🇮', points: 1300, winrate: 84, logo: null },
      { rank: 6, name: 'Rogue', acronym: 'ROG', country: '🇰', points: 1250, winrate: 82, logo: null },
      { rank: 7, name: 'Stats', acronym: 'STA', country: '🇰🇷', points: 1200, winrate: 80, logo: null },
      { rank: 8, name: 'ByuN', acronym: 'BYU', country: '🇰🇷', points: 1150, winrate: 78, logo: null },
    ]
  };
  return mockData[gameSlug] || mockData['cs2'];
}
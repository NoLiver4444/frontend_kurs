(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const e of s)if(e.type==="childList")for(const o of e.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function r(s){const e={};return s.integrity&&(e.integrity=s.integrity),s.referrerPolicy&&(e.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?e.credentials="include":s.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function n(s){if(s.ep)return;s.ep=!0;const e=r(s);fetch(s.href,e)}})();class A{constructor(t={}){this.props=t,this.element=null,this.state={}}render(){throw new Error("Метод render() должен быть переопределён")}appendTo(t){this.element&&t.appendChild(this.element)}updateState(t){this.state={...this.state,...t},this.render()}}class P extends A{constructor(){super({logo:"🏆 BRACKET.GG",navItems:[{path:"tournaments",label:"Турниры"},{path:"rating",label:"Рейтинг"},{path:"about",label:"О нас"}]}),this.isMenuOpen=!1}render(){this.element=document.createElement("header"),this.element.className="header";const t=window.location.hash.slice(1)||"tournaments",r=this.props.navItems.map(n=>`
      <li class="header__item">
        <a href="#${n.path}" 
           class="header__link ${n.path===t?"active":""}" 
           data-path="${n.path}">
          ${n.label}
        </a>
      </li>
    `).join("");return this.element.innerHTML=`
      <div class="header__container">
        <a href="#tournaments" class="header__logo">${this.props.logo}</a>
        
        <button class="header__burger" aria-label="Меню">
          <span></span><span></span><span></span>
        </button>

        <nav class="header__nav ${this.isMenuOpen?"header__nav--active":""}">
          <ul class="header__list">${r}</ul>
        </nav>
      </div>
    `,this.attachEvents(),this.element}attachEvents(){const t=this.element.querySelector(".header__burger"),r=this.element.querySelector(".header__nav");t&&t.addEventListener("click",()=>{this.isMenuOpen=!this.isMenuOpen,r.classList.toggle("header__nav--active",this.isMenuOpen),t.classList.toggle("header__burger--active",this.isMenuOpen)}),window.addEventListener("hashchange",()=>{this.updateActiveLink()}),this.updateActiveLink()}updateActiveLink(){const t=window.location.hash.slice(1)||"tournaments";this.element.querySelectorAll(".header__link").forEach(n=>{n.dataset.path===t?n.classList.add("active"):n.classList.remove("active")})}}class D extends A{constructor(){super(),this.year=new Date().getFullYear()}render(){return this.element=document.createElement("footer"),this.element.className="footer",this.element.innerHTML=`
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
    `,this.element}}const C="VVmjz97l-DKiaJ4OJuRmsEE-kN2OV9HW2oA2qpsqQ9VCQIgb-cg",G="https://api.pandascore.co";async function N(d=null,t=20){try{console.log("🔄 Загрузка турниров...");const r=new URLSearchParams({per_page:"50",sort:"-begin_at"}),n=`${G}/tournaments?${r.toString()}`;console.log("📡 Запрос к API:",n);const s=await fetch(n,{method:"GET",headers:{Authorization:`Bearer ${C}`,"Content-Type":"application/json"}});if(console.log("📊 Статус:",s.status),!s.ok)throw new Error(`HTTP Error: ${s.status}`);const e=await s.json();console.log(`✅ Получено с сервера: ${e.length} турниров`);let o=e;if(d){const c=d.toLowerCase();o=e.filter(g=>{var u,a,l,h;const i=(((u=g.videogame)==null?void 0:u.slug)||"").toLowerCase(),w=(((a=g.videogame_title)==null?void 0:a.slug)||"").toLowerCase(),f=(((l=g.videogame)==null?void 0:l.name)||"").toLowerCase(),v=(((h=g.videogame_title)==null?void 0:h.name)||"").toLowerCase();return i.includes(c)||w.includes(c)||f.includes(c)||v.includes(c)}),console.log(`🔍 Отфильтровано для "${d}": ${o.length}`)}return o.slice(0,t).map(c=>{var i,w,f;const g=c.videogame_title||c.videogame||{};return{id:c.id,name:c.name||"Tournament",status:c.status==="running"?"running":c.status==="finished"?"completed":"pending",game:g.name||"Esports",gameSlug:g.slug||"unknown",prizepool:c.prizepool,begin_at:c.begin_at,end_at:c.end_at,league:(i=c.league)==null?void 0:i.name,teams_count:((w=c.teams)==null?void 0:w.length)||((f=c.expected_roster)==null?void 0:f.length)||0,has_bracket:c.has_bracket}})}catch(r){throw console.error("🔴 Ошибка API:",r),r}}async function I(d){try{console.log(`📡 Загрузка матчей турнира #${d}`);const t=`${G}/tournaments/${d}/matches?per_page=50`,r=await fetch(t,{method:"GET",headers:{Authorization:`Bearer ${C}`,"Content-Type":"application/json"}});if(!r.ok)throw new Error(`HTTP Error: ${r.status}`);const n=await r.json(),s=Array.isArray(n)?n:[];return console.log(`✅ Получено матчей: ${s.length}`),s.map(e=>({id:e.id,name:e.name||`Match #${e.id}`,status:e.status,begin_at:e.begin_at,opponents:e.opponents||[],results:e.results||[],winner_id:e.winner_id,serie_id:e.serie_id,serie:e.serie||null}))}catch(t){throw console.error("🔴 Ошибка загрузки матчей:",t),t}}async function H(d){try{console.log(`🏆 Загрузка рейтинга для: ${d}`);const t=d==="cs2"?"cs-2":d;console.log(`🎮 Ищем игры: ${t}`);const r=`${G}/tournaments?per_page=100&sort=-begin_at`,n=await fetch(r,{method:"GET",headers:{Authorization:`Bearer ${C}`,"Content-Type":"application/json"}});if(!n.ok)return console.warn("⚠️ Не удалось получить турниры"),B(d);const s=await n.json();console.log(`📦 Всего турниров: ${s.length}`);const e=new Date().getFullYear(),o=e-1;let c=s.filter(a=>{var T,m,M,S;const l=(((T=a.videogame)==null?void 0:T.slug)||"").toLowerCase(),h=(((m=a.videogame_title)==null?void 0:m.slug)||"").toLowerCase(),_=(((M=a.videogame)==null?void 0:M.name)||"").toLowerCase(),y=(((S=a.videogame_title)==null?void 0:S.name)||"").toLowerCase();let p=!1;t==="lol"?p=l==="lol"||h==="lol"||_.includes("league")||y.includes("league"):t==="cs-2"?p=l==="cs-2"||h==="cs-2"||l==="cs-go"||h==="cs-go":t==="starcraft-2"?p=l==="starcraft-2"||h==="starcraft-2"||_.includes("starcraft")||y.includes("sc2"):p=l===t||h===t;const $=a.begin_at?new Date(a.begin_at).getFullYear():0,E=$>=o&&$<=e+1,k=(a.tier||"").toLowerCase();return p&&E&&(k==="a"||k==="s")});if(console.log(`✅ Отфильтровано (A-S тир, ${o}-${e}): ${c.length}`),c.length===0)return B(d);const g=c.slice(0,15),i=new Map;let w=0,f=0;for(const a of g)try{console.log(`📥 [${f+1}/15] ${a.name} (Tier: ${a.tier}, ID: ${a.id})`);const l=`${G}/tournaments/${a.id}/matches?per_page=50&include=opponents,teams`,h=await fetch(l,{method:"GET",headers:{Authorization:`Bearer ${C}`,"Content-Type":"application/json"}});if(!h.ok)continue;const _=await h.json(),y=Array.isArray(_)?_:_.data||[];if(y.length===0)continue;w+=y.length,f++,y.forEach(p=>{const $=p.opponents||[],E=p.results||[],k=p.winner_id;$.forEach((b,T)=>{const m=(b==null?void 0:b.opponent)||b;if(!m||!m.id)return;const M=E[T]||{},S=k===m.id,R=M.score||0;i.has(m.id)||i.set(m.id,{id:m.id,name:m.name||m.acronym||"Unknown",acronym:m.acronym||"",logo:m.image_url,country:m.location||"INT",matches:0,wins:0,totalScore:0,points:0,tournaments:new Set,tierBonus:a.tier==="s"?1.5:1});const L=i.get(m.id);L.matches++,L.tournaments.add(a.id),L.totalScore+=R,S?(L.wins++,L.points+=300*L.tierBonus):L.points+=75*L.tierBonus,L.points+=R*20*L.tierBonus})})}catch(l){console.error(`❌ Ошибка турнира ${a.id}:`,l)}if(console.log(`📊 Обработано турниров: ${f}`),console.log(`📊 Матчей: ${w}`),console.log(`📊 Команд: ${i.size}`),i.size===0)return B(d);const v=Array.from(i.values()).map(a=>({...a,tournamentsCount:a.tournaments.size}));v.sort((a,l)=>{const h=a.matches>0?a.wins/a.matches:0,_=l.matches>0?l.wins/l.matches:0;return l.points!==a.points?l.points-a.points:_!==h?_-h:l.tournamentsCount!==a.tournamentsCount?l.tournamentsCount-a.tournamentsCount:l.matches-a.matches});const u=v.slice(0,20).map((a,l)=>({rank:l+1,name:a.name,acronym:a.acronym,logo:a.logo,country:a.country,points:Math.round(a.points),winrate:a.matches>0?Math.round(a.wins/a.matches*100):0,matches:a.matches,wins:a.wins,tournaments:a.tournamentsCount}));return console.log("✅ ВОЗВРАЩАЕМ:",u.length,"команд"),u}catch(t){return console.error("🔴 Ошибка:",t),B(d)}}function B(d){const t={cs2:[{rank:1,name:"Natus Vincere",acronym:"NAVI",country:"🇺🇦",points:1e3,winrate:88,logo:null},{rank:2,name:"Vitality",acronym:"VIT",country:"🇫🇷",points:950,winrate:85,logo:null},{rank:3,name:"FaZe Clan",acronym:"FaZe",country:"🇪🇺",points:920,winrate:82,logo:null},{rank:4,name:"G2 Esports",acronym:"G2",country:"🇪🇺",points:890,winrate:79,logo:null},{rank:5,name:"MOUZ",acronym:"MOUZ",country:"🇩🇪",points:860,winrate:76,logo:null}],"dota-2":[{rank:1,name:"Team Spirit",acronym:"TS",country:"🇷🇺",points:1200,winrate:85,logo:null},{rank:2,name:"Gaimin Gladiators",acronym:"GG",country:"🇪🇺",points:1150,winrate:82,logo:null},{rank:3,name:"Tundra Esports",acronym:"TUN",country:"🇪🇺",points:1100,winrate:79,logo:null},{rank:4,name:"Team Liquid",acronym:"TL",country:"🇪🇺",points:1050,winrate:76,logo:null},{rank:5,name:"BetBoom Team",acronym:"BBT",country:"🇷🇺",points:1e3,winrate:73,logo:null}],lol:[{rank:1,name:"T1",acronym:"T1",country:"🇰🇷",points:2100,winrate:88,logo:null},{rank:2,name:"Gen.G",acronym:"GEN",country:"🇰🇷",points:2050,winrate:85,logo:null},{rank:3,name:"JD Gaming",acronym:"JDG",country:"🇨🇳",points:1900,winrate:82,logo:null},{rank:4,name:"Bilibili Gaming",acronym:"BLG",country:"🇨🇳",points:1850,winrate:79,logo:null},{rank:5,name:"G2 Esports",acronym:"G2",country:"🇪🇺",points:1600,winrate:76,logo:null}],valorant:[{rank:1,name:"Sentinels",acronym:"SEN",country:"🇺🇸",points:1400,winrate:85,logo:null},{rank:2,name:"Paper Rex",acronym:"PRX",country:"🇸🇬",points:1350,winrate:82,logo:null},{rank:3,name:"DRX",acronym:"DRX",country:"🇰🇷",points:1300,winrate:79,logo:null},{rank:4,name:"Fnatic",acronym:"FNC",country:"🇪🇺",points:1250,winrate:76,logo:null},{rank:5,name:"LOUD",acronym:"LOUD",country:"🇧🇷",points:1100,winrate:73,logo:null}],"starcraft-2":[{rank:1,name:"Maru",acronym:"MARU",country:"🇰🇷",points:1500,winrate:92,logo:null},{rank:2,name:"Dark",acronym:"DRK",country:"🇰🇷",points:1450,winrate:89,logo:null},{rank:3,name:"Cure",acronym:"CURE",country:"🇰",points:1400,winrate:87,logo:null},{rank:4,name:"Reynor",acronym:"REY",country:"🇮🇹",points:1350,winrate:85,logo:null},{rank:5,name:"Serral",acronym:"SER",country:"🇫🇮",points:1300,winrate:84,logo:null},{rank:6,name:"Rogue",acronym:"ROG",country:"🇰",points:1250,winrate:82,logo:null},{rank:7,name:"Stats",acronym:"STA",country:"🇰🇷",points:1200,winrate:80,logo:null},{rank:8,name:"ByuN",acronym:"BYU",country:"🇰🇷",points:1150,winrate:78,logo:null}]};return t[d]||t.cs2}class O extends A{constructor(){super({title:"Активные турниры",filter:"cs-2"}),this.tournaments=[],this.currentTournament=null,this.matches=[],this.isLoading=!1,this.error=null,this.viewMode="list"}async init(){this.isLoading=!0,this.render();try{this.viewMode==="list"?this.tournaments=await N(this.props.filter):this.viewMode==="bracket"&&this.currentTournament&&(this.matches=await I(this.currentTournament.id)),this.error=null}catch(t){this.error=t.message||"Не удалось загрузить данные",console.error(t)}this.isLoading=!1,this.render()}async showTournamentBracket(t){this.currentTournament=t,this.viewMode="bracket",await this.init()}showTournamentsList(){this.currentTournament=null,this.matches=[],this.viewMode="list",this.render(),this.init()}render(){return this.element||(this.element=document.createElement("section"),this.element.className="bracket"),this.isLoading?(this.element.innerHTML='<div class="loader">Загрузка...</div>',this.element):this.error?(this.element.innerHTML=`
        <div class="error-msg">❌ ${this.error}</div>
        <button class="retry-btn" data-action="retry">🔄 Повторить</button>
      `,this.element.querySelector(".retry-btn").addEventListener("click",()=>this.init()),this.element):this.viewMode==="bracket"&&this.currentTournament?this.renderBracketView():this.renderTournamentsList()}renderTournamentsList(){const t=`
      <div class="bracket__filters">
        <button class="filter-btn ${this.props.filter==="cs-2"?"active":""}" data-game="cs-2">CS2</button>
        <button class="filter-btn ${this.props.filter==="dota-2"?"active":""}" data-game="dota-2">Dota 2</button>
        <button class="filter-btn ${this.props.filter==="lol"?"active":""}" data-game="lol">LoL</button>
        <button class="filter-btn ${this.props.filter==="valorant"?"active":""}" data-game="valorant">Valorant</button>
        <button class="filter-btn ${this.props.filter==="starcraft-2"?"active":""}" data-game="starcraft-2">StarCraft 2</button>
      </div>
    `;let r=`<h2 class="bracket__title">${this.props.title}</h2>${t}`;return this.tournaments.length===0?r+='<div class="empty-state">Нет активных турниров для выбранной игры</div>':(r+='<div class="tournaments-grid">',this.tournaments.forEach(n=>{const s={running:"status--live",completed:"status--done",pending:"status--upcoming"}[n.status]||"status--upcoming",e={running:"🔴 LIVE",completed:"✅ Завершён",pending:"⏳ Скоро"}[n.status]||n.status,o=n.prizepool?`🏆 ${n.prizepool}`:"";r+=`
          <article class="tournament-card">
            <div class="card__header">
              <h3 class="card__name">${n.name}</h3>
              <span class="card__status ${s}">${e}</span>
            </div>
            <div class="card__game">🎮 ${n.game} ${n.league?`• ${n.league}`:""}</div>
            <div class="card__meta">
              <span>👥 ${n.teams_count} команд</span>
              ${n.begin_at?`<span>📅 ${new Date(n.begin_at).toLocaleDateString("ru-RU")}</span>`:""}
            </div>
            ${o?`<div class="card__prize">${o}</div>`:""}
            <button class="card__btn" data-action="view-bracket" data-id="${n.id}" ${n.has_bracket?"":"disabled"}>
              ${n.has_bracket?"Открыть сетку":"Сетка скоро"}
            </button>
          </article>
        `}),r+="</div>"),this.element.innerHTML=r,this.element.querySelectorAll(".filter-btn").forEach(n=>{n.addEventListener("click",s=>{const e=s.target.dataset.game;e&&e!==this.props.filter&&(this.props.filter=e,this.init())})}),this.element.querySelectorAll('[data-action="view-bracket"]').forEach(n=>{n.addEventListener("click",async s=>{const e=s.target.dataset.id,o=this.tournaments.find(c=>c.id==e);o&&o.has_bracket&&await this.showTournamentBracket(o)})}),this.element}renderBracketView(){const t=[...this.matches].sort((e,o)=>new Date(e.begin_at||0)-new Date(o.begin_at||0)),r=this.groupMatchesByRound(t);let n=`
      <div class="bracket-header">
        <button class="back-btn" data-action="back">← Назад к турнирам</button>
        <h1 class="bracket-title">${this.currentTournament.name}</h1>
        
        <div class="bracket-info">
          <span>🎮 ${this.currentTournament.game}</span>
          ${this.currentTournament.prizepool?`<span>🏆 ${this.currentTournament.prizepool}</span>`:""}
          ${this.currentTournament.league?`<span>🏅 ${this.currentTournament.league}</span>`:""}
        </div>
      </div>
    `;!r||r.length===0?n+='<div class="empty-state">Сетка матчей ещё не сформирована</div>':(n+='<div class="bracket-tree">',r.forEach((e,o)=>{const c=e&&Array.isArray(e.matches)?e.matches:[],g=e&&e.name?e.name:`Раунд ${o+1}`;c.length!==0&&(n+=`
          <div class="bracket-round">
            <div class="bracket-round__title">${g}</div>
            <div class="bracket-round__matches">
        `,c.forEach(i=>{var E,k,b,T;const w=i.opponents||[],f=i.results||[],v=((E=w[0])==null?void 0:E.opponent)||null,u=((k=w[1])==null?void 0:k.opponent)||null,a=((b=f[0])==null?void 0:b.score)??"-",l=((T=f[1])==null?void 0:T.score)??"-",h=i.status==="finished"||i.status==="completed",_=i.status==="running"||i.status==="live",y=i.winner_id,p=y&&v&&y===v.id,$=y&&u&&y===u.id;n+=`
            <div class="match-wrapper ${h?"match-card--finished":""}">
              <div class="match-card ${_?"match-card--live":""}">
                ${_?'<div class="match-status match-status--live">🔴 LIVE</div>':""}
                
                <div class="match-team ${p?"winner":""} ${p===!1?"loser":""}">
                  <span class="team-name">${(v==null?void 0:v.name)||(v==null?void 0:v.acronym)||"TBD"}</span>
                  <span class="team-score">${a}</span>
                </div>
                
                <div class="match-divider"></div>
                
                <div class="match-team ${$?"winner":""} ${$===!1?"loser":""}">
                  <span class="team-name">${(u==null?void 0:u.name)||(u==null?void 0:u.acronym)||"TBD"}</span>
                  <span class="team-score">${l}</span>
                </div>
                
                ${i.begin_at?`<div class="match-time">${new Date(i.begin_at).toLocaleDateString("ru-RU")}</div>`:""}
              </div>
              ${o<r.length-1?'<div class="connector-line"></div>':""}
            </div>
          `}),n+="</div></div>")}),n+="</div>"),this.element.innerHTML=n;const s=this.element.querySelector('[data-action="back"]');return s&&s.addEventListener("click",()=>{this.showTournamentsList()}),this.element}groupMatchesByRound(t){if(console.log("📊 Группировка матчей. Всего матчей:",t.length),!t||!Array.isArray(t)||t.length===0)return console.warn("⚠️ Матчей нет или они невалидны"),[];const r=new Map;t.forEach((s,e)=>{console.log(`Матч ${e}:`,{id:s.id,name:s.name,serie_id:s.serie_id,serie:s.serie,status:s.status});const o=s.serie||{},c=s.serie_id||o.slug||`round_${e}`,g=o.name||o.full_name||`Раунд ${r.size+1}`;r.has(c)||r.set(c,{name:g,matches:[],order:o.order||e});const i=r.get(c);i&&Array.isArray(i.matches)&&i.matches.push(s)});const n=Array.from(r.values());return n.sort((s,e)=>(s.order||0)-(e.order||0)),console.log("✅ Сгруппировано раундов:",n.length),n.forEach((s,e)=>{console.log(`Раунд ${e+1}: ${s.name} - ${s.matches.length} матчей`)}),n}renderBracketView(){console.log("🎨 Рендер сетки турнира:",this.currentTournament),console.log("📋 Матчей для отображения:",this.matches.length);const t=[...this.matches].sort((e,o)=>new Date(e.begin_at||0)-new Date(o.begin_at||0)),r=this.groupMatchesByRound(t);let n=`
    <div class="bracket-header">
      <button class="back-btn" data-action="back">← Назад к турнирам</button>
      <h1 class="bracket-title">${this.currentTournament.name}</h1>
      
      <div class="bracket-info">
        <span>🎮 ${this.currentTournament.game}</span>
        ${this.currentTournament.prizepool?`<span>🏆 ${this.currentTournament.prizepool}</span>`:""}
        ${this.currentTournament.league?`<span>🏅 ${this.currentTournament.league}</span>`:""}
      </div>
    </div>
  `;!r||r.length===0?(console.warn("⚠️ Раунды пустые!"),n+='<div class="empty-state">Сетка матчей ещё не сформирована</div>'):(n+='<div class="bracket-tree">',r.forEach((e,o)=>{const c=e&&Array.isArray(e.matches)?e.matches:[],g=e&&e.name?e.name:`Раунд ${o+1}`;if(console.log(`Рендер раунда ${o}: ${g}, матчей: ${c.length}`),c.length===0){console.warn(`Раунд ${o} пустой!`);return}n+=`
        <div class="bracket-round">
          <div class="bracket-round__title">${g}</div>
          <div class="bracket-round__matches">
      `,c.forEach((i,w)=>{var k,b,T,m;console.log(`Рендер матча ${w}:`,i);const f=i.opponents||[],v=i.results||[],u=((k=f[0])==null?void 0:k.opponent)||null,a=((b=f[1])==null?void 0:b.opponent)||null,l=((T=v[0])==null?void 0:T.score)??"-",h=((m=v[1])==null?void 0:m.score)??"-",_=i.status==="finished"||i.status==="completed",y=i.status==="running"||i.status==="live",p=i.winner_id,$=p&&u&&p===u.id,E=p&&a&&p===a.id;n+=`
          <div class="match-wrapper ${_?"match-card--finished":""}">
            <div class="match-card ${y?"match-card--live":""}">
              ${y?'<div class="match-status match-status--live">🔴 LIVE</div>':""}
              
              <div class="match-team ${$?"winner":""} ${$===!1?"loser":""}">
                <span class="team-name">${(u==null?void 0:u.name)||(u==null?void 0:u.acronym)||"TBD"}</span>
                <span class="team-score">${l}</span>
              </div>
              
              <div class="match-divider"></div>
              
              <div class="match-team ${E?"winner":""} ${E===!1?"loser":""}">
                <span class="team-name">${(a==null?void 0:a.name)||(a==null?void 0:a.acronym)||"TBD"}</span>
                <span class="team-score">${h}</span>
              </div>
              
              ${i.begin_at?`<div class="match-time">${new Date(i.begin_at).toLocaleDateString("ru-RU")}</div>`:""}
            </div>
            ${o<r.length-1?'<div class="connector-line"></div>':""}
          </div>
        `}),n+="</div></div>"}),n+="</div>"),this.element.innerHTML=n,console.log("HTML вставлен в DOM");const s=this.element.querySelector('[data-action="back"]');return s&&s.addEventListener("click",()=>{this.showTournamentsList()}),this.element}getRoundName(t,r){return t===r-1?"Финал":t===r-2?"Полуфинал":`Раунд ${t+1}`}}class z extends A{constructor(){super(),this.teams=[],this.isLoading=!1,this.activeGame="cs2"}async init(){console.log("🚀 Rating.init() для:",this.activeGame),this.isLoading=!0,this.element?this.updateContent():this.element=this.render();try{const t=await H(this.activeGame);console.log("✅ Получено команд:",t.length),this.teams=t||[]}catch(t){console.error("❌ Ошибка:",t),this.teams=[]}this.isLoading=!1,this.updateContent()}updateContent(){if(!this.element)return this.element=this.render(),this.element;const t=`
      <div class="rating__filters">
        <button class="filter-btn ${this.activeGame==="cs2"?"active":""}" data-game="cs2">CS2</button>
        <button class="filter-btn ${this.activeGame==="dota-2"?"active":""}" data-game="dota-2">Dota 2</button>
        <button class="filter-btn ${this.activeGame==="lol"?"active":""}" data-game="lol">LoL</button>
        <button class="filter-btn ${this.activeGame==="valorant"?"active":""}" data-game="valorant">Valorant</button>
        <button class="filter-btn ${this.activeGame==="starcraft-2"?"active":""}" data-game="starcraft-2">StarCraft 2</button>      
    </div>
    `;let r="";this.isLoading?r='<div class="loader">Загрузка рейтинга...</div>':!this.teams||this.teams.length===0?r=`
        <div class="empty-state">
          <p>Нет данных по командам для "${this.activeGame}"</p>
          <button class="retry-btn" data-action="retry">🔄 Обновить</button>
        </div>
      `:r=`
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
            <tbody>${this.teams.map(e=>`
        <tr class="rating__row">
          <td class="rating__cell rating__cell--rank">
            <span class="rank-badge ${e.rank<=3?"rank-badge--top":""}">${e.rank}</span>
          </td>
          <td class="rating__cell rating__cell--team">
            <div class="team-info">
              ${e.logo?`<img src="${e.logo}" alt="${e.name}" class="team-logo">`:""}
              <span class="team-name">${e.name}</span>
            </div>
          </td>
          <td class="rating__cell rating__cell--points">${e.points}</td>
          <td class="rating__cell rating__cell--winrate">
            <div class="progress-bar">
              <div class="progress-bar__fill" style="width: ${e.winrate}%"></div>
            </div>
            <span class="winrate-text">${e.winrate}%</span>
          </td>
        </tr>
      `).join("")}</tbody>
          </table>
        </div>
      `,this.element.innerHTML=`
      <h1 class="rating__title">Мировой Рейтинг Команд</h1>
      ${t}
      ${r}
    `,this.element.querySelectorAll(".filter-btn").forEach(s=>{s.addEventListener("click",async e=>{const o=e.target.dataset.game;o&&o!==this.activeGame&&(this.activeGame=o,await this.init())})});const n=this.element.querySelector('[data-action="retry"]');return n&&n.addEventListener("click",()=>this.init()),this.element}render(){return console.log("🎨 Rating.render() вызван"),this.element=document.createElement("section"),this.element.className="rating",this.updateContent()}}class V extends A{constructor(){super()}render(){return this.element=document.createElement("section"),this.element.className="about-page",this.element.innerHTML=`
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
    `,this.element}}document.addEventListener("DOMContentLoaded",()=>{const d=document.querySelector(".header-container"),t=document.querySelector(".footer-container"),r=document.getElementById("app");if(d){const s=new P;d.appendChild(s.render())}if(t){const s=new D;t.appendChild(s.render())}const n=()=>{r.innerHTML="";const s=window.location.hash.slice(1)||"tournaments";if(s==="rating"){const e=new z;r.appendChild(e.render()),e.init()}else if(s==="about"){const e=new V;r.appendChild(e.render())}else{const e=new O;e.init(),r.appendChild(e.element)}};window.addEventListener("hashchange",n),n()});

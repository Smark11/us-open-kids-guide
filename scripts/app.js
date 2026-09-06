/* Nora's US Open Guide — vanilla ES2017, no build step. Data comes from data/players.js (self.PLAYERS_DATA). */
(function () {
  'use strict';
  var DATA = window.PLAYERS_DATA || { config: {}, schedule: {}, matches: [], players: [] };
  var PLAYERS = DATA.players || [];
  var MATCHES = DATA.matches || [];
  var CONFIG = DATA.config || {};
  var OOP = !!(DATA.schedule && DATA.schedule.orderOfPlayPublished);
  var bySlug = {};
  PLAYERS.forEach(function (p) { bySlug[p.slug] = p; });
  var FAV_KEY = 'nora-favorites';
  var TIER = { 1: { label: 'Superstars', emoji: '⭐' }, 2: { label: 'Seeded', emoji: '🌱' }, 3: { label: 'Underdogs', emoji: '🐶' } };
  var COURT_ORDER = ['Arthur Ashe Stadium', 'Louis Armstrong Stadium', 'Grandstand'];
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function flagOf(p) {
    if (p.flagEmoji) return p.flagEmoji;
    var c = (p.country || '').toUpperCase();
    if (c.length !== 2) return '🎾';
    return String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65, 0x1F1E6 + c.charCodeAt(1) - 65);
  }
  function firstName(name) { return String(name || '').split(' ')[0]; }
  function initials(name) { var parts = String(name || '?').split(/\s+/).filter(Boolean); return ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase(); }
  function feetIn(cm) { if (!cm) return ''; var inches = Math.round(cm / 2.54); return Math.floor(inches / 12) + "'" + (inches % 12) + '"'; }
  function isTBD(v) { return v == null || v === '' || String(v).toUpperCase() === 'TBD'; }
  function hasPhoto(p) { return !!(p.photo && p.photo.localPath && p.photo.exists !== false); }
  function isAvatarPhoto(p) { return !!(p.photo && p.photo.isAvatar); }
  function tierInfo(t) { return TIER[t] || TIER[3]; }
  function tierTag(t) { return '<span class="tag t' + t + '">' + tierInfo(t).emoji + ' ' + tierInfo(t).label + '</span>'; }
  function courtIcon(court) { return /ashe/i.test(court) ? '🏟️' : /armstrong/i.test(court) ? '🎪' : /grandstand/i.test(court) ? '🎡' : '🎾'; }
  function fmtTime(t) { var m = /^(\d{1,2}):(\d{2})$/.exec(String(t || '')); if (!m) return t; var h = +m[1]; return (h % 12 || 12) + ':' + m[2] + (h < 12 ? ' AM' : ' PM'); }
  function sessionLabel(s) { return s === 'night' ? '🌙 Night' : s === 'day' ? '☀️ Day' : 'Session: TBD'; }
  function courtRank(c) { var i = COURT_ORDER.indexOf(c); if (i >= 0) return i; var n = parseInt(String(c).replace(/\D/g, ''), 10); return 10 + (isNaN(n) ? 99 : n); }
  function hometownOf(p) {
    var h = String(p.hometown || ''), cn = p.countryName || '';
    if (cn && h.slice(-cn.length - 2).toLowerCase() === (', ' + cn).toLowerCase()) h = h.slice(0, -cn.length - 2);
    return h;
  }
  function handOf(p) { var s = String(p.plays || ''); return /left/i.test(s) ? '🤚 Lefty!' : /right/i.test(s) ? '✋ Righty' : ''; }
  var AVATAR_COLORS = [['#1D4ED8', '#FDE047'], ['#0F766E', '#FDE68A'], ['#BE123C', '#FBCFE8'], ['#7C3AED', '#DDD6FE'], ['#EA580C', '#FFEDD5'], ['#0369A1', '#BAE6FD'], ['#15803D', '#BBF7D0'], ['#B45309', '#FEF3C7']];
  function avatarSVG(p) {
    var h = 0; for (var i = 0; i < p.slug.length; i++) h = (h * 31 + p.slug.charCodeAt(i)) >>> 0;
    var c = AVATAR_COLORS[h % AVATAR_COLORS.length];
    return '<svg class="avatar" viewBox="0 0 400 400" role="img" aria-label="' + esc(p.name) + '">' +
      '<rect width="400" height="400" fill="' + c[0] + '"/><circle cx="200" cy="200" r="150" fill="' + c[1] + '"/>' +
      '<path d="M95 95 Q200 200 95 305" fill="none" stroke="' + c[0] + '" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M305 95 Q200 200 305 305" fill="none" stroke="' + c[0] + '" stroke-width="10" stroke-linecap="round"/>' +
      '<text x="200" y="236" font-size="112" font-weight="900" text-anchor="middle" fill="' + c[0] + '">' + esc(initials(p.name)) + '</text></svg>';
  }
  function photoHTML(p) {
    if (!hasPhoto(p)) return avatarSVG(p);
    return '<img src="' + esc(p.photo.localPath) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async" data-slug="' + esc(p.slug) + '">';
  }
  function seedBadge(seed) {
    if (seed) return '<span class="seed" title="Seed ' + seed + '" aria-label="Seed ' + seed + '">' + seed + '</span>';
    return '<span class="seed none" title="Not seeded" aria-label="Not seeded">🎾</span>';
  }
  function matchOf(p) { var m = p.matchTomorrow; if (!m) return null; return MATCHES.filter(function (x) { return x.id === m.matchId; })[0] || null; }
  function courtOf(p) { var m = matchOf(p); return m ? m.court : (p.matchTomorrow && p.matchTomorrow.court); }
  function sessionOf(p) { var m = matchOf(p); return m ? m.session : (p.matchTomorrow && p.matchTomorrow.session); }
  /* Saturday (today) vs Sunday vs finished Friday: players carry playsSaturday/eliminated, matches carry day (missing = today) */
  var TODAY = (DATA.schedule && DATA.schedule.date) || '';
  function playsToday(p) { return p.playsSaturday !== false; }
  function isOut(p) { return !!p.eliminated; }
  function isToday(m) { return !m.day || !TODAY || m.day === TODAY; }
  function isPast(m) { return !!(m.day && TODAY && m.day < TODAY); }
  var TODAY_MATCHES = MATCHES.filter(isToday), LATER_MATCHES = MATCHES.filter(function (m) { return !isToday(m) && !isPast(m); }), PAST_MATCHES = MATCHES.filter(isPast);
  var SAT = PLAYERS.filter(playsToday), SUN = PLAYERS.filter(function (p) { return !playsToday(p) && !isOut(p); }), FRI = PLAYERS.filter(isOut);
  PLAYERS = SAT.concat(SUN, FRI); // "All" order: today first, then Sunday, then finished Friday
  function roundShort(r) { return { 'Third round': '3rd round', 'Fourth round': '4th round' }[r] || String(r || '').toLowerCase() || '4th round'; }
  function bySlot(a, b) { var sa = a.session === 'night' ? 1 : 0, sb = b.session === 'night' ? 1 : 0; return sa - sb || (a.order || 99) - (b.order || 99); }
  // first not-yet-started match on each court = "Up next" (over all matches, so filters never shift it)
  var UP_NEXT = {};
  (function () {
    var g = {};
    TODAY_MATCHES.forEach(function (m) { if (!isTBD(m.court)) (g[m.court] = g[m.court] || []).push(m); });
    Object.keys(g).forEach(function (c) { var s = g[c].sort(bySlot).filter(function (m) { return !m.status || m.status === 'scheduled'; })[0]; if (s) UP_NEXT[s.id] = true; });
  })();
  function statusChip(m) {
    if (m.status === 'completed') return '<span class="tag done">✅ Done</span>';
    if (m.status === 'in_progress') return '<span class="tag live">🔴 On now</span>';
    if (UP_NEXT[m.id]) return '<span class="tag next">⏭️ Up next</span>';
    return '';
  }

  /* ---------- favorites ---------- */
  var favorites = new Set();
  try { var raw = localStorage.getItem(FAV_KEY); if (raw) JSON.parse(raw).forEach(function (s) { favorites.add(s); }); } catch (e) { /* private mode etc. */ }
  function saveFavs() { try { localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favorites))); } catch (e) { /* ignore */ } }
  function favButton(p, big) {
    var on = favorites.has(p.slug);
    return '<button type="button" class="fav" data-fav="' + esc(p.slug) + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Remove ' : 'Add ') + esc(p.name) + (on ? ' from favorites' : ' to favorites') + '">' + (on ? '⭐' : '☆') + '</button>';
  }
  function toggleFav(slug) {
    if (favorites.has(slug)) favorites.delete(slug); else favorites.add(slug);
    saveFavs();
    var on = favorites.has(slug), name = (bySlug[slug] || {}).name || '';
    document.querySelectorAll('[data-fav="' + slug + '"]').forEach(function (b) {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.setAttribute('aria-label', (on ? 'Remove ' : 'Add ') + name + (on ? ' from favorites' : ' to favorites'));
      b.textContent = on ? '⭐' : '☆';
    });
    if (filters.fav) renderGrid(); else renderCount();
    renderMatches();
  }

  /* ---------- filters ---------- */
  // Default is "All" (sorted today → Sunday → Friday) so nobody is hidden under a pill she has not tapped yet.
  var filters = { day: 'all', draw: null, tier: null, court: null, session: null, fav: false };
  function dayOf(p) { return isOut(p) ? 'fri' : playsToday(p) ? 'sat' : 'sun'; }
  function matchesFilters(p) {
    if (filters.day !== 'all' && dayOf(p) !== filters.day) return false;
    if ((filters.court || filters.session) && !playsToday(p)) return false; // court/session pills are today's order of play
    if (filters.fav && !favorites.has(p.slug)) return false;
    if (filters.draw && p.draw !== filters.draw) return false;
    if (filters.tier && String(p.tier) !== String(filters.tier)) return false;
    if (filters.court && courtOf(p) !== filters.court) return false;
    if (filters.session && sessionOf(p) !== filters.session) return false;
    return true;
  }
  function pill(opts) {
    return '<button type="button" class="pill ' + (opts.cls || '') + '" data-f="' + opts.key + '" data-v="' + esc(opts.value) + '" aria-pressed="' + (opts.on ? 'true' : 'false') + '">' + opts.label + '</button>';
  }
  function renderFilters() {
    var days = [['sat', '🎾 Playing today (Sat)']];
    if (SUN.length) days.push(['sun', '📅 Playing Sunday']);
    if (FRI.length) days.push(['fri', '🏁 Finished Friday']);
    days.push(['all', 'All']);
    $('filter-day').innerHTML = days.length > 2 ? days.map(function (d) {
      return pill({ key: 'day', value: d[0], on: filters.day === d[0], cls: 'daypill ' + d[0], label: d[1] });
    }).join('') : '';
    $('day-note').hidden = !(days.length > 2 && filters.day === 'all');
    $('filter-draw').innerHTML =
      pill({ key: 'fav', value: '1', on: filters.fav, cls: 'favpill', label: '⭐ My favorites' }) +
      pill({ key: 'draw', value: 'women', on: filters.draw === 'women', label: '👩 Women' }) +
      pill({ key: 'draw', value: 'men', on: filters.draw === 'men', label: '👨 Men' });
    $('filter-tier').innerHTML = [1, 2, 3].map(function (t) {
      return pill({ key: 'tier', value: t, on: String(filters.tier) === String(t), cls: 't' + t, label: tierInfo(t).emoji + ' ' + tierInfo(t).label });
    }).join('');
    var courts = uniq(TODAY_MATCHES.map(function (m) { return m.court; }).filter(function (c) { return !isTBD(c); })).sort(function (a, b) { return courtRank(a) - courtRank(b); });
    var sessions = uniq(TODAY_MATCHES.map(function (m) { return m.session; }).filter(function (s) { return !isTBD(s); }));
    $('filter-court').innerHTML = courts.map(function (c) {
      return pill({ key: 'court', value: c, on: filters.court === c, label: courtIcon(c) + ' ' + esc(shortCourt(c)) });
    }).join('');
    $('filter-session').innerHTML = sessions.map(function (s) {
      return pill({ key: 'session', value: s, on: filters.session === s, cls: s, label: sessionLabel(s) });
    }).join('');
    $('court-note').hidden = courts.length > 0;
  }
  function shortCourt(c) { return String(c).replace('Arthur Ashe Stadium', 'Ashe').replace('Louis Armstrong Stadium', 'Armstrong'); }
  function uniq(a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }); }
  function resetFilters() { filters = { day: 'all', draw: null, tier: null, court: null, session: null, fav: false }; }
  $('filters').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-f]'); if (!b) return;
    var k = b.getAttribute('data-f'), v = b.getAttribute('data-v');
    if (k === 'fav') filters.fav = !filters.fav; else if (k === 'day') filters.day = v; else filters[k] = (String(filters[k]) === v) ? null : v;
    renderFilters(); renderGrid(); renderMatches();
  });
  $('clear-filters').addEventListener('click', function () { resetFilters(); renderFilters(); renderGrid(); renderMatches(); });

  /* ---------- hero + section order ---------- */
  function renderHero() {
    var kid = CONFIG.kidName || '';
    var title = (kid ? kid + "'s" : 'My') + ' US Open Guide';
    document.title = title;
    $('hero-title').innerHTML = '<span class="hero-name">' + esc(kid ? kid + "'s" : 'My') + '</span><span class="hero-rest">US Open Guide</span>';
    (function () {
      var parts = (CONFIG.eventLabel || '').split(' · ');
      var el = $('hero-date'); el.textContent = '';
      el.appendChild(document.createTextNode(parts[0] || ''));
      if (parts.length > 1) { el.appendChild(document.createTextNode(' · ')); var sp = document.createElement('span'); sp.className = 'nowrap'; sp.textContent = parts.slice(1).join(' · '); el.appendChild(sp); }
    })();
    var counts = SUN.length ? SAT.length + ' playing today · ' + SUN.length + ' more still in it' + (FRI.length ? ' · ' + FRI.length + ' finished Friday' : '') : PLAYERS.length + ' players · ' + MATCHES.length + ' matches';
    $('hero-kicker').textContent = (kid ? kid + "'s collector's guide · " : '') + counts;
    // While the order of play is unknown the matches carry little a kid can use: album first.
    var main = $('main'), players = $('players'), matches = $('matches');
    if (OOP) main.insertBefore(matches, players); else main.insertBefore(players, matches);
  }

  /* ---------- matches ---------- */
  function playerBtn(mp, right, m) {
    if (!mp || !mp.slug) return '<span class="match-player' + (right ? ' right' : '') + '"><span class="nm">TBD</span></span>';
    var p = bySlug[mp.slug] || mp;
    var fav = favorites.has(mp.slug) ? ' <span class="fav-dot" aria-label="favorite">⭐</span>' : '';
    var won = m && m.winnerSlug === mp.slug;
    return '<button type="button" class="match-player' + (right ? ' right' : '') + (won ? ' won' : '') + '" data-open="' + esc(mp.slug) + '" aria-label="Open ' + esc(p.name) + (won ? ', winner' : '') + '">' +
      '<span class="flag" aria-hidden="true">' + flagOf(p) + '</span>' + seedBadge(mp.seed) +
      '<span class="nm">' + esc(p.name) + (won ? ' <span class="won-dot" aria-hidden="true">🏆</span>' : '') + fav + '</span></button>';
  }
  function matchCard(m, compact) {
    var meta = '<span class="tag">' + (m.draw === 'women' ? "👩 Women's" : "👨 Men's") + '</span>';
    if (isPast(m)) meta += '<span class="tag fri">🏁 Fri</span>'; // finished days: who won and the score is all that matters
    else {
      if (compact) meta += isTBD(m.court) ? '<span class="tag">🏟️ Court &amp; time: coming soon</span>' : '<span class="tag">' + courtIcon(m.court) + ' ' + esc(shortCourt(m.court)) + '</span>';
      if (!isTBD(m.session)) meta += '<span class="tag ' + esc(m.session) + '">' + sessionLabel(m.session) + '</span>';
      if (m.order) meta += '<span class="tag">Match ' + m.order + (m.startTimeET ? ' · ' + esc(fmtTime(m.startTimeET)) + ' ET' : '') + '</span>';
      else if (m.startTimeET) meta += '<span class="tag">' + esc(fmtTime(m.startTimeET)) + ' ET</span>';
      meta += statusChip(m);
    }
    if (m.status === 'completed' && m.score) meta += '<span class="tag">' + esc(m.score) + '</span>';
    var ps = m.players || [], a = bySlug[(ps[0] || {}).slug] || ps[0] || {}, b = bySlug[(ps[1] || {}).slug] || ps[1] || {};
    return '<article class="match' + (compact ? ' compact' : '') + '" aria-label="' + esc(a.name || 'TBD') + ' versus ' + esc(b.name || 'TBD') + '">' +
      '<div class="match-meta">' + meta + '</div>' +
      '<div class="match-row">' + playerBtn(ps[0], false, m) + '<span class="vs" aria-hidden="true">vs</span>' + playerBtn(ps[1], true, m) + '</div></article>';
  }
  function matchVisible(m) {
    if (filters.draw && m.draw !== filters.draw) return false;
    if (filters.tier && !m.players.some(function (mp) { var p = bySlug[mp.slug]; return p && String(p.tier) === String(filters.tier); })) return false;
    if (filters.court && m.court !== filters.court) return false;
    if (filters.session && m.session !== filters.session) return false;
    if (filters.fav && !m.players.some(function (p) { return favorites.has(p.slug); })) return false;
    return true;
  }
  function renderMatches() {
    var banner = $('oop-banner'), list = $('matches-list');
    var visible = TODAY_MATCHES.filter(matchVisible), html;
    var anyCourt = TODAY_MATCHES.some(function (m) { return !isTBD(m.court); });
    if (!OOP || !anyCourt) {
      $('matches-title').textContent = "Saturday's Matches";
      banner.hidden = false;
      banner.innerHTML = '<span class="big" aria-hidden="true">📣</span><span>Courts and times get announced <strong>Saturday morning</strong> — check back! Here is everyone playing.</span>';
      html = '<div class="match-cards">' + visible.map(function (m) { return matchCard(m); }).join('') + '</div>';
    } else {
      $('matches-title').textContent = "Who's playing where";
      banner.hidden = true;
      var groups = {};
      visible.forEach(function (m) { var c = isTBD(m.court) ? 'Court TBD' : m.court; (groups[c] = groups[c] || []).push(m); });
      var courts = Object.keys(groups).sort(function (a, b) { return courtRank(a) - courtRank(b); });
      html = courts.map(function (c) {
        var ms = groups[c].sort(bySlot);
        return '<section class="court-group" aria-label="' + esc(c) + '"><h3 class="court-head"><span class="court-icon" aria-hidden="true">' + courtIcon(c) + '</span>' + esc(c) + '</h3><div class="match-cards">' + ms.map(function (m) { return matchCard(m); }).join('') + '</div></section>';
      }).join('');
    }
    if (!visible.length) html = '<div class="empty"><p class="empty-big">No matches match!</p><p>Try another filter.</p></div>';
    // Sunday's matches: compact rows; court/session pills describe today's order of play, so they hide this block
    if (LATER_MATCHES.length && !filters.court && !filters.session) {
      var later = LATER_MATCHES.filter(matchVisible);
      html += '<section class="court-group later" aria-label="Sunday\'s matches"><h3 class="court-head"><span class="court-icon" aria-hidden="true">📅</span>Sunday\'s 4th-round matches</h3>' +
        (later.length ? '<div class="match-cards">' + later.map(function (m) { return matchCard(m, true); }).join('') + '</div>' : '<p class="filter-note">No Sunday matches match this filter.</p>') + '</section>';
    }
    // Friday's results: collapsed by default (the day is over), same compact rows
    if (PAST_MATCHES.length && !filters.court && !filters.session) {
      var past = PAST_MATCHES.filter(matchVisible);
      html += '<details class="results-box court-group later" id="fri-results"' + (friOpen ? ' open' : '') + '><summary><h3 class="court-head"><span class="court-icon" aria-hidden="true">🏁</span>Friday\'s 3rd-round results</h3></summary>' +
        (past.length ? '<div class="match-cards">' + past.map(function (m) { return matchCard(m, true); }).join('') + '</div>' : '<p class="filter-note">No Friday matches match this filter.</p>') + '</details>';
    }
    list.innerHTML = html;
  }
  var friOpen = false;
  $('matches-list').addEventListener('toggle', function (e) { if (e.target.id === 'fri-results') friOpen = e.target.open; }, true);

  /* ---------- player grid ---------- */
  function cardChip(p) {
    if (isOut(p)) return '<span class="tag chip fri">🏁 Fri</span>';
    if (!playsToday(p)) return '<span class="tag chip sun">📅 Sun</span>';
    var c = courtOf(p); if (isTBD(c)) return '';
    var st = (matchOf(p) || {}).status;
    // Status wins over the court name on the small card chip (the court is in the detail sheet anyway).
    if (st === 'in_progress') return '<span class="tag chip live">🔴 On now</span>';
    if (st === 'completed') return '<span class="tag chip done">✅ Done</span>';
    return '<span class="tag chip">' + courtIcon(c) + ' ' + esc(shortCourt(c)) + '</span>';
  }
  function playerCard(p) {
    return '<div class="card-wrap">' +
      '<button type="button" class="card' + (isOut(p) ? ' out' : '') + '" data-open="' + esc(p.slug) + '" aria-label="Open ' + esc(p.name) + ' card' + (isOut(p) ? ', finished Friday' : '') + '">' +
        '<div class="card-photo">' + photoHTML(p) +
          '<span class="flag-big" aria-hidden="true">' + flagOf(p) + '</span>' + seedBadge(p.seed) + cardChip(p) + '</div>' +
        '<div class="card-body"><h3 class="card-name">' + esc(p.name) + '</h3>' +
          '<p class="card-tag">' + esc(p.nicknameOrTagline || p.countryName || '') + '</p>' +
          '<span class="card-tier">' + tierTag(p.tier) + '</span>' +
        '</div></button>' + favButton(p) + '</div>';
  }
  function renderCount() {
    var n = PLAYERS.filter(matchesFilters).length;
    var favs = favorites.size ? ' · ⭐ ' + favorites.size + ' collected' : '';
    var plain = !filters.draw && !filters.tier && !filters.court && !filters.session && !filters.fav;
    var txt = plain && (filters.day === 'sat' || filters.day === 'all') && SUN.length ? SAT.length + ' today · ' + SUN.length + ' more still in it' + (FRI.length ? ' · ' + FRI.length + ' finished Friday' : '')
      : plain && filters.day === 'sun' ? n + ' playing Sunday'
      : plain && filters.day === 'fri' ? n + ' finished Friday'
      : n === PLAYERS.length ? 'All ' + n + ' players' : n + ' of ' + PLAYERS.length + ' players';
    $('count').textContent = txt + favs;
  }
  function renderGrid() {
    var list = PLAYERS.filter(matchesFilters);
    $('grid').innerHTML = list.map(playerCard).join('');
    $('empty').hidden = list.length > 0;
    renderCount();
    if (!PLAYERS.length) { $('empty').hidden = false; $('empty').querySelector('.empty-big').textContent = 'Player cards are being printed…'; }
  }
  document.addEventListener('click', function (e) {
    var f = e.target.closest('button[data-fav]');
    if (f) { toggleFav(f.getAttribute('data-fav')); return; }
    var o = e.target.closest('[data-open]');
    if (o && !o.closest('#sheet')) { lastFocus = o; openedFromPage = true; location.hash = '#p/' + o.getAttribute('data-open'); }
  });
  document.addEventListener('error', function (e) {
    var img = e.target; if (!img || img.tagName !== 'IMG' || !img.dataset.slug) return;
    var p = bySlug[img.dataset.slug]; if (!p) return;
    var wrap = document.createElement('span'); wrap.innerHTML = avatarSVG(p);
    img.replaceWith(wrap.firstChild);
  }, true);

  /* ---------- detail sheet ---------- */
  var sheet = $('sheet'), sheetScroll = $('sheet-scroll'), lastFocus = null, openSlug = null, openedFromPage = false;
  function stat(k, v) { return v ? '<div class="stat"><span class="k">' + k + '</span><span class="v">' + v + '</span></div>' : ''; }
  function detailHTML(p) {
    var mt = p.matchTomorrow || {}; var m = matchOf(p) || mt;
    var court = m.court, session = m.session;
    var opp = mt.opponentSlug && bySlug[mt.opponentSlug];
    var today = playsToday(p), out = isOut(p);
    var oppName = opp ? opp.name : mt.opponent;
    var courtTxt = isTBD(court) ? (out ? '' : today ? '🏟️ Court and time: coming soon!' : '🏟️ Court and time: announced Saturday evening!')
      : courtIcon(court) + ' ' + esc(court) + (isTBD(session) ? '' : ' · ' + sessionLabel(session) + ' session') + (out ? '' : m.startTimeET ? ' · ' + esc(fmtTime(m.startTimeET)) : m.startTimeNote ? ' · ' + esc(m.startTimeNote) : '');
    var sessTxt = isTBD(session) ? '' : '<span class="tag ' + esc(session) + '">' + sessionLabel(session) + '</span>';
    var timeTxt = m.order && !out ? '<span class="tag">Match ' + m.order + (isTBD(court) && m.startTimeET ? ' · ' + esc(fmtTime(m.startTimeET)) + ' ET' : '') + '</span>' : '';
    // Eliminated players: always kind, never a red "lost" style — she played a great tournament.
    var result = out ? '<p class="result">💪 Played a great tournament!</p>' + (oppName ? '<p>Played <strong>' + esc(oppName) + '</strong> on Friday' + (m.score ? ' · ' + esc(m.score) : '') + '</p>' : '')
      : m.status === 'completed' ? '<p class="result">' + (m.winnerSlug === p.slug ? '✅ Won!' + (m.score ? ' ' + esc(m.score) : '') : m.winnerSlug ? '💪 Played a great match today!' : '🏁 Match finished!') + '</p>'
      : m.status === 'in_progress' ? '<p class="result">🔴 On court right now!</p>' : '';
    var fri = p.fridayMatchId && !out ? MATCHES.filter(function (x) { return x.id === p.fridayMatchId; })[0] : null;
    var friTxt = fri && fri.winnerSlug === p.slug ? '<p>✅ Won on Friday' + (fri.score ? ' · ' + esc(fri.score) : '') + '</p>' : '';
    var idx = PLAYERS.indexOf(p);
    var prev = PLAYERS[(idx - 1 + PLAYERS.length) % PLAYERS.length], next = PLAYERS[(idx + 1) % PLAYERS.length];
    var facts = (p.funFacts || []).map(function (f, i) {
      return '<button type="button" class="flip" aria-pressed="false" aria-label="Fun fact ' + (i + 1) + ', tap to flip"><div class="flip-inner">' +
        '<div class="face front c' + (i % 3) + '"><span class="q" aria-hidden="true">?</span><span class="n">Fun fact #' + (i + 1) + '</span><span class="tap">Tap to flip! 🔄</span></div>' +
        '<div class="face back" aria-hidden="true"><span class="n">#' + (i + 1) + '</span>' + esc(f.text || f) + '</div></div></button>';
    }).join('');
    var srcs = (p.sources || []).map(function (s) { return '<li><a href="' + esc(s) + '" target="_blank" rel="noopener">' + esc(s.replace(/^https?:\/\/(www\.)?/, '').slice(0, 60)) + '</a></li>'; }).join('');
    var home = hometownOf(p);
    return '<div class="d-top"><div class="d-photo">' + photoHTML(p) + '</div>' +
        (hasPhoto(p) && !isAvatarPhoto(p) ? '' : '<span class="d-mystery">🕵️ No photo yet — a mystery card!</span>') +
        '<button type="button" class="d-close" id="d-close" aria-label="Close">✕</button></div>' +
      '<div class="d-head"><span class="flag-big" aria-hidden="true">' + flagOf(p) + '</span><div class="grow">' +
        '<h2 class="d-name" id="sheet-name">' + esc(p.name) + '</h2>' +
        (p.nicknameOrTagline ? '<p class="d-tagline">“' + esc(p.nicknameOrTagline) + '”</p>' : '') +
        '<p class="d-country">' + esc(p.countryName || p.country || '') + (home ? ' · from ' + esc(home) : '') + '</p>' +
      '</div>' + favButton(p, true) + '</div>' +
      '<div class="d-body">' +
        '<div class="stats">' +
          stat('Age', p.age) + stat('Seed', p.seed ? '#' + p.seed : '<small>no seed</small>') +
          stat('Height', p.heightCm ? feetIn(p.heightCm) + '<small>' + p.heightCm + ' cm</small>' : '') +
          stat('Hits with', handOf(p) ? '<small style="font-size:20px">' + handOf(p) + '</small>' : '') +
        '</div>' +
        '<section class="box match-box" aria-label="' + (out ? "Friday's match" : today ? "Today's match" : "Sunday's match") + '"><h3>' + (out ? "🏁 Friday's match" : today ? "🎾 Today's match" : "📅 Sunday's match (" + esc(roundShort(mt.round || p.round)) + ')') + '</h3>' + result +
          (mt.opponent ? (out ? '' : '<p>vs</p>') + '<button type="button" class="opp" data-open="' + esc(mt.opponentSlug || '') + '"' + (opp ? '' : ' disabled') + '>' + (opp ? flagOf(opp) + ' ' : '') + esc(oppName) + (opp ? ' ▸' : '') + '</button>' : '<p>Opponent coming soon!</p>') +
          (courtTxt ? '<p>' + courtTxt + '</p>' : '') + friTxt + '<div class="tags">' + tierTag(p.tier) + sessTxt + timeTxt + '</div></section>' +
        (p.watchFor ? '<section class="box watch"><h3>Watch for this! 👀</h3><p>' + esc(p.watchFor) + '</p></section>' : '') +
        (facts ? '<section aria-label="Fun facts"><h3 class="facts-h">🤩 Fun facts — tap to collect!</h3><div class="facts">' + facts + '</div></section>' : '') +
        (p.intro ? '<section class="box"><h3>👋 Meet ' + esc(firstName(p.name)) + '</h3><p>' + esc(p.intro) + '</p></section>' : '') +
        (p.story ? '<section class="box"><h3>📖 The story</h3><p>' + esc(p.story) + '</p></section>' : '') +
        (p.ranking ? '<p class="verified">World ranking: #' + p.ranking + (p.seed ? ' · Seed #' + p.seed : '') + '</p>' : '') +
        '<details><summary>Where this came from</summary><ul class="src-list">' + (srcs || '<li>Sources coming soon.</li>') + '</ul>' +
          (p.photo && !isAvatarPhoto(p) && hasPhoto(p) ? '<p class="verified">Photo: ' + esc(p.photo.author || 'Unknown') + ' · ' + esc(p.photo.license || '') + (p.photo.sourceUrl ? ' · <a href="' + esc(p.photo.sourceUrl) + '" target="_blank" rel="noopener">source</a>' : '') + '</p>' : '') +
        '</details>' +
      '</div>' +
      '<nav class="d-nav" aria-label="Other players">' +
        '<button type="button" class="pill" data-nav="' + esc(prev.slug) + '" aria-label="Previous: ' + esc(prev.name) + '">◀ <span class="nm">' + esc(prev.name) + '</span></button>' +
        '<button type="button" class="pill close" data-close aria-label="Close">✕ Close</button>' +
        '<button type="button" class="pill" data-nav="' + esc(next.slug) + '" aria-label="Next: ' + esc(next.name) + '"><span class="nm">' + esc(next.name) + '</span> ▶</button>' +
      '</nav>';
  }
  function openDetail(slug) {
    var p = bySlug[slug]; if (!p) { closeDetail(); return; }
    openSlug = slug;
    sheetScroll.innerHTML = detailHTML(p);
    sheetScroll.scrollTop = 0;
    sheet.hidden = false;
    document.body.classList.add('locked');
    $('d-close').focus({ preventScroll: true });
  }
  function closeDetail() {
    if (sheet.hidden) return;
    sheet.hidden = true; openSlug = null;
    document.body.classList.remove('locked');
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  function requestClose() {
    if (location.hash.indexOf('#p/') === 0) {
      // Only go back through history when WE pushed this hash from a tap on the page;
      // a deep link opened directly must never navigate away from the site.
      if (openedFromPage) { openedFromPage = false; history.back(); }
      else { history.replaceState(null, '', location.pathname + location.search); closeDetail(); }
    } else closeDetail();
  }
  function route() {
    var h = decodeURIComponent(location.hash || '');
    if (h.indexOf('#p/') === 0) openDetail(h.slice(3));
    else { openedFromPage = false; closeDetail(); }
  }
  function swapTo(slug) { history.replaceState(null, '', '#p/' + slug); openDetail(slug); }
  sheet.addEventListener('click', function (e) {
    if (e.target === sheet || e.target.closest('#d-close') || e.target.closest('[data-close]')) { requestClose(); return; }
    var nav = e.target.closest('[data-nav]');
    if (nav) { swapTo(nav.getAttribute('data-nav')); return; }
    var opp = e.target.closest('.opp[data-open]');
    if (opp && !opp.disabled) { swapTo(opp.getAttribute('data-open')); return; }
    var flip = e.target.closest('.flip');
    if (flip) {
      var on = flip.getAttribute('aria-pressed') !== 'true';
      flip.setAttribute('aria-pressed', on ? 'true' : 'false');
      flip.querySelector('.face.front').setAttribute('aria-hidden', on ? 'true' : 'false');
      flip.querySelector('.face.back').setAttribute('aria-hidden', on ? 'false' : 'true');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (sheet.hidden) return;
    if (e.key === 'Escape') { requestClose(); return; }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      var btns = sheetScroll.querySelectorAll('[data-nav]');
      var b = btns[e.key === 'ArrowRight' ? 1 : 0]; if (b) b.click();
    }
    if (e.key === 'Tab') { // keep focus inside the dialog
      var f = sheetScroll.querySelectorAll('button:not([disabled]), a[href], summary');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('hashchange', route);

  /* ---------- credits ---------- */
  function renderCredits() {
    var items = PLAYERS.filter(function (p) { return p.photo && !isAvatarPhoto(p) && hasPhoto(p); });
    $('credits').innerHTML = items.length ? items.map(function (p) {
      var ph = p.photo;
      var lic = esc(ph.license || 'see source');
      return '<li>' + esc(p.name) + ' — ' + esc(ph.author || 'Unknown') + ' — ' + (ph.sourceUrl ? '<a href="' + esc(ph.sourceUrl) + '" target="_blank" rel="noopener">' + lic + '</a>' : lic) + '</li>';
    }).join('') : '<li>All photos are drawn avatars (no credits needed).</li>';
    var g = DATA.generatedAt ? 'Guide last updated ' + esc(String(DATA.generatedAt).replace('T', ' ').slice(0, 16)) + '.' : '';
    var v = PLAYERS.filter(function (p) { return p.verified; }).length;
    $('generated').textContent = g + (v ? ' ' + v + ' of ' + PLAYERS.length + ' player cards fact-checked.' : '');
  }

  /* ---------- boot ---------- */
  renderHero(); renderFilters(); renderMatches(); renderGrid(); renderCredits(); route();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('./sw.js').catch(function () { /* offline-first is a bonus, not required */ }); });
  }
})();

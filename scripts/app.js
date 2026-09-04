/* Nora's US Open Guide — vanilla ES2017, no build step. Data comes from data/players.js (window.PLAYERS_DATA). */
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
  var TIER = { 1: { label: 'Superstars', emoji: '🔥' }, 2: { label: 'Seeds', emoji: '🌱' }, 3: { label: 'Rising Stars', emoji: '🚀' } };
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
  function initials(name) { var parts = String(name || '?').split(/\s+/).filter(Boolean); return ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase(); }
  function feetIn(cm) { if (!cm) return ''; var inches = Math.round(cm / 2.54); return Math.floor(inches / 12) + "'" + (inches % 12) + '"'; }
  function isTBD(v) { return v == null || v === '' || String(v).toUpperCase() === 'TBD'; }
  function hasPhoto(p) { return !!(p.photo && p.photo.localPath && p.photo.exists !== false); }
  function isAvatarPhoto(p) { return !!(p.photo && p.photo.isAvatar); }
  function tierInfo(t) { return TIER[t] || TIER[3]; }
  function courtIcon(court) { return /ashe/i.test(court) ? '🏟️' : /armstrong/i.test(court) ? '🎪' : /grandstand/i.test(court) ? '🎡' : '🎾'; }
  function sessionLabel(s) { return s === 'night' ? '🌙 Night' : s === 'day' ? '☀️ Day' : 'Session: TBD'; }
  function courtRank(c) { var i = COURT_ORDER.indexOf(c); if (i >= 0) return i; var n = parseInt(String(c).replace(/\D/g, ''), 10); return 10 + (isNaN(n) ? 99 : n); }
  var AVATAR_COLORS = [['#1D4ED8', '#FDE047'], ['#0F766E', '#FDE68A'], ['#BE123C', '#FBCFE8'], ['#7C3AED', '#DDD6FE'], ['#EA580C', '#FFEDD5'], ['#0369A1', '#BAE6FD'], ['#15803D', '#BBF7D0'], ['#B45309', '#FEF3C7']];
  function avatarSVG(p) {
    var h = 0; for (var i = 0; i < p.slug.length; i++) h = (h * 31 + p.slug.charCodeAt(i)) >>> 0;
    var c = AVATAR_COLORS[h % AVATAR_COLORS.length];
    return '<svg class="avatar" viewBox="0 0 400 400" role="img" aria-label="' + esc(p.name) + '">' +
      '<rect width="400" height="400" fill="' + c[0] + '"/><circle cx="200" cy="200" r="150" fill="' + c[1] + '"/>' +
      '<path d="M95 95 Q200 200 95 305" fill="none" stroke="' + c[0] + '" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M305 95 Q200 200 305 305" fill="none" stroke="' + c[0] + '" stroke-width="10" stroke-linecap="round"/>' +
      '<text x="200" y="236" font-size="112" font-weight="900" text-anchor="middle" fill="' + c[0] + '">' + esc(initials(p.name)) + '</text>' +
      '<text x="330" y="90" font-size="64" text-anchor="middle">' + flagOf(p) + '</text></svg>';
  }
  function photoHTML(p, cls) {
    if (!hasPhoto(p)) return avatarSVG(p);
    return '<img src="' + esc(p.photo.localPath) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async" data-slug="' + esc(p.slug) + '"' + (cls ? ' class="' + cls + '"' : '') + '>';
  }
  function seedBadge(seed, big) {
    if (seed) return '<span class="seed" title="Seed ' + seed + '" aria-label="Seed ' + seed + '">' + seed + '</span>';
    return '<span class="seed none" aria-label="Not seeded">' + (big ? 'un-<br>seeded' : '—') + '</span>';
  }
  function matchOf(p) { var m = p.matchTomorrow; if (!m) return null; return MATCHES.filter(function (x) { return x.id === m.matchId; })[0] || null; }
  function courtOf(p) { var m = matchOf(p); return m ? m.court : (p.matchTomorrow && p.matchTomorrow.court); }
  function sessionOf(p) { var m = matchOf(p); return m ? m.session : (p.matchTomorrow && p.matchTomorrow.session); }

  /* ---------- favorites ---------- */
  var favorites = new Set();
  try { var raw = localStorage.getItem(FAV_KEY); if (raw) JSON.parse(raw).forEach(function (s) { favorites.add(s); }); } catch (e) { /* private mode etc. */ }
  function saveFavs() { try { localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(favorites))); } catch (e) { /* ignore */ } }
  function toggleFav(slug) {
    if (favorites.has(slug)) favorites.delete(slug); else favorites.add(slug);
    saveFavs();
    document.querySelectorAll('[data-fav="' + slug + '"]').forEach(function (b) {
      var on = favorites.has(slug);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.setAttribute('aria-label', (on ? 'Remove ' : 'Add ') + (bySlug[slug] || {}).name + (on ? ' from favorites' : ' to favorites'));
    });
    if (filters.fav) renderGrid();
    renderMatches();
  }

  /* ---------- filters ---------- */
  var filters = { draw: null, tier: null, court: null, session: null, fav: false };
  function matchesFilters(p) {
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
    $('filter-draw').innerHTML =
      pill({ key: 'fav', value: '1', on: filters.fav, cls: 'favpill', label: '⭐ My favorites' }) +
      pill({ key: 'draw', value: 'women', on: filters.draw === 'women', label: '👩 Women' }) +
      pill({ key: 'draw', value: 'men', on: filters.draw === 'men', label: '👨 Men' });
    $('filter-tier').innerHTML = [1, 2, 3].map(function (t) {
      return pill({ key: 'tier', value: t, on: String(filters.tier) === String(t), cls: 't' + t, label: tierInfo(t).emoji + ' ' + tierInfo(t).label });
    }).join('');
    var courts = uniq(MATCHES.map(function (m) { return m.court; }).filter(function (c) { return !isTBD(c); })).sort(function (a, b) { return courtRank(a) - courtRank(b); });
    var sessions = uniq(MATCHES.map(function (m) { return m.session; }).filter(function (s) { return !isTBD(s); }));
    $('filter-court').innerHTML = courts.length ? courts.map(function (c) {
      return pill({ key: 'court', value: c, on: filters.court === c, label: courtIcon(c) + ' ' + esc(shortCourt(c)) });
    }).join('') : '<span class="pill muted">🏟️ Court filters unlock Saturday morning!</span>';
    $('filter-session').innerHTML = sessions.map(function (s) {
      return pill({ key: 'session', value: s, on: filters.session === s, cls: s, label: sessionLabel(s) });
    }).join('');
  }
  function shortCourt(c) { return String(c).replace('Arthur Ashe Stadium', 'Ashe').replace('Louis Armstrong Stadium', 'Armstrong'); }
  function uniq(a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }); }
  $('filters').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-f]'); if (!b) return;
    var k = b.getAttribute('data-f'), v = b.getAttribute('data-v');
    if (k === 'fav') filters.fav = !filters.fav; else filters[k] = (String(filters[k]) === v) ? null : v;
    renderFilters(); renderGrid(); renderMatches();
  });
  $('clear-filters').addEventListener('click', function () {
    filters = { draw: null, tier: null, court: null, session: null, fav: false };
    renderFilters(); renderGrid(); renderMatches();
  });

  /* ---------- hero ---------- */
  function renderHero() {
    var kid = CONFIG.kidName || 'My';
    var title = (kid === 'My' ? 'My' : kid + "'s") + ' US Open Guide';
    document.title = title;
    $('hero-title').textContent = title;
    $('hero-date').textContent = CONFIG.eventLabel || '';
    $('hero-kicker').textContent = (PLAYERS.length || MATCHES.length * 2) + ' players · ' + MATCHES.length + ' matches';
  }

  /* ---------- matches ---------- */
  function playerBtn(mp, right) {
    var p = bySlug[mp.slug] || mp;
    var fav = favorites.has(mp.slug) ? '<span class="fav-dot" aria-label="favorite">⭐</span>' : '';
    return '<button type="button" class="match-player' + (right ? ' right' : '') + '" data-open="' + esc(mp.slug) + '" aria-label="Open ' + esc(mp.name) + '">' +
      '<span class="flag" aria-hidden="true">' + flagOf(p) + '</span>' + seedBadge(mp.seed) +
      '<span class="nm">' + esc(mp.name) + ' ' + fav + '</span></button>';
  }
  function matchCard(m) {
    var meta = '<span class="tag t' + m.tier + '">' + tierInfo(m.tier).emoji + ' ' + tierInfo(m.tier).label + '</span>' +
      '<span class="tag">' + (m.draw === 'women' ? "👩 Women's" : "👨 Men's") + '</span>';
    if (!isTBD(m.session)) meta += '<span class="tag ' + esc(m.session) + '">' + sessionLabel(m.session) + '</span>';
    if (m.order) meta += '<span class="tag">Match ' + m.order + (m.startTimeET ? ' · ' + esc(m.startTimeET) + ' ET' : '') + '</span>';
    else if (m.startTimeET) meta += '<span class="tag">' + esc(m.startTimeET) + ' ET</span>';
    return '<article class="match" aria-label="' + esc(m.players[0].name) + ' versus ' + esc(m.players[1].name) + '">' +
      '<div class="match-meta">' + meta + '</div>' +
      '<div class="match-row">' + playerBtn(m.players[0]) + '<span class="vs" aria-hidden="true">vs</span>' + playerBtn(m.players[1], true) + '</div></article>';
  }
  function matchVisible(m) {
    if (filters.draw && m.draw !== filters.draw) return false;
    if (filters.tier && String(m.tier) !== String(filters.tier)) return false;
    if (filters.court && m.court !== filters.court) return false;
    if (filters.session && m.session !== filters.session) return false;
    if (filters.fav && !m.players.some(function (p) { return favorites.has(p.slug); })) return false;
    return true;
  }
  function renderMatches() {
    var banner = $('oop-banner'), list = $('matches-list');
    var visible = MATCHES.filter(matchVisible);
    var anyCourt = MATCHES.some(function (m) { return !isTBD(m.court); });
    if (!OOP || !anyCourt) {
      $('matches-title').textContent = "Saturday's Matches";
      banner.hidden = false;
      banner.innerHTML = '<span class="big" aria-hidden="true">📣</span><span>Courts and times get announced <strong>Saturday morning</strong> — check back! Here is everyone playing.</span>';
      list.innerHTML = '<div class="match-cards">' + visible.map(matchCard).join('') + '</div>';
    } else {
      $('matches-title').textContent = "Who's playing where";
      banner.hidden = true;
      var groups = {};
      visible.forEach(function (m) { var c = isTBD(m.court) ? 'Court TBD' : m.court; (groups[c] = groups[c] || []).push(m); });
      var courts = Object.keys(groups).sort(function (a, b) { return courtRank(a) - courtRank(b); });
      list.innerHTML = courts.map(function (c) {
        var ms = groups[c].sort(function (a, b) {
          var sa = a.session === 'night' ? 1 : 0, sb = b.session === 'night' ? 1 : 0;
          return sa - sb || (a.order || 99) - (b.order || 99);
        });
        return '<section class="court-group" aria-label="' + esc(c) + '"><h3 class="court-head"><span class="court-icon" aria-hidden="true">' + courtIcon(c) + '</span>' + esc(c) + '</h3><div class="match-cards">' + ms.map(matchCard).join('') + '</div></section>';
      }).join('');
    }
    if (!visible.length) list.innerHTML = '<div class="empty"><p class="empty-big">No matches match!</p><p>Try another filter.</p></div>';
  }

  /* ---------- player grid ---------- */
  function playerCard(p) {
    var fav = favorites.has(p.slug);
    return '<div class="card-wrap">' +
      '<button type="button" class="card" data-open="' + esc(p.slug) + '" aria-label="Open ' + esc(p.name) + ' card">' +
        '<div class="card-photo">' + photoHTML(p) +
          '<span class="flag-big" aria-hidden="true">' + flagOf(p) + '</span>' + seedBadge(p.seed, true) + '</div>' +
        '<div class="card-body"><h3 class="card-name">' + esc(p.name) + '</h3>' +
          '<p class="card-tag">' + esc(p.nicknameOrTagline || p.countryName || '') + '</p>' +
          '<span class="card-tier"><span class="tag t' + p.tier + '">' + tierInfo(p.tier).emoji + ' ' + tierInfo(p.tier).label + '</span></span>' +
        '</div></button>' +
      '<button type="button" class="fav" data-fav="' + esc(p.slug) + '" aria-pressed="' + fav + '" aria-label="' + (fav ? 'Remove ' : 'Add ') + esc(p.name) + (fav ? ' from favorites' : ' to favorites') + '">' + (fav ? '⭐' : '☆') + '</button>' +
    '</div>';
  }
  function renderGrid() {
    var list = PLAYERS.filter(matchesFilters);
    $('grid').innerHTML = list.map(playerCard).join('');
    $('empty').hidden = list.length > 0;
    $('count').textContent = list.length ? (list.length === PLAYERS.length ? 'All ' + list.length + ' players' : list.length + ' of ' + PLAYERS.length + ' players') : '';
    if (!PLAYERS.length) { $('empty').hidden = false; $('empty').querySelector('.empty-big').textContent = 'Player cards are being printed…'; }
  }
  document.addEventListener('click', function (e) {
    var f = e.target.closest('button[data-fav]');
    if (f) { toggleFav(f.getAttribute('data-fav')); if (favorites.has(f.getAttribute('data-fav'))) f.textContent = '⭐'; else f.textContent = '☆'; return; }
    var o = e.target.closest('[data-open]');
    if (o) { lastFocus = o; location.hash = '#p/' + o.getAttribute('data-open'); }
  });
  document.addEventListener('error', function (e) {
    var img = e.target; if (!img || img.tagName !== 'IMG' || !img.dataset.slug) return;
    var p = bySlug[img.dataset.slug]; if (!p) return;
    var wrap = document.createElement('span'); wrap.innerHTML = avatarSVG(p);
    img.replaceWith(wrap.firstChild);
  }, true);

  /* ---------- detail sheet ---------- */
  var sheet = $('sheet'), sheetScroll = $('sheet-scroll'), lastFocus = null, openSlug = null;
  function stat(k, v, wide) { return v ? '<div class="stat' + (wide ? ' wide' : '') + '"><span class="k">' + k + '</span><span class="v">' + v + '</span></div>' : ''; }
  function detailHTML(p) {
    var mt = p.matchTomorrow || {}; var m = matchOf(p) || mt;
    var court = m.court, session = m.session;
    var opp = mt.opponentSlug && bySlug[mt.opponentSlug];
    var courtTxt = isTBD(court) ? '🏟️ Court: coming Saturday morning!' : courtIcon(court) + ' ' + esc(court);
    var sessTxt = isTBD(session) ? '' : '<span class="tag ' + esc(session) + '">' + sessionLabel(session) + '</span>';
    var timeTxt = m.order ? '<span class="tag">Match ' + m.order + (m.startTimeET ? ' · ' + esc(m.startTimeET) + ' ET' : '') + '</span>' : '';
    var idx = PLAYERS.indexOf(p);
    var prev = PLAYERS[(idx - 1 + PLAYERS.length) % PLAYERS.length], next = PLAYERS[(idx + 1) % PLAYERS.length];
    var facts = (p.funFacts || []).map(function (f, i) {
      return '<button type="button" class="flip" aria-pressed="false" aria-label="Fun fact ' + (i + 1) + ', tap to flip"><div class="flip-inner">' +
        '<div class="face front"><span class="n">Fun fact #' + (i + 1) + '</span><span class="tap">Tap to flip! 🔄</span></div>' +
        '<div class="face back">' + esc(f.text || f) + '</div></div></button>';
    }).join('');
    var srcs = (p.sources || []).map(function (s) { return '<li><a href="' + esc(s) + '" target="_blank" rel="noopener">' + esc(s.replace(/^https?:\/\/(www\.)?/, '').slice(0, 60)) + '</a></li>'; }).join('');
    return '<button type="button" class="d-close" id="d-close" aria-label="Close">✕</button>' +
      '<div class="d-top"><div class="d-photo">' + photoHTML(p) + '</div></div>' +
      '<div class="d-head"><span class="flag-big" aria-hidden="true">' + flagOf(p) + '</span><div>' +
        '<h2 class="d-name" id="sheet-name">' + esc(p.name) + '</h2>' +
        (p.nicknameOrTagline ? '<p class="d-tagline">“' + esc(p.nicknameOrTagline) + '”</p>' : '') +
        '<p class="d-country">' + flagOf(p) + ' ' + esc(p.countryName || p.country || '') + (p.hometown ? ' · from ' + esc(p.hometown) : '') + '</p>' +
      '</div></div>' +
      '<div class="d-body">' +
        '<div class="stats">' +
          stat('Age', p.age) + stat('Seed', p.seed ? '#' + p.seed : 'Unseeded') + stat('Ranking', p.ranking ? '#' + p.ranking : '') +
          stat('Height', p.heightCm ? feetIn(p.heightCm) + '<small>' + p.heightCm + ' cm</small>' : '') +
          stat('Plays', p.plays ? '<small style="font-size:17px">' + esc(p.plays) + '</small>' : '', true) +
          stat('Tier', tierInfo(p.tier).emoji + ' <small style="font-size:16px">' + tierInfo(p.tier).label + '</small>') +
        '</div>' +
        '<section class="box match-box" aria-label="Saturday match"><h3>🎾 Saturday\'s match</h3>' +
          (mt.opponent ? '<p>vs</p><button type="button" class="opp" data-open="' + esc(mt.opponentSlug || '') + '"' + (opp ? '' : ' disabled') + '>' + (opp ? flagOf(opp) + ' ' : '') + esc(mt.opponent) + '</button>' : '<p>Opponent coming soon!</p>') +
          '<p>' + courtTxt + '</p><div class="tags">' + sessTxt + timeTxt + '</div></section>' +
        (p.intro ? '<section class="box"><h3>👋 Meet ' + esc(p.name.split(' ')[0]) + '</h3><p>' + esc(p.intro) + '</p></section>' : '') +
        (p.story ? '<section class="box"><h3>📖 The story</h3><p>' + esc(p.story) + '</p></section>' : '') +
        (p.watchFor ? '<section class="box watch"><h3>Watch for this! 👀</h3><p>' + esc(p.watchFor) + '</p></section>' : '') +
        (facts ? '<section aria-label="Fun facts"><h3 class="box-h" style="font-family:var(--display);font-weight:400;font-size:26px;margin:0 0 10px">🤩 Fun facts</h3><div class="facts">' + facts + '</div></section>' : '') +
        '<details><summary>Where this came from</summary><ul class="src-list">' + (srcs || '<li>Sources coming soon.</li>') + '</ul>' +
          (p.photo && !isAvatarPhoto(p) && hasPhoto(p) ? '<p class="verified">Photo: ' + esc(p.photo.author || 'Unknown') + ' · ' + esc(p.photo.license || '') + (p.photo.sourceUrl ? ' · <a href="' + esc(p.photo.sourceUrl) + '" target="_blank" rel="noopener">source</a>' : '') + '</p>' : '') +
        '</details>' +
      '</div>' +
      '<nav class="d-nav" aria-label="Other players">' +
        '<button type="button" class="pill" data-nav="' + esc(prev.slug) + '">◀ <span class="nm">' + esc(prev.name) + '</span></button>' +
        '<button type="button" class="pill" data-nav="' + esc(next.slug) + '">' + '<span class="nm">' + esc(next.name) + '</span> ▶</button>' +
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
      if (history.length > 1 && cameFromHere) history.back();
      else { history.replaceState(null, '', location.pathname + location.search); closeDetail(); }
    } else closeDetail();
  }
  var cameFromHere = false;
  function route() {
    var h = decodeURIComponent(location.hash || '');
    if (h.indexOf('#p/') === 0) { cameFromHere = true; openDetail(h.slice(3)); }
    else closeDetail();
  }
  sheet.addEventListener('click', function (e) {
    if (e.target === sheet) { requestClose(); return; }
    if (e.target.closest('#d-close')) { requestClose(); return; }
    var nav = e.target.closest('[data-nav]');
    if (nav) { e.stopPropagation(); history.replaceState(null, '', '#p/' + nav.getAttribute('data-nav')); openDetail(nav.getAttribute('data-nav')); return; }
    var opp = e.target.closest('.opp[data-open]');
    if (opp) { e.stopPropagation(); e.preventDefault(); history.replaceState(null, '', '#p/' + opp.getAttribute('data-open')); openDetail(opp.getAttribute('data-open')); return; }
    var flip = e.target.closest('.flip');
    if (flip) flip.setAttribute('aria-pressed', flip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
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

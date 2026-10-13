// 13 oct 2026: live numbers of the game, refreshed every hour (data/stats.json)
(function () {
  var base = document.currentScript.getAttribute('data-base') || './';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var num = function (n) { return Math.round(Number(n) || 0).toLocaleString('en-US'); };
  var px = function (p) { p = Number(p) || 0; return '$' + (p >= 1 ? p.toFixed(2) : p.toFixed(4)); };
  var chg = function (c) { if (c == null) return ''; c = Number(c); return '<span class="' + (c >= 0 ? 'up' : 'down') + '">' + (c >= 0 ? '+' : '') + c + '%</span>'; };
  var hold = function (n) { n = Number(n) || 0; return num(n) + (n === 1 ? ' holder' : ' holders'); };
  var med = function (x) { return '<span class="med" style="--c:' + esc(x.color || '#ffd43b') + '">' + esc(x.emoji || '🪙') + '</span>'; };
  var put = function (id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; };
  fetch(base + 'data/stats.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (d) {
    put('s-players', num(d.players)); put('s-coins', num(d.coins)); put('s-chains', num(d.chains)); put('s-trades', num(d.trades24));
    put('top-coins', (d.top_coins || []).map(function (x, i) { return '<div class="coin"><span class="rank">' + (i + 1) + '</span>' + med(x) + '<div><b>$' + esc(x.ticker) + (x.grad ? '<span class="tag">🎓 DEX</span>' : '') + '</b><small>' + esc(x.name) + ' · ' + hold(x.holders) + '</small></div><div class="p">$' + num(x.mcap) + '<br>' + chg(x.chg) + '</div></div>'; }).join(''));
    put('gainers', (d.gainers || []).map(function (x) { return '<div class="coin">' + med(x) + '<div><b>$' + esc(x.ticker) + '</b><small>' + esc(x.name) + '</small></div><div class="p">' + px(x.price) + '<br>' + chg(x.chg) + '</div></div>'; }).join('') || '<p class="muted">No big move in the last 24 hours.</p>');
    put('newest', (d.newest || []).map(function (x) { return '<div class="coin">' + med(x) + '<div><b>$' + esc(x.ticker) + '</b><small>' + esc(x.name) + '</small></div><div class="p">' + px(x.price) + '<br><small>' + hold(x.holders) + '</small></div></div>'; }).join(''));
    put('tycoons', (d.tycoons || []).map(function (x, i) { return '<div class="coin"><span class="rank">' + (['🥇', '🥈', '🥉'][i] || i + 1) + '</span><div><b>' + (x.crown ? '👑 ' : '') + esc(x.name) + (x.ai ? ' 🤖' : '') + '</b></div><div class="p">$' + num(x.worth) + '</div></div>'; }).join(''));
    var at = new Date(d.at); put('updated', 'Updated ' + at.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) + ' · refreshed every hour');
  }).catch(function () { put('updated', 'Live data is loading slowly, open the game to see everything.'); });
})();

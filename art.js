// Story Time art: original characters and scenes as plain inline SVG (no images, no network).
(function (root) {
'use strict';
const INK = '#3a2f45';
function eyes(x1, x2, y, sleepy, r = 6, ink = INK) {
  if (sleepy) return [x1, x2].map(x => `<path d="M${x - r} ${y} q${r} ${r * .9} ${r * 2} 0" stroke="${ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`).join('');
  return [x1, x2].map(x => `<circle cx="${x}" cy="${y}" r="${r}" fill="${ink}"/><circle cx="${x + r * .35}" cy="${y - r * .38}" r="${r * .36}" fill="#fff"/>`).join('');
}
const smile = (x, y, w = 7, ink = INK) => `<path d="M${x - w} ${y} q${w} ${w * .9} ${w * 2} 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
const cheeks = (x1, x2, y, rx = 7) => `<ellipse cx="${x1}" cy="${y}" rx="${rx}" ry="${rx * .62}" fill="#ff9fb2" opacity=".55"/><ellipse cx="${x2}" cy="${y}" rx="${rx}" ry="${rx * .62}" fill="#ff9fb2" opacity=".55"/>`;
const face = (cx, cy, sp, s, o = {}) => eyes(cx - sp, cx + sp, cy, s, o.r || 6) + cheeks(cx - sp - (o.ch || 9), cx + sp + (o.ch || 9), cy + 11) + (o.noSmile ? '' : smile(cx, o.my || cy + 11, o.mw || 6));

const HERO_ART = {
  fox: s => `
    <path d="M132 158 C 186 158 196 98 160 84 C 170 112 156 138 128 142 Z" fill="#f4a261" stroke="#d9823f" stroke-width="3"/>
    <path d="M160 84 C 184 92 190 114 180 128 C 176 108 170 96 160 84 Z" fill="#fff4e6"/>
    <ellipse cx="100" cy="152" rx="40" ry="34" fill="#f4a261" stroke="#d9823f" stroke-width="3"/>
    <ellipse cx="100" cy="160" rx="22" ry="20" fill="#fff4e6"/>
    <path d="M60 74 L70 30 L98 60 Z M140 74 L130 30 L102 60 Z" fill="#f4a261" stroke="#d9823f" stroke-width="3" stroke-linejoin="round"/>
    <path d="M70 64 L74 44 L86 58 Z M130 64 L126 44 L114 58 Z" fill="#ffd2bf"/>
    <ellipse cx="100" cy="90" rx="46" ry="38" fill="#f4a261" stroke="#d9823f" stroke-width="3"/>
    <ellipse cx="100" cy="106" rx="27" ry="17" fill="#fff4e6"/>
    ${face(100, 86, 18, s, { my: 104, mw: 5 })}
    <ellipse cx="100" cy="99" rx="6" ry="4.5" fill="${INK}"/>`,
  cloud: s => {
    const c = [[64, 122, 32], [100, 98, 42], [138, 118, 34], [100, 134, 36], [78, 142, 26], [124, 142, 26]];
    return c.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#c9c3ef" stroke="#c9c3ef" stroke-width="8"/>`).join('') +
      c.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff"/>`).join('') +
      `<path d="M78 178 q-5 9 0 12 q5 -3 0 -12 Z M100 184 q-5 9 0 12 q5 -3 0 -12 Z M122 178 q-5 9 0 12 q5 -3 0 -12 Z" fill="#9fd3f5"/>` + face(100, 118, 17, s);
  },
  turtle: s => `
    <ellipse cx="66" cy="160" rx="15" ry="11" fill="#a6dcab" stroke="#6fb07a" stroke-width="3"/>
    <ellipse cx="134" cy="160" rx="15" ry="11" fill="#a6dcab" stroke="#6fb07a" stroke-width="3"/>
    <path d="M36 150 l-12 6 l14 3 Z" fill="#a6dcab"/>
    <circle cx="160" cy="124" r="24" fill="#a6dcab" stroke="#6fb07a" stroke-width="3"/>
    <path d="M42 150 C 42 82 158 82 158 150 Z" fill="#62b07a" stroke="#4a9563" stroke-width="3"/>
    <rect x="36" y="144" width="128" height="15" rx="7.5" fill="#4a9563"/>
    <circle cx="100" cy="116" r="15" fill="#86cc98"/><circle cx="68" cy="134" r="10" fill="#86cc98"/><circle cx="132" cy="134" r="10" fill="#86cc98"/>
    <circle cx="84" cy="98" r="7" fill="#86cc98"/><circle cx="116" cy="98" r="7" fill="#86cc98"/>
    ${eyes(152, 170, 120, s, 4.5)}${cheeks(146, 176, 131, 5)}${smile(161, 130, 5)}`,
  bunny: s => `
    <g transform="rotate(-9 80 60)"><ellipse cx="80" cy="50" rx="14" ry="38" fill="#f3efff" stroke="#cbbfee" stroke-width="3"/><ellipse cx="80" cy="52" rx="6.5" ry="27" fill="#ffc6d9"/></g>
    <g transform="rotate(9 120 60)"><ellipse cx="120" cy="50" rx="14" ry="38" fill="#f3efff" stroke="#cbbfee" stroke-width="3"/><ellipse cx="120" cy="52" rx="6.5" ry="27" fill="#ffc6d9"/></g>
    <circle cx="140" cy="166" r="12" fill="#ffffff" stroke="#cbbfee" stroke-width="3"/>
    <ellipse cx="100" cy="154" rx="38" ry="32" fill="#f3efff" stroke="#cbbfee" stroke-width="3"/>
    <path d="M94 142 a15 15 0 1 0 14 22 a11.5 11.5 0 1 1 -14 -22 Z" fill="#ffe08a"/>
    <circle cx="100" cy="100" r="40" fill="#f3efff" stroke="#cbbfee" stroke-width="3"/>
    ${face(100, 98, 16, s, { my: 113, mw: 5 })}
    <path d="M95 106 h10 l-5 5 Z" fill="#ff9fb2"/>`,
  dragon: s => `
    <path d="M128 168 C 168 176 182 146 166 130" stroke="#b9a6ee" stroke-width="15" fill="none" stroke-linecap="round"/>
    <path d="M160 128 l12 -10 l2 16 Z" fill="#ffe7b0"/>
    <path d="M64 128 C 28 98 20 136 36 146 C 42 134 54 136 64 140 Z" fill="#e4dbff" stroke="#a592de" stroke-width="3" stroke-linejoin="round"/>
    <path d="M136 128 C 172 98 180 136 164 146 C 158 134 146 136 136 140 Z" fill="#e4dbff" stroke="#a592de" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="100" cy="152" rx="36" ry="32" fill="#b9a6ee" stroke="#a592de" stroke-width="3"/>
    <ellipse cx="100" cy="160" rx="20" ry="19" fill="#ffe7b0"/>
    <path d="M76 70 l-6 -20 l18 12 Z M124 70 l6 -20 l-18 12 Z" fill="#ffe7b0" stroke="#e8c98a" stroke-width="2" stroke-linejoin="round"/>
    <path d="M92 60 l8 -12 l8 12 Z" fill="#ffb7c9"/>
    <circle cx="100" cy="96" r="38" fill="#b9a6ee" stroke="#a592de" stroke-width="3"/>
    ${face(100, 94, 15, s, { my: 112, mw: 6 })}
    <circle cx="94" cy="105" r="1.8" fill="${INK}"/><circle cx="106" cy="105" r="1.8" fill="${INK}"/>`,
  ladybug: s => `
    <path d="M56 140 l-18 6 M56 160 l-16 12 M144 140 l18 6 M144 160 l16 12" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="100" cy="132" r="54" fill="#f27c7c" stroke="#d65f5f" stroke-width="3"/>
    <path d="M100 84 V186" stroke="#5b4a66" stroke-width="3"/>
    ${[[76, 112, 9], [124, 112, 9], [68, 146, 8], [132, 146, 8], [86, 170, 7], [114, 170, 7], [100, 140, 6.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#5b4a66"/>`).join('')}
    <path d="M88 52 C 82 36 76 30 68 30 M112 52 C 118 36 124 30 132 30" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="68" cy="30" r="6" fill="#5b4a66"/><circle cx="132" cy="30" r="6" fill="#5b4a66"/>
    <circle cx="100" cy="76" r="30" fill="#ffdccc" stroke="#e8b9a4" stroke-width="3"/>
    ${face(100, 74, 12, s, { r: 5, ch: 7, my: 86, mw: 5 })}`,
  owl: s => `
    <ellipse cx="80" cy="186" rx="10" ry="6" fill="#f6b24f"/><ellipse cx="120" cy="186" rx="10" ry="6" fill="#f6b24f"/>
    <path d="M52 66 L60 34 L84 58 Z M148 66 L140 34 L116 58 Z" fill="#c8a27c" stroke="#a6805c" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="100" cy="118" rx="58" ry="66" fill="#c8a27c" stroke="#a6805c" stroke-width="3"/>
    <ellipse cx="48" cy="128" rx="15" ry="34" fill="#b48d66" transform="rotate(12 48 128)"/>
    <ellipse cx="152" cy="128" rx="15" ry="34" fill="#b48d66" transform="rotate(-12 152 128)"/>
    <ellipse cx="100" cy="148" rx="34" ry="34" fill="#f3e2c7"/>
    <path d="M86 140 q6 6 12 0 M102 140 q6 6 12 0 M94 156 q6 6 12 0" stroke="#d8bf9c" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="78" cy="98" r="22" fill="#fff6e6"/><circle cx="122" cy="98" r="22" fill="#fff6e6"/>
    ${eyes(78, 122, 98, s, 9)}${cheeks(64, 136, 120, 6)}
    <path d="M94 110 h12 l-6 11 Z" fill="#f6b24f"/>`,
  bear: s => `
    <ellipse cx="100" cy="162" rx="40" ry="30" fill="#c7956b" stroke="#a87650" stroke-width="3"/>
    <ellipse cx="100" cy="168" rx="22" ry="17" fill="#f1d7bd"/>
    <circle cx="64" cy="62" r="18" fill="#c7956b" stroke="#a87650" stroke-width="3"/><circle cx="64" cy="62" r="9" fill="#e8b796"/>
    <circle cx="136" cy="62" r="18" fill="#c7956b" stroke="#a87650" stroke-width="3"/><circle cx="136" cy="62" r="9" fill="#e8b796"/>
    <circle cx="100" cy="100" r="44" fill="#c7956b" stroke="#a87650" stroke-width="3"/>
    <ellipse cx="100" cy="114" rx="21" ry="16" fill="#f1d7bd"/>
    ${eyes(82, 118, 92, s, 6)}${cheeks(70, 130, 106)}
    <ellipse cx="100" cy="107" rx="7" ry="5" fill="${INK}"/>${smile(100, 114, 6)}`,
  whale: s => `
    <path d="M80 80 C 78 68 70 60 62 58 M80 80 C 82 68 90 60 98 58" stroke="#9fd3f5" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="60" cy="52" r="5" fill="#9fd3f5"/><circle cx="100" cy="52" r="5" fill="#9fd3f5"/><circle cx="80" cy="60" r="4" fill="#9fd3f5"/>
    <path d="M138 118 Q 164 118 172 96 Q 188 110 178 122 Q 192 134 176 150 Q 164 134 138 142 Z" fill="#8cc3ec" stroke="#5d9fd0" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="90" cy="130" rx="62" ry="46" fill="#8cc3ec" stroke="#5d9fd0" stroke-width="3"/>
    <path d="M36 140 Q 90 186 146 140 Q 140 170 90 175 Q 44 172 36 140 Z" fill="#dff1ff"/>
    <ellipse cx="104" cy="152" rx="16" ry="8" fill="#6fb0e0" transform="rotate(-20 104 152)"/>
    ${face(72, 122, 15, s)}`,
  penguin: s => `
    <ellipse cx="82" cy="184" rx="15" ry="7" fill="#f6a94a"/><ellipse cx="118" cy="184" rx="15" ry="7" fill="#f6a94a"/>
    <ellipse cx="52" cy="130" rx="12" ry="32" fill="#46557a" transform="rotate(20 52 130)"/>
    <ellipse cx="148" cy="130" rx="12" ry="32" fill="#46557a" transform="rotate(-20 148 130)"/>
    <ellipse cx="100" cy="120" rx="52" ry="66" fill="#46557a" stroke="#36425f" stroke-width="3"/>
    <ellipse cx="100" cy="140" rx="35" ry="42" fill="#fbfbff"/>
    <path d="M100 84 C 82 66 58 78 66 100 C 70 112 86 116 100 112 C 114 116 130 112 134 100 C 142 78 118 66 100 84 Z" fill="#fbfbff"/>
    ${eyes(84, 116, 94, s, 6)}${cheeks(72, 128, 106)}
    <path d="M92 104 h16 l-8 9 Z" fill="#f6a94a"/>`,
};

function hero(id, opts = {}) {
  const f = HERO_ART[id]; if (!f) return '';
  return `<svg viewBox="0 0 200 200" class="hero-art" role="img" aria-hidden="true">${f(!!opts.sleepy)}</svg>`;
}
function heroGroup(id, sleepy) { return HERO_ART[id] ? HERO_ART[id](sleepy) : ''; }

// friend: a small round buddy, tinted from its name; a listener friend is a glowing heart (never a person)
const BUDDY = ['#ffd38a', '#a8e0c9', '#f9b8c8', '#b8d4ff', '#d9c2ff', '#ffc9a3'];
function buddy(name, sleepy, isListener) {
  if (isListener) return `<g><circle cx="50" cy="52" r="34" fill="#fff3b0" opacity=".35"/><path d="M50 82 C 18 60 20 30 38 30 C 46 30 50 38 50 42 C 50 38 54 30 62 30 C 80 30 82 60 50 82 Z" fill="#ff9fb2" stroke="#f07c97" stroke-width="3"/>
    <path d="M78 18 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 Z" fill="#fff3b0"/>${eyes(42, 58, 52, sleepy, 3.5)}${smile(50, 60, 4)}</g>`;
  let h = 0; for (const c of String(name)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const col = BUDDY[h % BUDDY.length];
  return `<g><circle cx="30" cy="30" r="11" fill="${col}" stroke="#00000018" stroke-width="2"/><circle cx="70" cy="30" r="11" fill="${col}" stroke="#00000018" stroke-width="2"/>
    <ellipse cx="50" cy="60" rx="34" ry="32" fill="${col}" stroke="#00000018" stroke-width="2"/><ellipse cx="50" cy="72" rx="17" ry="13" fill="#ffffff" opacity=".6"/>
    ${eyes(39, 61, 56, sleepy, 4.5)}${cheeks(31, 69, 66, 5)}${smile(50, 66, 4)}</g>`;
}

// ---------- scenes (400 x 300) ----------
const SKY = {
  day: ['#bfe3ff', '#ffe4ee'], dusk: ['#ffbfa8', '#c9a8e8'], night: ['#26295a', '#5b4f8a'],
};
function starsField(n, seed, maxY = 170, op = 1) {
  let a = seed, out = '';
  const r = () => { a = (a * 1103515245 + 12345) & 0x7fffffff; return a / 0x7fffffff; };
  for (let i = 0; i < n; i++) { const x = r() * 400, y = r() * maxY, s = 1.2 + r() * 2.2; out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${s.toFixed(1)}" fill="#fff8d6" opacity="${(op * (0.5 + r() * 0.5)).toFixed(2)}"/>`; }
  return out;
}
const moon = (x, y, r = 24) => { const k = r / 22; return `<circle cx="${x}" cy="${y}" r="${r + 14}" fill="#fff6c9" opacity=".16"/><path transform="translate(${(x - 32 * k).toFixed(1)} ${(y - 32 * k).toFixed(1)}) scale(${k.toFixed(3)})" d="M38 8 a24 24 0 1 0 18 40 a19 19 0 1 1 -18 -40 Z" fill="#fff1b8"/>`; };
const sun = (x, y, r = 26, c = '#fff1a8') => `<circle cx="${x}" cy="${y}" r="${r + 16}" fill="${c}" opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
const tree = (x, y, s = 1, c = '#7cc79a') => `<rect x="${x - 6 * s}" y="${y - 10 * s}" width="${12 * s}" height="${34 * s}" rx="${4 * s}" fill="#b08a6a"/><circle cx="${x}" cy="${y - 26 * s}" r="${28 * s}" fill="${c}"/><circle cx="${x - 16 * s}" cy="${y - 14 * s}" r="${16 * s}" fill="${c}"/><circle cx="${x + 16 * s}" cy="${y - 14 * s}" r="${16 * s}" fill="${c}"/>`;
const pine = (x, y, s = 1, c = '#6fb58e', snow) => `<rect x="${x - 4 * s}" y="${y}" width="${8 * s}" height="${14 * s}" fill="#a07c5e"/><path d="M${x} ${y - 60 * s} L${x + 26 * s} ${y + 2} L${x - 26 * s} ${y + 2} Z" fill="${c}"/>${snow ? `<path d="M${x} ${y - 60 * s} L${x + 10 * s} ${y - 36 * s} L${x - 10 * s} ${y - 36 * s} Z" fill="#fff"/>` : ''}`;
const flower = (x, y, c) => `<path d="M${x} ${y} V${y + 30}" stroke="#6fb07a" stroke-width="4"/>${[0, 72, 144, 216, 288].map(a => `<circle cx="${(x + 8 * Math.cos(a * Math.PI / 180)).toFixed(1)}" cy="${(y + 8 * Math.sin(a * Math.PI / 180)).toFixed(1)}" r="6.5" fill="${c}"/>`).join('')}<circle cx="${x}" cy="${y}" r="5" fill="#ffe08a"/>`;

const GROUND = {
  forest: () => `<ellipse cx="90" cy="300" rx="260" ry="90" fill="#a6dbb0"/><ellipse cx="330" cy="310" rx="220" ry="100" fill="#95d1a2"/>
    ${tree(40, 200, 1.1, '#7cc79a')}${pine(360, 214, 1.2, '#6fb58e')}${tree(300, 205, .8, '#8fd4a4')}${pine(110, 205, .8, '#7cc79a')}
    <path d="M330 262 h18 v10 h-18 Z" fill="#fff"/><path d="M326 262 a13 10 0 0 1 26 0 Z" fill="#f28b82"/><circle cx="334" cy="257" r="2" fill="#fff"/><circle cx="344" cy="258" r="2" fill="#fff"/>`,
  beach: () => `<rect x="0" y="168" width="400" height="60" fill="#8fd3e8"/><path d="M0 182 q25 -10 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" stroke="#e6f8ff" stroke-width="4" fill="none"/>
    <path d="M0 214 q50 -16 100 -4 t100 0 t100 -2 t100 4 V300 H0 Z" fill="#f6e2b3"/>
    <path d="M330 236 a12 12 0 0 1 24 0 Z" fill="#ffc6d9"/><path d="M60 262 a9 9 0 0 1 18 0 Z" fill="#ffd9a8"/>
    <path d="M300 230 L300 160" stroke="#b08a6a" stroke-width="4"/><path d="M262 166 Q300 126 338 166 Z" fill="#ff9fb2"/><path d="M288 166 Q300 126 312 166 Z" fill="#fff"/>`,
  stars: () => `<g opacity=".95"><circle cx="40" cy="290" r="50" fill="#ece6ff"/><circle cx="110" cy="300" r="56" fill="#f6f2ff"/><circle cx="200" cy="296" r="48" fill="#ece6ff"/><circle cx="280" cy="302" r="58" fill="#f6f2ff"/><circle cx="370" cy="292" r="50" fill="#ece6ff"/></g>`,
  farm: () => `<ellipse cx="200" cy="320" rx="320" ry="120" fill="#b5e0a0"/>
    <path d="M300 214 V150 L336 124 L372 150 V214 Z" fill="#e8746c"/><path d="M296 152 L336 120 L376 152" stroke="#c95a54" stroke-width="6" fill="none" stroke-linejoin="round"/>
    <rect x="322" y="176" width="28" height="38" fill="#fff6ec"/><path d="M322 176 L350 214 M350 176 L322 214" stroke="#e8746c" stroke-width="4"/>
    <path d="M0 236 H250 M0 256 H250" stroke="#f3e2c7" stroke-width="5"/>${[20, 70, 120, 170, 220].map(x => `<rect x="${x}" y="226" width="8" height="40" rx="3" fill="#f3e2c7"/>`).join('')}
    <rect x="248" y="228" width="40" height="30" rx="8" fill="#f6d77c"/><path d="M252 238 H284 M252 248 H284" stroke="#e6c25e" stroke-width="3"/>`,
  rain: () => `<rect x="0" y="232" width="400" height="68" fill="#c9cde6"/>
    ${[[20, 150, '#f9c6c9'], [110, 132, '#c6e6d6'], [210, 150, '#ffe1a8'], [300, 136, '#cdd8ff']].map(([x, y, c]) => `<rect x="${x}" y="${y}" width="80" height="${232 - y}" fill="${c}"/><path d="M${x - 6} ${y} L${x + 40} ${y - 34} L${x + 86} ${y} Z" fill="#9a8fb8"/><rect class="win" x="${x + 14}" y="${y + 18}" width="18" height="18" rx="3" fill="#fff1b8"/><rect class="win" x="${x + 48}" y="${y + 18}" width="18" height="18" rx="3" fill="#fff1b8"/><rect x="${x + 30}" y="${206}" width="20" height="26" rx="4" fill="#8a7aa8"/>`).join('')}
    <ellipse cx="90" cy="266" rx="50" ry="8" fill="#a9c8ec"/><ellipse cx="300" cy="280" rx="40" ry="7" fill="#a9c8ec"/>
    <g stroke="#a9c8ec" stroke-width="3" stroke-linecap="round" opacity=".9">${Array.from({ length: 28 }, (_, i) => { const x = (i * 53) % 400, y = (i * 37) % 200; return `<path d="M${x} ${y} l-5 12"/>`; }).join('')}</g>`,
  sea: () => `<path d="M0 260 q60 -16 120 -4 t140 0 t140 -4 V300 H0 Z" fill="#f2dcb0"/>
    ${[30, 70, 330, 370].map((x, i) => `<path d="M${x} 270 q-12 -24 0 -46 q12 -24 0 -50" stroke="#6cc79a" stroke-width="7" fill="none" stroke-linecap="round" opacity="${i % 2 ? .8 : 1}"/>`).join('')}
    <path d="M250 262 q0 -30 -14 -40 M250 262 q0 -28 14 -42 M250 246 q-10 -6 -14 -20" stroke="#ff9fb2" stroke-width="7" fill="none" stroke-linecap="round"/>
    ${[[120, 120, 6], [132, 96, 4], [126, 70, 5], [290, 140, 5], [300, 110, 3.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#e6f8ff" stroke-width="2"/>`).join('')}
    <g transform="translate(340 150)"><ellipse rx="16" ry="10" fill="#ffb36b"/><path d="M14 0 l12 -9 v18 Z" fill="#ffb36b"/><circle cx="-7" cy="-2" r="2" fill="${INK}"/></g>`,
  garden: () => `<ellipse cx="200" cy="320" rx="320" ry="110" fill="#b8e3a6"/>
    <path d="M0 220 H400 M0 244 H400" stroke="#f3e2c7" stroke-width="5"/>${Array.from({ length: 10 }, (_, i) => `<rect x="${10 + i * 42}" y="206" width="10" height="48" rx="4" fill="#f3e2c7"/>`).join('')}
    ${flower(60, 246, '#ff9fb2')}${flower(110, 258, '#c9b6ff')}${flower(300, 250, '#ff9fb2')}${flower(350, 262, '#9fd3f5')}
    <path d="M200 260 V196" stroke="#6fb07a" stroke-width="5"/>${[0, 40, 80, 120, 160, 200, 240, 280, 320].map(a => `<ellipse cx="${(200 + 14 * Math.cos(a * Math.PI / 180)).toFixed(1)}" cy="${(190 + 14 * Math.sin(a * Math.PI / 180)).toFixed(1)}" rx="8" ry="5" transform="rotate(${a} ${(200 + 14 * Math.cos(a * Math.PI / 180)).toFixed(1)} ${(190 + 14 * Math.sin(a * Math.PI / 180)).toFixed(1)})" fill="#ffd56b"/>`).join('')}<circle cx="200" cy="190" r="9" fill="#b08a6a"/>`,
  snow: () => `<ellipse cx="80" cy="300" rx="250" ry="90" fill="#eef4ff"/><ellipse cx="340" cy="312" rx="220" ry="100" fill="#ffffff"/>
    ${pine(40, 214, 1.1, '#7fb8a0', 1)}${pine(360, 220, 1.2, '#6fa892', 1)}${pine(300, 206, .7, '#8fc4ae', 1)}
    <g fill="#ffffff">${Array.from({ length: 22 }, (_, i) => `<circle cx="${(i * 71) % 400}" cy="${(i * 43) % 190}" r="${2 + (i % 3)}"/>`).join('')}</g>`,
};

let UID = 0;
function scene(page, story) {
  const gid = 'skyg' + (++UID);
  const place = story.place, mood = page.scene.mood, sleepy = page.scene.pose === 'sleepy';
  let [top, bot] = SKY[mood];
  if (place === 'sea') [top, bot] = mood === 'day' ? ['#9fe3ea', '#4f93c9'] : mood === 'dusk' ? ['#7fb6d8', '#3c5f9a'] : ['#2b4a7a', '#1d2e57'];
  else if (place === 'rain' && mood === 'day') [top, bot] = ['#c7d3ec', '#e8e2f3'];
  else if (place === 'stars' && mood === 'day') [top, bot] = ['#8f88d6', '#f3c6dd'];
  let cel = '';
  if (place === 'sea') cel = mood === 'day' ? `<g opacity=".18" fill="#fff"><path d="M80 0 L120 0 L60 260 L30 260 Z"/><path d="M220 0 L250 0 L230 260 L190 260 Z"/></g>` : `<circle cx="320" cy="30" r="40" fill="#fff6c9" opacity=".12"/>`;
  else if (place === 'stars') cel = starsField(46, 7, 240, mood === 'day' ? .55 : 1) + moon(300, 80, 34);
  else if (mood === 'day') cel = place === 'rain' ? `<g fill="#ffffff" opacity=".8"><ellipse cx="90" cy="60" rx="60" ry="22"/><ellipse cx="300" cy="44" rx="70" ry="24"/></g>` : sun(330, 58) + `<g fill="#ffffff" opacity=".85"><ellipse cx="90" cy="56" rx="44" ry="15"/><ellipse cx="120" cy="46" rx="26" ry="15"/></g>`;
  else if (mood === 'dusk') cel = sun(320, 170, 34, '#ffc58f') + starsField(10, 3, 110, .6);
  else cel = starsField(40, 11, 190) + moon(320, 62);
  const overlay = mood === 'night' ? `<rect width="400" height="300" fill="#1c1a3d" opacity="${place === 'sea' ? .25 : .38}"/>` : mood === 'dusk' ? `<rect width="400" height="300" fill="#ff9a8a" opacity=".12"/>` : '';
  const winGlow = mood !== 'day' ? `<style>.win{fill:#ffd36b}</style>` : '';
  const showFriend = page.scene.friend && !sleepy;
  const heroX = showFriend ? 40 : 110, heroScale = showFriend ? .85 : 1;
  const zzz = sleepy ? `<g fill="#fff8d6" font-family="Nunito, sans-serif" font-weight="800" opacity=".9"><text x="${heroX + 166}" y="168" font-size="20">z</text><text x="${heroX + 182}" y="146" font-size="26">z</text><text x="${heroX + 200}" y="120" font-size="32">z</text></g>` : '';
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" class="scene" role="img" aria-label="${story.place} scene">
    <defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs>${winGlow}
    <rect width="400" height="300" fill="url(#skyg)"/>${cel}${GROUND[place]()}${overlay}
    <g transform="translate(${heroX} ${sleepy ? 96 : 92}) scale(${heroScale})" class="hero-g${sleepy ? '' : ' bob'}">${heroGroup(story.hero, sleepy)}</g>
    ${showFriend ? `<g transform="translate(262 176) scale(1.05)" class="bob2">${buddy(story.friend, false, page.scene.listenerFriend)}</g>` : ''}
    ${mood === 'night' ? `<rect width="400" height="300" fill="#1c1a3d" opacity=".1"/>` : ''}${zzz}</svg>`.replace(/#skyg\)/g, '#' + gid + ')').replace('id="skyg"', 'id="' + gid + '"');
}
function placeThumb(id) { return scene({ scene: { mood: id === 'stars' ? 'night' : 'day', pose: 'happy', friend: false } }, { place: id, hero: null, friend: '' }).replace(/<g transform="translate\(\d+ \d+\) scale\([\d.]+\)" class="hero-g bob"><\/g>/, ''); }

const LESSON_ICON = {
  sharing: `<circle cx="22" cy="36" r="13" fill="#f27c7c"/><circle cx="42" cy="36" r="13" fill="#f9a8a8"/><path d="M32 22 q4 -10 12 -10" stroke="#6fb07a" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  brave: `<path d="M32 6 L39.6 22.6 L57.7 24.6 L44.2 36.9 L48 54.8 L32 45.7 L16 54.8 L19.8 36.9 L6.3 24.6 L24.4 22.6 Z" fill="#ffd56b" stroke="#f0b93a" stroke-width="3" stroke-linejoin="round"/>`,
  sorry: `<path d="M32 56 C 6 38 8 12 22 12 C 28 12 32 18 32 22 C 32 18 36 12 42 12 C 56 12 58 38 32 56 Z" fill="#ff9fb2"/><rect x="20" y="28" width="24" height="10" rx="5" fill="#fff3e0" transform="rotate(-30 32 33)"/>`,
  food: `<path d="M18 22 L46 26 L26 58 Z" fill="#ffa35c" stroke="#f08a3e" stroke-width="2" stroke-linejoin="round"/><path d="M40 22 q4 -14 14 -12 M40 22 q-2 -14 6 -16 M42 24 q10 -6 16 0" stroke="#6fb07a" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  calm: `<path d="M38 8 a24 24 0 1 0 18 40 a19 19 0 1 1 -18 -40 Z" fill="#fff1b8"/><path d="M50 10 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#fff1b8"/>`,
  kind: `${[0, 72, 144, 216, 288].map(a => `<circle cx="${(32 + 13 * Math.cos((a - 90) * Math.PI / 180)).toFixed(1)}" cy="${(30 + 13 * Math.sin((a - 90) * Math.PI / 180)).toFixed(1)}" r="10" fill="#c9b6ff"/>`).join('')}<circle cx="32" cy="30" r="8" fill="#ffd56b"/>`,
  feelings: `<path d="M8 46 a24 24 0 0 1 48 0" stroke="#ff9fb2" stroke-width="7" fill="none"/><path d="M16 46 a16 16 0 0 1 32 0" stroke="#ffd56b" stroke-width="7" fill="none"/><path d="M24 46 a8 8 0 0 1 16 0" stroke="#9fd3f5" stroke-width="7" fill="none"/>`,
  patience: `<path d="M20 44 h24 l-4 14 h-16 Z" fill="#e8a07a"/><path d="M32 44 V24" stroke="#6fb07a" stroke-width="4"/><path d="M32 30 q-14 0 -16 -12 q14 0 16 12 Z M32 26 q12 -2 16 -14 q-14 0 -16 14 Z" fill="#8fd4a4"/>`,
};
const lessonIcon = id => `<svg viewBox="0 0 64 64" class="lesson-art" aria-hidden="true">${LESSON_ICON[id] || ''}</svg>`;

const api = { hero, scene, placeThumb, lessonIcon, buddy };
root.StoryArt = api;
})(typeof window !== 'undefined' ? window : globalThis);

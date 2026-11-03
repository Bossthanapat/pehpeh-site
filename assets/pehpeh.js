/* PEHPEH · สคริปต์กลางของเว็บแบรนด์
 * ตอนนี้ (ขั้นที่ 1) ยังไม่ต่อของจริง: login กับข้อมูลลูกค้าเป็นข้อมูลตัวอย่าง เปิดลองได้เฉพาะในเครื่อง (localhost)
 * ขั้นที่ 2: login = Google Identity Services → ส่ง ID token ให้ตัวติดตั้ง (Apps Script) ตรวจแล้วตอบสิทธิ์ของอีเมลนั้น
 *   แทนที่ PEH.api.* ด้วย fetch ไปที่ตัวติดตั้ง · รูปแบบข้อมูลตาม lic:<อีเมล> ใน web/installer/Installer.gs */
(function () {
  const ICONS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13l2 2 4-4"/>',
    chart: '<path d="M21 12a9 9 0 1 1-9-9v9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14.5a5 5 0 0 1 4.5 5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    sheet: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M10 3v18"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    up: '<path d="m6 15 6-6 6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    coin: '<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>'
  };
  const GOOGLE = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  const icon = n => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[n] || '') + '</svg>';

  const LINE_URL = 'https://line.me/R/ti/p/@800htrqq';
  const PLAN_TEXT = { trial: 'ทดลองใช้', year: 'รายปี', perm: 'ซื้อขาด' };
  const TH_MONTH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const todayIso = () => new Date(Date.now() + 7 * 36e5).toISOString().slice(0, 10);
  const addDays = (iso, n) => new Date(Date.parse(iso + 'T12:00:00Z') + n * 864e5).toISOString().slice(0, 10);
  const thaiDate = iso => { if (!iso) return '–'; const [y, m, d] = iso.split('-').map(Number); return d + ' ' + TH_MONTH[m - 1] + ' ' + (y + 543); };
  const daysLeft = iso => iso ? Math.round((Date.parse(iso + 'T12:00:00Z') - Date.parse(todayIso() + 'T12:00:00Z')) / 864e5) : Infinity;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  /* ---------- ข้อมูลตัวอย่าง (ขั้นที่ 1 · ชื่อสมมติทั้งหมด) ---------- */
  const isPreview = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) || location.hostname.endsWith('.localhost');
  const t = todayIso();
  const SAMPLE_USERS = {
    customer: { email: 'finance.bansuksan@gmail.com', name: 'ครูสมใจ ใจดี', role: 'customer' },
    newbie: { email: 'kru.mana@gmail.com', name: 'ครูมานะ', role: 'customer' },
    admin: { email: 'officialpehpeh@gmail.com', name: 'บอส', role: 'admin' }
  };
  const SAMPLE_LIC = [
    { email: 'finance.bansuksan@gmail.com', school: 'โรงเรียนบ้านสุขสันต์ (สมมติ)', plan: 'year', since: addDays(t, -300), until: addDays(t, 65), slug: 'bansuksan' },
    { email: 'kru.wipa@gmail.com', school: 'โรงเรียนวัดทุ่งทอง (สมมติ)', plan: 'trial', since: addDays(t, -24), until: addDays(t, 6), slug: '' },
    { email: 'admin.nongbua@gmail.com', school: 'โรงเรียนหนองบัววิทยา (สมมติ)', plan: 'perm', since: addDays(t, -90), until: '', slug: 'nongbua' },
    { email: 'somsak.k@gmail.com', school: 'โรงเรียนบ้านป่าไม้ (สมมติ)', plan: 'year', since: addDays(t, -380), until: addDays(t, -15), slug: 'banpamai' }
  ];
  const store = {
    get(k, d) { try { const v = sessionStorage.getItem('peh:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { sessionStorage.setItem('peh:' + k, JSON.stringify(v)); } catch (e) { /* โหมดส่วนตัว */ } }
  };

  const api = {
    user: () => store.get('user', null),
    signInSample(kind) { store.set('user', SAMPLE_USERS[kind]); return SAMPLE_USERS[kind]; },
    signOut() { store.set('user', null); },
    /** สิทธิ์ของอีเมลที่เข้าสู่ระบบ → [{ service, plan, until, ... }] */
    async myServices() {
      const u = api.user(); if (!u) return [];
      const lic = api._lics().find(l => l.email === u.email);
      return lic ? [Object.assign({ service: 'smudngoen' }, lic)] : [];
    },
    _lics: () => store.get('lics', SAMPLE_LIC),
    async adminList() { return api._lics(); },
    async adminSave(x) {
      const list = api._lics().filter(l => l.email !== x.oldEmail && l.email !== x.email);
      list.push({ email: x.email, school: x.school, plan: x.plan, until: x.plan === 'perm' ? '' : x.until, since: x.since || t, slug: x.slug || '' });
      store.set('lics', list); return list;
    },
    async adminRemove(email) { const list = api._lics().filter(l => l.email !== email); store.set('lics', list); return list; },
    /* ข่าว: อ่านจาก /news.json จริง · แก้ในหน้าผู้ดูแลเก็บไว้ในเครื่องก่อน (ขั้นที่ 2 ตัวติดตั้งเขียนลง repo เว็บให้) */
    async news() {
      const local = store.get('news', null); if (local) return local;
      try { const r = await fetch(new URL('news.json', document.baseURI), { cache: 'no-store' }); const j = await r.json(); return j.items || []; } catch (e) { return []; }
    },
    async newsSave(items) { store.set('news', items); return items; },
    /* ภาพหน้าจอบริการ: อ่านจาก /showcase.json · แก้ในหน้าผู้ดูแลเก็บในเครื่องก่อนเหมือนข่าว */
    async showcase() {
      const local = store.get('showcase', null); if (local) return local;
      try { const r = await fetch(new URL('showcase.json', document.baseURI), { cache: 'no-store' }); const j = await r.json(); return j.services || []; } catch (e) { return []; }
    },
    async showcaseSave(list) { store.set('showcase', list); return list; },
    /* ข้อความหน้าแรก: อ่านจาก /content.json · แก้ในหน้าผู้ดูแลเก็บในเครื่องก่อนเหมือนข่าว */
    async content() {
      const local = store.get('content', null); if (local) return local;
      try { const r = await fetch(new URL('content.json', document.baseURI), { cache: 'no-store' }); return await r.json(); } catch (e) { return null; }
    },
    async contentSave(c) { store.set('content', c); return c; },
    contentReset() { store.set('content', null); }
  };

  /* ---------- โหมดสว่าง/มืด (จำไว้ในเครื่อง · ไม่ได้เลือก = ตามเครื่อง) ---------- */
  const darkNow = () => (document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';
  function paintThemeBtns() {
    const dark = darkNow();
    document.querySelectorAll('[data-theme-btn]').forEach(b => {
      b.innerHTML = icon(dark ? 'sun' : 'moon');
      b.setAttribute('aria-label', dark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด');
      b.title = b.getAttribute('aria-label');
    });
  }
  function toggleTheme() {
    const next = darkNow() ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('peh-theme', next); } catch (e) { /* โหมดส่วนตัว */ }
    paintThemeBtns();
  }

  /** สถานะสิทธิ์สำหรับแสดงผล */
  function licView(l) {
    const left = daysLeft(l.until);
    const out = l.plan !== 'perm' && left < 0;
    const total = l.plan === 'trial' ? 30 : 365;
    return {
      left, out,
      cls: out ? 'out' : l.plan === 'perm' ? 'perm' : l.plan === 'trial' ? 'trial' : '',
      label: out ? 'หมดอายุ' : PLAN_TEXT[l.plan],
      pct: l.plan === 'perm' ? 100 : Math.max(0, Math.min(100, left / total * 100)),
      ring: out ? 'out' : (l.plan !== 'perm' && left <= 14 ? 'warn' : '')
    };
  }

  function toast(text) {
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = text; el.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2400);
  }

  function initials(name) { return esc(String(name || '?').replace(/^(ครู|นาย|นางสาว|นาง)\s*/, '').trim().charAt(0) || '?'); }

  /** แถบผู้ใช้มุมขวาบน (ในหน้าที่มี [data-who]) */
  function renderWho() {
    document.querySelectorAll('[data-who]').forEach(el => {
      const u = api.user();
      if (!u) { el.innerHTML = '<a class="btn btn-gold btn-sm" href="login.html">เข้าสู่ระบบ</a>'; return; }
      const home = u.role === 'admin' ? 'admin.html' : 'account.html';
      el.innerHTML = el.dataset.who === 'link'
        ? '<a class="btn btn-gold btn-sm" href="' + home + '">' + (u.role === 'admin' ? 'หน้าผู้ดูแล' : 'บริการของฉัน') + '</a>'
        : '<div class="chip"><span class="av">' + initials(u.name) + '</span><span>' + esc(u.email) + '</span><button type="button" data-out>ออกจากระบบ</button></div>';
      const out = el.querySelector('[data-out]');
      if (out) out.onclick = () => { api.signOut(); location.href = 'index.html'; };
    });
  }

  function boot() {
    document.querySelectorAll('i[data-ic]').forEach(i => { i.outerHTML = icon(i.dataset.ic); });
    document.querySelectorAll('[data-google]').forEach(b => { b.insertAdjacentHTML('afterbegin', GOOGLE); });
    const nav = document.querySelector('.nav');
    const mb = nav && nav.querySelector('.menu-btn');
    if (mb) {
      mb.onclick = () => { const open = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', open); };
      nav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); }));
    }
    renderWho();
    document.querySelectorAll('[data-theme-btn]').forEach(b => { b.type = 'button'; b.onclick = toggleTheme; });
    paintThemeBtns();
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paintThemeBtns);
    // เมนูค้างบน: เปลี่ยนแค่พื้นหลังเมื่อพ้นหัวหน้า (ตำแหน่งไม่ขยับ จึงไม่กระตุก)
    const fixed = document.querySelector('.nav.fixed');
    if (fixed) {
      const onScroll = () => fixed.classList.toggle('stuck', scrollY > 40);
      addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }
    const rise = document.querySelectorAll('.rise');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
      rise.forEach(el => io.observe(el));
    } else rise.forEach(el => el.classList.add('in'));
  }

  window.PEH = { api, icon, esc, thaiDate, daysLeft, todayIso, addDays, licView, toast, isPreview, PLAN_TEXT, LINE_URL, boot };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

/* PEHPEH · เติมข้อความหน้าแรกจาก content.json (แก้จากหน้าผู้ดูแล แท็บ "เนื้อหาเว็บ")
 * HTML ใน index.html เป็นค่าตั้งต้นตอนโหลด (ให้หน้าขึ้นทันทีและ Google อ่านได้) แล้วไฟล์นี้เขียนทับด้วยเนื้อหาล่าสุด
 * ข้อความ: **คำ** = ตัวหนา · ขึ้นบรรทัดใหม่ได้ */
(function () {
  const { esc, icon } = PEH;
  const fmt = s => esc(s || '').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
  const ext = href => /^https?:/.test(href || '') ? ' target="_blank" rel="noopener"' : '';
  const link = (text, href, cls) => text ? '<a class="' + cls + '" href="' + esc(href || '#') + '"' + ext(href) + '>' + esc(text) + '</a>' : '';
  const STAR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z"/></svg>';
  const BADGE = { ready: 'พร้อมใช้', soon: 'กำลังพัฒนา', idea: '' };

  const R = {
    head(el, c) {
      const hid = el.dataset.hid ? ' id="' + el.dataset.hid + '"' : '';
      el.innerHTML = '<div><span class="kicker">' + esc(c.kicker) + '</span><h2' + hid + '>' + fmt(c.title) + '</h2></div>' + (c.lead ? '<p>' + fmt(c.lead) + '</p>' : '');
    },
    hero(el, c) {
      el.innerHTML = (c.badge ? '<span class="eyebrow"><b>ใหม่</b> ' + esc(c.badge) + '</span>' : '') +
        '<h1>' + esc(c.title1) + '<br><span class="pop">' + esc(c.title2) + STAR + '</span></h1>' +
        '<p class="lead">' + fmt(c.lead) + '</p>' +
        '<div class="cta">' + link(c.cta1Text, c.cta1Href, 'btn btn-gold') +
          (c.cta2Text ? '<a class="btn btn-ghost" href="' + esc(c.cta2Href) + '"' + ext(c.cta2Href) + '>' + esc(c.cta2Text) + ' ' + icon('arrow') + '</a>' : '') + '</div>' +
        '<div class="facts">' + (c.facts || []).map(f => '<div><strong>' + esc(f.big) + '</strong>' + esc(f.small) + '</div>').join('') + '</div>';
    },
    perks(el, list) {
      el.innerHTML = list.map(p => '<div class="perk"><span class="ic">' + icon(p.icon || 'check') + '</span><div><b>' + esc(p.title) + '</b><span>' + esc(p.text) + '</span></div></div>').join('');
    },
    story(el, c) {
      el.innerHTML =
        '<article class="tale before rise in"><div class="pic"><img src="assets/img/stressed.jpg" alt="ครูการเงินกุมหัว เครียดกับกองเอกสาร" loading="lazy" width="400" height="400"></div>' +
          '<div class="txt"><span class="tag">' + esc(c.beforeTag) + '</span><h3>' + fmt(c.beforeTitle) + '</h3>' +
          '<div class="notes">' + (c.beforeNotes || []).map(n => '<span class="sticky">' + esc(n) + '</span>').join('') + '</div></div></article>' +
        '<article class="tale after rise in"><div class="pic"><img src="assets/img/happy.jpg" alt="ครูการเงินยิ้ม ขยิบตา งานเสร็จ" loading="lazy" width="480" height="480"></div>' +
          '<div class="txt"><span class="tag">' + esc(c.afterTag) + '</span><h3>' + fmt(c.afterTitle) + '</h3>' +
          '<ul class="checks">' + (c.afterChecks || []).map(n => '<li>' + icon('check') + esc(n) + '</li>').join('') + '</ul></div></article>';
    },
    services(el, items) {
      el.innerHTML = items.map(s => {
        const main = s.featured;
        const badge = BADGE[s.status] ? '<span class="badge">' + BADGE[s.status] + '</span>' : '';
        return '<article class="svc rise in' + (main ? ' main' : '') + (s.status === 'soon' ? ' soon' : '') + '">' +
          (main ? '<img class="peek" src="assets/img/mascot.webp" alt="">' : '<span class="ic">' + icon(s.icon || 'spark') + '</span>') +
          badge + '<h3>' + esc(s.name) + '</h3><p>' + fmt(s.text) + '</p>' +
          ((s.features || []).length ? '<ul class="feat">' + s.features.map(f => '<li>' + icon('check') + esc(f) + '</li>').join('') + '</ul>' : '') +
          (main
            ? '<div class="acts">' + link(s.link1Text, s.link1Href, 'btn btn-gold') + link(s.link2Text, s.link2Href, 'btn btn-ghost') + '</div>'
            : link(s.link1Text, s.link1Href, 'more') + link(s.link2Text, s.link2Href, 'more')) +
          '</article>';
      }).join('');
    },
    steps(el, items) {
      el.innerHTML = items.map(s => '<div class="step rise in"><h3>' + esc(s.title) + '</h3><p>' + fmt(s.text) + '</p></div>').join('');
    },
    plans(el, plans) {
      el.innerHTML = plans.map(p => '<div class="plan glass rise in' + (p.best ? ' best' : '') + '"><span class="nm">' + esc(p.name) + '</span>' +
        '<span class="amt">' + esc(p.amount) + ' <small>' + esc(p.unit) + '</small>' + (p.old ? '<s>' + esc(p.old) + '</s>' : '') + '</span>' +
        '<p>' + fmt(p.text) + '</p>' + link(p.btnText, p.btnHref, 'btn ' + (p.best ? 'btn-gold' : 'btn-ghost')) + '</div>').join('');
      const sel = document.querySelector('#quote-form select[name=plan]');
      const q = plans.filter(p => p.quote);
      if (sel && q.length) sel.innerHTML = q.map(p => '<option>' + esc(p.name.split('·')[0].trim() + ' ' + p.amount + ' ' + p.unit.replace(/\/.*/, '')) + '</option>').join('');
    },
    pnote(el, c) {
      // ขั้นที่ 2 (login จริง) ค่อยเพิ่มลิงก์ "ลูกค้าเดิมดูวันหมดอายุได้ที่ บริการของฉัน" กลับมา
      el.textContent = c.note || '';
    },
    faqside(el, c) {
      el.innerHTML = '<span class="kicker">' + esc(c.kicker) + '</span><h2 style="font-size:clamp(32px,4.6vw,54px)">' + fmt(c.title) + '</h2>' +
        '<p>' + fmt(c.lead) + '</p><img src="assets/img/mascot.webp" alt="" loading="lazy" width="160" height="160">';
    },
    qa(el, items) {
      el.innerHTML = items.map((x, i) => '<details' + (i ? '' : ' open') + '><summary>' + esc(x.q) + '</summary><div class="ans">' + fmt(x.a) + '</div></details>').join('');
    },
    contact(el, c) {
      el.innerHTML = '<img src="assets/img/mascot.webp" alt="" loading="lazy" width="120" height="120">' +
        '<div><h2>' + fmt(c.title) + '</h2><p>' + fmt(c.text) + '</p></div><div class="acts">' +
        (c.line ? '<a class="btn btn-green" href="https://line.me/R/ti/p/' + encodeURIComponent(c.line) + '" target="_blank" rel="noopener">' + icon('chat') + 'LINE ' + esc(c.line) + '</a>' : '') +
        (c.email ? '<a class="btn btn-line" href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a>' : '') + '</div>';
    }
  };

  /** ใส่เนื้อหาลงหน้า · [data-sec="ชื่อ"] ใช้ตัวเติมชื่อนั้น ข้อมูลจาก data-key (ถ้าไม่ใส่ = ชื่อเดียวกัน) · [data-head="ส่วน"] = หัวข้อส่วน */
  function apply(c) {
    document.querySelectorAll('[data-head]').forEach(el => { if (c[el.dataset.head]) R.head(el, c[el.dataset.head]); });
    document.querySelectorAll('[data-sec]').forEach(el => {
      const v = (el.dataset.key || el.dataset.sec).split('.').reduce((o, k) => o && o[k], c);
      if (v != null) R[el.dataset.sec](el, v);
    });
  }

  PEH.content = { apply, fmt };
  PEH.api.content().then(c => { if (c) apply(c); });
})();

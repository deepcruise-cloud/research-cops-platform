// Research COPS — shared site behaviour. Every block checks its elements exist,
// so the same file runs on the homepage and on inner pages.
const $ = id => document.getElementById(id);

// Nav background on scroll
const nav = $('nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 20);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// Mobile menu
const burger = $('burger'), mm = $('mobileMenu');
burger.addEventListener('click', () => { const o = mm.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { mm.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));

// Desktop dropdowns: click toggles (hover/focus handled in CSS), Escape closes
document.querySelectorAll('.dd-btn').forEach(b => b.addEventListener('click', () => {
  const dd = b.parentElement, open = !dd.classList.contains('open');
  document.querySelectorAll('.dd.open').forEach(x => { x.classList.remove('open'); x.querySelector('.dd-btn').setAttribute('aria-expanded', false); });
  dd.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
}));
document.addEventListener('click', e => { if (!e.target.closest('.dd')) document.querySelectorAll('.dd.open').forEach(x => x.classList.remove('open')); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.dd.open').forEach(x => x.classList.remove('open')); });

// Audience tabs (homepage)
document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(x => x.setAttribute('aria-selected', x === t));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('on', p.dataset.p === t.dataset.t));
}));

// Reveal on scroll + animate bars
const fillBars = el => el.querySelectorAll('.bar i').forEach(b => b.style.width = b.dataset.w + '%');
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); fillBars(e.target); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
// Homepage headline choreography (one calm sequence):
//   0–0.8s words rise in (CSS) → 0.9s "Research Projects" types in once → caret fades →
//   ~2.1s the Price → … → Report & Analyze steps fade in, then follow the product panel below.
const heroWord = $('heroWord'), heroTag = $('heroTag');
const heroReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (heroWord && !heroReduced) {
  const full = heroWord.textContent, caret = heroWord.nextElementSibling;
  heroWord.textContent = '';
  let ci = 0;
  const type = () => {
    heroWord.textContent = full.slice(0, ++ci);
    if (ci < full.length) return setTimeout(type, 55);
    setTimeout(() => caret && caret.classList.add('done'), 900);
    if (heroTag) heroTag.classList.add('go');
  };
  setTimeout(type, 900);
} else if (heroTag) heroTag.classList.add('go');

// Homepage hero: auto-advancing walkthrough of one study through the platform
const flow = $('heroFlow');
if (flow) {
  const tabs = [...flow.querySelectorAll('.flow-steps li')], panes = [...flow.querySelectorAll('.fs')];
  const prog = $('flowProgress'), pauseBtn = $('flowPause');
  const STEP_MS = 3600, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = 0, timer = null, paused = reduced, started = 0;

  const countUp = el => {
    const end = +el.dataset.count, dec = +(el.dataset.dec || 0), pre = el.dataset.prefix || '';
    const fmt = v => pre + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    if (reduced) { el.textContent = fmt(end); return; }
    const t0 = performance.now(), dur = 1100;
    const tick = t => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(end * e); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  // Panel stages → hero sequence steps (Clean and Report both light "Report & Analyze")
  const tagSteps = heroTag ? [...heroTag.querySelectorAll(':scope > span')] : [];
  const TAG_FOR_STAGE = [0, 1, 2, 3, 4, 4];
  // "One Platform" glides under the lit step (centred on it, kept inside the line)
  const opLabel = heroTag && heroTag.querySelector('.op-label');
  const placeLabel = () => {
    const step = tagSteps[TAG_FOR_STAGE[cur]];
    if (!opLabel || !step) return;
    const row = opLabel.parentElement.getBoundingClientRect(), s = step.getBoundingClientRect();
    const arrow = step.querySelector('i'), textRight = arrow ? arrow.getBoundingClientRect().left : s.right;
    const centre = (s.left + textRight) / 2 - row.left, w = opLabel.offsetWidth;
    opLabel.style.transform = `translateX(${Math.max(0, Math.min(row.width - w, centre - w / 2))}px)`;
  };
  addEventListener('resize', placeLabel);
  const show = i => {
    cur = i;
    tagSteps.forEach((s, k) => s.classList.toggle('on', k === TAG_FOR_STAGE[i]));
    placeLabel();
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.classList.toggle('done', k < i); });
    panes.forEach((p, k) => {
      const on = k === i;
      p.classList.toggle('on', on);
      p.querySelectorAll('.bar i').forEach(b => b.style.width = on ? b.dataset.w + '%' : '0');
      if (on) p.querySelectorAll('[data-count]').forEach(countUp);
    });
    prog.style.transition = 'none';
    prog.style.width = ((paused ? i + 1 : i) / tabs.length * 100) + '%';
    if (!paused) requestAnimationFrame(() => { prog.style.transition = `width ${STEP_MS}ms linear`; prog.style.width = ((i + 1) / tabs.length * 100) + '%'; });
    started = performance.now();
  };
  const schedule = () => { clearTimeout(timer); if (!paused) timer = setTimeout(() => { show((cur + 1) % tabs.length); schedule(); }, STEP_MS); };
  tabs.forEach((t, k) => t.addEventListener('click', () => { show(k); schedule(); }));
  pauseBtn.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.textContent = paused ? 'Play' : 'Pause';
    pauseBtn.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
    show(cur); schedule();
  });
  if (reduced) { pauseBtn.textContent = 'Play'; pauseBtn.setAttribute('aria-label', 'Play animation'); }
  // Only animate while the hero is on screen
  // (start once on entering the viewport; don't restart on repeat callbacks, or the panel never advances)
  let visible = false;
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !visible) { visible = true; show(cur); schedule(); }
    else if (!e.isIntersecting && visible) { visible = false; clearTimeout(timer); }
  }), { threshold: .2 }).observe(flow);
}

// Insights filters
document.querySelectorAll('.filter').forEach(f => f.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(x => x.setAttribute('aria-pressed', x === f));
  const c = f.dataset.f;
  document.querySelectorAll('.post-grid .icard').forEach(p => p.hidden = c !== 'all' && p.dataset.cat !== c);
}));

// CPI estimator (indicative model)
if ($('estForm')) {
  // USA reference CPIs at ~10 min LOI; sit inside the rate-card bands
  // (Consumer $1–12, Business $8–28, Healthcare $22–90, Patients $8–34)
  const base = { consumer: 3.2, b2b: 9.5, itdm: 13, csuite: 18, hcp: 24, patients: 12 };
  const usd = v => '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const calc = () => {
    const panel = $('ePanel').value, n = +$('eN').value, loi = +$('eLoi').value;
    const ctry = +$('eCountry').value, ir = +$('eIr').value;
    const noSize = panel === 'consumer' || panel === 'patients';
    const size = noSize ? 1 : +$('eSize').value;
    $('eSize').disabled = noSize;
    const loiF = 1 + Math.max(0, loi - 10) * 0.045;
    let cpi = Math.max(base[panel] * ctry * ir * size * loiF, panel === 'consumer' ? 1.5 : 7);
    if (n >= 1000) cpi *= 0.92;
    const total = cpi * n;
    // Feasibility score: harder audiences, low IR and large N reduce it
    const diff = { consumer: 0, b2b: 1, itdm: 1.6, csuite: 2.3, hcp: 2.6, patients: 2 }[panel];
    const score = 100 - diff * 8 - (ir - 1) * 22 - (size - 1) * 25 - n / 150 - Math.max(0, loi - 20) * 0.8;
    const f = $('rFeas');
    if (score >= 72) { f.textContent = 'High'; f.className = 'feas hi'; }
    else if (score >= 50) { f.textContent = 'Medium'; f.className = 'feas md'; }
    else { f.textContent = 'Limited – talk to us'; f.className = 'feas lo'; }
    $('oN').textContent = n.toLocaleString(); $('oLoi').textContent = loi + ' min';
    $('rCpi').innerHTML = usd(cpi) + '<span> /complete</span>';
    $('rTotal').textContent = usd(total);
    $('rTime').textContent = score >= 72 ? '48–72 hours' : score >= 50 ? '4–6 days' : '7–10 days';
  };
  ['ePanel', 'eCountry', 'eIr', 'eSize', 'eN', 'eLoi'].forEach(id => $(id).addEventListener('input', calc)); calc();

  // Carry estimate into the quote form
  $('lockBtn').addEventListener('click', () => {
    const p = $('ePanel'), c = $('eCountry'), ir = $('eIr');
    $('cform').dataset.estimate = JSON.stringify({ cpi: $('rCpi').textContent.replace(' /complete', ''), total: $('rTotal').textContent });
    $('fMsg').value = `Estimate: ${p.options[p.selectedIndex].text}, ${c.options[c.selectedIndex].text}, N=${$('eN').value}, LOI ${$('eLoi').value} min, IR ${ir.options[ir.selectedIndex].text}. Indicative CPI ${$('rCpi').textContent.replace(' /complete', '')}, total ${$('rTotal').textContent}.\n\n`;
  });
}

// Pre-select the "I need" option from ?need= (used by inner-page CTAs)
const needParam = new URLSearchParams(location.search).get('need');
if (needParam && $('fNeed')) [...$('fNeed').options].forEach(o => { if (o.value === needParam || o.text === needParam) o.selected = true; });

// Quote form -> Firestore "leads" via RC.saveLead (same schema the admin reads)
if ($('cform')) $('cform').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, em = f.email, nm = f.name, btn = f.querySelector('button[type=submit]');
  const err = $('formErr'); err.style.display = 'none';
  if (!nm.value.trim()) { nm.focus(); return; }
  if (!em.checkValidity() || !em.value) { em.focus(); return; }
  if (f.phone.value && !/^[\d\s+()-]{7,20}$/.test(f.phone.value)) { f.phone.focus(); return; }
  const est = f.dataset.estimate ? JSON.parse(f.dataset.estimate) : {};
  btn.disabled = true; btn.firstChild.textContent = 'Sending… ';
  RC.saveLead({
    name: nm.value.trim(), email: em.value.trim(), company: f.company.value.trim() || 'Not provided', phone: f.phone.value.trim(),
    cpi: est.cpi || 'N/A', budget: est.total || 'N/A',
    message: `I am a: ${f.type.value}\nNeed: ${f.need.value}\n\n${f.message.value}`,
    source: 'Website Form'
  }).then(() => {
    [...f.children].forEach(el => { if (!el.classList.contains('form-ok')) el.style.display = 'none'; });
    $('formOk').style.display = 'block';
    $('formOk').querySelectorAll('[data-calendly]').forEach(a => a.href = RC.calendly);
    $('formOk').scrollIntoView({ block: 'center' });
  }).catch(e2 => {
    console.error('Lead save failed', e2);
    err.style.display = 'block'; btn.disabled = false; btn.firstChild.textContent = 'Send request ';
  });
});

// Back-to-top arrow, centred at the foot of the screen once the visitor has scrolled a screen down
(() => {
  const btn = document.createElement('button');
  btn.className = 'to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  btn.addEventListener('click', () => scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  document.body.appendChild(btn);
  const toggle = () => btn.classList.toggle('show', scrollY > innerHeight * 0.8);
  addEventListener('scroll', toggle, { passive: true });
  toggle();
})();

// Header logo: "RESEARCH COPS" stays still while the tagline is built out of it.
// "Research" drops from Research, "C" drops from COPS and "entric" wipes in, then "OPS" drops from COPS.
// It holds, fades out and plays again on a loop.
(() => {
  const word = document.querySelector('header.rc-chrome .logo-word'), sub = document.querySelector('header.rc-chrome .logo-sub');
  if (!word || !sub || !sub.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const pairs = [[word.querySelector('.lw-r'), sub.querySelector('.ls-r'), 150],
                 [word.querySelector('.lw-c'), sub.querySelector('.ls-cap'), 750],
                 [word.querySelector('.lw-ops'), sub.querySelector('.ls-ops'), 1700]];
  const tail = sub.querySelector('.ls-tail');
  if (pairs.some(([a, b]) => !a || !b) || !tail) return;
  pairs.forEach(([, el]) => { el.style.opacity = 0; }); tail.style.opacity = 0;
  const run = () => {
    pairs.forEach(([src, el, delay]) => {
      const a = src.getBoundingClientRect(), b = el.getBoundingClientRect(), k = a.height / b.height;
      const from = getComputedStyle(src).color, to = getComputedStyle(el).color;
      el.style.transformOrigin = '0 0';
      el.style.opacity = '';
      el.animate([
        { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${k})`, color: from, opacity: 0 },
        { offset: .15, opacity: .9 },
        { offset: .8, transform: 'translate(0, 1.5px) scale(1)', color: to, opacity: 1 },
        { transform: 'none', color: to, opacity: 1 }
      ], { duration: 800, delay, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'backwards' });
    });
    tail.style.opacity = '';
    tail.animate([{ clipPath: 'inset(0 100% 0 0)', opacity: .4 }, { clipPath: 'inset(0 0 0 0)', opacity: 1 }],
      { duration: 650, delay: 1500, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
    // Hold the finished tagline, fade it out, then build it again
    setTimeout(() => { const fade = sub.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: 'ease-in', fill: 'forwards' }); fade.finished.then(() => { run(); fade.cancel(); }); }, 2500 + 4500);
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(run));
})();

// Tinta Mía · «Kakemono»: cada tatuaje cuelga como un pergamino de un clavo. El de la portada se desenrolla al cargar;
// todos se balancean con un muelle amortiguado cuando bajas la página o pasas el cursor por encima.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const has = () => typeof gsap !== 'undefined' && !reduce;

  function unroll() {
    if (!has()) return;
    const h = document.querySelector('.hang-hero'), paper = h.querySelector('.paper'), rod = h.querySelector('.rod-b'), ph = paper.offsetHeight;
    gsap.timeline({ delay: .2 })
      .fromTo(h, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power2.out' })
      .fromTo(paper, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power3.inOut' }, '-=.1')
      .fromTo(rod, { y: -ph }, { y: 0, duration: 1.5, ease: 'power3.inOut', clearProps: 'transform' }, '<')
      .fromTo(paper.querySelector('img'), { scale: 1.25 }, { scale: 1, duration: 2.2, ease: 'expo.out' }, '<.2')
      .fromTo('.hanko', { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: .5, ease: 'back.out(2)' }, '-=1')
      .add(() => kick(h, 7), '-=1.3');
    gsap.fromTo('.mega span', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.4, ease: 'expo.out', stagger: .12, delay: .45 });
  }

  // ---------- balanceo: θ'' = −kθ − cθ' (+ empujones) ----------
  const items = [];
  const kick = (el, v) => { const it = items.find((i) => i.el === el); if (it) it.w += v * it.f; };
  function sway() {
    if (!has()) return;
    document.querySelectorAll('.hang').forEach((el, n) => items.push({ el, f: +el.dataset.sway || 1, a: 0, w: 0, vis: false, dir: n % 2 ? -1 : 1, lx: null }));
    const io = new IntersectionObserver((es) => es.forEach((e) => { const it = items.find((i) => i.el === e.target); if (it) it.vis = e.isIntersecting; }));
    items.forEach((it) => {
      io.observe(it.el);
      it.el.addEventListener('pointermove', (e) => { if (it.lx !== null) it.w += (e.clientX - it.lx) * .09 * it.f; it.lx = e.clientX; });
      it.el.addEventListener('pointerleave', () => (it.lx = null));
    });
    let lastY = scrollY, t0 = performance.now();
    gsap.ticker.add(() => {
      const now = performance.now(), dt = Math.min(.033, (now - t0) / 1000); t0 = now;
      const v = P.lenis ? P.lenis.velocity : (scrollY - lastY); lastY = scrollY;
      items.forEach((it) => {
        if (!it.vis) return;
        it.w += v * .022 * it.f * it.dir;
        it.w += (-34 * it.a - 2.6 * it.w) * dt;
        it.a = Math.max(-14, Math.min(14, it.a + it.w * dt));
        if (Math.abs(it.a) < .005 && Math.abs(it.w) < .005) { it.a = 0; it.w = 0; }
        it.el.style.transform = `rotate(${it.a.toFixed(3)}deg)`;
      });
    });
  }

  function init() { sway(); unroll(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

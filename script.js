/*  Nav  */
  const tog = document.querySelector('.nav-toggle');
  const nl  = document.getElementById('nav-links');
  tog.addEventListener('click', () => { const o = nl.classList.toggle('open'); tog.setAttribute('aria-expanded', o); });
  nl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nl.classList.remove('open'); tog.setAttribute('aria-expanded','false'); }));

  /*  Active nav link  */
  const sects = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id)); });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sects.forEach(s => io.observe(s));

  /*  Fade-in + progress bars  */
  const fio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        e.target.querySelectorAll('.prog-fill[data-w]').forEach(b => b.style.width = b.dataset.w);
        fio.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fi').forEach(el => fio.observe(el));
  document.querySelectorAll('.prog-fill[data-w]').forEach(b => { if (b.getBoundingClientRect().top < window.innerHeight) b.style.width = b.dataset.w; });

  /*  Project Modals  */
  function openModal(id) {
    const backdrop = document.getElementById(id);
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    // focus the close button
    backdrop.querySelector('.modal-close').focus();
  }
  function closeModal(id) {
    document.getElementById(id).classList.remove('open');
    document.body.style.overflow = '';
  }
  // Close on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(bd => {
    bd.addEventListener('click', e => { if (e.target === bd) closeModal(bd.id); });
  });
  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(bd => closeModal(bd.id));
      closeLightbox();
    }
  });

  /*  Modal tabs  */
  document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const modalId  = tab.dataset.modal;
      const tabId    = tab.dataset.tab;
      const modal    = document.getElementById(modalId);
      // deactivate all tabs + panels in this modal
      modal.querySelectorAll('.modal-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      modal.querySelectorAll('.modal-panel').forEach(p => p.classList.remove('active'));
      // activate selected
      tab.classList.add('active'); tab.setAttribute('aria-selected','true');
      document.getElementById(tabId).classList.add('active');
    });
  });

  /*  Lightbox  */
  function openLightbox(el) {
    const img = el.querySelector('img');
    const lb  = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    if (img) { lbImg.src = img.src; lbImg.alt = img.alt; }
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.querySelector('.lightbox-close').focus();
  }
  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('lightbox').addEventListener('click', e => { if (e.target === e.currentTarget || e.target === document.getElementById('lb-img')) return; closeLightbox(); });
  document.getElementById('lb-img').addEventListener('click', e => e.stopPropagation());

  /*  Contact Form  */
  const form = document.getElementById('cform');
  const sbtn = document.getElementById('sbtn');
  function chk(id, ok) { document.getElementById('fg-'+id)?.classList.toggle('err',!ok); return ok; }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    ok = chk('name',  document.getElementById('nm').value.trim().length > 0) && ok;
    ok = chk('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('em').value)) && ok;
    ok = chk('msg',   document.getElementById('msg').value.trim().length >= 20) && ok;
    const con = document.getElementById('consent'), ce = document.getElementById('con-err');
    if (!con.checked) { ce.textContent = 'Please accept to continue.'; ce.style.display = 'block'; ok = false; } else { ce.style.display = 'none'; }
    if (!ok) { form.querySelector('.err .fctrl')?.focus(); return; }
    sbtn.disabled = true;
    sbtn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending…';
    await new Promise(r => setTimeout(r, 1400));
    sbtn.style.display = 'none';
    document.getElementById('fsuccess').style.display = 'block';
    form.reset();
  });
  ['nm','em','msg'].forEach(id => {
    document.getElementById(id).addEventListener('blur', () => {
      const v = document.getElementById(id).value;
      if (id==='nm')  chk('name',  v.trim().length > 0);
      if (id==='em')  chk('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      if (id==='msg') chk('msg',   v.trim().length >= 20);
    });
  });

  /* Scroll top */
  const stt = document.getElementById('stt');
  window.addEventListener('scroll', () => stt.classList.toggle('show', scrollY > 400));
  stt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
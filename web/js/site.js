/* ============================================================
   Zenti — shared site behaviour
   Floating retractable nav · dropdowns · mobile menu ·
   scroll-step logo spin · reveals
   ============================================================ */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- dark / light theme ---------- */
  var root = document.documentElement;
  function setTheme(t){
    if(t==='dark') root.setAttribute('data-theme','dark'); else root.removeAttribute('data-theme');
    try{ localStorage.setItem('zenti-theme', t); }catch(e){}
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(function(b){
    b.addEventListener('click', function(){ setTheme(root.getAttribute('data-theme')==='dark' ? 'light' : 'dark'); });
  });

  /* ---------- floating nav: retract on scroll-down, reveal on scroll-up ---------- */
  var nav = document.getElementById('fnav');
  if(nav){
    var lastY = window.scrollY, ticking = false;
    function onScroll(){
      var y = window.scrollY;
      if(y > lastY + 6 && y > 140){ nav.classList.add('hide'); closeAll(); }
      else if(y < lastY - 6){ nav.classList.remove('hide'); }
      lastY = y; ticking = false;
    }
    window.addEventListener('scroll', function(){ if(!ticking){ requestAnimationFrame(onScroll); ticking = true; } }, {passive:true});

    /* dropdown toggles (click — works on touch + keyboard; hover handled by CSS) */
    var items = nav.querySelectorAll('.fnav-item.has-drop');
    function closeAll(except){ items.forEach(function(it){ if(it!==except) it.classList.remove('open'); }); }
    items.forEach(function(it){
      var btn = it.querySelector('.fnav-link');
      btn.addEventListener('click', function(e){
        e.preventDefault();
        var open = it.classList.contains('open');
        closeAll(it);
        it.classList.toggle('open', !open);
        btn.setAttribute('aria-expanded', String(!open));
      });
    });
    document.addEventListener('click', function(e){ if(!nav.contains(e.target)) closeAll(); });

    /* mobile burger */
    var burger = document.getElementById('fnavBurger');
    if(burger){
      burger.addEventListener('click', function(){ nav.classList.toggle('menu-open'); });
      nav.querySelectorAll('.fnav-menu a').forEach(function(a){
        a.addEventListener('click', function(){ nav.classList.remove('menu-open'); });
      });
    }
  }

  /* ---------- reveals ---------- */
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    }, {threshold:.18, rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('[data-r]').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('[data-r]').forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- waitlist / email capture ----------
     Works today with no backend via a mailto handoff. To capture silently,
     set WAITLIST_ENDPOINT to a form endpoint (Formspree, Supabase function,
     your own API) that accepts a POST { email, source } — the form will then
     submit in the background and skip the mailto step. */
  var WAITLIST_ENDPOINT = ''; // e.g. 'https://formspree.io/f/xxxx' or your API URL
  var WAITLIST_EMAIL = 'hello@zentipay.app';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function alreadyJoined(email){
    try{ var a = JSON.parse(localStorage.getItem('zenti_waitlist')||'[]'); return a.indexOf(email)>-1; }catch(e){ return false; }
  }
  function remember(email){
    try{ var a = JSON.parse(localStorage.getItem('zenti_waitlist')||'[]'); if(a.indexOf(email)<0){ a.push(email); localStorage.setItem('zenti_waitlist', JSON.stringify(a)); } }catch(e){}
  }
  function setMsg(form, text, isErr){
    var box = form.parentNode.querySelector('[data-wl-msg]') || form.nextElementSibling;
    if(box){ box.textContent = text; box.classList.toggle('err', !!isErr); }
  }
  function lockSuccess(form, text){
    setMsg(form, text, false);
    var btn = form.querySelector('button'); var inp = form.querySelector('input');
    if(btn){ btn.disabled = true; btn.textContent = '✓ On the list'; }
    if(inp){ inp.disabled = true; }
  }

  document.querySelectorAll('form[data-waitlist]').forEach(function(form){
    var input = form.querySelector('input[type="email"], input[name="email"]');
    var source = form.getAttribute('data-source') || (document.title || 'site');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var email = (input && input.value || '').trim();
      if(!EMAIL_RE.test(email)){
        if(input){ input.setAttribute('aria-invalid','true'); input.focus(); }
        setMsg(form, 'Enter a valid email so we can reach you.', true);
        return;
      }
      if(input) input.removeAttribute('aria-invalid');
      if(alreadyJoined(email)){ lockSuccess(form, 'You’re already on the list — see you at launch.'); return; }
      remember(email);
      if(WAITLIST_ENDPOINT){
        var fd = new FormData(); fd.append('email', email); fd.append('source', source);
        fetch(WAITLIST_ENDPOINT, {method:'POST', body:fd, headers:{'Accept':'application/json'}})
          .then(function(r){ lockSuccess(form, r.ok ? 'You’re on the list. We’ll email you at launch.' : 'Got it — we’ll be in touch at launch.'); })
          .catch(function(){ lockSuccess(form, 'Saved. We’ll email you at launch.'); });
      } else {
        var subject = encodeURIComponent('Join the Zenti waitlist');
        var body = encodeURIComponent('Add me to the Zenti waitlist.\n\nEmail: ' + email + '\nFrom: ' + source);
        window.location.href = 'mailto:' + WAITLIST_EMAIL + '?subject=' + subject + '&body=' + body;
        lockSuccess(form, 'Almost there — send the email we just opened (or write to ' + WAITLIST_EMAIL + ').');
      }
    });
  });

  /* ---------- flip cards (Apple-style feature cards) ---------- */
  document.querySelectorAll('.flip').forEach(function(card){
    card.setAttribute('tabindex','0');
    card.setAttribute('role','button');
    card.setAttribute('aria-expanded','false');
    function toggle(){
      var on = card.classList.toggle('flipped');
      card.setAttribute('aria-expanded', String(on));
    }
    card.addEventListener('click', function(e){
      if(e.target.closest('a')) return; /* let links on the back work */
      toggle();
    });
    card.addEventListener('keydown', function(e){
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); }
      if(e.key==='Escape' && card.classList.contains('flipped')) toggle();
    });
  });

  /* ---------- scroll-step spinning logo ---------- */
  var spin = document.querySelector('.spinsteps');
  if(spin && !reduce){
    var logo = spin.querySelector('.ss-logo');
    var steps = spin.querySelectorAll('.ss-step');
    var st = false;
    function spinLoop(){
      var r = spin.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = r.height - vh;
      var p = Math.min(Math.max((vh*0.5 - r.top) / total, 0), 1);
      if(logo) logo.style.transform = 'rotate(' + (p * 720) + 'deg)';
      /* highlight active step */
      steps.forEach(function(s){
        var sr = s.getBoundingClientRect();
        var mid = sr.top + sr.height/2;
        s.classList.toggle('active', mid > vh*0.2 && mid < vh*0.8);
      });
      st = false;
    }
    window.addEventListener('scroll', function(){ if(!st){ requestAnimationFrame(spinLoop); st = true; } }, {passive:true});
    spinLoop();
  }
})();

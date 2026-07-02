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
    if(window.__updBg) window.__updBg();
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

  /* ---------- immersive scroll backgrounds ----------
     Sections tagged data-bg="green|blue|purple|amber|mint|pink" flood the
     page background with their colour as they cross the viewport centre. */
  var BGP = {
    green:  ['#b3f89b', '#123c1d'],
    blue:   ['#9fc7ff', '#142c58'],
    purple: ['#dcbcff', '#301c58'],
    amber:  ['#ffd76e', '#453510'],
    mint:   ['#93f2d2', '#104033'],
    pink:   ['#ffb7d8', '#44142e']
  };
  var bgEls = [].slice.call(document.querySelectorAll('[data-bg]'));
  function updBg(){
    var mid = window.innerHeight * 0.5, cur = null;
    for(var i=0;i<bgEls.length;i++){
      var r = bgEls[i].getBoundingClientRect();
      if(r.top <= mid && r.bottom >= mid){ cur = bgEls[i]; break; }
    }
    var dark = root.getAttribute('data-theme')==='dark';
    if(cur){
      var p = BGP[cur.getAttribute('data-bg')];
      if(p) document.body.style.backgroundColor = p[dark?1:0];
    } else {
      document.body.style.backgroundColor = '';
    }
  }
  if(bgEls.length){
    document.body.style.transition = 'background-color .9s cubic-bezier(.32,.72,0,1)';
    var bgTick = false;
    window.addEventListener('scroll', function(){ if(!bgTick){ requestAnimationFrame(function(){ updBg(); bgTick=false; }); bgTick=true; } }, {passive:true});
    window.addEventListener('resize', updBg);
    updBg();
  }
  window.__updBg = updBg;

  /* ---------- tabbed features ----------
     A .fp-toc[data-tabs] nav turns its #anchor targets into tab panels:
     one visible at a time, pill highlighted, hash + deep links kept. */
  var toc = document.querySelector('.fp-toc[data-tabs]');
  if(toc){
    var tabLinks = [].slice.call(toc.querySelectorAll('a[href^="#"]'));
    var panels = tabLinks.map(function(l){ return document.getElementById(l.getAttribute('href').slice(1)); }).filter(Boolean);
    function activateTab(id, focus){
      tabLinks.forEach(function(l){ l.classList.toggle('on', l.getAttribute('href')==='#'+id); });
      panels.forEach(function(p){
        var on = p.id===id;
        p.style.display = on ? '' : 'none';
        p.classList.toggle('tabpane', on);
        if(on){ p.querySelectorAll('[data-r]').forEach(function(el){ el.classList.add('in'); }); }
      });
      if(window.__updBg) window.__updBg();
    }
    tabLinks.forEach(function(l){
      l.addEventListener('click', function(e){
        e.preventDefault();
        var id = l.getAttribute('href').slice(1);
        activateTab(id);
        try{ history.replaceState(null,'','#'+id); }catch(err){}
      });
    });
    window.addEventListener('hashchange', function(){
      var id = location.hash.slice(1);
      if(panels.some(function(p){ return p.id===id; })) activateTab(id);
    });
    var initId = location.hash.slice(1);
    if(!panels.some(function(p){ return p.id===initId; })) initId = panels.length ? panels[0].id : null;
    if(initId) activateTab(initId);
  }

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

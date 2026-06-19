/* ============================================================
   Zenti — shared site behaviour
   Floating retractable nav · dropdowns · mobile menu ·
   scroll-step logo spin · reveals
   ============================================================ */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

function goTo(id){
  var el = document.getElementById(id);
  if(el){ el.scrollIntoView({behavior:'smooth', block:'start'}); }
}
function toggleAcc(btn){
  var item = btn.closest('.acc-item');
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.acc-item').forEach(function(el){
    el.classList.remove('open');
    el.querySelector('.acc-header').setAttribute('aria-expanded', 'false');
  });
  if(!isOpen){
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}
function setLang(lang){
  document.querySelectorAll('.i18n').forEach(function(el){
    var val = el.getAttribute('data-' + lang);
    if(val !== null){ el.textContent = val; }
  });
  var sw = document.getElementById('langSwitch');
  sw.setAttribute('data-lang', lang);
  document.getElementById('btnTr').setAttribute('aria-pressed', lang === 'tr' ? 'true' : 'false');
  document.getElementById('btnEn').setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
  try{ localStorage.setItem('frayd-lang', lang); }catch(e){}
}
(function(){
  var saved = 'tr';
  try{ saved = localStorage.getItem('frayd-lang') || 'tr'; }catch(e){}
  setLang(saved);
})();

/* Scroll reveal */
(function(){
  var items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  if(!('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  items.forEach(function(el){ io.observe(el); });
})();

/* Active nav link + scroll progress + hero parallax */
(function(){
  var navButtons = document.querySelectorAll('.navlinks button[data-navfor]');
  var sections = [];
  navButtons.forEach(function(btn){
    var sec = document.getElementById(btn.getAttribute('data-navfor'));
    if(sec) sections.push({btn:btn, sec:sec});
  });
  var progressBar = document.getElementById('scrollProgress');
  var heroBadge = document.querySelector('.hero-badge img');
  var reduceMotion = false;
  try{ reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}

  function onScroll(){
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var max = (doc.scrollHeight - doc.clientHeight) || 1;
    if(progressBar){ progressBar.style.width = Math.min(100, (scrollTop / max) * 100) + '%'; }

    var pos = scrollTop + doc.clientHeight * .3;
    var current = null;
    sections.forEach(function(item){
      if(item.sec.offsetTop <= pos){ current = item; }
    });
    sections.forEach(function(item){ item.btn.classList.toggle('active', item === current); });

    if(heroBadge && !reduceMotion){
      var y = Math.min(scrollTop, 500);
      heroBadge.style.transform = 'translateY(' + (y * 0.12) + 'px)';
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  onScroll();
})();

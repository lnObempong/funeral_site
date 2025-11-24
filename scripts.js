
// scripts.js - animations, parallax effect, back-to-top, and localStorage handlers (no content changed)

// Simple parallax for hero photo
(function(){
  const hero = document.querySelector('.header-hero');
  const photo = document.querySelector('.hero-photo img');
  function onScroll(){
    const sc = window.scrollY;
    if(hero){
      hero.style.backgroundPosition = `center ${Math.max(-20, -sc/15)}px`;
    }
    if(photo){
      photo.style.transform = `translateY(${Math.min(20, sc/30)}px)`;
    }
    // back to top show/hide
    const b = document.getElementById('backToTop');
    if(window.scrollY > 300) b.classList.add('show'); else b.classList.remove('show');
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

// Intersection Observer for simple scroll-in animations
(function(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ en.target.classList.add('in-view'); io.unobserve(en.target); }
    });
  }, {threshold:0.12});
  document.querySelectorAll('[data-animate]').forEach(el=>io.observe(el));
})();

// Back to top
document.addEventListener('DOMContentLoaded', ()=>{
  const b = document.getElementById('backToTop');
  if(b) b.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));
});

// LOCAL STORAGE: tributes & guestbook (same keys as original)
const tributesKey = 'memorial_tributes_v1';
const guestKey = 'memorial_guestbook_v1';

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

function loadTributesLive(selector){
  const el = document.querySelector(selector);
  if(!el) return;
  el.innerHTML='';
  const arr = JSON.parse(localStorage.getItem(tributesKey) || '[]');
  if(arr.length===0){ el.innerHTML = '<p class=\"muted\">No tributes added yet, use the form above.</p>'; return }
  arr.slice().reverse().forEach(t => {
    const d = document.createElement('div'); d.className='card';
    d.innerHTML = `<strong>${escapeHtml(t.name)}</strong> <span class=\"muted\">, ${escapeHtml(t.relation || 'Friend')}</span><p>${escapeHtml(t.message)}</p>`;
    if(t.photo) d.innerHTML += `<img src=\"${escapeHtml(t.photo)}\" alt=\"tribute photo\" style=\"max-width:140px;border-radius:8px;margin-top:8px\">`;
    el.appendChild(d);
  });
}

function loadGuestsLive(selector){
  const el = document.querySelector(selector);
  if(!el) return;
  el.innerHTML='';
  const arr = JSON.parse(localStorage.getItem(guestKey) || '[]');
  if(arr.length===0){ el.innerHTML='<p class=\"muted\">No guest messages yet.</p>'; return }
  arr.slice().reverse().forEach(g =>{
    const d=document.createElement('div'); d.className='card'; d.innerHTML=`<strong>${escapeHtml(g.name)}</strong><p>${escapeHtml(g.msg)}</p><small class=\"muted\">${new Date(g.when).toLocaleString()}</small>`; el.appendChild(d);
  });
}

// Wire up tribute form (if present on page)
document.addEventListener('submit', function(e){
  if(e.target && e.target.id === 'tributeForm'){
    e.preventDefault();
    const name = document.getElementById('t-name').value.trim();
    const relation = document.getElementById('t-relation').value.trim();
    const message = document.getElementById('t-message').value.trim();
    const photo = document.getElementById('t-photo').value.trim();
    const arr = JSON.parse(localStorage.getItem(tributesKey) || '[]');
    arr.push({name,relation,message,photo,created:Date.now()});
    localStorage.setItem(tributesKey, JSON.stringify(arr));
    e.target.reset();
    loadTributesLive('#liveTributes');
  }
  if(e.target && e.target.id === 'guestForm'){
    e.preventDefault();
    const name=document.getElementById('g-name').value.trim();
    const msg=document.getElementById('g-message').value.trim();
    const arr=JSON.parse(localStorage.getItem(guestKey) || '[]');
    arr.push({name,msg,when:Date.now()}); localStorage.setItem(guestKey, JSON.stringify(arr));
    e.target.reset();
    loadGuestsLive('#guestList');
  }
});

// Clear button for tributes (delegated)
document.addEventListener('click', function(e){
  if(e.target && e.target.id === 'clearBtn'){
    if(confirm('Clear local tributes, this only clears this browser')){
      localStorage.removeItem(tributesKey);
      loadTributesLive('#liveTributes');
    }
  }
});

// Initialize live lists on DOM ready
document.addEventListener('DOMContentLoaded', ()=>{
  loadTributesLive('#liveTributes');
  loadGuestsLive('#guestList');
});


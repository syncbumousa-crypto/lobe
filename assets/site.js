/* لُب — السلوك المشترك: الترويسة والذيل، اللغتان، الشعارات، والتطويل المحسوب. */
(function () {
  'use strict';

  /* ══ ١ · الشعارات ══ */
  var HEART = 'M-140.75,148.39 A54.25,54.25 0 1,1 -50.37,91.6 A54.25,54.25 0 0,1 50.38,91.6 A54.25,54.25 0 1,1 140.75,148.39 L0,302 Z';
  var MARKS = {
    /* قلب لُب: ثلاث دوائر حقيقية ومماسان */
    lobe: '<svg viewBox="-154.995 57.485 309.99 244.515" aria-hidden="true"><path d="' + HEART + '" fill="currentColor"/></svg>',
    /* معلَم أكاديميا كما هو في موقعها */
    academia: '<svg viewBox="36 36 328 332" fill="currentColor" aria-hidden="true"><g transform="rotate(-8 200 200)">'
      + '<g stroke="currentColor" stroke-width="13" stroke-linecap="round" fill="none">'
      + '<line x1="92" y1="78" x2="308" y2="78"/><line x1="78" y1="92" x2="78" y2="308"/>'
      + '<line x1="322" y1="92" x2="322" y2="218"/><line x1="92" y1="322" x2="212" y2="322"/></g>'
      + '<rect x="58" y="58" width="40" height="40" rx="9"/><rect x="302" y="58" width="40" height="40" rx="9"/>'
      + '<rect x="58" y="302" width="40" height="40" rx="9"/>'
      + '<path transform="translate(200 207) scale(0.56) translate(0 -179.75)" d="' + HEART + '"/></g>'
      + '<path fill-rule="evenodd" transform="translate(312 318) rotate(38)" d="M-17,-74 Q-17,-86 -5,-86 L5,-86 Q17,-86 17,-74 L17,6 L0,36 L-17,6 Z M-3.5,-70 A3.5,3.5 0 0,1 3.5,-70 L3.5,2 A3.5,3.5 0 0,1 -3.5,2 Z"/></svg>',
    /* معلَم مرقاب (الاسم الأولي لأجندا) مرسومًا من الصورة المرسلة */
    agenda: '<svg viewBox="0 0 158 228" aria-hidden="true"><defs><mask id="mq-cut">'
      + '<rect width="158" height="228" fill="#fff"/><circle cx="83" cy="56" r="11" fill="#000"/>'
      + '<path d="M78 124 L90 118 L90 186 L78 186 Z" fill="#000"/></mask></defs>'
      + '<g mask="url(#mq-cut)" fill="currentColor"><circle cx="83" cy="60" r="46"/>'
      + '<path d="M55 92 L111 92 L124 214 Q124 222 116 222 L50 222 Q42 222 42 214 Z"/></g></svg>'
  };
  function paintMarks(root){
    var els = (root || document).querySelectorAll('[data-mark]'), i;
    for (i = 0; i < els.length; i++) els[i].innerHTML = MARKS[els[i].getAttribute('data-mark')] || '';
  }

  /* ══ ٢ · الترويسة والذيل ══ */
  var NAV = [
    ['index.html',    'الرئيسية',     'Home',     'home'],
    ['about.html',    'عن الشركة',    'About',    'about'],
    ['academia.html', 'أكاديميا',     'Academia', 'academia'],
    ['agenda.html',   'أجندا',        'Agenda',   'agenda'],
    ['careers.html',  'انضم إلينا',   'Careers',  'careers'],
    ['contact.html',  'تواصل معنا',   'Contact',  'contact']
  ];
  var page = document.body.getAttribute('data-page') || 'home';
  /* الترويسة كما في النسخة السابقة: شريط كبسولي عائم فيه المعلَم والاسم وزر اللغة،
     وبينهما روابط الصفحات */
  function header(){
    var h = '<div class="navin"><a class="brand" href="index.html" aria-label="لُب"><i class="mk" data-mark="lobe"></i>'
      + '<span class="nm" data-en="LOBE">لُب</span></a>'
      + '<nav class="links" id="links">';
    for (var i = 1; i < NAV.length; i++)
      h += '<a href="' + NAV[i][0] + '"' + (NAV[i][3] === page ? ' aria-current="page"' : '') + ' data-en="' + NAV[i][2] + '">' + NAV[i][1] + '</a>';
    h += '</nav><button class="pill menu" id="menu" type="button" aria-expanded="false" aria-controls="links" data-en="MENU">القائمة</button>'
      + '<button class="pill" id="lang" type="button">EN</button></div>';
    return h;
  }
  function footer(){
    var h = '<div class="wrap foot"><div class="row1"><a class="brand" href="index.html"><i data-mark="lobe" style="display:block;width:22px"></i>'
      + '<span data-en="LOBE">لُب</span></a><nav>';
    for (var i = 1; i < NAV.length; i++) h += '<a href="' + NAV[i][0] + '" data-en="' + NAV[i][2] + '">' + NAV[i][1] + '</a>';
    h += '<a href="https://acdemia.com/" data-en="acdemia.com ↗">acdemia.com ↗</a></nav></div>'
      + '<div class="cr" data-en="© 2026 LOBE. All rights reserved.">© ٢٠٢٦ لُب. جميع الحقوق محفوظة.</div></div>';
    return h;
  }
  var top = document.getElementById('top'), foot = document.getElementById('foot');
  if (top){ top.className = 'nav'; top.innerHTML = header(); }
  if (foot){ foot.innerHTML = footer(); }
  paintMarks();

  var menu = document.getElementById('menu');
  if (menu) menu.addEventListener('click', function(){
    var l = document.getElementById('links'), o = !l.classList.contains('open');
    l.classList.toggle('open', o); menu.setAttribute('aria-expanded', String(o));
  });

  /* ══ ٣ · التطويل المحسوب ══
     العناوين ذات السطرين تُطوَّل بحرف التطويل حتى يتساوى طول السطرين،
     ويُحسب العدد بالقياس فيصح مهما تغيّر الخط أو المقاس. */
  var NOJOIN = 'ادذرزوؤأإآةىءٱ';
  function isAr(c){ return c >= 'ء' && c <= 'ي'; }
  function sites(s){ var o = [], i;
    for (i = 0; i < s.length - 1; i++){ if (!isAr(s[i]) || NOJOIN.indexOf(s[i]) >= 0 || !isAr(s[i+1])) continue; o.push(i+1); }
    return o; }
  function stretch(s, n){
    if (n <= 0) return s; var p = sites(s); if (!p.length) return s;
    var add = new Array(p.length).fill(0), i, j, k = 0, out = '';
    for (i = 0; i < n; i++) add[i % p.length]++;
    for (i = 0; i < s.length; i++){ out += s[i];
      if (k < p.length && p[k] === i + 1){ for (j = 0; j < add[k]; j++) out += 'ـ'; k++; } }
    return out; }
  function justify(host){
    var lines = (document.documentElement.lang === 'ar' ? host.getAttribute('data-lines') : host.getAttribute('data-lines-en') || host.getAttribute('data-lines')).split('|');
    host.innerHTML = ''; var spans = [], i, target = 0;
    for (i = 0; i < lines.length; i++){ var sp = document.createElement('span'); sp.className = 'ln';
      sp.textContent = lines[i]; host.appendChild(sp); spans.push(sp); }
    if (document.documentElement.lang !== 'ar' || host.hasAttribute('data-nojustify')) return;
    for (i = 0; i < spans.length; i++) target = Math.max(target, spans[i].offsetWidth);
    for (i = 0; i < spans.length; i++){ var n = 0, g = 0;
      while (spans[i].offsetWidth < target - 2 && g++ < 60){ n++; spans[i].textContent = stretch(lines[i], n);
        if (spans[i].offsetWidth > target + 6){ n--; spans[i].textContent = stretch(lines[i], n); break; } } }
  }
  function justifyAll(){ var h = document.querySelectorAll('[data-lines]'), i; for (i = 0; i < h.length; i++) justify(h[i]); }

  /* ══ ٤ · اللغتان ══
     النص العربي هو الأصل في الصفحة، والإنجليزي في data-en. البيت يبقى عربيًا. */
  var nodes = document.querySelectorAll('[data-en]'), i;
  for (i = 0; i < nodes.length; i++) nodes[i].setAttribute('data-ar', nodes[i].innerHTML);
  function setLang(lang, remember){
    var ar = lang !== 'en', b = document.body;
    document.documentElement.lang = ar ? 'ar' : 'en';
    document.documentElement.dir = ar ? 'rtl' : 'ltr';
    for (i = 0; i < nodes.length; i++) nodes[i].innerHTML = nodes[i].getAttribute(ar ? 'data-ar' : 'data-en');
    var t = b.getAttribute(ar ? 'data-title' : 'data-title-en'); if (t) document.title = t;
    var L = document.getElementById('lang'); if (L){ L.textContent = ar ? 'EN' : 'ع'; L.setAttribute('aria-label', ar ? 'English' : 'العربية'); }
    var gl = document.querySelectorAll('[data-only="en"]'); for (i = 0; i < gl.length; i++) gl[i].hidden = ar;
    justifyAll();
    document.dispatchEvent(new Event('lobe:lang'));
    if (remember){ try{ localStorage.setItem('lobe-lang', ar ? 'ar' : 'en'); }catch(e){} }
  }
  var saved = null; try{ saved = localStorage.getItem('lobe-lang'); }catch(e){}
  var L0 = document.getElementById('lang');
  if (L0) L0.addEventListener('click', function(){ setLang(document.documentElement.lang === 'ar' ? 'en' : 'ar', true); });

  var rt = 0;
  window.addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(justifyAll, 180); });

  /* التطويل يُقاس بعد وصول الخط، وإلا ضُبط على خط النظام ثم قفز */
  var shown = false;
  function reveal(){ if (shown) return; shown = true; setLang(saved === 'en' ? 'en' : 'ar', false);
    document.body.classList.add('ready'); document.dispatchEvent(new Event('lobe:ready')); }
  setLang(saved === 'en' ? 'en' : 'ar', false);
  if (document.fonts && document.fonts.ready){ document.fonts.ready.then(reveal, reveal); setTimeout(reveal, 2500); }
  else setTimeout(reveal, 200);
})();

/* قلب لُب خلفيةً للرئيسية — «ضوء مائل» بالأبيض والأسود.
   مرسومٌ بالمظلّل من هندسة المعلَم بدقّة الشاشة، والقيم مثبَّتة من مختبر الضوء
   (حدّ ضوءٍ منحنٍ يقطع القلب، منطقة مضيئة تحته وداكنة فوقه، ووهجٌ واسع حوله). */
(function(){ 'use strict';
  var cv = document.getElementById('gl'); if (!cv) return;
  var host = cv.parentNode;
  var still = true;   /* القلب ثابت: يُرسم مرة واحدة ويُعاد رسمه عند تغيّر المقاس فقط */
  var gl = cv.getContext('webgl', { antialias:false, alpha:false }); if (!gl) return;
  function dpr(){ return Math.min(2, window.devicePixelRatio || 1); }
  /* كبيرٌ، جزءٌ من الخلفية، في الطرف المقابل للنص */
  function place(W, H){
    var wide = W > 900 * dpr(), rtl = document.documentElement.dir === 'rtl';
    var w = wide ? Math.min(W*0.40, H*0.90) : Math.min(W*0.88, H*0.52);
    return { cx: wide ? (rtl ? W*0.26 : W*0.74) : W*0.5, cy: wide ? H*0.52 : H*0.74, s: w / 310 };
  }
  var VS = 'attribute vec2 a; void main(){ gl_Position = vec4(a,0.,1.); }';
  var FS = "\nprecision highp float;\nuniform vec2 uRes; uniform vec3 uPlace; uniform float uT;\nconst float u_exposure = 0.9800;\nconst float u_angle = 29.0000;\nconst float u_height = -16.0000;\nconst float u_sag = 23.0000;\nconst float u_soft = 14.5000;\nconst float u_litBright = 1.0500;\nconst float u_cool = 0.1900;\nconst float u_dark = 0.6000;\nconst float u_sat = 0.0000;\nconst float u_warm = 1.1300;\nconst float u_warmSize = 44.0000;\nconst float u_srcU = -14.0000;\nconst float u_warmTone = 0.2200;\nconst float u_fringe = 1.2700;\nconst float u_rimW = 0.4000;\nconst float u_rimI = 0.0000;\nconst float u_innerGlow = 1.5900;\nconst float u_glowSize = 44.5000;\nconst float u_glowI = 1.7700;\nconst float u_blue = 0.0000;\nconst float u_size = 0.7100;\nconst float u_valley = 0.0000;\nconst float u_rot = 0.0000;\nconst float u_posX = 5.5000;\nconst float u_posY = 0.0000;\nconst float u_drift = 1.0000;\nconst float u_speed = 1.0000;\nconst float u_grain = 0.0000;\nfloat gK;\nconst float R = 54.25; const float CY = 111.735;\nfloat sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p-a, ba = b-a; float h = clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h); }\nvoid edge(vec2 p, vec2 a, vec2 b, inout bool s){ if ((a.y>p.y)!=(b.y>p.y) && p.x < (b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x) s = !s; }\nbool inWedge(vec2 p){ vec2 v0=vec2(-140.75,148.39), v1=vec2(-100.75,CY), v2=vec2(100.75,CY), v3=vec2(140.75,148.39), v4=vec2(0.,302.);\n  bool s=false; edge(p,v0,v1,s); edge(p,v1,v2,s); edge(p,v2,v3,s); edge(p,v3,v4,s); edge(p,v4,v0,s); return s; }\nbool inShape(vec2 q, int skip){\n  if (skip!=0 && length(q-vec2(-100.75,CY)) < R-.01) return true;\n  if (skip!=1 && length(q-vec2(0.,CY)) < R-.01) return true;\n  if (skip!=2 && length(q-vec2(100.75,CY)) < R-.01) return true;\n  return inWedge(q); }\nfloat arcD(vec2 p, vec2 c, int i){ vec2 v=p-c; float L=length(v); vec2 q=c+v/max(L,1e-4)*(R+.02); return inShape(q,i) ? 1e5 : abs(L-R); }\n/* البُعد الحقيقي عن حدّ قلب لُب: ثلاث دوائر ومماسّان إلى الرأس */\nfloat sd(vec2 p){\n  vec2 c0=vec2(-100.75,CY), c1=vec2(0.,CY), c2=vec2(100.75,CY), LP=vec2(-140.75,148.39), RP=vec2(140.75,148.39), TIP=vec2(0.,302.);\n  float d = min(min(arcD(p,c0,0), arcD(p,c1,1)), arcD(p,c2,2));\n  d = min(d, min(sdSeg(p,LP,TIP), sdSeg(p,RP,TIP)));\n  d = min(d, min(length(p-vec2(-50.37,91.6)), length(p-vec2(50.38,91.6))));\n  bool inside = length(p-c0)<R || length(p-c1)<R || length(p-c2)<R || inWedge(p);\n  d = inside ? -d : d;\n  float k = max(gK, .001); float a=length(p-c0)-R, b=length(p-c1)-R, c=length(p-c2)-R;\n  float h = max(k-abs(a-b),0.)/k; float g = min(a,b)-h*h*k*.25;\n  h = max(k-abs(g-c),0.)/k; g = min(g,c)-h*h*k*.25;\n  return min(d,g); }\nfloat h2(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }\nfloat gs(float x, float w){ return exp(-x*x/(w*w)); }\nvoid main(){\n  vec2 f = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);\n  vec2 q = (f - uPlace.xy)/uPlace.z - vec2(u_posX, u_posY);\n  float cr = cos(radians(-u_rot)), sr = sin(radians(-u_rot)); q = vec2(cr*q.x - sr*q.y, sr*q.x + cr*q.y);\n  vec2 q0 = q;\n  gK = u_valley;\n  float d = sd(q + vec2(0.,179.7425));\n  /* خارج القلب يُحسب الضوء عند أقرب نقطة من الحافّة، فالوهج يأخذ سطوع حافّته ولا يمتدّ شعاعًا خارج الشكل */\n  if (d > 0.){\n    vec2 c = vec2(0.,179.7425); float e = 1.5; gK = 46.;\n    vec2 g = vec2(sd(q+c+vec2(e,0.)) - sd(q+c-vec2(e,0.)), sd(q+c+vec2(0.,e)) - sd(q+c-vec2(0.,e)));\n    q -= normalize(g + 1e-5) * (d + 1.5); gK = u_valley;\n  }\n\n  /* حدّ الضوء: منحنى حرّ يقطع القلب، لا يتبع حافّته */\n  float a = radians(u_angle); vec2 dir = vec2(cos(a), sin(a)), nrm = vec2(-dir.y, dir.x);\n  float u = dot(q,dir), v = dot(q,nrm);\n  float t = uT*u_speed;\n  float sway = u_drift * (9.*sin(t*.45) + 5.*sin(t*.23 + u*.012));\n  float vb = u_height + u_sag*(1. - (u*u)/(160.*160.)) + sway;\n  float soft = u_soft * (.35 + 1.35*smoothstep(-150.,150.,u));\n  float lit = smoothstep(-soft, soft, v - vb);\n  /* خارج القلب: انتقال الوهج بين الجهة المضيئة والداكنة أنعم وأهدأ، حتى لا يبرز نتوءٌ عند نقطة التقاء حدّ الضوء بالحافّة */\n  float so = soft + 34. + max(d,0.)*1.6; float litO = smoothstep(-so, so, v - vb);\n  vec2 S = dir*u_srcU + nrm*(u_height + u_sag*(1. - u_srcU*u_srcU/25600.) + sway + 4.);          /* منبع الضوء عند طرف المنحنى */\n  float dS = length(q - S), dS0 = length(q0 - S);\n\n  vec3 warmC = mix(vec3(1.,.50,.20), vec3(1.,.42,.58), u_warmTone);\n  vec3 coolC = mix(vec3(.80,.86,1.), vec3(.32,.46,1.), u_blue);\n  vec3 litC  = mix(vec3(1.,.985,.96), vec3(.58,.64,.93), u_cool*smoothstep(10.,270.,dS)) * (1.06 - .22*smoothstep(0.,300.,dS)) * u_litBright;\n  vec3 col;\n  if (d < 0.){\n    vec3 darkC = vec3(.030,.034,.070)*(.35 + 3.*u_dark)\n               + coolC * exp(d/15.) * .42 * u_innerGlow * (.45 + .55*smoothstep(-160.,160., q.x - q.y))\n               + coolC * exp(d/60.) * .06 * u_innerGlow;\n    col = mix(darkC, litC, lit);\n    col += litC * exp(d/7.) * .22 * lit * u_innerGlow;\n    /* هالةٌ لونية على حدّ الضوء: دافئة قرب المنبع، مزرقّة في آخره */\n    vec3 fr = mix(mix(warmC, vec3(.85,.62,.80), .45), coolC, smoothstep(-110.,120.,u));\n    col += fr * gs(v - vb + soft*.9, soft*1.5 + 5.) * (1. - lit) * .42 * u_fringe;\n    col += warmC * gs(dS, u_warmSize) * u_warm * (1. - .55*lit);\n  } else {\n    vec3 gC = mix(coolC, vec3(1.), litO*.55);\n    col = (gC * exp(-d/u_glowSize) * .50 * (.58 + .50*litO) + coolC * exp(-d/(u_glowSize*3.6)) * .11 * (.8 + .3*litO*exp(-d/40.))) * u_glowI;\n    col += warmC * gs(dS0, u_warmSize*1.2) * exp(-d/(u_glowSize*1.2)) * u_warm * .5;\n  }\n  col += mix(coolC*.5 + .5, vec3(1.), lit) * gs(d, u_rimW) * u_rimI * (.55 + .6*lit);\n  col *= u_exposure;\n  col = col / (1. + .10*col);\n  col = pow(max(col, 0.), vec3(.95));\n  col = mix(vec3(dot(col, vec3(.2126,.7152,.0722))), col, u_sat);   /* أبيض وأسود عند الصفر */\n  col *= 0.18;\n  col += (h2(f + fract(uT)) + h2(f.yx + 17.3 + fract(uT*1.7)) - 1.) * (1.5/255.);\n  gl_FragColor = vec4(col, 1.);\n}";
  function sh(type, src){ var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
  var pr = gl.createProgram();
  try { gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
  } catch (e) { console.warn('LOBE heart:', e); return; }
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  var la = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(la); gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);
  var uRes = gl.getUniformLocation(pr, 'uRes'), uPlace = gl.getUniformLocation(pr, 'uPlace'), uT = gl.getUniformLocation(pr, 'uT');
  function draw(ms){
    var r = host.getBoundingClientRect(); if (!r.width) return;
    var W = Math.round(r.width * dpr()), H = Math.round(r.height * dpr());
    if (cv.width !== W || cv.height !== H){ cv.width = W; cv.height = H; }
    gl.viewport(0, 0, W, H);
    var P = place(W, H);
    gl.uniform2f(uRes, W, H); gl.uniform3f(uPlace, P.cx, P.cy, P.s); gl.uniform1f(uT, still ? 0 : ms / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  var raf = 0, last = 0;
  function loop(ms){ if (ms - last > 33){ last = ms; draw(ms); } raf = requestAnimationFrame(loop); }
  function start(){ if (still){ draw(0); return; } if (!raf) raf = requestAnimationFrame(loop); }
  function stop(){ if (raf){ cancelAnimationFrame(raf); raf = 0; } }
  document.addEventListener('visibilitychange', function(){ if (document.hidden) stop(); else start(); });
  window.addEventListener('resize', function(){ draw(performance.now()); });
  document.addEventListener('lobe:lang', function(){ draw(performance.now()); });
  start();
})();

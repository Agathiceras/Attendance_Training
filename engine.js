// ─── SHARED ENGINE ───────────────────────────────────────────────────────────
// Extracted verbatim from attendance-training.html (theme toggle, progress storage,
// module/quiz/sort rendering, dev mode). Only T(), setLang(), and the INIT block were
// adapted: each page here loads ONE language via content-XX.js (as CONTENT), instead
// of switching between all languages at runtime. setLang() now navigates to the
// sibling <lang>.html page instead of swapping data in place.
// Shared English fallback strings (used by T() when a language's own UI text is ever missing).
const UI_EN={
  pageTitle:'Boost Student Attendance — Kodland Tutor Training',
  logoSub:'Tutor Development Department',
  heroEyebrow:'📊 Tutor Training Program',
  heroTitle:'Boost Your Students\'<br><span class="h-pill">Attendance</span>',
  heroWelcome:'Welcome to this training! You\'re probably here for one of two reasons:',
  heroReason1:'Your attendance percentage is low and you want to understand how to turn it around.',
  heroReason2:'You\'re about to start a new course and want to keep your students with you until the end.',
  heroWork:'Work through 5 modules, pass a final exam, and unlock the essentials checklist. Score 70%+ to move forward at every step.',
  startBtn:'🚀 Start Training',
  learningPath:'Your learning path',
  modulesAllDone:'🏆 All modules done!',
  modulesComplete:'{done}/{total} complete',
  badgeReading:'📖 Reading',
  noTestRequired:'No test required',
  badgeCompleted:'✓ Completed',
  badgeLocked:'🔒 Locked',
  badgeStart:'Start',
  scoreLabel:'Score:',
  completeModuleN:'Complete Module {n}',
  hasACheck:'Has a check',
  moduleN:'Module {n}',
  finalStage:'Final Stage',
  finalExam:'Final Exam',
  finalExamDesc:'Your DST (final assessment) is available in the LMS training page, right below this training — complete it there.',
  openForm:'View Instructions',
  dstMessage:'🎉 Congratulations! You\'ve completed the self-study training to improve your Attendance Metrics!<br><br>You\'re almost done! Please return to the LMS training page where you accessed this training. The DST is available directly below the training.<br><br>👉 You must complete and pass the DST for the training to be considered successfully completed. If the DST is not completed, the training will remain incomplete and may become overdue.<br><br>Please make sure to complete the DST and achieve a passing score to successfully close the assignment.<br><br>Good luck! ❤️',
  certifiedCheck:'Certified ✓',
  opensInForms:'Complete it in your LMS',
  completeAllModules:'Complete all modules',
  bonus:'Bonus',
  attendanceChecklist:'Attendance Checklist',
  checklistCardDesc:'Habits, bond-building, and self-check questions — plus a PDF download. Unlocked once you\'re certified.',
  unlocked:'✓ Unlocked',
  referenceCard:'Reference card',
  navModules:'← Modules',
  navExitCheck:'← Exit Check',
  navExit:'← Exit',
  navDashboard:'← Dashboard',
  navBackDashboard:'← Back to Dashboard',
  moduleOfTotal:'Module {n} of {total}',
  objectiveLabel:'Objective:',
  continueToModule:'✅ Continue to Module {n} →',
  backToDashboardCheck:'✅ Back to Dashboard',
  retakeSort:'🔄 Retake the Sort',
  startSort:'🗂️ Sort: Trash or Treasure →',
  retakeCheck:'🔄 Retake the Check',
  startCheck:'📝 Take the Knowledge Check →',
  videoDefaultTitle:'Take a look at an example of a real class',
  captionNote:'Remember to turn on this lesson\'s subtitles in your language.',
  phaseExampleBtn:'Check out a real-life example!',
  youngerLabel:'Younger (6–11)',
  olderLabel:'Older (12–17)',
  cuteTipDefault:'Tip',
  questionOfTotal:'Question {n} of {total}',
  nextArrow:'Next →',
  seeResults:'See Results',
  correctPrefix:'✓ Correct! ',
  wrongPrefix:'✗ Not quite — ',
  sortHowToPlay:'📚 How to Play',
  sortStep1Label:'Step 1',
  sortStep1:'You\'ll see one statement at a time about this module\'s habits.',
  sortStep2Label:'Step 2',
  sortStep2:'Drag the card into the zone where it belongs.',
  sortTrashLabel:'Trash',
  sortTrashDesc:'Habits that hurt attendance and engagement.',
  sortTreasureLabel:'Treasure',
  sortTreasureDesc:'Habits that build unforgettable classes.',
  sortNote:'Drag with your mouse — no clicking needed. You\'ll see how you did after each drop.',
  sortStartGame:'🎮 Start Game',
  sortTrashZone:'🗑️<br>Trash',
  sortTreasureZone:'💎<br>Treasure',
  statementOfTotal:'Statement {n} of {total}',
  youPassed:'You Passed!',
  keepStudying:'Keep Studying',
  answeredCorrectly:'You answered {score}/{total} correctly.',
  trainingCertifiedNote:'The training is now certified.',
  nextModuleUnlocked:'The next module is unlocked.',
  needSeventy:'You need at least 70% to continue.',
  viewCertificate:'🎓 View Certificate',
  retakeFinalExam:'Retake Final Exam',
  nextModule:'Next Module →',
  goToFinalExam:'🎓 Go to Final Exam',
  reviewModule:'📖 Review Module {n}',
  trainingCertifiedTitle:'Training Certified!',
  certifiedBody:'You\'ve completed all {total} modules and passed the final exam — congratulations! Your Attendance Checklist is now unlocked.',
  certOfCompletion:'Certificate of Completion',
  certTrainingName:'Boost Student Attendance',
  certFooter:'Kodland Tutor Development Department · All {total} modules · Final exam: {pct}%',
  viewYourChecklist:'✅ View Your Checklist →',
  chkBadge:'✅ Certified',
  chkH1:'Your Attendance Essentials Checklist',
  chkSub:'Keep this nearby. These are the habits from the training that move the needle most — in the order they show up in a real class.',
  chkSelfH:'🪞 Self-Check: Ask Yourself',
  chkSelfSub:'Not graded — just a quick, honest check-in with yourself before or after class.',
  chkDownload:'⬇️ Download as PDF',
};

// ─── THEME (light/dark) ─────────────────────────────────────────────────────
const THEME_KEY='kl-att-theme';
(function(){
  const saved=localStorage.getItem(THEME_KEY);
  const sys=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  const t=saved||sys;
  if(t==='dark') document.documentElement.setAttribute('data-theme','dark');
  setThemeIcons(t);
})();
function setThemeIcons(t){ document.querySelectorAll('.tbtn').forEach(b=>b.textContent=t==='dark'?'☀️':'🌙'); }
function toggleTheme(){
  const isDark=document.documentElement.getAttribute('data-theme')==='dark';
  const next=isDark?'light':'dark';
  if(next==='dark') document.documentElement.setAttribute('data-theme','dark'); else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem(THEME_KEY,next);
  setThemeIcons(next);
}

// ─── DATA ──────────────────────────────────────────────────────────────────
const TOTAL=6;
let currentModule=null, quizData=[], qi=0, score=0;
const PROG_KEY='kl-att-progress';
const LANG_KEY='kl-att-lang';
let LANG=(typeof PAGE_LANG!=='undefined')?PAGE_LANG:(localStorage.getItem(LANG_KEY)||'en');

function T(key,vars){
  let s=(CONTENT&&CONTENT.ui&&CONTENT.ui[key]!=null)?CONTENT.ui[key]:UI_EN[key];
  if(s==null) return '';
  if(vars) Object.keys(vars).forEach(k=>{ s=s.split('{'+k+'}').join(vars[k]); });
  return s;
}
function applyStaticI18n(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{ el.textContent=T(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{ el.innerHTML=T(el.getAttribute('data-i18n-html')); });
  document.title=T('pageTitle');
}
function setLang(lang){
  const known=['en','es','pt','it','ru','ar','pl','id','tr'];
  if(known.indexOf(lang)===-1) return;
  localStorage.setItem(LANG_KEY,lang);
  location.href=lang+'.html';
}

// ─── PROGRESS ────────────────────────────────────────────────────────────
function getProgress(){ try{ return JSON.parse(localStorage.getItem(PROG_KEY)||'{}'); }catch(e){ return {}; } }
function saveProgress(p){ localStorage.setItem(PROG_KEY, JSON.stringify(p)); }
function isPassed(id){ const p=getProgress(); return p[id]?.passed===true; }
function isDoneColor(id){ const p=getProgress(); return p[id]?.passed===true; }
function getScore(id){ const p=getProgress(); return p[id]?.score||0; }
function setResult(id, pct, passed){
  const p=getProgress(); const prev=p[id]||{};
  p[id]={passed: passed||prev.passed===true, score: Math.max(pct, prev.score||0)};
  saveProgress(p);
}

// ─── HOME / DASHBOARD ───────────────────────────────────────────────────
function renderHome(){
  const done = MODULES.filter(m=>isPassed(m.id)).length;
  const tag=document.getElementById('ntag');
  if(done>0){tag.style.display='inline';tag.textContent=done===TOTAL?T('modulesAllDone'):T('modulesComplete',{done:done,total:TOTAL});}else tag.style.display='none';
  const g=document.getElementById('mgrid'); g.innerHTML='';

  MODULES.forEach((m,i)=>{
    const prevNoQuiz = i>0 && MODULES[i-1].noQuiz;
    const prev = i===0 || prevNoQuiz ? true : isPassed(MODULES[i-1].id);
    const isDone = isPassed(m.id);
    const locked = !prev;
    const el=document.createElement('div');
    el.className='mc'+(locked?' locked':'');
    let badge, stag;
    if(m.noQuiz){
      badge=`<span class="badge br">${T('badgeReading')}</span>`;
      stag=`<span class="stag">${T('noTestRequired')}</span>`;
    }else{
      const pct=getScore(m.id);
      badge=isDone?`<span class="badge bd">${T('badgeCompleted')}</span>`:locked?`<span class="badge bl">${T('badgeLocked')}</span>`:`<span class="badge bs">${T('badgeStart')}</span>`;
      stag=isDone?`<span class="stag">${T('scoreLabel')} <b>${pct}%</b></span>`:locked?`<span class="stag">${T('completeModuleN',{n:m.id-1})}</span>`:`<span class="stag">${T('hasACheck')}</span>`;
    }
    el.innerHTML=`<div class="mc-stripe" style="background:var(--blue)"></div>
    <div class="mc-body">
      <div class="mc-top"><div class="mc-num">${T('moduleN',{n:m.id})}</div><div class="mc-em">${m.emoji}</div></div>
      <div class="mc-title">${m.title}</div>
      <div class="mc-desc">${m.desc}</div>
      <div class="mc-foot">${badge}${stag}</div>
    </div>`;
    if(!locked) el.onclick=()=>openModule(m);
    g.appendChild(el);
  });

  // Checklist card
  const allDone=MODULES.every(m=>isPassed(m.id));
  const chkEl=document.createElement('div');
  chkEl.className='mc'+(allDone?'':' locked');
  chkEl.innerHTML=`<div class="mc-stripe" style="background:var(--blue)"></div>
  <div class="mc-body">
    <div class="mc-top"><div class="mc-num">${T('bonus')}</div><div class="mc-em">✅</div></div>
    <div class="mc-title">${T('attendanceChecklist')}</div>
    <div class="mc-desc">${T('checklistCardDesc')}</div>
    <div class="mc-foot">${allDone?`<span class="badge bd">${T('unlocked')}</span>`:`<span class="badge bl">${T('badgeLocked')}</span>`}<span class="stag">${T('referenceCard')}</span></div>
  </div>`;
  if(allDone) chkEl.onclick=()=>showChecklist();
  g.appendChild(chkEl);

  // DST card
  const dstEl=document.createElement('div');
  dstEl.className='mc'+(allDone?'':' locked');
  const dstBadge=allDone?`<span class="badge bs">${T('openForm')}</span>`:`<span class="badge bl">${T('badgeLocked')}</span>`;
  const dstStag=allDone?`<span class="stag">${T('opensInForms')}</span>`:`<span class="stag">${T('completeAllModules')}</span>`;
  dstEl.innerHTML=`<div class="mc-stripe" style="background:var(--blue)"></div>
  <div class="mc-body">
    <div class="mc-top"><div class="mc-num">${T('finalStage')}</div><div class="mc-em">🎓</div></div>
    <div class="mc-title">${T('finalExam')}</div>
    <div class="mc-desc">${T('finalExamDesc')}</div>
    <div class="mc-foot">${dstBadge}${dstStag}</div>
  </div>`;
  if(allDone) dstEl.onclick=()=>startExam();
  g.appendChild(dstEl);
}

// ─── MODULE CONTENT ───────────────────────────────────────────────────────
function openModule(m){
  currentModule=m.id;
  let html=`<div class="meyebrow">${T('moduleOfTotal',{n:m.id,total:TOTAL})}</div><div class="mh1">${m.emoji} ${m.title}</div><div class="mobj"><strong>${T('objectiveLabel')}</strong> ${m.obj}</div>`;
  m.sections.forEach(s=>{html+=`<div class="sch">${s.t}</div>`;s.cards.forEach(c=>{html+=rc(c);});});
  html+='<hr class="divider">';
  if(m.noQuiz){
    const next=MODULES.find(x=>x.id===m.id+1);
    html+=next?`<button class="ctabtn" onclick="completeReading(${m.id})">${T('continueToModule',{n:next.id})}</button>`:`<button class="ctabtn" onclick="goDashboard()">${T('backToDashboardCheck')}</button>`;
  }else if(m.sortGame){
    const lbl=isPassed(m.id)?T('retakeSort'):T('startSort');
    html+=`<button class="ctabtn" onclick="startSort(${m.id})">${lbl}</button>`;
  }else{
    const lbl=isPassed(m.id)?T('retakeCheck'):T('startCheck');
    html+=`<button class="ctabtn" onclick="startQuiz(${m.id})">${lbl}</button>`;
  }
  document.getElementById('cbody').innerHTML=html;
  showScreen('screen-content');
  window.scrollTo(0,0);
}
function completeReading(id){
  setResult(id,100,true);
  const next=MODULES.find(x=>x.id===id+1);
  if(next) openModule(next); else goDashboard();
}

function rc(c){
  if(c.type==='text')return`<div class="card">${c.h?`<h4>${c.h}</h4>`:''}<p>${c.b}</p></div>`;
  if(c.type==='hi')return`<div class="card hi">${c.h?`<h4>${c.h}</h4>`:''}<p>${c.b}</p></div>`;
  if(c.type==='warnbox')return`<div class="card danger">${c.h?`<h4>${c.h}</h4>`:''}<p>${c.b}</p></div>`;
  if(c.type==='table'){
    const head=c.head.map(h=>`<th>${h}</th>`).join('');
    const rows=c.rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('');
    const cls='card'+(c.tone==='danger'?' danger':'');
    return`<div class="${cls}">${c.h?`<h4>${c.h}</h4>`:''}<div class="tbl-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div></div>`;
  }
  if(c.type==='img')return`<img src="${c.src}" alt="" style="display:block;width:100%;height:auto;border-radius:var(--r);margin-bottom:11px">`;
  if(c.type==='cute')return`<div class="card cute"><h4>⭐ ${c.h||T('cuteTipDefault')}</h4><p>${c.b}</p></div>`;
  if(c.type==='video'){
    const showNote=LANG!=='en'&&!c.native;
    return`<div class="vbox"><h4>🎥 ${c.h||T('videoDefaultTitle')}</h4><div class="vwrap"><iframe src="${c.src}" allow="autoplay" loading="lazy"></iframe></div>${showNote?`<div class="vnote">💬 ${T('captionNote')}</div>`:''}</div>`;
  }
  if(c.type==='warn')return`<div class="callout cw"><span class="ci">⚠️</span><span>${c.txt}</span></div>`;
  if(c.type==='tip')return`<div class="callout ct"><span class="ci">💡</span><span>${c.txt}</span></div>`;
  if(c.type==='good')return`<div class="callout cg"><span class="ci">✅</span><span>${c.txt}</span></div>`;
  if(c.type==='list'){
    const li=c.items.map(i=>`<li>${i}</li>`).join('');
    return`<div class="card">${c.h?`<h4>${c.h}</h4>`:''}${c.p?`<p style="margin-bottom:8px">${c.p}</p>`:''}<ul>${li}</ul></div>`;
  }
  if(c.type==='twocol'){
    const li=items=>items.map(i=>`<li>${i}</li>`).join('');
    const rightCls=c.right.plain?'card':'card hi';
    const rightTitle=c.right.plain?`<h4>${c.right.h}</h4>`:`<h4 style="color:var(--hi-t)">${c.right.h}</h4>`;
    return`<div class="two-col"><div class="card"><h4>${c.left.h}</h4><ul>${li(c.left.items)}</ul></div><div class="${rightCls}">${rightTitle}<ul>${li(c.right.items)}</ul></div></div>`;
  }
  if(c.type==='doavoid'){
    const li=items=>items.map(i=>`<li>${i}</li>`).join('');
    return`<div class="two-col"><div class="card ok"><h4>${c.left.h}</h4><ul>${li(c.left.items)}</ul></div><div class="card danger"><h4>${c.right.h}</h4><ul>${li(c.right.items)}</ul></div></div>`;
  }
  if(c.type==='flow'){
    const steps=c.steps.map((s,i)=>{
      const arrow=i<c.steps.length-1?'<div class="flow-arrow">→</div>':'';
      return `<div class="flow-step f-${s.color}"><div class="fs-ic">${s.ic}</div><h4>${s.h}</h4><p>${s.b}</p></div>${arrow}`;
    }).join('');
    return`<div class="flow">${steps}</div>`;
  }
  if(c.type==='phases'){
    const cards=c.items.map(it=>`<div class="phcard" style="background:${it.bg||'var(--surface)'};border-color:${it.bd||'var(--border)'}"><div class="ph-num">${it.num}</div><div class="ph-ic">${it.ic}</div><div class="ph-title">${it.h}</div><div class="ph-body">${it.b}</div><a class="ph-btn" href="${it.src}" target="_blank" rel="noopener">▶ ${T('phaseExampleBtn')}</a></div>`).join('');
    return`<div class="phrow">${cards}</div>`;
  }
  if(c.type==='agefriendly'){
    return`<div class="agef">${c.intro?`<div class="agef-title"><span class="agef-title-emoji">🎚️</span>${c.intro}</div>`:''}<div class="agef-row"><div class="agef-col"><div class="agef-lbl"><span class="agef-emoji">👶</span>${T('youngerLabel')}</div><p>${c.younger}</p></div><div class="agef-col"><div class="agef-lbl"><span class="agef-emoji">🧑</span>${T('olderLabel')}</div><p>${c.older}</p></div></div></div>`;
  }
  if(c.type==='mirrorSummary'){
    return`<div class="msum"><img class="msum-img" src="${c.img}" alt=""><div class="msum-right"><div class="card quote">${c.caption}</div><div class="card cute"><h4>⭐ ${c.tipH||T('cuteTipDefault')}</h4><p>${c.tipB}</p></div></div></div>`;
  }
  if(c.type==='twoimg'){
    return`<div class="twoimg"><img src="${c.left}" alt=""><img src="${c.right}" alt=""></div>`;
  }
  if(c.type==='imgtext'){
    const p=c.items.map(i=>`<p>${i}</p>`).join('');
    return`<div class="imgtext"><img src="${c.img}" alt=""><div class="imgtext-txt">${p}</div></div>`;
  }
  if(c.type==='simulation'){
    return`<div class="sim-embed"><div class="sim-embed-inner"><iframe src="${c.src}" title="${c.title||'BO Simulation'}" loading="lazy"></iframe></div></div>`;
  }
  if(c.type==='mirror'){
    const arrDown='<div class="lmv2-arrow"><svg viewBox="0 0 20 26"><path d="M10 2 V22 M3 15 L10 23 L17 15" fill="none" stroke="#0a0a1a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
    const arrUp='<div class="lmv2-arrow"><svg viewBox="0 0 20 26"><path d="M10 24 V4 M3 11 L10 3 L17 11" fill="none" stroke="#0a0a1a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
    const beginItems=c.beginItems.map((it,i)=>`<div class="lmv2-item"><span class="lmv2-num">${it.n}</span><span class="lmv2-text">${it.label}</span></div>`+(i<c.beginItems.length-1?arrDown:'')).join('');
    const endItems=c.endItems.map((it,i)=>`<div class="lmv2-item"><span class="lmv2-num">${it.n}</span><span class="lmv2-text">${it.label}</span></div>`+(i<c.endItems.length-1?arrUp:'')).join('');
    return`<div class="lmv2-wrap">
      <svg class="lmv2-bg" viewBox="0 0 1200 700" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="0,0 170,0 60,700 0,700" fill="rgba(255,255,255,0.30)"/>
        <polygon points="210,0 330,0 220,700 150,700" fill="rgba(255,255,255,0.22)"/>
        <polygon points="1200,40 1200,240 960,170 1030,10" fill="rgba(255,255,255,0.28)"/>
        <polygon points="1200,280 1200,460 1020,410 1080,260" fill="rgba(255,255,255,0.18)"/>
        <polygon points="1060,470 1200,510 1200,700 980,700" fill="rgba(255,255,255,0.24)"/>
      </svg>
      <div class="lmv2-row">
        <div class="lmv2-card"><div class="lmv2-title">${c.beginTitle}</div>${beginItems}</div>
        <div class="lmv2-center"><svg viewBox="0 0 100 100"><path d="M78 32 A34 34 0 1 0 84 58" fill="none" stroke="#90c2ff" stroke-width="9" stroke-linecap="round"/><polygon points="78,16 92,32 74,38" fill="#90c2ff"/><path d="M22 68 A34 34 0 1 0 16 42" fill="none" stroke="#90c2ff" stroke-width="9" stroke-linecap="round"/><polygon points="22,84 8,68 26,62" fill="#90c2ff"/></svg><div class="lmv2-label">${c.mirrorLabel}</div></div>
        <div class="lmv2-card"><div class="lmv2-title">${c.endTitle}</div>${endItems}</div>
      </div>
      <div class="lmv2-caption">${c.caption}</div>
    </div>`;
  }
  return'';
}

// ─── QUIZ (module checks + final exam share this engine) ────────────────
function shuf(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function startQuiz(id){
  currentModule=id;
  quizData=shuf([...QUIZ[id]]).map(q=>{
    const order=shuf(q.opts.map((_,i)=>i));
    return {q:q.q, opts:order.map(i=>q.opts[i]), c:order.indexOf(q.c), fb:q.fb};
  });
  qi=0; score=0;
  renderQ(); showScreen('screen-quiz');
  window.scrollTo(0,0);
}
const FINAL_EXAM_FORM_URLS={
  en:'https://forms.gle/8Zha9jj2y7oqbdFT6',
  es:'https://docs.google.com/forms/d/e/1FAIpQLSdnX3OuClVUaj7UIE-uqVkIco8GLicZwjRnsCDf1APi51hipA/viewform?usp=sharing&ouid=106291634165948186361',
  id:'https://docs.google.com/forms/d/e/1FAIpQLSdI0dI3LhJ4n2JeIH0G19aEh926m5D68DQ447X5kOK0Bdz7uA/viewform?usp=sharing&ouid=106291634165948186361',
  pt:'https://docs.google.com/forms/d/e/1FAIpQLSdrRJUghy1u8Tu3yVxJJwvCMGXZBekQ6NvTYe66MSf_-QmLJA/viewform?usp=sharing&ouid=106291634165948186361',
  ru:'https://forms.gle/CJT1nN1NF1wARCVR6',
  ar:'https://forms.gle/qzjZNqNRYzVHt5uR7',
  it:'https://docs.google.com/forms/d/e/1FAIpQLScxdrKBtppoXN4jMnULNv4LdelHrcrESOfyisR3EdZ1ui_keg/viewform?usp=sharing&ouid=106291634165948186361',
  tr:'https://docs.google.com/forms/d/e/1FAIpQLSd54-9XsUzbIDJLtj5FaHvzmq94kNKMntFg6zSGjfHjJ4P1hA/viewform?usp=sharing&ouid=106291634165948186361',
  pl:'https://docs.google.com/forms/d/e/1FAIpQLSf3dQ07Jq3kYkZQNq0KtAIZkdF8HzfCioCLlgQ8QbehXCeymQ/viewform?usp=sharing&ouid=106291634165948186361',
};
function startExam(){
  document.getElementById('compbody').innerHTML=`<p style="color:var(--text2);font-size:15.5px;line-height:1.8;text-align:left">${T('dstMessage')}</p><button class="bline" style="margin-top:20px" onclick="goDashboard()">${T('navBackDashboard')}</button>`;
  showScreen('screen-complete');
  window.scrollTo(0,0);
}
function renderQ(){
  const q=quizData[qi];
  document.getElementById('qfill').style.width=(qi/quizData.length*100)+'%';
  document.getElementById('qcount').textContent=T('questionOfTotal',{n:qi+1,total:quizData.length});
  document.getElementById('qtext').innerHTML=q.q;
  const el=document.getElementById('qopts'); el.innerHTML='';
  q.opts.forEach((o,idx)=>{const b=document.createElement('button');b.className='qopt';b.textContent=o;b.onclick=()=>answerQ(idx);el.appendChild(b);});
  document.getElementById('qfb').className='qfb';
  document.getElementById('qnxt').className='qnxt';
}
function answerQ(idx){
  if(document.querySelector('.qopt.answered')) return;
  const q=quizData[qi]; const ok=idx===q.c;
  if(ok)score++;
  document.querySelectorAll('.qopt').forEach((b,i)=>{b.classList.add('answered');if(i===q.c)b.classList.add('correct');else if(i===idx&&!ok)b.classList.add('wrong');});
  const fb=document.getElementById('qfb');
  fb.className='qfb show '+(ok?'ok':'bad');
  fb.innerHTML=(ok?T('correctPrefix'):T('wrongPrefix'))+q.fb;
  const nx=document.getElementById('qnxt');
  nx.className='qnxt show';
  nx.textContent=qi===quizData.length-1?T('seeResults'):T('nextArrow');
}
function nextQ(){
  qi++;
  if(qi<quizData.length){renderQ();window.scrollTo(0,0);return;}
  const pct=Math.round(score/quizData.length*100);
  const passed=pct>=70;
  setResult(currentModule, pct, passed);
  showResults(pct, passed);
}

// ─── SORT GAME (Module 3: Trash or Treasure — drag & drop) ───────────────
let sortDragReady=false;
function startSort(id){
  currentModule=id;
  quizData=shuf([...SORT_ITEMS]);
  qi=0; score=0;
  document.getElementById('sort-instructions').style.display='';
  document.getElementById('sort-playfield').style.display='none';
  showScreen('screen-sort');
  window.scrollTo(0,0);
}
function beginSortGame(){
  document.getElementById('sort-instructions').style.display='none';
  document.getElementById('sort-playfield').style.display='block';
  renderSort();
  if(!sortDragReady){ setupSortDrag(); sortDragReady=true; }
  window.scrollTo(0,0);
}
function renderSort(){
  const it=quizData[qi];
  document.getElementById('sfill').style.width=(qi/quizData.length*100)+'%';
  document.getElementById('scount').textContent=T('statementOfTotal',{n:qi+1,total:quizData.length});
  const card=document.getElementById('stext');
  card.textContent=it.txt;
  card.className='sort-card';
  card.setAttribute('draggable','true');
  document.getElementById('strash').className='sort-zone trash';
  document.getElementById('streasure').className='sort-zone treasure';
  document.getElementById('sfb').className='qfb';
  document.getElementById('snxt').className='qnxt';
}
function setupSortDrag(){
  const card=document.getElementById('stext');
  card.addEventListener('dragstart',()=>{card.classList.add('dragging');});
  card.addEventListener('dragend',()=>{
    card.classList.remove('dragging');
    document.getElementById('strash').classList.remove('dragover');
    document.getElementById('streasure').classList.remove('dragover');
  });
  ['strash','streasure'].forEach(id=>{
    const zone=document.getElementById(id);
    zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('dragover');});
    zone.addEventListener('dragleave',()=>{zone.classList.remove('dragover');});
    zone.addEventListener('drop',e=>{
      e.preventDefault();
      zone.classList.remove('dragover');
      resolveSort(id==='strash'?'trash':'treasure');
    });
  });
}
function resolveSort(choice){
  const card=document.getElementById('stext');
  if(card.getAttribute('draggable')==='false') return;
  card.setAttribute('draggable','false');
  const it=quizData[qi]; const ok=choice===it.type;
  if(ok)score++;
  const chosenZone=document.getElementById(choice==='trash'?'strash':'streasure');
  chosenZone.classList.add(ok?'correct-choice':'wrong-choice');
  if(!ok) document.getElementById(it.type==='trash'?'strash':'streasure').classList.add('correct-choice');
  const fb=document.getElementById('sfb');
  fb.className='qfb show '+(ok?'ok':'bad');
  fb.innerHTML=(ok?T('correctPrefix'):T('wrongPrefix'))+it.fb;
  const nx=document.getElementById('snxt');
  nx.className='qnxt show';
  nx.textContent=qi===quizData.length-1?T('seeResults'):T('nextArrow');
}
function nextSort(){
  qi++;
  if(qi<quizData.length){renderSort();window.scrollTo(0,0);return;}
  const pct=Math.round(score/quizData.length*100);
  const passed=pct>=70;
  setResult(currentModule, pct, passed);
  showResults(pct, passed);
}
function exitSort(){
  const m=MODULES.find(x=>x.id===currentModule); if(m) openModule(m); else goDashboard();
}

// ─── RESULTS ──────────────────────────────────────────────────────────────
function showResults(pct, passed){
  let acts='';
  if(currentModule==='final'){
    if(passed) acts+=`<button class="bdark" onclick="showComplete()">${T('viewCertificate')}</button>`;
    acts+=`<button class="bline" onclick="goDashboard()">${T('navBackDashboard')}</button>`;
    acts+=`<button class="bline" onclick="startExam()">${T('retakeFinalExam')}</button>`;
  }else{
    const m=MODULES.find(x=>x.id===currentModule);
    if(passed&&m.id<TOTAL) acts+=`<button class="bdark" onclick="openModule(MODULES.find(x=>x.id==${m.id+1}))">${T('nextModule')}</button>`;
    if(passed&&m.id===TOTAL) acts+=`<button class="bdark" onclick="goDashboard()">${T('goToFinalExam')}</button>`;
    acts+=`<button class="bline" onclick="openModule(MODULES.find(x=>x.id==${m.id}))">${T('reviewModule',{n:m.id})}</button>`;
    acts+=m.sortGame?`<button class="bline" onclick="startSort(${m.id})">${T('retakeSort')}</button>`:`<button class="bline" onclick="startQuiz(${m.id})">${T('retakeCheck')}</button>`;
  }
  const label=currentModule==='final'?'exam':'check';
  const sub=T('answeredCorrectly',{score:score,total:quizData.length})+(passed?` ${label==='exam'?T('trainingCertifiedNote'):T('nextModuleUnlocked')}`:` ${T('needSeventy')}`);
  document.getElementById('rbody').innerHTML=`<div class="remi">${passed?'🎉':'😅'}</div><div class="rtitle">${passed?T('youPassed'):T('keepStudying')}</div><div class="rpct ${passed?'pass':'fail'}">${pct}%</div><div class="rsub">${sub}</div>${acts}`;
  showScreen('screen-results');
  window.scrollTo(0,0);
  renderHome();
}

// ─── CERTIFICATE ──────────────────────────────────────────────────────────
function showComplete(){
  const avg=Math.round(MODULES.map(m=>getScore(m.id)).reduce((a,b)=>a+b,0)/TOTAL);
  document.getElementById('compbody').innerHTML=`<div style="font-size:72px">🎓</div><h1 style="font-family:'Baloo 2',sans-serif;font-size:32px;font-weight:800;letter-spacing:-.5px;margin-top:15px;color:var(--text)">${T('trainingCertifiedTitle')}</h1><p style="color:var(--text2);margin-top:9px;font-size:15.5px;line-height:1.65">${T('certifiedBody',{total:TOTAL})}</p><div class="cert"><div class="clbl2">${T('certOfCompletion')}</div><h2>${T('certTrainingName')}</h2><p>${T('certFooter',{total:TOTAL,pct:getScore('final')})}</p><div class="cmods">${MODULES.map(m=>`<div class="cmod">${m.emoji}</div>`).join('')}</div></div><button class="bdark" style="margin-bottom:10px" onclick="showChecklist()">${T('viewYourChecklist')}</button><button class="bline" onclick="goDashboard()">${T('navBackDashboard')}</button>`;
  showScreen('screen-complete');
  window.scrollTo(0,0);
}

// ─── CHECKLIST ─────────────────────────────────────────────────────────────
function showChecklist(){
  setResult('checklist',100,true);
  const el=document.getElementById('chkList'); el.innerHTML='';
  CHECKLIST.forEach((txt,i)=>{
    const d=document.createElement('div'); d.className='chk-item';
    d.innerHTML=`<div class="chk-ic">${i+1}</div><div class="chk-txt">${txt}</div>`;
    el.appendChild(d);
  });
  const selfEl=document.getElementById('chkSelf'); selfEl.innerHTML='';
  SELF_QUESTIONS.forEach(q=>{
    const d=document.createElement('div'); d.className='chk-self-item';
    d.innerHTML=`<span class="chk-self-ic">☐</span><span>${q}</span>`;
    selfEl.appendChild(d);
  });
  showScreen('screen-checklist');
  window.scrollTo(0,0);
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────
function exitQuiz(){
  if(currentModule==='final'){ goDashboard(); return; }
  const m=MODULES.find(x=>x.id===currentModule); if(m) openModule(m); else goDashboard();
}
function goHome(){ showScreen('screen-home'); window.scrollTo(0,0); }
function goDashboard(){ renderHome(); showScreen('screen-path'); window.scrollTo(0,0); }
function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ─── LANGUAGE DROPDOWN ─────────────────────────────────────────────────────
function toggleLang(e){
  e.stopPropagation();
  document.getElementById('langMenu').classList.toggle('show');
}
document.addEventListener('click', function(){
  document.getElementById('langMenu').classList.remove('show');
});

// ─── DEV MODE (Shift+D ×4, within 2s) ──────────────────────────────────────
let devKeyBuffer=[];
document.addEventListener('keydown', function(e){
  if(e.shiftKey && e.key.toLowerCase()==='d'){
    const now=Date.now();
    devKeyBuffer.push(now);
    devKeyBuffer=devKeyBuffer.filter(t=>now-t<2000);
    if(devKeyBuffer.length>=4){ toggleDevMode(); devKeyBuffer=[]; }
  }
});
function toggleDevMode(){
  const isDev=localStorage.getItem('kl-att-devmode')==='1';
  if(!isDev){
    localStorage.setItem('kl-att-devmode-backup', localStorage.getItem(PROG_KEY)||'{}');
    const p={}; MODULES.forEach(m=>{p[m.id]={passed:true,score:100};}); p['final']={passed:true,score:100};
    saveProgress(p);
    localStorage.setItem('kl-att-devmode','1');
    showDevBadge(true);
  }else{
    const backup=localStorage.getItem('kl-att-devmode-backup');
    if(backup) localStorage.setItem(PROG_KEY, backup);
    localStorage.removeItem('kl-att-devmode');
    showDevBadge(false);
  }
  renderHome();
}
function showDevBadge(on){
  let b=document.getElementById('devBadge');
  if(on){
    if(!b){
      b=document.createElement('div'); b.id='devBadge';
      b.style.cssText='position:fixed;bottom:16px;right:16px;background:#0B1F45;color:#7BC142;font-family:monospace;font-size:12px;font-weight:700;padding:9px 16px;border-radius:10px;z-index:999;box-shadow:0 6px 20px rgba(0,0,0,.3);letter-spacing:.3px';
      b.textContent='🛠 DEV MODE — everything unlocked (Shift+D×4 to exit)';
      document.body.appendChild(b);
    }
  }else if(b){ b.remove(); }
}

// ─── INIT ──────────────────────────────────────────────────────────────────
if(localStorage.getItem('kl-att-devmode')==='1') showDevBadge(true);
MODULES=CONTENT.modules; QUIZ=CONTENT.quiz; SORT_ITEMS=CONTENT.sortItems; CHECKLIST=CONTENT.checklist; SELF_QUESTIONS=CONTENT.selfQuestions;
document.documentElement.lang=LANG; document.documentElement.dir=CONTENT.dir||'ltr';
{ const btn=document.getElementById('langBtn'); if(btn) btn.innerHTML=`${CONTENT.flag||'\ud83c\udf10'} ${LANG.toUpperCase()} <span style="font-size:10px">\u25be</span>`; }
document.querySelectorAll('.lang-item').forEach(it=>{ it.classList.toggle('active', it.getAttribute('data-lang')===LANG); });
applyStaticI18n();
renderHome();
if(location.search.indexOf('start=1')!==-1){ goDashboard(); }

/* =====================================================================
   START + FINAL SURVEY — Attendance training: required answers + time per module
   (same system as the Refunds trainings' surveys-v2.js, adapted to the Attendance engine and questions)
   Loaded right BEFORE assets/engine.js: it defines window.TD_CAN_COMPLETE, which the engine's
   notifyMaterialCompleted() reads before telling the LMS "completed". Everything else starts on
   DOMContentLoaded, after the engine: it reads its globals (MODULES, LANG, TRAINING_ID) and wraps
   openModule / setResult / renderHome.
   - The modules open only after the start survey has been sent.
   - Time per module: ONE row per tutor + training ("training_time": start/finish time, active minutes in
     total and per module) goes to the same Apps Script, tab "Module time". See "time per module" below.
   - Start survey: a pop-up when the training opens; the training can't be used until it is sent.
   - Final survey: a pop-up as soon as the 6 modules are passed. The LMS gets "completed" (which unlocks
     the DST) only after it is sent.
   - Each survey is sent once per browser (kept in memory + localStorage + sessionStorage).
   - Answers go to the Attendance Google Sheet (tabs "Start survey" and "Final survey").
   - The Attendance questions and answers (texts from the owner, 9 languages) are in ATT below; they
     replace the Refunds ones in T. The interface texts (titles, buttons, errors) stay in T.
   - Question ids and answer codes are NOT translated: they are what arrives in the Google Sheet.
   - No skip, not even with ?dev=1: every question is required, open answers need at least 10 characters,
     and the e-mail must end in @kodland.team. The send button stays grey until everything is valid.
   To translate: add a block to T with the same keys (see "en").
   ===================================================================== */
(function(){
  'use strict';
  /* ---------- CONFIG ----------
     Web App URL of the Apps Script of the Refunds surveys Google Sheet.
     Empty = answers are not sent anywhere: the payload is logged (console.warn), kept in storage and the survey closes. */
  var SURVEY_URL = 'https://script.google.com/macros/s/AKfycbzE1ZxpUujdvGh18OXsb-zXMzZ2cYRpY0hWv5yeR2uni3Ueo84PnMZZTU3H5E6buYdUJA/exec';
  var TRAINING_NAMES = {
    'attendance': 'Attendance',
    'refunds': 'Refunds (main training)',
    'mini-no_interest': 'Mini 1 · No Interest',
    'mini-course_expectations': 'Mini 2 · Course Expectations',
    'mini-org_discipline': 'Mini 3 · Lesson Organization',
    'mini-teacher_work': 'Mini 4 · Lesson Quality',
    'mini-content_errors': 'Mini 5 · Handling Content Errors',
    'mini-online_format': 'Mini 6 · Online Format',
    'mini-technical_issues': 'Mini 7 · Technical Issues'
  };
  // Region preselected from the page or the language (the tutor can change it). en and ar are used by several regions: no default.
  var REGION_BY_PAGE = { us:'usa', uk:'uk' };
  var REGION_BY_LANG = { es:'latam', pt:'brazil', it:'italy', pl:'poland', ru:'cis', tr:'mena', id:'indonesia' };
  var MIN_OPEN = 10;
  var EMAIL_RX = /^[^@\s]+@kodland\.team$/i;
  // Texts that changed in v2 (required answers, @kodland.team): they replace the ones in T[lang].s
  var V2 = {
    en: { emailPlaceholder:"name.surname@kodland.team", emailError:"Please write your Kodland corporate e-mail (it ends in @kodland.team).", missing:"Please answer all questions to continue.", minChars:"Write at least 10 characters." },
    es: { emailPlaceholder:"nombre.apellido@kodland.team", emailError:"Escribe tu correo corporativo de Kodland (termina en @kodland.team).", missing:"Responde todas las preguntas para continuar.", minChars:"Escribe al menos 10 caracteres." },
    pt: { emailPlaceholder:"nome.sobrenome@kodland.team", emailError:"Escreva o seu e-mail corporativo da Kodland (ele termina em @kodland.team).", missing:"Responda a todas as perguntas para continuar.", minChars:"Escreva pelo menos 10 caracteres." },
    it: { emailPlaceholder:"nome.cognome@kodland.team", emailError:"Inserisci il tuo indirizzo e-mail aziendale Kodland (termina con @kodland.team).", missing:"Rispondi a tutte le domande per continuare.", minChars:"Scrivi almeno 10 caratteri." },
    pl: { emailPlaceholder:"imie.nazwisko@kodland.team", emailError:"Wpisz swój służbowy e-mail Kodland (kończy się na @kodland.team).", missing:"Odpowiedz na wszystkie pytania, żeby przejść dalej.", minChars:"Napisz co najmniej 10 znaków." },
    tr: { emailPlaceholder:"ad.soyad@kodland.team", emailError:"Lütfen Kodland kurumsal e-posta adresini yaz (@kodland.team ile biter).", missing:"Devam etmek için lütfen tüm soruları yanıtla.", minChars:"En az 10 karakter yaz." },
    id: { emailPlaceholder:"nama.belakang@kodland.team", emailError:"Silakan tulis e-mail korporat Kodland-mu (berakhiran @kodland.team).", missing:"Silakan jawab semua pertanyaan untuk melanjutkan.", minChars:"Tulis minimal 10 karakter." },
    ru: { emailPlaceholder:"imya.familiya@kodland.team", emailError:"Пожалуйста, укажи свой корпоративный e-mail Kodland (он заканчивается на @kodland.team).", missing:"Пожалуйста, ответь на все вопросы, чтобы продолжить.", minChars:"Напиши не меньше 10 символов." },
    ar: { emailPlaceholder:"name.surname@kodland.team", emailError:"يُرجى كتابة بريدك الإلكتروني المؤسسي في Kodland (ينتهي بـ ‎@kodland.team).", missing:"يُرجى الإجابة عن جميع الأسئلة للمتابعة.", minChars:"اكتب 10 أحرف على الأقل." }
  };

  /* ---------- time per module: ONE row per tutor + training (Apps Script tab "Module time") ----------
     Active time = page visible and mouse/keyboard/touch input in the last 2 minutes. It is added to the module
     that is open on screen (and always to the training total). Kept in storage, so a reload or a second day
     adds to it. The row is created when the first module opens and updated each time a module is passed,
     when the tutor leaves the page (at most once a minute) and when the training is completed.
     After completion the time is frozen: later visits don't change the row. */
  var lastTick = Date.now(), lastInput = Date.now(), TIME = null, dirty = false, lastSent = 0;
  ['mousemove','keydown','scroll','click','touchstart'].forEach(function(ev){ addEventListener(ev, function(){ lastInput = Date.now(); }, { passive:true }); });
  function trainingId(){ return (typeof TRAINING_ID !== 'undefined') ? TRAINING_ID : ''; }
  function startKey(){ return 'kl-rf-start-survey-' + trainingId(); }
  function finalKey(){ return 'kl-rf-final-survey-' + trainingId(); }
  function timeKey(){ return 'kl-rf-time-' + trainingId(); }
  function devOn(){ return typeof isDevMode === 'function' && isDevMode(); }
  function loadTime(){ var t = null; try { t = JSON.parse(store(timeKey()) || 'null'); } catch(e){} return (t && t.mods) ? t : { started_at:'', finished_at:'', total:0, mods:{} }; }
  function saveTime(){ if (TIME) store(timeKey(), JSON.stringify(TIME)); }
  setInterval(function(){
    var now = Date.now(), d = Math.min(now - lastTick, 10000) / 1000;
    lastTick = now;
    if (!TIME || !TIME.started_at || TIME.finished_at || devOn()) return;
    if (document.visibilityState !== 'visible' || now - lastInput >= 120000) return;
    TIME.total += d;
    // time goes to the module on screen: its content, its check (quiz) or its sort game
    var onModule = ['screen-content','screen-quiz','screen-sort'].some(function(s){ var el = document.getElementById(s); return el && el.classList.contains('active'); });
    if (onModule && typeof currentModule !== 'undefined' && currentModule && currentModule !== 'final') TIME.mods[currentModule] = (TIME.mods[currentModule] || 0) + d;
    dirty = true; saveTime();
  }, 5000);
  function min1(sec){ return Math.round((sec || 0) / 6) / 10; }   // seconds → minutes with 1 decimal
  function sendTime(beacon){
    if (!SURVEY_URL || !TIME || !TIME.started_at || devOn() || typeof MODULES === 'undefined') return;   // nothing is sent in developer mode
    var email = ''; try { email = (JSON.parse(store(startKey()) || 'null') || {}).email || ''; } catch(e){}
    if (!email) return;
    var body = JSON.stringify({ type:'training_time', email:email, training:trainingId(), training_name:TRAINING_NAMES[trainingId()] || trainingId(),
      lang:(typeof LANG !== 'undefined' && LANG) || '', started_at:TIME.started_at, finished_at:TIME.finished_at, completed:!!TIME.finished_at,
      active_min:min1(TIME.total), module_ids:MODULES.map(function(m){ return m.id; }), module_min:MODULES.map(function(m){ return min1(TIME.mods[m.id]); }) });
    dirty = false; lastSent = Date.now();
    try { if (beacon && navigator.sendBeacon && navigator.sendBeacon(SURVEY_URL, new Blob([body], { type:'text/plain;charset=utf-8' }))) return; } catch(e){}
    try { fetch(SURVEY_URL, { method:'POST', mode:'no-cors', keepalive:true, headers:{ 'Content-Type':'text/plain;charset=utf-8' }, body:body }); } catch(e){}
  }
  // Leaving or hiding the page: save the time spent so far (at most once a minute)
  document.addEventListener('visibilitychange', function(){ if (document.visibilityState === 'hidden' && dirty && Date.now() - lastSent > 60000) sendTime(true); });
  // Read by the engine (notifyMaterialCompleted) before it tells the LMS "completed" (that message unlocks the DST): only after the final survey.
  window.TD_CAN_COMPLETE = function(){ return !!store(finalKey()); };

  /* ---------- questions (ids and answer codes go to the Sheet) ---------- */
  var CODES = {
    feel: ['curious','calm','worried','overwhelmed','insecure','excited','anxious'],
    understand: ['yes','partly','no'],
    help: ['yes','partly','no'],
    support: ['fully','mostly','not_sure','no'],
    dur: ['too_short','just_right','too_long']
  };
  var FEEL_ICONS = ['🤔','😌','😟','😵','😕','🤩','😰'];
  // [id, type, options/texts key, optional]  types: choice | lscale (1–5 with a label per value) | scale (1–5) | open
  var START = [['feeling','choice','feel'], ['understand_why','choice','understand'], ['know_help','choice','help'], ['confidence_before','lscale'], ['comment','open','']];
  var FINAL = [['feeling','choice','feel'], ['confidence_after','lscale'], ['kodland_support','choice','support'], ['clarity','scale'], ['duration','choice','dur'], ['improve','open','']];

  /* ---------- texts ---------- */
  var T = {
    en: {
      start: { title:"Before you start: a quick check-in", intro:"There are no right or wrong answers. Your answers help the team support you better. Send them to open the training." },
      final: { sec:"💬 A last check-in", title:"Before you finish: how do you feel now?", intro:"This isn’t a test — there are no right or wrong answers. Your answers help us improve the training and the support we give tutors. Send them to finish the training.", lockMsg:"Send the survey above to finish the training.", unlocked:"You can now finish the training." },
      s: { emailLabel:"Your Kodland corporate e-mail", emailPlaceholder:"name.surname@kodland.org", emailError:"Please write your Kodland corporate e-mail (it ends in @kodland…).", regionLabel:"Your region", regionPlaceholder:"Choose your region…", regionError:"Please choose your region.", missing:"Please answer every question marked with ★.", send:"Send my answers", sending:"Sending…", thanks:"✅ <b>Thank you!</b> Your answers have been sent.", low:"Not at all", high:"Completely", optional:"optional", openPlaceholder:"Write anything you like…" },
      q: {
        start_feeling:"How do you feel about being assigned this training?",
        understand_why:"Do you understand why you have been assigned this training?",
        know_help:"Do you know where to find help and who to contact if you have questions or need support handling refund cases?",
        confidence_before:"Before starting, how confident do you feel about handling and resolving refund cases related to this specific issue?",
        comment:"Is there anything you would like to share or comment on before starting the training?",
        final_feeling:"How do you feel now that you have completed the training?",
        confidence_after:"Now that you have completed the training, how confident do you feel about handling and resolving refund cases related to this specific issue?",
        prevent_confidence:"How confident do you feel about preventing or reducing this type of refund case in your future lessons?",
        kodland_support:"Do you feel that Kodland provides you with the support you need to improve and handle these types of situations?",
        clarity:"How clear and easy to follow did you find the training?",
        duration:"How would you rate the duration of the training?",
        improve:"Is there anything you would change about the training or anything you think we could improve? We’d love to hear your thoughts!",
        support_suggestions:"Do you have any comments or suggestions on how we could improve the support we provide to tutors when handling refund cases?"
      },
      feel:["Curious","Calm","Worried","Overwhelmed","Insecure","Excited","Anxious"],
      understand:["Yes, I clearly understand the reason.","I have a general idea, but I’m not entirely sure.","No, I don’t understand why I have been assigned this training."],
      help:["Yes, I know where to find help and who to contact.","I have a general idea, but I’m not completely sure.","No, I don’t know where to find help."],
      conf:["Not at all confident","Slightly confident","Moderately confident","Very confident","Completely confident"],
      support:["Yes, I feel fully supported.","Generally, yes, although I would need more support in some areas.","I’m not sure.","No, I feel I need more support."],
      dur:["Too short.","Just right.","Too long."],
      regions:[["brazil","Brazil"],["latam","LATAM (incl. Spain)"],["mena","MENA"],["italy","Italy"],["poland","Poland"],["uk","UK"],["usa","USA"],["indonesia","Indonesia"],["gcc","GCC"],["cis","CIS"]]
    },
    es: {
      start: { title:"Antes de empezar: un breve chequeo", intro:"No hay respuestas correctas ni incorrectas. Tus respuestas ayudan al equipo a apoyarte mejor. Envíalas para abrir la capacitación." },
      final: { sec:"💬 Un último chequeo", title:"Antes de terminar: ¿cómo te sientes ahora?", intro:"Esto no es un test: no hay respuestas correctas ni incorrectas. Tus respuestas nos ayudan a mejorar la capacitación y el apoyo que damos a los tutores. Envíalas para terminar la capacitación.", lockMsg:"Envía la encuesta de arriba para terminar la capacitación.", unlocked:"Ya puedes terminar la capacitación." },
      s: { emailLabel:"Tu correo corporativo de Kodland", emailPlaceholder:"nombre.apellido@kodland.org", emailError:"Escribe tu correo corporativo de Kodland (termina en @kodland…).", regionLabel:"Tu región", regionPlaceholder:"Elige tu región…", regionError:"Elige tu región.", missing:"Responde todas las preguntas marcadas con ★.", send:"Enviar mis respuestas", sending:"Enviando…", thanks:"✅ <b>¡Gracias!</b> Tus respuestas se enviaron.", low:"Nada", high:"Totalmente", optional:"opcional", openPlaceholder:"Escribe lo que quieras…" },
      q: {
        start_feeling:"¿Cómo te sientes al recibir esta capacitación?",
        understand_why:"¿Entiendes por qué se te ha asignado esta capacitación?",
        know_help:"¿Sabes dónde encontrar ayuda y a quién acudir si tienes dudas o necesitas apoyo para gestionar casos de refunds?",
        confidence_before:"Antes de comenzar, ¿qué tan seguro/a te sientes de poder gestionar y resolver los casos de refunds relacionados con este motivo?",
        comment:"¿Hay algo que te gustaría compartir o comentar antes de comenzar la capacitación?",
        final_feeling:"¿Cómo te sientes ahora que has completado la capacitación?",
        confidence_after:"Ahora que has completado la capacitación, ¿qué tan seguro/a te sientes de poder gestionar y resolver los casos de refunds relacionados con este motivo?",
        prevent_confidence:"¿Qué tan seguro/a te sientes de poder prevenir o reducir este tipo de casos de refunds en tus futuras lecciones?",
        kodland_support:"¿Sientes que Kodland te brinda el apoyo necesario para mejorar y gestionar este tipo de situaciones?",
        clarity:"¿Qué tan clara y fácil de seguir te pareció la capacitación?",
        duration:"¿Cómo calificarías la duración de la capacitación?",
        improve:"¿Hay algo que cambiarías de la capacitación o que crees que podríamos mejorar? ¡Cuéntanos tu opinión!",
        support_suggestions:"¿Tienes algún comentario o sugerencia sobre cómo podríamos mejorar el apoyo que brindamos a los tutores al gestionar casos de refunds?"
      },
      feel:["Curioso/a","Tranquilo/a","Preocupado/a","Abrumado/a","Inseguro/a","Entusiasmado/a","Ansioso/a"],
      understand:["Sí, entiendo claramente el motivo.","Tengo una idea general, pero no estoy del todo seguro/a.","No, no entiendo por qué se me ha asignado."],
      help:["Sí, sé dónde encontrar ayuda y a quién contactar.","Tengo una idea, pero no estoy completamente seguro/a.","No, no sé dónde encontrar ayuda."],
      conf:["Nada seguro/a","Poco seguro/a","Moderadamente seguro/a","Muy seguro/a","Completamente seguro/a"],
      support:["Sí, me siento completamente apoyado/a.","En general, sí, aunque necesitaría más apoyo en algunos aspectos.","No estoy seguro/a.","No, siento que necesito más apoyo."],
      dur:["Demasiado corta.","Adecuada.","Demasiado larga."],
      regions:[["brazil","Brasil"],["latam","LATAM (incl. España)"],["mena","MENA"],["italy","Italia"],["poland","Polonia"],["uk","UK"],["usa","USA"],["indonesia","Indonesia"],["gcc","GCC"],["cis","CIS"]]
    },
    pt: {
      start: { title:"Antes de começar: um check-in rápido", intro:"Não há respostas certas ou erradas. As suas respostas ajudam a equipe a apoiar você melhor. Envie-as para abrir o treinamento." },
      final: { sec:"💬 Um último check-in", title:"Antes de terminar: como você se sente agora?", intro:"Isto não é um teste — não há respostas certas ou erradas. As suas respostas nos ajudam a melhorar o treinamento e o apoio que oferecemos aos tutores. Envie-as para concluir o treinamento.", lockMsg:"Envie a pesquisa acima para concluir o treinamento.", unlocked:"Agora você já pode concluir o treinamento." },
      s: { emailLabel:"O seu e-mail corporativo da Kodland", emailPlaceholder:"nome.sobrenome@kodland.org", emailError:"Escreva o seu e-mail corporativo da Kodland (ele termina em @kodland…).", regionLabel:"A sua região", regionPlaceholder:"Escolha a sua região…", regionError:"Escolha a sua região.", missing:"Responda a todas as perguntas marcadas com ★.", send:"Enviar minhas respostas", sending:"Enviando…", thanks:"✅ <b>Obrigado!</b> As suas respostas foram enviadas.", low:"Nem um pouco", high:"Totalmente", optional:"opcional", openPlaceholder:"Escreva o que quiser…" },
      q: {
        start_feeling:"Como você se sente ao receber este treinamento?",
        understand_why:"Você entende por que este treinamento foi atribuído a você?",
        know_help:"Você sabe onde encontrar ajuda e com quem entrar em contato caso tenha dúvidas ou precise de apoio para lidar com casos de reembolso?",
        confidence_before:"Antes de começar, quão confiante você se sente para lidar e resolver casos de reembolso relacionados a esse motivo específico?",
        comment:"Há algo que você gostaria de compartilhar ou comentar antes de começar o treinamento?",
        final_feeling:"Como você se sente agora que concluiu o treinamento?",
        confidence_after:"Agora que concluiu o treinamento, quão confiante você se sente para lidar e resolver casos de reembolso relacionados a esse motivo específico?",
        prevent_confidence:"Quão confiante você se sente para prevenir ou reduzir esse tipo de caso de reembolso em suas futuras aulas?",
        kodland_support:"Você sente que a Kodland oferece o apoio necessário para que você possa melhorar e lidar com esse tipo de situação?",
        clarity:"Quão claro e fácil de acompanhar foi o treinamento?",
        duration:"Como você avalia a duração do treinamento?",
        improve:"Há algo que você mudaria no treinamento ou que acredita que poderíamos melhorar? Conte para nós o que você pensa!",
        support_suggestions:"Você tem algum comentário ou sugestão sobre como poderíamos melhorar o apoio oferecido aos tutores na gestão de casos de reembolso?"
      },
      feel:["Curioso(a)","Tranquilo(a)","Preocupado(a)","Sobrecarregado(a)","Inseguro(a)","Entusiasmado(a)","Ansioso(a)"],
      understand:["Sim, entendo claramente o motivo.","Tenho uma ideia geral, mas não tenho total certeza.","Não, não entendo por que este treinamento foi atribuído a mim."],
      help:["Sim, sei onde encontrar ajuda e com quem entrar em contato.","Tenho uma ideia, mas não tenho total certeza.","Não, não sei onde encontrar ajuda."],
      conf:["Nada confiante","Pouco confiante","Moderadamente confiante","Muito confiante","Totalmente confiante"],
      support:["Sim, sinto que tenho todo o apoio necessário.","De modo geral, sim, mas precisaria de mais apoio em alguns aspectos.","Não tenho certeza.","Não, sinto que preciso de mais apoio."],
      dur:["Muito curto.","Adequado.","Muito longo."],
      regions:[["brazil","Brasil"],["latam","LATAM (incl. Espanha)"],["mena","MENA"],["italy","Itália"],["poland","Polônia"],["uk","UK"],["usa","USA"],["indonesia","Indonésia"],["gcc","GCC"],["cis","CIS"]]
    },
    it: {
      start: { title:"Prima di iniziare: un breve questionario", intro:"Non ci sono risposte giuste o sbagliate. Le tue risposte aiutano il team a sostenerti meglio. Invia le risposte per accedere alla formazione." },
      final: { sec:"💬 Un ultimo questionario", title:"Prima di finire: come ti senti ora?", intro:"Non è un test: non ci sono risposte giuste o sbagliate. Le tue risposte ci aiutano a migliorare la formazione e il supporto che offriamo ai tutor. Inviale per completare la formazione.", lockMsg:"Invia il sondaggio qui sopra per completare la formazione.", unlocked:"Ora puoi completare la formazione." },
      s: { emailLabel:"La tua e-mail aziendale Kodland", emailPlaceholder:"nome.cognome@kodland.org", emailError:"Inserisci il tuo indirizzo e-mail aziendale Kodland (ad esempio nome.cognome@kodland.org).", regionLabel:"La tua regione", regionPlaceholder:"Scegli la tua regione…", regionError:"Scegli la tua regione.", missing:"Rispondi a tutte le domande contrassegnate con ★.", send:"Invia le mie risposte", sending:"Invio in corso…", thanks:"✅ <b>Grazie!</b> Le tue risposte sono state inviate.", low:"Per niente", high:"Completamente", optional:"facoltativa", openPlaceholder:"Scrivi quello che vuoi…" },
      q: {
        start_feeling:"Come ti senti all’idea che ti sia stata assegnata questa formazione?",
        understand_why:"Hai capito perché ti è stata assegnata questa formazione?",
        know_help:"Sai dove trovare aiuto e a chi rivolgerti se hai domande o hai bisogno di supporto nella gestione dei casi di rimborso?",
        confidence_before:"Prima di iniziare, quanto ti senti sicuro/a di poter gestire e risolvere i casi di rimborso relativi a questo specifico motivo?",
        comment:"C’è qualcosa che vorresti condividere o commentare prima di iniziare la formazione?",
        final_feeling:"Come ti senti ora che hai completato la formazione?",
        confidence_after:"Ora che hai completato la formazione, quanto ti senti sicuro/a di poter gestire e risolvere i casi di rimborso relativi a questo specifico motivo?",
        prevent_confidence:"Quanto ti senti sicuro/a di poter prevenire o ridurre questo tipo di casi di rimborso nelle tue lezioni future?",
        kodland_support:"Senti che Kodland ti offre il supporto necessario per migliorare e gestire questo tipo di situazioni?",
        clarity:"Quanto ti è sembrata chiara e facile da seguire la formazione?",
        duration:"Come valuteresti la durata della formazione?",
        improve:"C’è qualcosa che cambieresti nella formazione o che pensi potremmo migliorare? Raccontaci cosa ne pensi!",
        support_suggestions:"Hai commenti o suggerimenti su come potremmo migliorare il supporto che offriamo ai tutor nella gestione dei casi di rimborso?"
      },
      feel:["Curioso/a","Tranquillo/a","Preoccupato/a","Sopraffatto/a","Insicuro/a","Entusiasta","Ansioso/a"],
      understand:["Sì, ne comprendo chiaramente il motivo.","Ho un’idea generale, ma non ne sono del tutto sicuro/a.","No, non capisco perché mi sia stata assegnata."],
      help:["Sì, so dove trovare aiuto e chi contattare.","Ho un’idea generale, ma non ne sono completamente sicuro/a.","No, non so dove trovare aiuto."],
      conf:["Per niente sicuro/a","Poco sicuro/a","Moderatamente sicuro/a","Molto sicuro/a","Completamente sicuro/a"],
      support:["Sì, mi sento pienamente supportato/a.","In generale sì, anche se avrei bisogno di maggiore supporto in alcuni aspetti.","Non ne sono sicuro/a.","No, sento di aver bisogno di maggiore supporto."],
      dur:["Troppo breve.","Adeguata.","Troppo lunga."],
      regions:[["brazil","Brasile"],["latam","LATAM (Spagna inclusa)"],["mena","MENA"],["italy","Italia"],["poland","Polonia"],["uk","UK"],["usa","USA"],["indonesia","Indonesia"],["gcc","GCC"],["cis","CIS"]]
    },
    pl: {
      start: { title:"Zanim zaczniesz: krótka ankieta", intro:"Nie ma dobrych ani złych odpowiedzi. Twoje odpowiedzi pomagają zespołowi lepiej Cię wspierać. Wyślij je, żeby otworzyć szkolenie." },
      final: { sec:"💬 Ostatnia ankieta", title:"Zanim skończysz: jak się teraz czujesz?", intro:"To nie jest test — nie ma dobrych ani złych odpowiedzi. Twoje odpowiedzi pomagają nam ulepszać szkolenie i wsparcie dla tutorów. Wyślij je, żeby ukończyć szkolenie.", lockMsg:"Wyślij ankietę powyżej, żeby ukończyć szkolenie.", unlocked:"Teraz możesz ukończyć szkolenie." },
      s: { emailLabel:"Twój służbowy e-mail Kodland", emailPlaceholder:"imie.nazwisko@kodland.org", emailError:"Wpisz swój służbowy e-mail Kodland (kończy się na @kodland…).", regionLabel:"Twój region", regionPlaceholder:"Wybierz swój region…", regionError:"Wybierz swój region.", missing:"Odpowiedz na każde pytanie oznaczone ★.", send:"Wyślij moje odpowiedzi", sending:"Wysyłanie…", thanks:"✅ <b>Dziękujemy!</b> Twoje odpowiedzi zostały wysłane.", low:"Wcale", high:"Całkowicie", optional:"opcjonalnie", openPlaceholder:"Napisz, co chcesz…" },
      q: {
        start_feeling:"Jak się czujesz po otrzymaniu tego szkolenia?",
        understand_why:"Czy rozumiesz, dlaczego przydzielono Ci to szkolenie?",
        know_help:"Czy wiesz, gdzie szukać pomocy i z kim się skontaktować, jeśli masz pytania lub potrzebujesz wsparcia w obsłudze przypadków refundacji?",
        confidence_before:"Zanim rozpoczniesz szkolenie, na ile czujesz się pewnie w zakresie obsługi i rozwiązywania przypadków refundacji związanych z tym konkretnym powodem?",
        comment:"Czy jest coś, czym chcesz się podzielić lub o czym chciał(a)byś wspomnieć przed rozpoczęciem szkolenia?",
        final_feeling:"Jak się teraz czujesz po ukończeniu szkolenia?",
        confidence_after:"Teraz, po ukończeniu szkolenia, na ile czujesz się pewnie w zakresie obsługi i rozwiązywania przypadków refundacji związanych z tym konkretnym powodem?",
        prevent_confidence:"Na ile czujesz się pewnie, że potrafisz zapobiegać takim przypadkom refundacji lub ograniczać ich liczbę podczas przyszłych lekcji?",
        kodland_support:"Czy czujesz, że Kodland zapewnia Ci wsparcie potrzebne do doskonalenia swoich umiejętności i radzenia sobie z tego typu sytuacjami?",
        clarity:"Jak oceniasz przejrzystość szkolenia i łatwość jego realizacji?",
        duration:"Jak oceniasz długość szkolenia?",
        improve:"Czy jest coś, co zmienił(a)byś w szkoleniu lub co Twoim zdaniem moglibyśmy ulepszyć? Podziel się z nami swoją opinią!",
        support_suggestions:"Czy masz jakieś uwagi lub sugestie dotyczące tego, jak możemy poprawić wsparcie udzielane tutorom w obsłudze przypadków refundacji?"
      },
      feel:["Ciekawość","Spokój","Zaniepokojenie","Przytłoczenie","Niepewność","Entuzjazm","Niepokój"],
      understand:["Tak, dokładnie rozumiem, dlaczego zostało mi przydzielone.","Mam ogólne pojęcie, ale nie mam całkowitej pewności.","Nie, nie rozumiem, dlaczego zostało mi przydzielone."],
      help:["Tak, wiem, gdzie szukać pomocy i z kim się skontaktować.","Mam ogólne pojęcie, ale nie mam całkowitej pewności.","Nie, nie wiem, gdzie szukać pomocy."],
      conf:["Wcale nie czuję się pewnie","Czuję się mało pewnie","Czuję się umiarkowanie pewnie","Czuję się bardzo pewnie","Czuję się całkowicie pewnie"],
      support:["Tak, czuję się w pełni wspierany/a.","Ogólnie tak, chociaż w niektórych obszarach potrzebuję większego wsparcia.","Nie jestem pewien/pewna.","Nie, czuję, że potrzebuję większego wsparcia."],
      dur:["Zbyt krótkie.","Odpowiednie.","Zbyt długie."],
      regions:[["brazil","Brazylia"],["latam","LATAM (z Hiszpanią)"],["mena","MENA"],["italy","Włochy"],["poland","Polska"],["uk","UK"],["usa","USA"],["indonesia","Indonezja"],["gcc","GCC"],["cis","CIS"]]
    },
    tr: {
      start: { title:"Başlamadan önce: kısa bir değerlendirme", intro:"Doğru ya da yanlış cevap yok. Yanıtların ekibin sana daha iyi destek olmasına yardımcı olur. Eğitimi açmak için gönder." },
      final: { sec:"💬 Son bir değerlendirme", title:"Bitirmeden önce: şimdi nasıl hissediyorsun?", intro:"Bu bir test değil — doğru ya da yanlış cevap yok. Yanıtların eğitimi ve eğitmenlere verdiğimiz desteği geliştirmemize yardımcı olur. Eğitimi tamamlamak için gönder.", lockMsg:"Eğitimi tamamlamak için yukarıdaki anketi gönder.", unlocked:"Artık eğitimi tamamlayabilirsin." },
      s: { emailLabel:"Kodland kurumsal e-posta adresin", emailPlaceholder:"ad.soyad@kodland.org", emailError:"Lütfen Kodland kurumsal e-posta adresini yaz (@kodland… ile biter).", regionLabel:"Bölgen", regionPlaceholder:"Bölgeni seç…", regionError:"Lütfen bölgeni seç.", missing:"Lütfen ★ ile işaretlenmiş tüm soruları yanıtla.", send:"Yanıtlarımı gönder", sending:"Gönderiliyor…", thanks:"✅ <b>Teşekkürler!</b> Yanıtların gönderildi.", low:"Hiç", high:"Tamamen", optional:"isteğe bağlı", openPlaceholder:"İstediğini yaz…" },
      q: {
        start_feeling:"Bu eğitimin sana atanması hakkında ne hissediyorsun?",
        understand_why:"Bu eğitimin sana neden atandığını anlıyor musun?",
        know_help:"İade (refund) vakalarını yönetirken soruların olduğunda veya desteğe ihtiyaç duyduğunda nereden yardım bulacağını ve kiminle iletişime geçeceğini biliyor musun?",
        confidence_before:"Eğitime başlamadan önce, bu özel nedenle ilgili iade (refund) vakalarını yönetme ve çözme konusunda kendini ne kadar yeterli hissediyorsun?",
        comment:"Eğitime başlamadan önce paylaşmak veya yorum yapmak istediğin bir şey var mı?",
        final_feeling:"Eğitimi tamamladıktan sonra şimdi kendini nasıl hissediyorsun?",
        confidence_after:"Eğitimi tamamladıktan sonra, bu özel nedenle ilgili iade (refund) vakalarını yönetme ve çözme konusunda kendini ne kadar yeterli hissediyorsun?",
        prevent_confidence:"Gelecekteki derslerinde bu tür iade (refund) vakalarını önleme veya azaltma konusunda kendini ne kadar yeterli hissediyorsun?",
        kodland_support:"Kodland’ın bu tür durumları yönetmen ve kendini geliştirmen için sana gerekli desteği sağladığını düşünüyor musun?",
        clarity:"Eğitimi ne kadar açık ve takip etmesi kolay buldun?",
        duration:"Eğitimin süresini nasıl değerlendiriyorsun?",
        improve:"Eğitimde değiştirmek istediğin veya sence geliştirebileceğimiz bir şey var mı? Düşüncelerini bizimle paylaş!",
        support_suggestions:"İade (refund) vakalarını yönetirken eğitmenlere sunduğumuz desteği nasıl geliştirebileceğimize dair yorum veya önerilerin var mı?"
      },
      feel:["Meraklı","Sakin","Endişeli","Bunalmış","Kendinden emin değil","Heyecanlı","Kaygılı"],
      understand:["Evet, neden atandığını açıkça anlıyorum.","Genel olarak bir fikrim var, ancak tam olarak emin değilim.","Hayır, bu eğitimin bana neden atandığını anlamıyorum."],
      help:["Evet, nereden yardım bulacağımı ve kiminle iletişime geçeceğimi biliyorum.","Genel olarak bir fikrim var, ancak tam olarak emin değilim.","Hayır, nereden yardım bulacağımı bilmiyorum."],
      conf:["Hiç yeterli hissetmiyorum.","Biraz yeterli hissediyorum.","Orta düzeyde yeterli hissediyorum.","Oldukça yeterli hissediyorum.","Tamamen yeterli hissediyorum."],
      support:["Evet, kendimi tamamen desteklenmiş hissediyorum.","Genel olarak evet, ancak bazı konularda daha fazla desteğe ihtiyacım var.","Emin değilim.","Hayır, daha fazla desteğe ihtiyacım olduğunu düşünüyorum."],
      dur:["Çok kısa.","Uygun.","Çok uzun."],
      regions:[["brazil","Brezilya"],["latam","LATAM (İspanya dahil)"],["mena","MENA"],["italy","İtalya"],["poland","Polonya"],["uk","UK"],["usa","USA"],["indonesia","Endonezya"],["gcc","GCC"],["cis","CIS"]]
    },
    id: {
      start: { title:"Sebelum mulai: check-in singkat", intro:"Tidak ada jawaban yang benar atau salah. Jawabanmu membantu tim mendukungmu dengan lebih baik. Kirimkan untuk membuka pelatihan." },
      final: { sec:"💬 Check-in terakhir", title:"Sebelum selesai: bagaimana perasaanmu sekarang?", intro:"Ini bukan tes — tidak ada jawaban yang benar atau salah. Jawabanmu membantu kami meningkatkan pelatihan dan dukungan untuk tutor. Kirimkan untuk menyelesaikan pelatihan.", lockMsg:"Kirim survei di atas untuk menyelesaikan pelatihan.", unlocked:"Sekarang kamu bisa menyelesaikan pelatihan." },
      s: { emailLabel:"E-mail korporat Kodland-mu", emailPlaceholder:"nama.belakang@kodland.org", emailError:"Silakan tulis e-mail korporat Kodland-mu (berakhiran @kodland…).", regionLabel:"Wilayahmu", regionPlaceholder:"Pilih wilayahmu…", regionError:"Silakan pilih wilayahmu.", missing:"Silakan jawab setiap pertanyaan yang bertanda ★.", send:"Kirim jawaban saya", sending:"Mengirim…", thanks:"✅ <b>Terima kasih!</b> Jawabanmu sudah terkirim.", low:"Sama sekali tidak", high:"Sepenuhnya", optional:"opsional", openPlaceholder:"Tulis apa saja…" },
      q: {
        start_feeling:"Bagaimana perasaanmu setelah menerima pelatihan ini?",
        understand_why:"Apakah kamu memahami alasan mengapa pelatihan ini diberikan kepadamu?",
        know_help:"Apakah kamu tahu di mana bisa mendapatkan bantuan dan siapa yang harus dihubungi jika memiliki pertanyaan atau membutuhkan dukungan dalam menangani kasus refund?",
        confidence_before:"Sebelum memulai pelatihan, seberapa yakin kamu dapat menangani dan menyelesaikan kasus refund yang berkaitan dengan alasan spesifik ini?",
        comment:"Apakah ada hal yang ingin kamu sampaikan atau komentari sebelum memulai pelatihan?",
        final_feeling:"Bagaimana perasaanmu sekarang setelah menyelesaikan pelatihan?",
        confidence_after:"Setelah menyelesaikan pelatihan, seberapa yakin kamu dapat menangani dan menyelesaikan kasus refund yang berkaitan dengan alasan spesifik ini?",
        prevent_confidence:"Seberapa yakin kamu dapat mencegah atau mengurangi kasus refund seperti ini dalam kelas-kelasmu mendatang?",
        kodland_support:"Apakah kamu merasa Kodland memberikan dukungan yang kamu butuhkan untuk berkembang dan menangani situasi seperti ini?",
        clarity:"Seberapa jelas dan mudah diikuti pelatihan ini menurutmu?",
        duration:"Bagaimana penilaianmu terhadap durasi pelatihan ini?",
        improve:"Apakah ada hal yang ingin kamu ubah dari pelatihan ini atau menurutmu masih bisa kami tingkatkan? Bagikan pendapatmu kepada kami!",
        support_suggestions:"Apakah kamu memiliki komentar atau saran tentang bagaimana kami dapat meningkatkan dukungan yang diberikan kepada tutor dalam menangani kasus refund?"
      },
      feel:["Penasaran","Tenang","Khawatir","Kewalahan","Tidak percaya diri","Antusias","Cemas"],
      understand:["Ya, saya memahami alasannya dengan jelas.","Saya memiliki gambaran umum, tetapi belum sepenuhnya yakin.","Tidak, saya tidak memahami mengapa pelatihan ini diberikan kepada saya."],
      help:["Ya, saya tahu di mana mencari bantuan dan siapa yang harus dihubungi.","Saya memiliki gambaran umum, tetapi belum sepenuhnya yakin.","Tidak, saya tidak tahu di mana bisa mendapatkan bantuan."],
      conf:["Sama sekali tidak yakin","Kurang yakin","Cukup yakin","Sangat yakin","Sepenuhnya yakin"],
      support:["Ya, saya merasa mendapatkan dukungan penuh.","Secara umum, ya, tetapi saya membutuhkan lebih banyak dukungan dalam beberapa hal.","Saya tidak yakin.","Tidak, saya merasa membutuhkan lebih banyak dukungan."],
      dur:["Terlalu singkat.","Sudah sesuai.","Terlalu lama."],
      regions:[["brazil","Brasil"],["latam","LATAM (termasuk Spanyol)"],["mena","MENA"],["italy","Italia"],["poland","Polandia"],["uk","UK"],["usa","USA"],["indonesia","Indonesia"],["gcc","GCC"],["cis","CIS"]]
    },
    ru: {
      start: { title:"Перед началом: короткий опрос", intro:"Здесь нет правильных и неправильных ответов. Твои ответы помогают команде лучше тебя поддерживать. Отправь их, чтобы открыть обучение." },
      final: { sec:"💬 Последний опрос", title:"Перед завершением: что ты чувствуешь сейчас?", intro:"Это не тест — правильных и неправильных ответов нет. Твои ответы помогают нам улучшать обучение и поддержку тьюторов. Отправь их, чтобы завершить обучение.", lockMsg:"Отправь опрос выше, чтобы завершить обучение.", unlocked:"Теперь ты можешь завершить обучение." },
      s: { emailLabel:"Твой корпоративный e-mail Kodland", emailPlaceholder:"imya.familiya@kodland.org", emailError:"Пожалуйста, укажи свой корпоративный e-mail Kodland (он заканчивается на @kodland…).", regionLabel:"Твой регион", regionPlaceholder:"Выбери свой регион…", regionError:"Пожалуйста, выбери свой регион.", missing:"Пожалуйста, ответь на все вопросы, отмеченные ★.", send:"Отправить ответы", sending:"Отправка…", thanks:"✅ <b>Спасибо!</b> Твои ответы отправлены.", low:"Совсем нет", high:"Полностью", optional:"необязательно", openPlaceholder:"Напиши всё, что хочешь…" },
      q: {
        start_feeling:"Что ты чувствуешь, получив это обучение?",
        understand_why:"Понимаешь ли ты, почему тебе назначили это обучение?",
        know_help:"Знаешь ли ты, где найти помощь и к кому обратиться, если у тебя возникнут вопросы или понадобится поддержка в работе с кейсами возврата средств (refunds)?",
        confidence_before:"Насколько уверенно ты чувствуешь себя перед началом обучения в вопросах работы с кейсами возврата средств (refunds), связанными с этой конкретной причиной, и их решения?",
        comment:"Есть ли что-то, чем ты хотел(а) бы поделиться или прокомментировать перед началом обучения?",
        final_feeling:"Что ты чувствуешь теперь, после завершения обучения?",
        confidence_after:"Теперь, после завершения обучения, насколько уверенно ты чувствуешь себя в вопросах работы с кейсами возврата средств (refunds), связанными с этой конкретной причиной, и их решения?",
        prevent_confidence:"Насколько уверенно ты чувствуешь себя в том, что сможешь предотвращать или сокращать количество подобных случаев возврата средств (refunds) на своих будущих занятиях?",
        kodland_support:"Чувствуешь ли ты, что Kodland предоставляет тебе необходимую поддержку для профессионального развития и решения подобных ситуаций?",
        clarity:"Насколько понятным и удобным для прохождения было это обучение?",
        duration:"Как бы ты оценил(а) продолжительность обучения?",
        improve:"Есть ли что-то, что ты хотел(а) бы изменить в обучении или что, по твоему мнению, мы могли бы улучшить? Поделись своим мнением!",
        support_suggestions:"Есть ли у тебя комментарии или предложения о том, как мы могли бы улучшить поддержку, которую оказываем тьюторам при работе с кейсами возврата средств (refunds)?"
      },
      feel:["Любопытство","Спокойствие","Обеспокоенность","Растерянность","Неуверенность","Воодушевление","Тревогу"],
      understand:["Да, я чётко понимаю причину.","У меня есть общее представление, но я не совсем уверен(а).","Нет, я не понимаю, почему мне назначили это обучение."],
      help:["Да, я знаю, где найти помощь и к кому обратиться.","У меня есть общее представление, но я не совсем уверен(а).","Нет, я не знаю, где найти помощь."],
      conf:["Совершенно не уверен(а)","Скорее не уверен(а)","Умеренно уверен(а)","Очень уверен(а)","Полностью уверен(а)"],
      support:["Да, я чувствую, что получаю всю необходимую поддержку.","В целом да, но в некоторых вопросах мне хотелось бы получать больше поддержки.","Не уверен(а).","Нет, я чувствую, что мне нужна дополнительная поддержка."],
      dur:["Слишком короткое.","Оптимальное.","Слишком длинное."],
      regions:[["brazil","Бразилия"],["latam","LATAM (вкл. Испанию)"],["mena","MENA"],["italy","Италия"],["poland","Польша"],["uk","UK"],["usa","USA"],["indonesia","Индонезия"],["gcc","GCC"],["cis","СНГ"]]
    },
    ar: {
      start: { title:"قبل أن تبدأ: وقفة قصيرة", intro:"لا توجد إجابات صحيحة أو خاطئة. تساعد إجاباتك الفريق على دعمك بشكل أفضل. أرسلها لفتح التدريب." },
      final: { sec:"💬 وقفة أخيرة", title:"قبل أن تنتهي: كيف تشعر الآن؟", intro:"هذا ليس اختبارًا — لا توجد إجابات صحيحة أو خاطئة. تساعدنا إجاباتك على تحسين التدريب والدعم الذي نقدمه للمعلمين. أرسلها لإنهاء التدريب.", lockMsg:"أرسل الاستبيان أعلاه لإنهاء التدريب.", unlocked:"يمكنك الآن إنهاء التدريب." },
      s: { emailLabel:"بريدك الإلكتروني المؤسسي في Kodland", emailPlaceholder:"name.surname@kodland.org", emailError:"يُرجى كتابة بريدك الإلكتروني المؤسسي في Kodland (ينتهي بـ ‎@kodland…).", regionLabel:"منطقتك", regionPlaceholder:"اختر منطقتك…", regionError:"يُرجى اختيار منطقتك.", missing:"يُرجى الإجابة عن كل سؤال عليه علامة ★.", send:"أرسل إجاباتي", sending:"جارٍ الإرسال…", thanks:"✅ <b>شكرًا لك!</b> تمّ إرسال إجاباتك.", low:"إطلاقًا", high:"تمامًا", optional:"اختياري", openPlaceholder:"اكتب ما تشاء…" },
      q: {
        start_feeling:"كيف تشعر بعد إسناد هذا التدريب إليك؟",
        understand_why:"هل تفهم سبب إسناد هذا التدريب إليك؟",
        know_help:"هل تعرف أين يمكنك العثور على المساعدة ومع من يمكنك التواصل إذا كانت لديك أسئلة أو كنت بحاجة إلى دعم في التعامل مع حالات استرداد الأموال (Refunds)؟",
        confidence_before:"قبل البدء، ما مدى ثقتك بقدرتك على التعامل مع حالات استرداد الأموال المرتبطة بهذا السبب المحدد وحلّها؟",
        comment:"هل هناك أي شيء تود مشاركته أو التعليق عليه قبل البدء بالتدريب؟",
        final_feeling:"كيف تشعر الآن بعد إكمال التدريب؟",
        confidence_after:"الآن بعد إكمال التدريب، ما مدى ثقتك بقدرتك على التعامل مع حالات استرداد الأموال المرتبطة بهذا السبب المحدد وحلّها؟",
        prevent_confidence:"ما مدى ثقتك بقدرتك على منع حدوث هذا النوع من حالات استرداد الأموال أو تقليلها خلال دروسك المستقبلية؟",
        kodland_support:"هل تشعر أن Kodland توفر لك الدعم اللازم لتطوير مهاراتك والتعامل مع مثل هذه المواقف؟",
        clarity:"ما مدى وضوح التدريب وسهولة متابعته بالنسبة لك؟",
        duration:"كيف تقيّم مدة التدريب؟",
        improve:"هل هناك أي شيء تود تغييره في التدريب أو تعتقد أنه يمكننا تحسينه؟ شاركنا رأيك!",
        support_suggestions:"هل لديك أي تعليقات أو اقتراحات حول كيفية تحسين الدعم الذي نقدمه للمدربين عند التعامل مع حالات استرداد الأموال (Refunds)؟"
      },
      feel:["أشعر بالفضول","أشعر بالهدوء","أشعر بالقلق","أشعر بالإرهاق","أشعر بعدم الثقة بالنفس","أشعر بالحماس","أشعر بالتوتر"],
      understand:["نعم، أفهم السبب بوضوح.","لدي فكرة عامة، لكنني لست متأكدًا تمامًا.","لا، لا أفهم سبب إسناد هذا التدريب إليّ."],
      help:["نعم، أعرف أين أجد المساعدة ومع من أتواصل.","لدي فكرة عامة، لكنني لست متأكدًا تمامًا.","لا، لا أعرف أين يمكنني العثور على المساعدة."],
      conf:["لا أشعر بالثقة إطلاقًا.","أشعر بقليل من الثقة.","أشعر بثقة متوسطة.","أشعر بثقة كبيرة.","أشعر بثقة تامة."],
      support:["نعم، أشعر أنني أحصل على كل الدعم الذي أحتاج إليه.","بشكل عام، نعم، لكنني أحتاج إلى مزيد من الدعم في بعض الجوانب.","لست متأكدًا.","لا، أشعر أنني بحاجة إلى مزيد من الدعم."],
      dur:["قصيرة جدًا.","مناسبة.","طويلة جدًا."],
      regions:[["brazil","البرازيل"],["latam","LATAM (بما فيها إسبانيا)"],["mena","MENA"],["italy","إيطاليا"],["poland","بولندا"],["uk","UK"],["usa","USA"],["indonesia","إندونيسيا"],["gcc","GCC"],["cis","CIS"]]
    }
  };

  /* ---------- Attendance questions (replace the Refunds ones in T) ---------- */
  var ATT = {
    en: {
      q: {
        start_feeling:"How do you feel about being assigned this training?",
        understand_why:"Do you understand why you have been assigned this training?",
        know_help:"Do you know where to find help and who to contact if you have questions or need support improving attendance?",
        confidence_before:"Before starting, how confident do you feel about improving attendance of your groups?",
        comment:"Is there anything you would like to share or comment on before starting the training?",
        final_feeling:"How do you feel now that you have completed the training?",
        confidence_after:"Now that you have completed the training, how confident do you feel about improving attendance?",
        kodland_support:"Do you feel that Kodland provides you with the support you need to improve attendance?",
        clarity:"How clear and easy to follow did you find the training?",
        duration:"How would you rate the duration of the training?",
        improve:"Is there anything you would change about the training or anything you think we could improve? We’d love to hear your thoughts!"
      },
      feel:["Curious","Calm","Worried","Overwhelmed","Insecure","Excited","Anxious"],
      understand:["Yes, I clearly understand the reason.","I have a general idea, but I’m not entirely sure.","No, I don’t understand why I have been assigned this training."],
      help:["Yes, I know where to find help and who to contact.","I have a general idea, but I’m not completely sure.","No, I don’t know where to find help."],
      conf:["Not at all confident","Slightly confident","Moderately confident","Very confident","Completely confident"],
      support:["Yes, I feel fully supported.","Generally, yes, although I would need more support in some areas.","I’m not sure.","No, I feel I need more support."],
      dur:["Too short.","Just right.","Too long."]
    },
    es: {
      q: {
        start_feeling:"¿Cómo te sientes al haber sido asignado a esta capacitación?",
        understand_why:"¿Entiendes por qué te asignaron esta capacitación?",
        know_help:"¿Sabes dónde encontrar ayuda y con quién comunicarte si tienes preguntas o necesitas apoyo para mejorar la asistencia?",
        confidence_before:"Antes de comenzar, ¿qué tan seguro/a te sientes de poder mejorar la asistencia de tus grupos?",
        comment:"¿Hay algo que te gustaría compartir o comentar antes de comenzar la capacitación?",
        final_feeling:"¿Cómo te sientes ahora que completaste la capacitación?",
        confidence_after:"Ahora que completaste la capacitación, ¿qué tan seguro/a te sientes de poder mejorar la asistencia?",
        kodland_support:"¿Sientes que Kodland te brinda el apoyo que necesitas para mejorar la asistencia?",
        clarity:"¿Qué tan clara y fácil de seguir te pareció la capacitación?",
        duration:"¿Cómo calificarías la duración de la capacitación?",
        improve:"¿Hay algo que cambiarías de la capacitación o que crees que podríamos mejorar? ¡Nos encantaría conocer tu opinión!"
      },
      feel:["Con curiosidad","Tranquilo/a","Preocupado/a","Abrumado/a","Inseguro/a","Entusiasmado/a","Ansioso/a"],
      understand:["Sí, entiendo claramente el motivo.","Tengo una idea general, pero no estoy completamente seguro/a.","No, no entiendo por qué me asignaron esta capacitación."],
      help:["Sí, sé dónde encontrar ayuda y con quién comunicarme.","Tengo una idea general, pero no estoy completamente seguro/a.","No, no sé dónde encontrar ayuda."],
      conf:["Nada seguro/a","Poco seguro/a","Moderadamente seguro/a","Muy seguro/a","Completamente seguro/a"],
      support:["Sí, siento que cuento con todo el apoyo necesario.","En general, sí, aunque necesitaría más apoyo en algunas áreas.","No estoy seguro/a.","No, siento que necesito más apoyo."],
      dur:["Demasiado corta","Adecuada","Demasiado larga"]
    },
    pt: {
      q: {
        start_feeling:"Como você se sente ao receber esta capacitação?",
        understand_why:"Você entende por que esta capacitação foi atribuída a você?",
        know_help:"Você sabe onde encontrar ajuda e com quem entrar em contato se tiver dúvidas ou precisar de apoio para melhorar a frequência dos alunos?",
        confidence_before:"Antes de começar, quão confiante você se sente para melhorar a frequência dos seus grupos?",
        comment:"Há algo que você gostaria de compartilhar ou comentar antes de começar a capacitação?",
        final_feeling:"Como você se sente agora que concluiu a capacitação?",
        confidence_after:"Agora que concluiu a capacitação, quão confiante você se sente para melhorar a frequência dos alunos?",
        kodland_support:"Você sente que a Kodland oferece o suporte necessário para ajudar você a melhorar a frequência dos alunos?",
        clarity:"Quão clara e fácil de acompanhar foi a capacitação?",
        duration:"Como você avalia a duração da capacitação?",
        improve:"Há algo que você mudaria na capacitação ou alguma coisa que acha que poderíamos melhorar? Adoraríamos saber sua opinião!"
      },
      feel:["Curioso(a)","Tranquilo(a)","Preocupado(a)","Sobrecarregado(a)","Inseguro(a)","Animado(a)","Ansioso(a)"],
      understand:["Sim, entendo claramente o motivo.","Tenho uma ideia geral, mas não tenho certeza.","Não, não entendo por que esta capacitação foi atribuída a mim."],
      help:["Sim, sei onde encontrar ajuda e com quem entrar em contato.","Tenho uma ideia geral, mas não tenho certeza.","Não, não sei onde encontrar ajuda."],
      conf:["Nada confiante","Pouco confiante","Moderadamente confiante","Muito confiante","Totalmente confiante"],
      support:["Sim, sinto que recebo todo o suporte necessário.","De modo geral, sim, mas precisaria de mais suporte em algumas áreas.","Não tenho certeza.","Não, sinto que preciso de mais suporte."],
      dur:["Muito curta","Adequada","Muito longa"]
    },
    it: {
      q: {
        start_feeling:"Come ti senti all’idea di dover seguire questa formazione?",
        understand_why:"Hai capito perché ti è stata assegnata questa formazione?",
        know_help:"Sai dove trovare aiuto e chi contattare se hai domande o hai bisogno di supporto per migliorare la frequenza degli studenti?",
        confidence_before:"Prima di iniziare, quanto ti senti sicuro/a di riuscire a migliorare la frequenza degli studenti dei tuoi gruppi?",
        comment:"C’è qualcosa che vorresti condividere o commentare prima di iniziare la formazione?",
        final_feeling:"Come ti senti ora che hai completato la formazione?",
        confidence_after:"Ora che hai completato la formazione, quanto ti senti sicuro/a di riuscire a migliorare la frequenza degli studenti?",
        kodland_support:"Pensi che Kodland ti fornisca il supporto necessario per migliorare la frequenza degli studenti?",
        clarity:"Quanto hai trovato la formazione chiara e facile da seguire?",
        duration:"Come valuteresti la durata della formazione?",
        improve:"C’è qualcosa che cambieresti nella formazione o qualcosa che pensi potremmo migliorare? Ci farebbe molto piacere conoscere la tua opinione!"
      },
      feel:["Curioso/a","Tranquillo/a","Preoccupato/a","Sopraffatto/a","Insicuro/a","Entusiasta","Ansioso/a"],
      understand:["Sì, capisco chiaramente il motivo.","Ho un’idea generale, ma non ne sono del tutto sicuro/a.","No, non capisco perché mi sia stata assegnata questa formazione."],
      help:["Sì, so dove trovare aiuto e chi contattare.","Ho un’idea generale, ma non ne sono del tutto sicuro/a.","No, non so dove trovare aiuto."],
      conf:["Per niente sicuro/a","Poco sicuro/a","Moderatamente sicuro/a","Molto sicuro/a","Completamente sicuro/a"],
      support:["Sì, sento di avere tutto il supporto necessario.","In generale sì, anche se avrei bisogno di maggiore supporto in alcune aree.","Non ne sono sicuro/a.","No, sento di aver bisogno di maggiore supporto."],
      dur:["Troppo breve","Adeguata","Troppo lunga"]
    },
    ru: {
      q: {
        start_feeling:"Какие чувства вы испытываете в связи с тем, что вам назначили это обучение?",
        understand_why:"Понимаете ли вы, почему вам назначили это обучение?",
        know_help:"Знаете ли вы, где найти помощь и к кому обратиться, если у вас возникнут вопросы или понадобится поддержка в улучшении посещаемости занятий?",
        confidence_before:"Насколько уверенно вы чувствуете себя перед началом обучения в том, что сможете улучшить посещаемость занятий в своих группах?",
        comment:"Хотите ли вы чем-нибудь поделиться или что-нибудь прокомментировать перед началом обучения?",
        final_feeling:"Какие чувства вы испытываете теперь, когда завершили обучение?",
        confidence_after:"Насколько уверенно вы чувствуете себя теперь, после завершения обучения, в том, что сможете улучшить посещаемость занятий?",
        kodland_support:"Считаете ли вы, что Kodland предоставляет вам необходимую поддержку для улучшения посещаемости занятий?",
        clarity:"Насколько понятным и удобным для восприятия было обучение?",
        duration:"Как бы вы оценили продолжительность обучения?",
        improve:"Хотели бы вы что-нибудь изменить в обучении или считаете, что мы могли бы что-то улучшить? Будем рады узнать ваше мнение!"
      },
      feel:["Любопытство","Спокойствие","Беспокойство","Подавленность","Неуверенность","Воодушевление","Тревога"],
      understand:["Да, я чётко понимаю причину.","В целом понимаю, но не до конца уверен(а).","Нет, я не понимаю, почему мне назначили это обучение."],
      help:["Да, я знаю, где найти помощь и к кому обратиться.","В целом понимаю, но не совсем уверен(а).","Нет, я не знаю, где найти помощь."],
      conf:["Совсем не уверен(а)","Немного уверен(а)","Умеренно уверен(а)","Очень уверен(а)","Полностью уверен(а)"],
      support:["Да, я чувствую, что получаю всю необходимую поддержку.","В целом да, но в некоторых вопросах мне потребовалась бы дополнительная поддержка.","Не уверен(а).","Нет, я чувствую, что мне нужна дополнительная поддержка."],
      dur:["Слишком короткое","Оптимальное","Слишком длинное"]
    },
    ar: {
      q: {
        start_feeling:"كيف تشعر حيال إسناد هذا التدريب إليك؟",
        understand_why:"هل تفهم سبب إسناد هذا التدريب إليك؟",
        know_help:"هل تعرف أين يمكنك العثور على المساعدة ومن يمكنك التواصل معه إذا كانت لديك أسئلة أو كنت بحاجة إلى دعم لتحسين نسبة حضور الطلاب؟",
        confidence_before:"قبل البدء، ما مدى ثقتك بقدرتك على تحسين نسبة حضور الطلاب في مجموعاتك؟",
        comment:"هل هناك أي شيء تود مشاركته أو التعليق عليه قبل بدء التدريب؟",
        final_feeling:"كيف تشعر الآن بعد إكمال التدريب؟",
        confidence_after:"بعد إكمال التدريب، ما مدى ثقتك بقدرتك على تحسين نسبة حضور الطلاب؟",
        kodland_support:"هل تشعر أن Kodland توفر لك الدعم الذي تحتاجه لتحسين نسبة حضور الطلاب؟",
        clarity:"ما مدى وضوح التدريب وسهولة متابعته؟",
        duration:"كيف تقيّم مدة التدريب؟",
        improve:"هل هناك أي شيء تود تغييره في التدريب أو تعتقد أنه يمكننا تحسينه؟ يسعدنا معرفة رأيك!"
      },
      feel:["فضولي","هادئ","قلق","مثقل بالمهام","غير واثق من نفسي","متحمس","متوتر"],
      understand:["نعم، أفهم السبب بوضوح.","لدي فكرة عامة، لكنني لست متأكدًا تمامًا.","لا، لا أفهم سبب إسناد هذا التدريب إليّ."],
      help:["نعم، أعرف أين أجد المساعدة ومع من أتواصل.","لدي فكرة عامة، لكنني لست متأكدًا تمامًا.","لا، لا أعرف أين يمكنني العثور على المساعدة."],
      conf:["غير واثق إطلاقًا","واثق بدرجة بسيطة","واثق بدرجة متوسطة","واثق جدًا","واثق تمامًا"],
      support:["نعم، أشعر أنني أحصل على كل الدعم الذي أحتاجه.","بشكل عام، نعم، لكنني أحتاج إلى مزيد من الدعم في بعض المجالات.","لست متأكدًا.","لا، أشعر أنني بحاجة إلى مزيد من الدعم."],
      dur:["قصيرة جدًا","مناسبة","طويلة جدًا"]
    },
    tr: {
      q: {
        start_feeling:"Bu eğitime atanmış olmak sana nasıl hissettiriyor?",
        understand_why:"Bu eğitime neden atandığını anlıyor musun?",
        know_help:"Devam oranını artırmak için soruların olduğunda veya desteğe ihtiyaç duyduğunda nereden yardım alacağını ve kiminle iletişime geçeceğini biliyor musun?",
        confidence_before:"Eğitime başlamadan önce, gruplarındaki öğrencilerin devam oranını artırma konusunda kendini ne kadar güvende hissediyorsun?",
        comment:"Eğitime başlamadan önce paylaşmak veya yorum yapmak istediğin bir şey var mı?",
        final_feeling:"Eğitimi tamamladıktan sonra şimdi kendini nasıl hissediyorsun?",
        confidence_after:"Eğitimi tamamladıktan sonra, öğrencilerin devam oranını artırma konusunda kendini ne kadar güvende hissediyorsun?",
        kodland_support:"Kodland’ın öğrencilerin devam oranını artırman için ihtiyaç duyduğun desteği sağladığını düşünüyor musun?",
        clarity:"Eğitimi ne kadar açık ve takip etmesi kolay buldun?",
        duration:"Eğitimin süresini nasıl değerlendirirsin?",
        improve:"Eğitimde değiştirmek istediğin veya geliştirebileceğimizi düşündüğün bir şey var mı? Görüşlerini duymaktan mutluluk duyarız!"
      },
      feel:["Meraklı","Sakin","Endişeli","Bunalmış","Kendine güvensiz","Heyecanlı","Kaygılı"],
      understand:["Evet, nedenini açıkça anlıyorum.","Genel olarak bir fikrim var ama tam olarak emin değilim.","Hayır, bu eğitime neden atandığımı anlamıyorum."],
      help:["Evet, nereden yardım alacağımı ve kiminle iletişime geçeceğimi biliyorum.","Genel olarak bir fikrim var ama tam olarak emin değilim.","Hayır, nereden yardım alacağımı bilmiyorum."],
      conf:["Hiç güvenmiyorum","Biraz güveniyorum","Orta düzeyde güveniyorum","Çok güveniyorum","Tamamen güveniyorum"],
      support:["Evet, ihtiyacım olan tüm desteği aldığımı hissediyorum.","Genel olarak evet, ancak bazı alanlarda daha fazla desteğe ihtiyacım var.","Emin değilim.","Hayır, daha fazla desteğe ihtiyacım olduğunu hissediyorum."],
      dur:["Çok kısa","Tam kararında","Çok uzun"]
    },
    id: {
      q: {
        start_feeling:"Bagaimana perasaan Anda setelah ditugaskan untuk mengikuti pelatihan ini?",
        understand_why:"Apakah Anda memahami alasan mengapa Anda ditugaskan untuk mengikuti pelatihan ini?",
        know_help:"Apakah Anda tahu di mana bisa mendapatkan bantuan dan siapa yang harus dihubungi jika memiliki pertanyaan atau membutuhkan dukungan untuk meningkatkan tingkat kehadiran siswa?",
        confidence_before:"Sebelum memulai pelatihan, seberapa percaya diri Anda dalam meningkatkan tingkat kehadiran siswa di grup Anda?",
        comment:"Apakah ada hal yang ingin Anda bagikan atau sampaikan sebelum memulai pelatihan?",
        final_feeling:"Bagaimana perasaan Anda sekarang setelah menyelesaikan pelatihan ini?",
        confidence_after:"Setelah menyelesaikan pelatihan ini, seberapa percaya diri Anda dalam meningkatkan tingkat kehadiran siswa?",
        kodland_support:"Apakah Anda merasa Kodland memberikan dukungan yang Anda butuhkan untuk meningkatkan tingkat kehadiran siswa?",
        clarity:"Seberapa jelas dan mudah diikuti pelatihan ini menurut Anda?",
        duration:"Bagaimana penilaian Anda terhadap durasi pelatihan ini?",
        improve:"Apakah ada hal yang ingin Anda ubah dari pelatihan ini atau menurut Anda masih bisa kami tingkatkan? Kami ingin mendengar pendapat Anda!"
      },
      feel:["Penasaran","Tenang","Khawatir","Kewalahan","Tidak percaya diri","Antusias","Cemas"],
      understand:["Ya, saya memahami alasannya dengan jelas.","Saya memiliki gambaran umum, tetapi belum sepenuhnya yakin.","Tidak, saya tidak memahami mengapa saya ditugaskan untuk mengikuti pelatihan ini."],
      help:["Ya, saya tahu di mana bisa mendapatkan bantuan dan siapa yang harus dihubungi.","Saya memiliki gambaran umum, tetapi belum sepenuhnya yakin.","Tidak, saya tidak tahu di mana bisa mendapatkan bantuan."],
      conf:["Sama sekali tidak percaya diri","Sedikit percaya diri","Cukup percaya diri","Sangat percaya diri","Sepenuhnya percaya diri"],
      support:["Ya, saya merasa mendapatkan semua dukungan yang saya butuhkan.","Secara umum, ya, tetapi saya membutuhkan lebih banyak dukungan di beberapa bidang.","Saya tidak yakin.","Tidak, saya merasa membutuhkan lebih banyak dukungan."],
      dur:["Terlalu singkat","Sudah sesuai","Terlalu lama"]
    },
    pl: {
      q: {
        start_feeling:"Jak się czujesz w związku z przydzieleniem Ci tego szkolenia?",
        understand_why:"Czy rozumiesz, dlaczego przydzielono Ci to szkolenie?",
        know_help:"Czy wiesz, gdzie szukać pomocy i z kim się skontaktować, jeśli masz pytania lub potrzebujesz wsparcia w poprawie frekwencji uczniów?",
        confidence_before:"Zanim rozpoczniesz szkolenie, na ile pewnie czujesz się w kwestii poprawy frekwencji uczniów w swoich grupach?",
        comment:"Czy jest coś, czym chcesz się podzielić lub co chciałbyś/chciałabyś skomentować przed rozpoczęciem szkolenia?",
        final_feeling:"Jak się teraz czujesz po ukończeniu szkolenia?",
        confidence_after:"Teraz, po ukończeniu szkolenia, na ile pewnie czujesz się w kwestii poprawy frekwencji uczniów?",
        kodland_support:"Czy uważasz, że Kodland zapewnia Ci wsparcie potrzebne do poprawy frekwencji uczniów?",
        clarity:"Na ile szkolenie było dla Ciebie jasne i łatwe do zrozumienia?",
        duration:"Jak oceniasz długość szkolenia?",
        improve:"Czy jest coś, co zmienił(a)byś w tym szkoleniu lub co Twoim zdaniem moglibyśmy ulepszyć? Chętnie poznamy Twoją opinię!"
      },
      feel:["Ciekawość","Spokój","Niepokój","Przytłoczenie","Brak pewności siebie","Ekscytacja","Lęk"],
      understand:["Tak, dokładnie rozumiem powód.","Mam ogólne pojęcie, ale nie mam całkowitej pewności.","Nie, nie rozumiem, dlaczego przydzielono mi to szkolenie."],
      help:["Tak, wiem, gdzie szukać pomocy i z kim się skontaktować.","Mam ogólne pojęcie, ale nie mam całkowitej pewności.","Nie, nie wiem, gdzie szukać pomocy."],
      conf:["Wcale niepewnie","Trochę pewnie","Umiarkowanie pewnie","Bardzo pewnie","Całkowicie pewnie"],
      support:["Tak, czuję, że otrzymuję całe potrzebne mi wsparcie.","Ogólnie tak, chociaż w niektórych obszarach potrzebuję większego wsparcia.","Nie mam pewności.","Nie, czuję, że potrzebuję większego wsparcia."],
      dur:["Zbyt krótkie","Odpowiednia długość","Zbyt długie"]
    }
  };

  /* ---------- helpers ---------- */
  // Safe storage (same pattern as the engine's STORE): memory + localStorage + sessionStorage, every access in try/catch.
  var MEM = {};
  function areas(){ var a = []; try { a.push(window.localStorage); } catch(e){} try { a.push(window.sessionStorage); } catch(e){} return a; }
  function store(k, v){
    var i, st, x, A = areas();
    if (v === undefined){
      for (i = 0; i < A.length; i++){ try { x = A[i].getItem(k); if (x !== null) return x; } catch(e){} }
      return Object.prototype.hasOwnProperty.call(MEM, k) ? MEM[k] : null;
    }
    v = String(v); MEM[k] = v;
    for (i = 0; i < A.length; i++){ st = A[i]; try { st.setItem(k, v); } catch(e){} }
  }
  function esc(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function each(list, fn){ Array.prototype.forEach.call(list, fn); }

  var css = '' +
  '.ksv-ov{position:fixed;inset:0;z-index:2147483000;background:rgba(17,17,17,.55);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;display:flex;justify-content:center;align-items:flex-start;padding:28px 16px}' +
  '.ksv{position:relative;width:100%;font-family:"Plus Jakarta Sans",system-ui,"Segoe UI",Arial,sans-serif;color:var(--ink,#111);background:var(--surface,#fff);border:2px solid var(--border,#D8F07A);border-radius:20px;box-shadow:0 10px 30px rgba(0,0,0,.12);padding:24px;text-align:start}' +
  '.ksv-ov .ksv{max-width:720px;margin:auto 0;box-shadow:0 10px 30px rgba(0,0,0,.18);animation:ksvin .35s ease}' +
  '.ksv-sec{margin:26px 0 18px}' +
  '.ksv *{box-sizing:border-box}' +
  '.ksv h2,.ksv h3{margin:0 0 6px;font-family:Nunito,"Plus Jakarta Sans",sans-serif;font-weight:900;letter-spacing:-.02em;font-size:23px;line-height:1.2}' +
  '.ksv-intro{margin:0;font-size:14.5px;line-height:1.6;color:var(--muted,#6B6F7D)}' +
  '.ksv-id{display:grid;grid-template-columns:1.4fr 1fr;gap:12px;margin:16px 0 6px}' +
  '.ksv-id label{display:block;font-size:13px;font-weight:800;margin-bottom:6px}' +
  '.ksv-id input,.ksv-id select,.ksv-open{width:100%;font:inherit;font-size:15px;padding:11px 13px;border-radius:12px;border:2px solid var(--border,#D8F07A);background:var(--surface2,#F7FDE6);color:inherit}' +
  '.ksv-id input:focus,.ksv-id select:focus,.ksv-open:focus{outline:none;border-color:#AEDD2E;box-shadow:0 0 0 3px rgba(196,240,70,.35)}' +
  '.ksv-open{min-height:80px;resize:vertical}' +
  '.ksv-q{border-top:1px solid #E7EFCF;padding:14px 0 6px}' +
  '.ksv-q.miss .ksv-qt{color:#E5484D}' +
  '.ksv-qt{margin:0 0 10px;font-weight:700;font-size:15.5px;line-height:1.45}' +
  '.ksv-qt::before{content:"\\2605  ";color:#5E7F07}' +
  '.ksv-q.opt .ksv-qt::before{content:""}' +
  '.ksv-qt em{font-style:normal;font-weight:600;color:var(--muted,#6B6F7D);font-size:13.5px}' +
  '.ksv-opts{display:flex;flex-wrap:wrap;gap:8px;align-items:center}' +
  '.ksv-opt{font:inherit;font-size:14.5px;font-weight:700;padding:9px 15px;border-radius:999px;border:2px solid var(--border,#D8F07A);background:var(--surface2,#F7FDE6);color:inherit;cursor:pointer;text-align:start;transition:transform .15s,border-color .15s,background .15s}' +
  '.ksv-opt:hover{border-color:#AEDD2E}' +
  '.ksv-opt.on{background:#C4F046;border-color:#AEDD2E;color:#111;transform:translateY(-1px)}' +
  '.ksv-list{flex-direction:column;align-items:stretch}.ksv-list .ksv-opt{border-radius:14px}' +
  '.ksv-scale .ksv-opt{width:46px;height:46px;padding:0;border-radius:14px;font-size:16px;text-align:center}' +
  '.ksv-scale small{font-size:12px;color:var(--muted,#6B6F7D);font-weight:700}' +
  '.ksv-foot{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:18px}' +
  '.ksv-send{font:inherit;font-weight:800;font-size:15px;border:0;border-radius:999px;padding:13px 24px;background:#111;color:#fff;cursor:pointer;transition:transform .15s,background .15s}' +
  '.ksv-send:hover{background:var(--pink,#F03D9E);transform:translateY(-1px)}' +
  '.ksv-send:disabled{background:#D5D8DE;color:#8C909C;cursor:default;transform:none}' +
  '.ksv-send.off,.ksv-send.off:hover{background:#D5D8DE;color:#8C909C;transform:none}' +
  '.ksv .bad{border-color:#E5484D!important}' +
  '.ksv-hint{display:block;margin-top:6px;font-size:12.5px;font-weight:700;color:var(--muted,#6B6F7D)}.ksv-q.miss .ksv-hint{color:#E5484D}' +
  '.ksv-msg{font-size:14.5px;font-weight:600}.ksv-msg.err{color:#E5484D}' +
  '.ksv-skip{margin-inline-start:auto;font-size:12.5px;font-weight:700;color:var(--muted,#6B6F7D);text-decoration:underline;background:none;border:0;cursor:pointer;font-family:inherit}' +
  '.ksv-done{border-radius:14px;padding:16px 18px;background:rgba(196,240,70,.22);border:2px solid #C4F046;font-size:16px;margin-top:10px}' +
  '.ksv-lock{margin:10px auto 0;text-align:center;font-weight:700;font-size:14px;color:#E5484D}' +
  '.ctabtn:disabled{opacity:.45;cursor:not-allowed;transform:none!important}' +
  '[dir="rtl"] .ksv input[type="email"]{direction:ltr;text-align:right}' +
  'html.ksv-lockpage,html.ksv-lockpage body{overflow:hidden!important}' +
  '@keyframes ksvin{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}' +
  '@media (max-width:700px){.ksv-ov{padding:12px 10px}.ksv{padding:18px}.ksv-id{grid-template-columns:1fr}.ksv h2,.ksv h3{font-size:20px}.ksv-scale .ksv-opt{width:42px;height:42px}}';

  /* ---------- shared form (used by both surveys) ---------- */
  function formHTML(X, defs, pre, dev){
    var S = X.s;
    var qs = defs.map(function(d){
      var id = d[0], type = d[1], key = d[2], optional = !!d[3], body;
      var text = X.q[id === 'feeling' ? (defs === START ? 'start_feeling' : 'final_feeling') : id];
      if (type === 'open') body = '<textarea class="ksv-open" placeholder="' + esc(S.openPlaceholder) + '"></textarea><small class="ksv-hint"></small>';
      else if (type === 'choice') body = '<div class="ksv-opts' + (key === 'feel' ? '' : ' ksv-list') + '">' + X[key].map(function(label, i){
          return '<button type="button" class="ksv-opt" data-v="' + esc(CODES[key][i]) + '">' + (key === 'feel' ? FEEL_ICONS[i] + ' ' : '') + esc(label) + '</button>'; }).join('') + '</div>';
      else if (type === 'lscale') body = '<div class="ksv-opts ksv-list">' + X.conf.map(function(label, i){
          return '<button type="button" class="ksv-opt" data-v="' + (i + 1) + '">' + (i + 1) + ' – ' + esc(label) + '</button>'; }).join('') + '</div>';
      else body = '<div class="ksv-opts ksv-scale"><small>' + esc(S.low) + '</small>' + [1,2,3,4,5].map(function(n){ return '<button type="button" class="ksv-opt" data-v="' + n + '">' + n + '</button>'; }).join('') + '<small>' + esc(S.high) + '</small></div>';
      return '<div class="ksv-q' + (optional ? ' opt' : '') + '" data-q="' + id + '" data-type="' + type + '"><p class="ksv-qt">' + esc(text) + (optional ? ' <em>(' + esc(S.optional) + ')</em>' : '') + '</p>' + body + '</div>';
    }).join('');
    return '<div class="ksv-body"><div class="ksv-id">' +
        '<div><label>' + esc(S.emailLabel) + '</label><input type="email" class="ksv-email" placeholder="' + esc(S.emailPlaceholder) + '" value="' + esc(pre.email) + '" autocomplete="email"></div>' +
        '<div><label>' + esc(S.regionLabel) + '</label><select class="ksv-region"><option value="">' + esc(S.regionPlaceholder) + '</option>' +
          X.regions.map(function(r){ return '<option value="' + esc(r[0]) + '"' + (r[0] === pre.region ? ' selected' : '') + '>' + esc(r[1]) + '</option>'; }).join('') + '</select></div>' +
      '</div>' + qs +
      '<div class="ksv-foot"><button type="button" class="ksv-send">' + esc(S.send) + '</button><span class="ksv-msg" aria-live="polite"></span></div></div>';
  }

  // Wires the options and the send button of a form. Every question is required; open answers need MIN_OPEN characters.
  // The send button stays grey until everything is valid; clicking it before that shows in red what is missing.
  function wire(box, X, onSend){
    var S = X.s, sendBtn = box.querySelector('.ksv-send'), msg = box.querySelector('.ksv-msg'), tried = false, busy = false;
    function check(){
      var emailEl = box.querySelector('.ksv-email'), regionEl = box.querySelector('.ksv-region');
      var email = emailEl.value.trim(), reg = regionEl.value, ok = EMAIL_RX.test(email) && !!reg, answers = {};
      emailEl.classList.toggle('bad', tried && !EMAIL_RX.test(email));
      regionEl.classList.toggle('bad', tried && !reg);
      each(box.querySelectorAll('.ksv-q'), function(q){
        var id = q.getAttribute('data-q'), good;
        if (q.getAttribute('data-type') === 'open'){
          var v = q.querySelector('textarea').value.trim(); good = v.length >= MIN_OPEN; answers[id] = v;
          q.querySelector('.ksv-hint').textContent = good ? '' : S.minChars + ' (' + v.length + '/' + MIN_OPEN + ')';
        } else { var on = q.querySelector('.ksv-opt.on'); good = !!on; if (on) answers[id] = on.getAttribute('data-v'); }
        q.classList.toggle('miss', tried && !good);
        if (!good) ok = false;
      });
      sendBtn.classList.toggle('off', !ok); sendBtn.setAttribute('aria-disabled', ok ? 'false' : 'true');
      if (ok && tried && !busy){ msg.className = 'ksv-msg'; msg.textContent = ''; }
      return ok ? { email:email, region:reg, answers:answers } : null;
    }
    box.addEventListener('input', check); box.addEventListener('change', check);
    box.addEventListener('click', function(e){
      var o = e.target.closest('.ksv-opt');
      if (o){ var q = o.closest('.ksv-q'); each(q.querySelectorAll('.ksv-opt'), function(b){ b.classList.toggle('on', b === o); }); check(); return; }
      if (!e.target.closest('.ksv-send') || busy) return;
      tried = true; var r = check();
      if (!r){
        var email = box.querySelector('.ksv-email').value.trim();
        msg.className = 'ksv-msg err'; msg.textContent = (email && !EMAIL_RX.test(email)) ? S.emailError : S.missing;
        var m = box.querySelector('.bad, .ksv-q.miss'); if (m && m.scrollIntoView) m.scrollIntoView({ block:'center', behavior:'smooth' });
        return;
      }
      busy = true; sendBtn.disabled = true; msg.className = 'ksv-msg'; msg.textContent = S.sending;
      try { localStorage.setItem('td_email', r.email); } catch(err){}
      onSend(r.email, r.region, r.answers);
    });
    check();
  }

  function post(payload, done){
    var called = false;
    function finish(){ if (!called){ called = true; done(); } }
    if (!SURVEY_URL){ console.warn('[Refunds survey] SURVEY_URL is empty: answers not sent', payload); finish(); return; }
    try {
      // text/plain avoids the CORS preflight that Apps Script doesn't answer; no-cors = fire and forget
      fetch(SURVEY_URL, { method:'POST', mode:'no-cors', headers:{ 'Content-Type':'text/plain;charset=utf-8' }, body:JSON.stringify(payload) }).then(finish, finish);
    } catch(err){ finish(); }
  }

  function init(){
    // Needs the Attendance engine (its globals). Anything else: do nothing.
    if (typeof MODULES === 'undefined' || !MODULES || !MODULES.length || typeof TRAINING_ID === 'undefined' || typeof openModule !== 'function' || typeof setResult !== 'function' || typeof renderHome !== 'function' || typeof isPassed !== 'function') return;
    var lang = (typeof LANG !== 'undefined' && LANG) || 'en';
    var X = T[lang] || T.en;
    var V = V2[lang] || V2.en; Object.keys(V).forEach(function(k){ X.s[k] = V[k]; });
    var A = ATT[lang] || ATT.en; Object.keys(A).forEach(function(k){ X[k] = A[k]; });   // Attendance questions
    var dev = false;   // no skip, not even with ?dev=1
    var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html?$/i, '') || 'index';
    var KEY_START = startKey(), KEY_FINAL = finalKey();
    TIME = loadTime();
    var base = { training:TRAINING_ID, training_name:TRAINING_NAMES[TRAINING_ID] || TRAINING_ID, page:page, lang:lang };

    var st = document.createElement('style'); st.id = 'ksv-style'; st.textContent = css; document.head.appendChild(st);

    function prefill(){
      var keys = [KEY_START, KEY_FINAL], i, s;
      for (i = 0; i < keys.length; i++){ try { s = JSON.parse(store(keys[i]) || 'null'); if (s && s.email) return { email:s.email, region:s.region || '' }; } catch(e){} }
      return { email:'', region:REGION_BY_PAGE[page] || REGION_BY_LANG[lang] || '' };
    }
    function payloadOf(survey, email, reg, answers){
      var p = { survey:survey, sent_at:new Date().toISOString(), training:base.training, training_name:base.training_name, page:base.page, lang:base.lang, email:email, region:reg };
      Object.keys(answers).forEach(function(k){ p[k] = answers[k]; });
      return p;
    }

    /* ----- blocking pop-up (used by both surveys) ----- */
    function popup(survey, title, intro, defs, thanks, onSent){
      if (document.querySelector('.ksv-ov')) return;
      var ov = document.createElement('div');
      ov.className = 'ksv-ov'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-modal','true'); ov.setAttribute('lang', lang);
      if (document.documentElement.dir === 'rtl') ov.setAttribute('dir','rtl');
      ov.innerHTML = '<div class="ksv"><h2>' + esc(title) + '</h2><p class="ksv-intro">' + esc(intro) + '</p>' + formHTML(X, defs, prefill(), dev) + '</div>';
      // Block the training behind: no scroll, no clicks, no keyboard focus
      var inerted = [];
      each(document.body.children, function(el){
        if (el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE' && !el.hasAttribute('inert')){ el.setAttribute('inert',''); el.setAttribute('aria-hidden','true'); inerted.push(el); }
      });
      document.documentElement.classList.add('ksv-lockpage');
      document.body.appendChild(ov);
      function close(){
        inerted.forEach(function(el){ el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); });
        document.documentElement.classList.remove('ksv-lockpage');
        if (ov.parentNode) ov.parentNode.removeChild(ov);
      }
      ov.addEventListener('keydown', function(e){ if (e.key === 'Escape') e.preventDefault(); });
      wire(ov, X, function(email, reg, answers){
        var p = payloadOf(survey, email, reg, answers);
        post(p, function(){
          onSent(p);
          ov.querySelector('.ksv-body').innerHTML = '<div class="ksv-done">' + thanks + '</div>';   // trusted HTML from the texts
          setTimeout(close, 1800);
        });
      });
    }

    /* ----- START SURVEY: when the training opens; the modules open only after it ----- */
    function startSurvey(){
      if (store(KEY_START)) return;
      popup('start', X.start.title, X.start.intro, START, X.s.thanks, function(p){ store(KEY_START, JSON.stringify(p)); });
    }
    /* ----- FINAL SURVEY: as soon as all the modules are passed; "completed" reaches the LMS only after it ----- */
    function allPassed(){ return MODULES.every(function(m){ return isPassed(m.id); }); }
    function finalSurvey(){
      if (!store(KEY_START) || store(KEY_FINAL) || !allPassed()) return;
      popup('final', X.final.title, X.final.intro, FINAL, X.s.thanks, function(p){
        store(KEY_FINAL, JSON.stringify(p));
        if (TIME.started_at && !TIME.finished_at && !devOn()){ TIME.finished_at = new Date().toISOString(); saveTime(); sendTime(); }
        if (typeof notifyMaterialCompleted === 'function') notifyMaterialCompleted();   // the engine now lets "completed" through
      });
    }

    var origSetResult = setResult;
    window.setResult = function(id, pct, passed){
      var isMod = MODULES.some(function(m){ return m.id === id; });
      var was = isPassed(id), r = origSetResult(id, pct, passed);
      if (isMod && !was && isPassed(id)) sendTime();
      return r;
    };
    var origOpen = openModule;
    window.openModule = function(m){
      if (!store(KEY_START)){ startSurvey(); return; }   // the modules open only after the start survey has been sent
      var first = !TIME.started_at && !devOn();
      if (first){ TIME.started_at = new Date().toISOString(); saveTime(); }
      origOpen(m);
      if (first) sendTime();   // creates the row
    };
    var origRender = renderHome;
    window.renderHome = function(){ var r = origRender.apply(this, arguments); setTimeout(finalSurvey, 0); return r; };

    startSurvey();
    finalSurvey();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

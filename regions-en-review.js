// Region-specific Module 6 content, for en_to_review.html only.
// Module 1 is NOT duplicated here — it's identical across regions and is read straight from MODULES[0] in content-en.js.
const RESTRICTION_CARD = {type:'warnbox',h:'⚠️ What You Must Never Do',b:'Never suggest to a family that the student take a break from the course. Never discuss pricing with parents — that\'s Sales\' job. Never offer a 1-to-1 lesson without approval. And never inform a family about a cancellation or postponement without your TL\'s permission first.'};
const RESTRICTION_CARD_BR = {type:'warnbox',h:'⚠️ What You Must Never Do',b:'Never offer a different course, group, or class time yourself — redirect the family to Customer Service instead. Never offer a 1-to-1 lesson without your TL\'s approval. And never offer an extra lesson on your own — when Customer Service decides a student needs one, the request reaches you through your TL or Team Lead Assistant, never directly from the family or from Customer Service.'};
const REASON_GROUPS_LIST = {type:'list',h:'The six reasons in BO',p:'Pick the closest one honestly — some expand into a more specific option once selected.',items:['🏥 <strong>Health issues</strong>','📚 <strong>Content issues</strong>','✈️ <strong>Vacation:</strong> traveling, school vacation, or holidays','💻 <strong>Technical issues:</strong> student\'s computer, the Kodland platform or Classroom, a power outage, or an internet connection problem','🗓️ <strong>Scheduling issues:</strong> moved to another group, or the lesson was rescheduled','📝 <strong>Other:</strong> school load / exams / homework, a family reason, or no specific reason shared (a comment is required)']};

const REGIONS = [

{key:'latam',label:'LatAm (Spanish)',flag:'🌎',emoji:'🌎',desc:'Tutor-driven: you follow up, you escalate, your TL approves the extra lesson directly. Maps to es.html.',
 m6:{emoji:'📞',title:'What to Do When a Student Misses Class',
  desc:'What you select in Back Office and when, how fast to act, what to do when they come back and when they don\'t, and the full escalation ladder — including how to request an extra lesson.',
  obj:'Know exactly what to select in Back Office and when, how fast to act with the student and the family, what to do when they come back and when they don\'t, and the full escalation ladder — including how to request an extra lesson.',
  sections:[
   {t:'🎯 What You Select, and When',cards:[
     {type:'text',b:'Before anything else: two clicks, and the whole metric depends on them. Module 1 explained what red and yellow mean. Here is exactly when you choose which.'},
     {type:'redyellow',left:{h:'🔴 Select RED when…',items:['The student did not appear and nobody told you why. That is the only case.','Red is not a harsher label for the same event — it means we do not know what happened, which is what makes it the most dangerous state a student can be in.','Nobody can help a student whose problem is invisible.']},right:{h:'🟡 Select YELLOW when…',items:['Someone told you a reason — before or after the lesson. Then pick which of the six reasons it was.','Those options are not paperwork: they are the only way we ever learn which absences we could have prevented from our side.','Five seconds from you, and a pattern we can act on.']}},
     REASON_GROUPS_LIST,
     {type:'yellowbox',h:'Marked red, and then the family answers? Change it.',b:'Change the absence to yellow and select the reason. That is not correcting a mistake — that is the process working: you reached out, you got an answer, and the record now matches reality.<br><br>It is also the fastest thing you can do for your own numbers. An unexplained absence that stays unexplained counts against you. The same absence, once you have spoken to the family and recorded why, does not.'},
     {type:'hi',h:'The comment goes on top of the selection, not instead of it.',b:'Write what the family actually told you. If the case later leaves you — because the family never answers, or because it escalates — the comment is what Customer Service and your TL read to know where things stand. A case with no comment arrives with them as a blank.'},
     {type:'warnbox',h:'And the line that protects all of it',b:'An absence you recorded honestly is never held against you. The only absence that hurts your numbers is the one nobody explained. If you ever find yourself wondering which colour makes you look better, the answer is: the true one — every time.'},
     {type:'simulation',title:'BO Simulation — Marking Attendance',src:'Simulacion_BO_Attendance_1.html'},
   ]},
   {t:'🔁 Follow Up',cards:[
     {type:'list',items:['Ask the parent or guardian how the student is doing, and mention that they were missed in class.','Share the class recording along with a short recap of the homework, so the student doesn\'t fall behind or lose motivation.','The next time the student attends, show them you noticed their absence — ask how they\'re doing and remind them where to find the recording and the homework.']},
   ]},
   {t:'⏱️ Timing: Don\'t Wait for the Third Absence',cards:[
     {type:'text',b:'Module 1 introduced 🟡 yellow and 🔴 red absences. How fast you act — and what becomes possible — changes with the count. And note the asymmetry: a red absence needs you on day one, while a yellow one gives you a little more room.'},
     {type:'table',h:'What changes as absences add up',head:['Count','What you do','By when'],rows:[
       ['One red absence','Contact the family, get the reason, then change the absence to yellow and select it. This is the single highest-value action in the whole module.','Same day. Never leave a red unexplained beyond 48 hours.'],
       ['One yellow absence','Share the recording and a short homework recap so they don\'t fall behind. Nothing to escalate.','Before the next lesson'],
       ['Two in a row','Don\'t wait for the third. This is the tipping point, and it is also the point where an extra lesson becomes possible (see the escalation section below).','Within 48 hours of the second'],
       ['Three or more, or any red nobody ever answered','Escalate through Student\'s Evaluation in BO and tell your TL. This is no longer a private follow-up between you and the family.','Now'],
     ]},
     {type:'warn',txt:'"Tell someone — don\'t wait for the third." Two lessons in a row is exactly the point where a drifting student can still be brought back, and you\'re usually the only person who sees it early.'},
   ]},
   {t:'👨‍👩‍👧 Talking With Parents',cards:[
     {type:'imgtext',img:'Images/WhatsApp_module_6_ENG.png',items:['Be kind and understanding, especially if the absence was due to illness or a family issue.','If there\'s extra material available in the course, let them know.','When the student does attend, use the moment to share their achievements in class with the parents.','Warmth costs nothing and it is the whole difference between a family that stays engaged with the course and one that quietly stops replying.']},
   ]},
   {t:'📋 What to Log in Back Office',cards:[
     {type:'list',h:'Now a short checklist — the mechanism itself is in the first section above',items:['Set the absence type and the reason. Yellow plus the matching reason from the six groups if you were told why; red if nobody told you anything.','Add a comment with what the family actually said. Short is fine. This is what your TL and Customer Service read if the case leaves you.','If the family never answers and it stays red, Customer Service picks it up — but only your comment tells them what has already been tried, so a case with no comment costs them a call you already made.']},
   ]},
   {t:'🔀 And Then? Two Ways This Goes',cards:[
     {type:'text',b:'You have contacted the family and recorded the absence. From here the situation goes one of two ways, and they need different things from you.'},
     {type:'table',h:'They come back vs. they don\'t',head:['','✅ They come back','❌ They don\'t'],rows:[
       ['<span class="rowic">⚡</span>Straight away','Show them you noticed they were gone — warmly, and privately, not in front of the group. A student who returns to silence learns that their absence didn\'t matter.','Second contact to the family within 48 hours, on a different channel from the first. One unanswered message is not an unreachable family.'],
       ['<span class="rowic">➡️</span>Then','Watch their presence, not just their attendance. If they turn up but stay at 40% in the room, the problem has moved inside the lesson — that is Modules 2 to 4, not this one.','Open Student\'s Evaluation in BO and message your TL. The case leaves the private follow-up here — that is the point of escalating, not a failure on your part.'],
       ['<span class="rowic">🧑‍🤝‍🧑</span>Who else you involve','Your TL, if the student has fallen behind enough to need an extra lesson (see the next section).','Your TL and Customer Service. CS takes over the contact attempts; your BO comment is what tells them what you have already tried, so write it before you hand over.'],
       ['<span class="rowic">👨‍👩‍👧</span>The parents','Share one concrete thing the student did in the lesson they came back to. A specific win beats "they did well" and it reinforces the turnaround for the family too.','Keep them informed, and promise nothing. No extra lesson is offered before your TL approves it — "let me check on that" is a complete answer.'],
     ]},
     {type:'redbox',h:'They came back, but they\'re still not really there.',b:'This is the most common outcome of all, and it is easy to file as solved because attendance recovered. It isn\'t solved: the student is now in the room and disengaged, which is a facilitation problem, not an absence problem. Their Classroom Presence will show it before you do.<br><br>That case belongs to Modules 2, 3 and 4 — how you open, who you call on, how you close.'},
   ]},
   {t:'🪜 If It Escalates: Requesting an Extra Lesson',cards:[
     {type:'text',b:'<strong>Contacting your TL first is correct</strong> — here is the complete path:'},
     {type:'flow',steps:[
       {ic:'💬',h:'1 · Inform your TL',b:'Mention that you\'re about to request an extra lesson for this student before you submit it — still the right thing to do, even though it\'s no longer a formal step the system requires.',color:'red'},
       {ic:'📋',h:'2 · Open it from the student\'s profile',b:'Go to the student\'s profile → <strong>Extra Lessons</strong> tab → "Add Lesson". Choose the Reason, the Lesson Objective, the Group, the Lesson, the Duration (60 minutes is typical) and a preliminary date and time, and write an honest Justification. Then "Submit for Review".',color:'blue'},
       {ic:'✅',h:'3 · Your TL approves it',b:'The request goes automatically to your Team Lead, who approves (or rejects) it and assigns the final date and time.',color:'green'},
       {ic:'🗓️',h:'4 · It appears in your Schedule',b:'Once approved, the extra lesson appears directly in your Schedule, just like any other scheduled lesson — you get a notification.',color:'orange'},
     ]},
     {type:'warnbox',h:'⚠️ If you started it, it stays with you',b:'If <strong>you</strong> initiated the case, do not redirect the student to Customer Service afterward — responsibility for seeing it through stays with you.'},

     {type:'text',h:'🖥️ Try It Yourself',b:'Time to practice how you\'d handle this in BO with a real case:'},
     {type:'simulation',title:'BO Simulation — Requesting an Extra Lesson',src:'Simulacion_BO_Attendance_2.html'},
   ]},
   {t:'🕳️ The Student Who Never Showed Up At All',cards:[
     {type:'hi',h:'This isn\'t a "missed class" — it\'s a different problem',b:'Some students never connect to a single lesson from day one. There\'s no "welcome back" for them — your first outreach <em>is</em> the first contact they\'ll have with you. Treat a no-show on lesson one as an immediate red flag, not something to wait out.'},
     {type:'text',b:'Mark it red — nobody told you anything — and follow the same 48-hour rule. A no-show on lesson one is the earliest and easiest save there is.'},
   ]},
  ]},
 quiz6:QUIZ[6],
},

{key:'brazil',label:'Brazil (Portuguese)',flag:'🇧🇷',emoji:'🎈',desc:'Tutor-driven, like LatAm — but the escalation trigger is two absences, not one, and there\'s an explicit "never do" list. Maps to pt.html.',
 m6:{emoji:'📞',title:'What to Do When a Student Misses Class',
  desc:'What you select in Back Office and when, how fast to act, the two-absence escalation trigger, and what you can never offer a family without your TL.',
  obj:'Know exactly what to select in Back Office and when, how fast to act with the student and the family, when two absences means it\'s time to escalate, and what\'s off-limits without your TL\'s approval.',
  sections:[
   {t:'🎯 What You Select, and When',cards:[
     {type:'text',b:'Before anything else: two clicks, and the whole metric depends on them. Module 1 explained what red and yellow mean. Here is exactly when you choose which.'},
     {type:'redyellow',left:{h:'🔴 Select RED when…',items:['The student did not appear and nobody told you why. That is the only case.','Classroom marks this automatically the moment a lesson goes unattended.','Nobody can help a student whose problem is invisible.']},right:{h:'🟡 Select YELLOW when…',items:['Someone told you a reason — before or after the lesson. You then change it from red to yellow yourself and pick which of the six reasons it was.','Those options are not paperwork: they are the only way we ever learn which absences we could have prevented from our side.','Five seconds from you, and a pattern we can act on.']}},
     REASON_GROUPS_LIST,
     {type:'yellowbox',h:'Marked red, and then the family answers? Change it.',b:'Change the absence to yellow and select the reason. That is not correcting a mistake — that is the process working: you reached out, you got an answer, and the record now matches reality.'},
     {type:'hi',h:'The comment goes on top of the selection, not instead of it.',b:'Write what the family actually told you. If the case later leaves you, the comment is what Customer Service and your TL read to know where things stand.'},
     {type:'warnbox',h:'And the line that protects all of it',b:'An absence you recorded honestly is never held against you. The only absence that hurts your numbers is the one nobody explained.'},
     {type:'simulation',title:'BO Simulation — Marking Attendance',src:'Simulacion_BO_Attendance_1.html'},
   ]},
   {t:'🔁 Follow Up',cards:[
     {type:'list',items:['Contact the family yourself, as soon as possible, after any unannounced absence — this is on you, not Customer Service, at least at first.','Share the class recording along with a short recap of the homework, so the student doesn\'t fall behind or lose motivation.','The next time the student attends, show them you noticed their absence.']},
   ]},
   {t:'⏱️ Timing: When to Escalate',cards:[
     {type:'text',b:'Module 1 introduced 🟡 yellow and 🔴 red absences. You escalate when <strong>either</strong> of these happens: two yellow absences, or one red absence the family never answers.'},
     {type:'table',h:'What changes as absences add up',head:['Count','What you do','By when'],rows:[
       ['One red absence','Contact the family yourself, get the reason, then change the absence to yellow and select it. If the family doesn\'t answer, that\'s the trigger — escalate now.','Same day. Never leave a red unexplained beyond 48 hours.'],
       ['One yellow absence','Share the recording and a short homework recap so they don\'t fall behind. Nothing to escalate yet.','Before the next lesson'],
       ['Two yellow absences','This is also the trigger — escalate now through Student\'s Evaluation, so Customer Service can check in with the family directly.','Now'],
     ]},
     {type:'tip',txt:'The trigger is: two yellow absences, or one red with no reply. As soon as either happens, that\'s the moment to hand it to Customer Service.'},
     {type:'warn',txt:'"Tell someone — don\'t wait for the third." This point is exactly where a drifting student can still be brought back, and you\'re usually the only person who sees it early.'},
   ]},
   {t:'👨‍👩‍👧 Talking With Parents',cards:[
     {type:'imgtext',img:'Images/WhatsApp_module_6_ENG.png',items:['Be kind and understanding, especially if the absence was due to illness or a family issue.','If there\'s extra material available in the course, let them know.','When the student does attend, use the moment to share their achievements in class with the parents.','Warmth costs nothing and it is the whole difference between a family that stays engaged with the course and one that quietly stops replying.']},
     RESTRICTION_CARD_BR,
   ]},
   {t:'📋 What to Log in Back Office',cards:[
     {type:'list',h:'Now a short checklist — the mechanism itself is in the first section above',items:['Set the absence type and the reason. Yellow plus the matching reason from the six groups if you were told why; red if nobody told you anything.','Add a comment with what the family actually said. Short is fine. This is what your TL and Customer Service read if the case leaves you.']},
   ]},
   {t:'🔀 And Then? Two Ways This Goes',cards:[
     {type:'text',b:'You have contacted the family and recorded the absence. From here the situation goes one of two ways, and they need different things from you.'},
     {type:'table',h:'They come back vs. they don\'t',head:['','✅ They come back','❌ They don\'t'],rows:[
       ['<span class="rowic">⚡</span>Straight away','Show them you noticed they were gone — warmly, and privately, not in front of the group.','Second contact to the family, on a different channel from the first, before the second absence.'],
       ['<span class="rowic">➡️</span>Then','Watch their presence, not just their attendance. If they turn up but stay at 40% in the room, that\'s Modules 2 to 4, not this one.','Open Student\'s Evaluation in BO after the second absence. The case leaves the private follow-up here.'],
       ['<span class="rowic">🧑‍🤝‍🧑</span>Who else you involve','Your TL, if the student has fallen behind enough to need an extra lesson.','Your TL, and Customer Service, who checks in with the family directly once you\'ve escalated.'],
       ['<span class="rowic">👨‍👩‍👧</span>The parents','Share one concrete thing the student did in the lesson they came back to.','Keep them informed of the course\'s progress: share recordings, mention interesting parts coming up in the next lessons, or something from the course they mentioned liking before. Start with warmth — something like "I hope [name] is doing well, we missed them." But promise nothing — no extra lesson without your TL, and no course, group, or schedule change without redirecting to Customer Service.'],
     ]},
     {type:'redbox',h:'They came back, but they\'re still not really there.',b:'This is the most common outcome of all, and it is easy to file as solved because attendance recovered. It isn\'t solved: the student is now in the room and disengaged, which is a facilitation problem, not an absence problem.<br><br>That case belongs to Modules 2, 3 and 4 — how you open, who you call on, how you close.'},
   ]},
   {t:'🪜 If It Escalates: Requesting an Extra Lesson',cards:[
     {type:'text',b:'<strong>Contacting your TL first is correct</strong> — here is the complete path:'},
     {type:'flow',steps:[
       {ic:'💬',h:'1 · Inform your TL',b:'Mention that you\'re about to request an extra lesson for this student before you submit it — still the right thing to do, even though it\'s no longer a formal step the system requires.',color:'red'},
       {ic:'📋',h:'2 · Open it from the student\'s profile',b:'Go to the student\'s profile → <strong>Extra Lessons</strong> tab → "Add Lesson". Choose the Reason, the Lesson Objective, the Group, the Lesson, the Duration (60 minutes — 40 minutes for the Funtech course) and a preliminary date and time, and write an honest Justification. Then "Submit for Review".',color:'blue'},
       {ic:'✅',h:'3 · Your TL approves it',b:'The request goes automatically to your Team Lead, who approves (or rejects) it and assigns the final date and time.',color:'green'},
       {ic:'🗓️',h:'4 · It appears in your Schedule',b:'Once approved, the extra lesson appears directly in your Schedule, just like any other scheduled lesson — you get a notification.',color:'orange'},
     ]},
     {type:'warnbox',h:'⚠️ If you started it, it stays with you',b:'If <strong>you</strong> initiated the case, do not redirect the student to Customer Service afterward — responsibility for seeing it through stays with you.'},
     {type:'text',h:'🖥️ Try It Yourself',b:'Time to practice how you\'d handle this in BO with a real case:'},
     {type:'simulation',title:'BO Simulation — Requesting an Extra Lesson',src:'Simulacion_BO_Attendance_2.html'},
   ]},
   {t:'🕳️ The Student Who Never Showed Up At All',cards:[
     {type:'hi',h:'This isn\'t a "missed class" — it\'s a different problem',b:'Some students never connect to a single lesson from day one. There\'s no "welcome back" for them — treat a no-show on lesson one as an immediate red flag, not something to wait out.'},
     {type:'text',b:'Customer Service is responsible for solving this case — but you should still notice it and escalate it as soon as possible. Follow the same 48-hour rule for marking it accurately.'},
   ]},
  ]},
 quiz6:[
  {q:'A student has now had two yellow absences. What\'s the best next step?',opts:['Wait for a third absence before doing anything else, since two absences alone doesn\'t confirm a pattern.','Report it now through Student\'s Evaluation — two yellow absences is one of Brazil\'s escalation triggers, don\'t wait for a third.','Stop reaching out and let Customer Service take over the case without any input from you.'],c:1,fb:'Two yellow absences is one of Brazil\'s escalation triggers (the other is a single unanswered red) — don\'t wait for the third. That\'s exactly when the case should move from a private follow-up into Student\'s Evaluation.'},
  {q:'A student missed class due to illness. How does the tutor talk to the parent?',opts:['Keep the conversation brief and neutral, avoiding personal questions about the illness so as not to intrude on the family\'s situation.','Express genuine concern for how the student is doing, mention any extra material available, and use their return to share something positive.','Focus mainly on catching the student up academically, since reassurance about the illness isn\'t really part of the tutor\'s role.'],c:1,fb:'Genuine warmth, practical help, and a positive note on their return covers the empathy this module asks for — staying neutral or purely academic misses it.'},
  {q:'A student who missed two classes returns and does great work today. How does the tutor use this with the parents?',opts:['Wait until the next scheduled check-in to mention it, to avoid contacting the family too many times in a short period.','Reach out around this class to share the specific achievement, reinforcing the positive turnaround for both student and parent.','Mention it briefly to the student only, since parents are usually more interested in attendance patterns than daily achievements.'],c:1,fb:'Sharing the achievement while it\'s fresh reinforces the turnaround for both student and parent — waiting or keeping it from the parent wastes the moment.'},
  {q:'Which of the following is NOT something a tutor should do?',opts:['Redirect a family asking about switching courses, groups, or schedule to Customer Service','Offer a 1-to-1 lesson directly to a family, without asking your TL first','Follow up with the family the same day after an unannounced absence'],c:1,fb:'Offering a 1-to-1 lesson (or an extra lesson) requires your TL\'s approval first — and a request to switch course, group, or schedule goes to Customer Service instead of being handled by you directly.'},
  {q:'A student missed Tuesday\'s lesson with no warning, so you marked it red. On Thursday the parent replies that the student had flu. What do you do?',opts:['Leave it red — it was unannounced at the time, and changing it afterwards would misrepresent what happened','Change the absence to yellow, select "Health issues", and add a comment with what the parent said','Add a comment with what the parent said and leave the absence type as it is'],c:1,fb:'Red means "we don\'t know why". Once you know, the record should say so: change the type, select the reason, and comment. A comment on its own leaves the absence red.'},
  {q:'A student never attended a single lesson from day one. Whose case is this?',opts:['Entirely Customer Service\'s — the tutor has nothing to do here','Customer Service is responsible for solving it, but the tutor should notice and escalate it as soon as possible','The tutor\'s alone, since Customer Service only handles active students'],c:1,fb:'CS owns solving this case, but you\'re usually the first person who can even notice it\'s happening — escalate it as soon as you see it.'},
 ],
},

{key:'cis',label:'CIS (Russian)',flag:'🇷🇺',emoji:'📨',desc:'Customer Service contacts the family after the very first lesson; you flag it, your TL approves the extra lesson directly in BO. Maps to ru.html.',
 quiz1Q5:{q:'In Back Office, what turns a red (unexcused) absence into a yellow one?',opts:['Once the reason becomes known, changing the absence to yellow and selecting that reason','72 hours passing without any action','Leaving a comment in Back Office, without changing the absence type'],c:0,fb:'What turns a red absence yellow is changing the type and picking the reason once it\'s known — whether you found out directly or Customer Service passed it along. A comment on its own, without changing the type, leaves it red.'},
 m6:{emoji:'📞',title:'What to Do When a Student Misses Class',
  desc:'Marking the absence accurately, the one exception where you contact the family yourself, and how the extra-lesson approval works.',
  obj:'Know exactly what to select in Back Office and when, when you personally contact a family versus when Customer Service does, and how the extra-lesson approval works.',
  sections:[
   {t:'🎯 What You Select, and When',cards:[
     {type:'text',b:'Before anything else: two clicks, and the whole metric depends on them. Module 1 explained what red and yellow mean. Here is exactly when you choose which.'},
     {type:'redyellow',left:{h:'🔴 Select RED when…',items:['The student did not appear and nobody told you why. That is the only case.','Red is not a harsher label for the same event — it means we do not know what happened, which is what makes it the most dangerous state a student can be in.','Nobody can help a student whose problem is invisible.']},right:{h:'🟡 Select YELLOW when…',items:['Someone told you a reason — before or after the lesson. Then pick which of the six reasons it was.','Those options are not paperwork: they are the only way we ever learn which absences we could have prevented from our side.','Five seconds from you, and a pattern we can act on.']}},
     REASON_GROUPS_LIST,
     {type:'yellowbox',h:'Marked red, and then the family answers? Change it.',b:'Change the absence to yellow and select the reason. That is not correcting a mistake — that is the process working: the record now matches reality.<br><br>It is also the fastest thing you can do for your own numbers. An unexplained absence that stays unexplained counts against you.'},
     {type:'hi',h:'The comment goes on top of the selection, not instead of it.',b:'Write what you know. If the case later escalates, the comment is what Customer Service and your TL read to know where things stand.'},
     {type:'hi',h:'Who contacts the family',b:'In most cases, once you\'ve selected the type, the reason, and left your comment, <strong>Customer Service takes it from there</strong> — they\'re the ones who reach out to the family. The one exception is your student\'s very first lesson ever, <strong>Module 1, Lesson 1</strong>. If a student misses that specific lesson, you contact the parent yourself, immediately — a first no-show needs a human response before any process kicks in.'},
     {type:'warnbox',h:'And the line that protects all of it',b:'An absence you recorded honestly is never held against you. The only absence that hurts your numbers is the one nobody explained. If you ever find yourself wondering which colour makes you look better, the answer is: the true one — every time.'},
     {type:'simulation',title:'BO Simulation — Marking Attendance',src:'Simulacion_BO_Attendance_1.html'},
   ]},
   {t:'🔁 Follow Up',cards:[
     {type:'list',items:['For Module 1, Lesson 1 specifically: reach out to the parent yourself, the same day.','For every other lesson, you don\'t need to personally chase the family — Customer Service already has it.','What\'s still important either way: reaching out to the student who missed class. You can do this by sending them a message letting them know you noticed they were absent and asking if they\'re okay. Additionally, you can share the recording or remind them that they can find it on the platform, and let them know about the homework assignment. The goal is to connect with our students.']},
   ]},
   {t:'⏱️ Timing: Don\'t Wait for the Third Absence',cards:[
     {type:'text',b:'Module 1 introduced 🟡 yellow and 🔴 red absences. How fast you act — and what becomes possible — changes with the count.'},
     {type:'table',h:'What changes as absences add up',head:['Count','What you do','By when'],rows:[
       ['One red absence (not M1L1)','Set the type and reason accurately — Customer Service will handle the contact.','Same day. Never leave a red unexplained beyond 48 hours.'],
       ['One yellow absence','Share the recording and a short homework recap so they don\'t fall behind. Nothing to escalate.','Before the next lesson'],
       ['Two absences within a 4-week window','Flag it through Student\'s Evaluation in BO — Customer Service takes it from there.','Within 48 hours of the second'],
       ['Three or more, or any red nobody ever answered','Escalate through Student\'s Evaluation in BO — Customer Service takes over the case from there.','Now'],
     ]},
     {type:'warn',txt:'"Tell someone — don\'t wait for the third." Two absences in the same 4-week window is exactly the point where a drifting student can still be brought back, and you\'re usually the only person who sees it early.'},
   ]},
   {t:'👨‍👩‍👧 Talking With Parents',cards:[
     {type:'imgtext',img:'Images/WhatsApp_module_6_ENG.png',items:['This mainly applies to Module 1, Lesson 1, or to conversations the family starts on their own — be kind and understanding, especially if the absence was due to illness or a family issue.','If there\'s extra material available in the course, let them know.','When the student does attend, use the moment to share their achievements in class with the parents.','Warmth costs nothing and it is the whole difference between a family that stays engaged with the course and one that quietly stops replying.']},
   ]},
   {t:'📋 What to Log in Back Office',cards:[
     {type:'list',h:'Now a short checklist — the mechanism itself is in the first section above',items:['Set the absence type and the reason. Yellow plus the matching reason from the six groups if you were told why; red if nobody told you anything.','Add a comment with what you know. Short is fine. This is what your TL and Customer Service read.','If it stays red, Customer Service picks it up — but only your comment tells them what has already been tried.']},
   ]},
   {t:'🔀 And Then? Two Ways This Goes',cards:[
     {type:'text',b:'You have recorded the absence. From here the situation goes one of two ways, and they need different things from you.'},
     {type:'table',h:'They come back vs. they don\'t',head:['','✅ They come back','❌ They don\'t'],rows:[
       ['<span class="rowic">⚡</span>Straight away','Show them you noticed they were gone — warmly, and privately, not in front of the group.','Customer Service makes the second contact attempt — not you, unless this was Module 1, Lesson 1.'],
       ['<span class="rowic">➡️</span>Then','Watch their presence, not just their attendance. If they turn up but stay at 40% in the room, that\'s Modules 2 to 4, not this one.','Open Student\'s Evaluation in BO. The case leaves the private follow-up here.'],
       ['<span class="rowic">🧑‍🤝‍🧑</span>Who else you involve','Your TL, if the student has fallen behind enough to need an extra lesson.','Your TL, who approves directly in BO — and, for a student who never attended at all, your Client Manager rather than your TL.'],
       ['<span class="rowic">👨‍👩‍👧</span>The parents','Share one concrete thing the student did in the lesson they came back to.','No extra lesson is promised before your TL approves it in BO.'],
     ]},
     {type:'redbox',h:'They came back, but they\'re still not really there.',b:'This is the most common outcome of all, and it is easy to file as solved because attendance recovered. It isn\'t solved: the student is now in the room and disengaged, which is a facilitation problem, not an absence problem.<br><br>That case belongs to Modules 2, 3 and 4 — how you open, who you call on, how you close.'},
   ]},
   {t:'🪜 If It Escalates: Requesting an Extra Lesson',cards:[
     {type:'text',b:'You don\'t create the request yourself — your part ends at leaving a Student\'s Evaluation. From there, it\'s your TL\'s call.'},
     {type:'flow',steps:[
       {ic:'📋',h:'1 · Leave a Student\'s Evaluation',b:'In BO, select "An additional class is needed" and explain why you think the student needs help catching up.',color:'blue'},
       {ic:'✅',h:'2 · Your TL decides',b:'Your TL reviews the evaluation and decides whether the extra lesson can be offered to this student.',color:'red'},
       {ic:'🔀',h:'3 · Two possible paths',b:'If yes, there are two options: your TL either creates the extra-lesson request themselves right away, or sends it to Customer Service, who contacts the parent, discusses the situation, and offers the lesson — only creating the request once the parent is on board.',color:'green'},
       {ic:'🗓️',h:'4 · It appears in the schedule',b:'Once the request is created and approved, the extra lesson shows up in the tutor\'s schedule, just like any other scheduled lesson.',color:'purple'},
     ]},
     {type:'text',h:'🖥️ Try It Yourself',b:'Time to practice how you\'d handle this in BO with a real case:'},
     {type:'simulation',title:'BO Simulation — Requesting an Extra Lesson',src:'Simulacion_BO_Attendance_2_RU.html'},
   ]},
   {t:'🕳️ The Student Who Never Showed Up At All',cards:[
     {type:'hi',h:'This isn\'t a "missed class" — it\'s a different problem',b:'Some students never connect to a single lesson from day one. Treat a no-show on lesson one as an immediate red flag, not something to wait out — this is exactly the Module 1, Lesson 1 case, so you personally reach out the same day.'},
     {type:'text',b:'Once you\'ve flagged it, this case is handled by your <strong>Client Manager</strong> — not your TL. Follow the same 48-hour rule either way.'},
   ]},
  ]},
 quiz6:[
  {q:'Who contacts the family after a missed lesson, in most cases?',opts:['You do, personally, every time','Customer Service does, once you\'ve logged the type and reason','Nobody — the system handles it without any human contact'],c:1,fb:'Once you\'ve marked the absence, CS takes over contacting the family. The one exception is the student\'s very first lesson ever (Module 1, Lesson 1).'},
  {q:'Which of these best describes your role after a routine (non-M1L1) unexplained absence?',opts:['You personally call the family before the end of the day','You mark the absence accurately in Back Office; Customer Service makes the contact','You wait for the student to come back and ask them what happened'],c:1,fb:'Outside of Module 1, Lesson 1, your part is the accurate record — Customer Service is the one who reaches out to the family.'},
  {q:'A brand-new student misses their very first lesson (Module 1, Lesson 1). What do you do?',opts:['Mark it and wait for Customer Service to contact the family, same as any other lesson','Contact the parent yourself, the same day — this is the one case where you reach out personally','Escalate immediately through Student\'s Evaluation without contacting anyone'],c:1,fb:'M1L1 is the one exception: you personally reach out on day one. Every other lesson, Customer Service owns the outreach.'},
  {q:'A student who missed two classes returns and does great work today. How does the tutor use this with the parents?',opts:['Wait until the next scheduled check-in to mention it, to avoid contacting the family too many times in a short period.','Reach out around this class to share the specific achievement, reinforcing the positive turnaround for both student and parent.','Mention it briefly to the student only, since parents are usually more interested in attendance patterns than daily achievements.'],c:1,fb:'Sharing the achievement while it\'s fresh reinforces the turnaround for both student and parent — waiting or keeping it from the parent wastes the moment.'},
  {q:'A student missed Tuesday\'s lesson with no warning, so you marked it red. On Thursday you learn the student had flu. What do you do?',opts:['Leave it red — it was unannounced at the time, and changing it afterwards would misrepresent what happened','Change the absence to yellow, select "Health issues", and add a comment with what you learned','Add a comment with what you learned and leave the absence type as it is'],c:1,fb:'Red means "we don\'t know why". Once you know, change the type, select the reason, and comment. A comment on its own leaves the absence red.'},
 ],
},

{key:'eu',label:'EU (Italian & Polish)',flag:'🇮🇹-🇵🇱',emoji:'🏫',desc:'Customer Service owns escalation from Module 1; extra-lesson requests go through the Teaching Department. You still practice marking attendance and reading Customer Service\'s notes. Maps to it.html, pl.html.',
 quiz1Q5:{q:'In Back Office, what turns a red (unexcused) absence into a yellow one?',opts:['Once the reason becomes known, changing the absence to yellow and selecting that reason','72 hours passing without any action','Leaving a comment in Back Office, without changing the absence type'],c:0,fb:'What turns a red absence yellow is changing the type and picking the reason once it\'s known — whether you found out directly or Customer Service passed it along. A comment on its own, without changing the type, leaves it red.'},
 m6:{emoji:'📞',title:'What to Do When a Student Misses Class',
  desc:'What you select in Back Office, the automated messages that run alongside your own follow-up, the escalation timeline, and what you can never say to a family.',
  obj:'Know exactly what to select in Back Office and when, understand how CS and the Teaching Department take over escalation and extra lessons, and know the boundaries you must never cross with a family.',
  sections:[
   {t:'🎯 What You Select, and When',cards:[
     {type:'text',b:'Before anything else: two clicks, and the whole metric depends on them. Module 1 explained what red and yellow mean. Here is exactly when you choose which.'},
     {type:'redyellow',left:{h:'🔴 Select RED when…',items:['The student did not appear and nobody told you why. That is the only case.','Red is not a harsher label for the same event — it means we do not know what happened, which is what makes it the most dangerous state a student can be in.','Nobody can help a student whose problem is invisible.']},right:{h:'🟡 Select YELLOW when…',items:['Someone told you a reason — before or after the lesson. Then pick which of the six reasons it was.','Those options are not paperwork: they are the only way we ever learn which absences we could have prevented from our side.','Five seconds from you, and a pattern we can act on.']}},
     REASON_GROUPS_LIST,
     {type:'yellowbox',h:'Once you know the reason, change it.',b:'Change the absence to yellow and select the reason, as soon as you learn it — usually from Customer Service\'s notes on the student\'s profile. That is not correcting a mistake — that is the process working: the record now matches reality.'},
     {type:'tip',txt:'An automated message also goes out to the family after every absence you log. That\'s not a substitute for reading Customer Service\'s notes — check the student\'s profile regularly to understand what\'s actually going on.'},
     {type:'warnbox',h:'And the line that protects all of it',b:'An absence you recorded honestly is never held against you. The only absence that hurts your numbers is the one nobody explained.'},
     {type:'simulation',title:'BO Simulation — Marking Attendance',src:'Simulacion_BO_Attendance_1.html'},
   ]},
   {t:'🔁 Follow Up',cards:[
     {type:'list',items:['Lesson-related things — explaining a topic, following up on classwork — happen directly with the student, on the WhatsApp group. Lessons themselves are already on the platform, so there\'s no need to send a link.','If a student is absent, you can message them yourself: let them know they were missed, and point them to the recording and any extra practice activities on the platform.','The next time the student attends, show them you noticed their absence.','Still worth a regular habit: check Customer Service\'s comments on the student\'s profile so you understand the full picture, not just what you can see from class.']},
   ]},
   {t:'⏱️ Timing: The Escalation Timeline',cards:[
     {type:'text',b:'Module 1 introduced 🟡 yellow and 🔴 red absences. The timeline that matters most is tied to how far into the course the student is.'},
     {type:'table',h:'Where the student is',head:['Where the student is','What triggers escalation','What happens'],rows:[
       ['Module 1','A single absence — Customer Service is already watching from here','CS reaches out directly; you still log the absence and your comment as usual'],
       ['Module 2 onward','Two consecutive absences','This becomes a critical case — Student\'s Evaluation now, same as elsewhere'],
     ]},
     {type:'warn',txt:'"Tell someone — don\'t wait for the third." Two consecutive absences from Module 2 onward is exactly the point where a drifting student can still be brought back.'},
   ]},
   {t:'👨‍👩‍👧 Talking With Parents',cards:[
     {type:'imgtext',img:'Images/WhatsApp_module_6_ENG.png',items:['Be kind and understanding, especially if the absence was due to illness or a family issue.','If there\'s extra material available in the course, let them know.','When the student does attend, use the moment to share their achievements in class with the parents.','Warmth costs nothing and it is the whole difference between a family that stays engaged with the course and one that quietly stops replying.']},
     RESTRICTION_CARD,
   ]},
   {t:'📋 What to Log in Back Office',cards:[
     {type:'list',h:'Now a short checklist — the mechanism itself is in the first section above',items:['Set the absence type and the reason. Yellow plus the matching reason from the six groups if you were told why; red if nobody told you anything.','Add a comment with what the family actually said. Short is fine. This is what Customer Service and the Teaching Department read if the case escalates.']},
   ]},
   {t:'🔀 And Then? Two Ways This Goes',cards:[
     {type:'text',b:'You have contacted the family and recorded the absence. From here the situation goes one of two ways, and they need different things from you.'},
     {type:'table',h:'They come back vs. they don\'t',head:['','✅ They come back','❌ They don\'t'],rows:[
       ['<span class="rowic">⚡</span>Straight away','Show them you noticed they were gone — warmly, and privately, not in front of the group.','Customer Service already has this — an automated message went out, and CS has been watching since Module 1.'],
       ['<span class="rowic">➡️</span>Then','Watch their presence, not just their attendance. If they turn up but stay at 40% in the room, that\'s Modules 2 to 4, not this one.','If it reaches two consecutive absences, it becomes a critical case automatically — your Student\'s Evaluation confirms it on your end.'],
       ['<span class="rowic">🧑‍🤝‍🧑</span>Who else you involve','Your TL, if the student has fallen behind enough to need an extra lesson.','Customer Service and the Teaching Department — already looped in per the timeline above.'],
       ['<span class="rowic">👨‍👩‍👧</span>The parents','Share one concrete thing the student did in the lesson they came back to.','Keep them informed, and promise nothing. No extra lesson is offered before it\'s approved.'],
     ]},
     {type:'redbox',h:'They came back, but they\'re still not really there.',b:'This is the most common outcome of all, and it is easy to file as solved because attendance recovered. It isn\'t solved: the student is now in the room and disengaged, which is a facilitation problem, not an absence problem.<br><br>That case belongs to Modules 2, 3 and 4 — how you open, who you call on, how you close.'},
   ]},
   {t:'🪜 If It Escalates: Requesting an Extra Lesson',cards:[
     {type:'text',b:'The request itself works differently here — <strong>Customer Service creates the extra-lesson request, and the Teaching Department reviews it</strong> before it\'s scheduled.'},
     {type:'flow',steps:[
       {ic:'📋',h:'1 · Open Student\'s Evaluation',b:'In BO, select "An additional class is required." Two or more consecutive absences qualify — for Modules 1 and 8, one absence is enough. Maximum one extra lesson per student per month.',color:'blue'},
       {ic:'📨',h:'2 · Customer Service picks it up',b:'CS reviews your evaluation and creates the extra-lesson request on the student\'s behalf.',color:'red'},
       {ic:'🏫',h:'3 · The Teaching Department reviews',b:'Approval comes from here, not directly from your TL.',color:'green'},
       {ic:'📞',h:'4 · Scheduled after approval',b:'Once approved, the lesson (30 minutes, free of charge) is scheduled with the family.',color:'orange'},
     ]},
     {type:'text',h:'🖥️ Try It Yourself',b:'Requesting the extra lesson isn\'t a flow you run yourself here — but checking what\'s already logged on a student\'s profile is. Practice that part:'},
     {type:'simulation',title:'BO Simulation — Marking Attendance & Reading CS Notes',src:'Simulacion_BO_Attendance_Simplified.html'},
   ]},
   {t:'🕳️ The Student Who Never Showed Up At All',cards:[
     {type:'hi',h:'This isn\'t a "missed class" — it\'s a different problem',b:'Some students never connect to a single lesson from day one. Treat a no-show on lesson one as an immediate red flag, not something to wait out.'},
     {type:'text',b:'Mark it red — nobody told you anything — and follow the same 48-hour rule.'},
   ]},
  ]},
 quiz6:[
  {q:'When does Customer Service first get involved with a student\'s absences?',opts:['Only once the tutor escalates through Student\'s Evaluation','From Module 1 — even a single absence is already on their radar','Only after three unexplained absences'],c:1,fb:'CS is already watching from a student\'s very first module — a single absence there is enough for them to reach out.'},
  {q:'A student missed class due to illness. How does the tutor talk to the parent?',opts:['Keep the conversation brief and neutral, avoiding personal questions about the illness so as not to intrude on the family\'s situation.','Express genuine concern for how the student is doing, mention any extra material available, and use their return to share something positive.','Focus mainly on catching the student up academically, since reassurance about the illness isn\'t really part of the tutor\'s role.'],c:1,fb:'Genuine warmth, practical help, and a positive note on their return covers the empathy this module asks for — staying neutral or purely academic misses it.'},
  {q:'A student who missed two classes returns and does great work today. How does the tutor use this with the parents?',opts:['Wait until the next scheduled check-in to mention it, to avoid contacting the family too many times in a short period.','Reach out around this class to share the specific achievement, reinforcing the positive turnaround for both student and parent.','Mention it briefly to the student only, since parents are usually more interested in attendance patterns than daily achievements.'],c:1,fb:'Sharing the achievement while it\'s fresh reinforces the turnaround for both student and parent — waiting or keeping it from the parent wastes the moment.'},
  {q:'Which of the following is something you must never do?',opts:['Share the class recording with a family whose child missed a lesson','Suggest to a family that the student take a short break from the course','Mention that Customer Service will be reaching out about a pattern of absences'],c:1,fb:'Suggesting a break is on the "never do" list — along with discussing pricing, offering unapproved 1-to-1 lessons, or informing a family about a cancellation without your TL\'s permission.'},
  {q:'A student missed Tuesday\'s lesson with no warning, so you marked it red. On Thursday you learn the student had flu. What do you do?',opts:['Leave it red — it was unannounced at the time, and changing it afterwards would misrepresent what happened','Change the absence to yellow, select "Health issues", and add a comment with what you learned','Add a comment with what you learned and leave the absence type as it is'],c:1,fb:'Red means "we don\'t know why". Once you know, the record should say so: change the type, select the reason, and comment.'},
  {q:'A student needs an extra lesson. Who actually creates the request?',opts:['You, directly with the family, once your TL gives a verbal yes','Customer Service creates it, and the Teaching Department reviews it before it\'s scheduled','The family, by submitting a request form themselves'],c:1,fb:'CS creates the extra-lesson request and the Teaching Department reviews it — your role stops at flagging the need through Student\'s Evaluation.'},
 ],
},

{key:'mena',label:'MENA / Turkish',flag:'🇹🇷',emoji:'📇',desc:'Customer Service manages the whole outreach and the extra-lesson request. Your part: mark it accurately, and know where to read what CS found out. Maps to tr.html.',
 quiz1Q5:{q:'In Back Office, what turns a red (unexcused) absence into a yellow one?',opts:['Once the reason becomes known, changing the absence to yellow and selecting that reason','72 hours passing without any action','Leaving a comment in Back Office, without changing the absence type'],c:0,fb:'What turns a red absence yellow is changing the type and picking the reason once it\'s known — whether you found out directly or Customer Service passed it along. A comment on its own, without changing the type, leaves it red.'},
 m6:{emoji:'📞',title:'What to Do When a Student Misses Class',
  desc:'What you select in Back Office and why it still matters even though Customer Service handles the contact, and where to find what they learn from the family.',
  obj:'Know exactly what to select in Back Office and when, understand that Customer Service — not you — contacts the family and manages extra lessons, and know where to read their notes on a student\'s profile.',
  sections:[
   {t:'🎯 What You Select, and When',cards:[
     {type:'text',b:'Before anything else: two clicks, and the whole metric depends on them. Module 1 explained what red and yellow mean. Here is exactly when you choose which.'},
     {type:'redyellow',left:{h:'🔴 Select RED when…',items:['The student did not appear and nobody told you why. That is the only case.','Red is not a harsher label for the same event — it means we do not know what happened, which is what makes it the most dangerous state a student can be in.','Nobody can help a student whose problem is invisible.']},right:{h:'🟡 Select YELLOW when…',items:['Someone told you a reason — before or after the lesson. Then pick which of the six reasons it was, if you know it.','Those options are not paperwork: they are the only way Customer Service learns what to say when they call.','Five seconds from you, and a pattern they can act on.']}},
     REASON_GROUPS_LIST,
     {type:'hi',h:'Customer Service contacts the family either way',b:'Whatever you mark, Customer Service reaches out to the family directly — usually within 3–4 days. Your part doesn\'t change because of that: marking the type and the reason accurately is still what matters, because it\'s the record CS reads before they make that call.'},
     {type:'warnbox',h:'And the line that protects all of it',b:'An absence you recorded honestly is never held against you. The only absence that hurts your numbers is the one nobody explained.'},
   ]},
   {t:'🔁 Follow Up',cards:[
     {type:'list',items:['The next time the student attends, show them you care about their attendance — warmly and kindly. It\'s part of strengthening the bond between you and them.','You don\'t need to personally chase the family — Customer Service already has it.']},
   ]},
   {t:'⏱️ Timing: What the Count Actually Triggers',cards:[
     {type:'text',b:'These thresholds don\'t trigger something you do — they trigger something that happens to the student, automatically, on Customer Service\'s side.'},
     {type:'table',h:'What changes as absences add up',head:['Count','What happens to the student','Your part'],rows:[
       ['1st absence','Customer Service is notified and will reach out within 3–4 days','Mark it accurately — type and reason if you have one'],
       ['2nd–3rd absence','The student becomes eligible for an extra lesson, which CS can offer the family','Same — mark it, add your comment'],
       ['4th absence or more','The student risks losing access to recordings, and moves closer to being withdrawn from the course','Same — and flag it to your TL if something about the pattern feels off'],
     ]},
   ]},
   {t:'👨‍👩‍👧 Talking With Parents',cards:[
     {type:'imgtext',img:'Images/WhatsApp_module_6_ENG.png',items:['If a parent reaches out to you directly, be kind and understanding, especially if the absence was due to illness or a family issue.','If there\'s extra material available in the course, let them know.','When the student does attend, use the moment to share their achievements in class with the parents.','Warmth costs nothing and it is the whole difference between a family that stays engaged with the course and one that quietly stops replying.']},
     RESTRICTION_CARD,
   ]},
   {t:'📋 What to Log in Back Office',cards:[
     {type:'list',h:'Now a short checklist — the mechanism itself is in the first section above',items:['Set the absence type and the reason. Yellow plus the matching reason from the six groups if you were told why; red if nobody told you anything.','Add a comment with anything relevant you know. Short is fine — this is what Customer Service reads before they contact the family.']},
   ]},
   {t:'🔀 And Then? Two Ways This Goes',cards:[
     {type:'text',b:'You have marked the absence. From here, Customer Service manages both outcomes — your part is already done.'},
     {type:'table',h:'They come back vs. they don\'t',head:['','✅ They come back','❌ They don\'t'],rows:[
       ['<span class="rowic">⚡</span>Straight away','Show them you noticed they were gone — warmly, and privately, not in front of the group.','Customer Service makes the follow-up contact — not you.'],
       ['<span class="rowic">➡️</span>Then','Watch their presence, not just their attendance. If they turn up but stay at 40% in the room, that\'s Modules 2 to 4, not this one.','Customer Service manages the case from here.'],
       ['<span class="rowic">🧑‍🤝‍🧑</span>Who else you involve','Customer Service, either way — they manage both outcomes.','Loop in your TL only if you want to flag a specific concern about the pattern.'],
       ['<span class="rowic">👨‍👩‍👧</span>The parents','Share one concrete thing the student did in the lesson they came back to.','You don\'t need to reach out — CS is already doing that.'],
     ]},
     {type:'redbox',h:'They came back, but they\'re still not really there.',b:'This is the most common outcome of all, and it is easy to file as solved because attendance recovered. It isn\'t solved: the student is now in the room and disengaged, which is a facilitation problem, not an absence problem.<br><br>That case belongs to Modules 2, 3 and 4 — how you open, who you call on, how you close.'},
   ]},
   {t:'🪜 If It Escalates: The Extra Lesson',cards:[
     {type:'text',b:'Requesting an extra lesson isn\'t a flow you run yourself here — <strong>Customer Service creates the request</strong> once the thresholds above are met.'},
     {type:'text',h:'🖥️ Try It Yourself',b:'Practice the part that actually is yours — marking attendance accurately — and see exactly what Customer Service leaves behind once they\'ve made contact:'},
     {type:'simulation',title:'BO Simulation — Marking Attendance & Reading CS Notes',src:'Simulacion_BO_Attendance_Simplified.html'},
   ]},
   {t:'🕳️ The Student Who Never Showed Up At All',cards:[
     {type:'hi',h:'This isn\'t a "missed class" — it\'s a different problem',b:'Some students never connect to a single lesson from day one. Treat a no-show on lesson one as an immediate red flag, not something to wait out.'},
     {type:'text',b:'Mark it red — nobody told you anything. Customer Service will still contact the family from here, following the same 48-hour rule.'},
   ]},
  ]},
 quiz6:[
  {q:'A student misses a lesson with no warning. Who contacts the family?',opts:['You do, the same day','Customer Service does, usually within 3–4 days','Nobody — the system sends an automated message only'],c:1,fb:'CS handles the outreach directly. Your part is marking the absence and the reason accurately.'},
  {q:'A parent reaches out to you directly about their child\'s illness. How do you talk to them?',opts:['Keep the conversation brief and neutral, and redirect them to Customer Service instead.','Express genuine concern for how the student is doing, mention any extra material available, and use their return to share something positive.','Focus mainly on catching the student up academically, since reassurance about the illness isn\'t really part of the tutor\'s role.'],c:1,fb:'Warmth still matters when a family reaches out to you directly — you\'re just not the one who initiates that outreach.'},
  {q:'A student who missed two classes returns and does great work today. How does the tutor use this with the parents?',opts:['Wait until the next scheduled check-in to mention it, to avoid contacting the family too many times in a short period.','Reach out around this class to share the specific achievement, reinforcing the positive turnaround for both student and parent.','Mention it briefly to the student only, since parents are usually more interested in attendance patterns than daily achievements.'],c:1,fb:'Sharing the achievement while it\'s fresh reinforces the turnaround for both student and parent — waiting or keeping it from the parent wastes the moment.'},
  {q:'Where do you find out why a student was absent, once Customer Service has followed up?',opts:['You don\'t — that information stays with CS','In the student\'s profile, under Comments','It\'s only shared if you ask your TL directly'],c:1,fb:'Click the student\'s name to open their profile — Customer Service\'s notes appear there, including why they were away or anything about the class itself.'},
  {q:'A student missed Tuesday\'s lesson with no warning, so you marked it red. On Thursday you learn the student had flu. What do you do?',opts:['Leave it red — it was unannounced at the time, and changing it afterwards would misrepresent what happened','Change the absence to yellow, select "Health issues", and add a comment with what you learned','Add a comment with what you learned and leave the absence type as it is'],c:1,fb:'Red means "we don\'t know why". Once you know, change the type, select the reason, and comment. A comment on its own leaves the absence red.'},
  {q:'A parent asks if their child can get an extra class. What do you tell them?',opts:['Schedule it directly since you know the family well','Let them know Customer Service manages extra-lesson requests','Tell them it\'s not possible'],c:1,fb:'Extra-lesson requests are created by Customer Service here, once the absence thresholds are met — not something you arrange directly.'},
 ],
},

{key:'globalen',label:'GCC · UK · US · Asia',flag:'🇦🇪-🇬🇧-🇺🇸-🇮🇩',emoji:'💬',desc:'Customer Service still manages escalation and extra lessons — but here, making a student feel missed is your job, not theirs. Maps to en.html, id.html, ar.html.',
 quiz1Q5:{q:'In Back Office, what turns a red (unexcused) absence into a yellow one?',opts:['Once the reason becomes known, changing the absence to yellow and selecting that reason','72 hours passing without any action','Leaving a comment in Back Office, without changing the absence type'],c:0,fb:'What turns a red absence yellow is changing the type and picking the reason once it\'s known — whether you found out directly or Customer Service passed it along. A comment on its own, without changing the type, leaves it red.'},
 m6:{emoji:'📞',title:'What to Do When a Student Misses Class',
  desc:'What you select in Back Office, how you personally make an absent student feel missed, and when Customer Service steps in instead.',
  obj:'Know exactly what to select in Back Office and when, how to reach out so a student feels missed and supported, and know when an administrative issue or an unresponsive family means it\'s time to loop in Customer Service.',
  sections:[
   {t:'🎯 What You Select, and When',cards:[
     {type:'text',b:'Before anything else: two clicks, and the whole metric depends on them. Module 1 explained what red and yellow mean. Here is exactly when you choose which.'},
     {type:'redyellow',left:{h:'🔴 Select RED when…',items:['The student did not appear and nobody told you why. That is the only case.','Red is not a harsher label for the same event — it means we do not know what happened, which is what makes it the most dangerous state a student can be in.','Nobody can help a student whose problem is invisible.']},right:{h:'🟡 Select YELLOW when…',items:['Someone told you a reason — before or after the lesson. Then pick which of the six reasons it was, if you know it.','Those options are not paperwork: they are part of how the pattern gets understood, whether it\'s you or Customer Service who acts on it.','Five seconds from you, and a pattern that can be acted on.']}},
     REASON_GROUPS_LIST,
     {type:'warnbox',h:'And the line that protects all of it',b:'An absence you recorded honestly is never held against you. The only absence that hurts your numbers is the one nobody explained.'},
     {type:'simulation',title:'BO Simulation — Marking Attendance',src:'Simulacion_BO_Attendance_1.html'},
   ]},
   {t:'🔁 Follow Up',cards:[
     {type:'hi',h:'Make sure they know they were missed',b:'A message from you — not just an automated one — is what makes an absence feel noticed instead of invisible. A short, warm message goes a long way: you were missed today, here\'s where to find the recording, and the practice activities are there whenever you\'re ready — framed as something useful, not an obligation.'},
     {type:'list',items:['Send a short message pointing to the recording and any extra practice activities on the platform — an opportunity to catch up, not a chore.','When the student returns, make it personal: ask if they got a chance to watch the recording, or if they need help finding it.','This part is yours. Customer Service steps in only for administrative issues, or if a family stops responding to your messages altogether.']},
   ]},
   {t:'⏱️ Timing: What the Count Actually Triggers',cards:[
     {type:'text',b:'These thresholds don\'t just trigger something you do — they also trigger consequences for the student, automatically, on Customer Service\'s side.'},
     {type:'table',h:'What changes as absences add up',head:['Count','What happens to the student','Your part'],rows:[
       ['1st absence','Nothing automatic yet','Message the student directly — recording, practice activities, a genuine "we missed you"'],
       ['2nd–3rd absence','The student becomes eligible for an extra lesson, which CS can offer the family','Keep messaging directly; flag it to Customer Service if the family has gone quiet'],
       ['4th absence or more','The student risks losing access to recordings, and moves closer to being withdrawn from the course','Loop in Customer Service — this is now an administrative matter'],
     ]},
     {type:'warn',txt:'The trigger for Customer Service isn\'t the absence count on its own — it\'s an administrative issue, or a family that stops answering you. Up to that point, this stays yours.'},
   ]},
   {t:'👨‍👩‍👧 Talking With Parents',cards:[
     {type:'imgtext',img:'Images/WhatsApp_module_6_ENG.png',items:['Be kind and understanding, especially if the absence was due to illness or a family issue.','If there\'s extra material available in the course, let them know.','When the student does attend, use the moment to share their achievements in class with the parents.','Warmth costs nothing and it is the whole difference between a family that stays engaged with the course and one that quietly stops replying.']},
     RESTRICTION_CARD,
   ]},
   {t:'📋 What to Log in Back Office',cards:[
     {type:'list',h:'Now a short checklist — the mechanism itself is in the first section above',items:['Set the absence type and the reason. Yellow plus the matching reason from the six groups if you were told why; red if nobody told you anything.','Add a comment with anything relevant you know. Short is fine — this is what Customer Service reads if the case reaches them.']},
   ]},
   {t:'🔀 And Then? Two Ways This Goes',cards:[
     {type:'text',b:'You have marked the absence and sent your message. From here the situation goes one of two ways, and they need different things from you.'},
     {type:'table',h:'They come back vs. they don\'t',head:['','✅ They come back','❌ They don\'t'],rows:[
       ['<span class="rowic">⚡</span>Straight away','Show them you noticed they were gone — warmly, and privately, not in front of the group.','Send a second message, on a different note if the first went unanswered — still you, not Customer Service.'],
       ['<span class="rowic">➡️</span>Then','Watch their presence, not just their attendance. If they turn up but stay at 40% in the room, that\'s Modules 2 to 4, not this one.','If the family goes quiet altogether, or it becomes an administrative matter, that\'s when Customer Service steps in.'],
       ['<span class="rowic">🧑‍🤝‍🧑</span>Who else you involve','Nobody, unless an extra lesson is worth flagging.','Customer Service — but only once it\'s gone from "a student I\'m following up with" to "a family I can\'t reach."'],
       ['<span class="rowic">👨‍👩‍👧</span>The parents','Share one concrete thing the student did in the lesson they came back to.','Keep it warm and low-pressure — you\'re still the one they hear from first.'],
     ]},
     {type:'redbox',h:'They came back, but they\'re still not really there.',b:'This is the most common outcome of all, and it is easy to file as solved because attendance recovered. It isn\'t solved: the student is now in the room and disengaged, which is a facilitation problem, not an absence problem.<br><br>That case belongs to Modules 2, 3 and 4 — how you open, who you call on, how you close.'},
   ]},
   {t:'🪜 If It Escalates: The Extra Lesson',cards:[
     {type:'text',b:'Requesting an extra lesson isn\'t a flow you run yourself here — <strong>Customer Service creates the request</strong> once the thresholds above are met.'},
     {type:'text',h:'🖥️ Try It Yourself',b:'Practice the part that\'s yours — marking attendance accurately — and see exactly what\'s already logged on a student\'s profile, so you know what Customer Service (or a colleague) has already tried:'},
     {type:'simulation',title:'BO Simulation — Marking Attendance & Reading CS Notes',src:'Simulacion_BO_Attendance_Simplified.html'},
   ]},
   {t:'🕳️ The Student Who Never Showed Up At All',cards:[
     {type:'hi',h:'This isn\'t a "missed class" — it\'s a different problem',b:'Some students never connect to a single lesson from day one. Treat a no-show on lesson one as an immediate red flag, not something to wait out.'},
     {type:'text',b:'Mark it red — nobody told you anything — and send that first "we missed you" message yourself, same as any other absence. If the family never responds at all, that\'s when Customer Service takes over.'},
   ]},
  ]},
 quiz6:[
  {q:'A student misses a lesson with no warning. What\'s your role in the first 24 hours?',opts:['Nothing — Customer Service handles all contact','Send the student a warm message yourself, with the recording and any practice activities — framed as an opportunity, not an obligation','Wait to see if Customer Service reaches out first, then follow up if they don\'t'],c:1,fb:'Making the student feel missed is your job here — a personal message with the recording and practice activities goes further than a system notification ever could.'},
  {q:'Why send a personal message about a missed lesson, when Customer Service will eventually step in anyway?',opts:['It\'s not really necessary — Customer Service will get there either way','So the student feels genuinely missed and supported, not just processed by a system — that\'s the difference between an automated flag and a person who noticed','Because Customer Service can\'t act until the tutor has messaged the student first'],c:1,fb:'Customer Service exists for administrative issues and unresponsive families — the personal message is what makes the student feel like a person was paying attention, not just a system.'},
  {q:'When does Customer Service actually step in?',opts:['As soon as a single absence happens','Once it becomes an administrative matter, or a family stops responding to your messages altogether','Never — this is entirely the tutor\'s responsibility'],c:1,fb:'Up to that point, following up is yours. Customer Service comes in for administrative issues or when a family has gone genuinely silent — not for every absence.'},
  {q:'Where do you check what\'s already been tried with a student before you follow up yourself?',opts:['You don\'t — there\'s no way to see that','In the student\'s profile, under Comments','Only by asking your TL directly'],c:1,fb:'Click the student\'s name to open their profile — Comments show what\'s already been logged, whether it was Customer Service or a colleague who left it.'},
  {q:'A student missed Tuesday\'s lesson with no warning, so you marked it red. On Thursday you learn the student had flu. What do you do?',opts:['Leave it red — it was unannounced at the time, and changing it afterwards would misrepresent what happened','Change the absence to yellow, select "Health issues", and add a comment with what you learned','Add a comment with what you learned and leave the absence type as it is'],c:1,fb:'Red means "we don\'t know why". Once you know, change the type, select the reason, and comment. A comment on its own leaves the absence red.'},
  {q:'A parent asks if their child can get an extra class. What do you tell them?',opts:['Schedule it directly since you know the family well','Let them know Customer Service manages extra-lesson requests','Tell them it\'s not possible'],c:1,fb:'Extra-lesson requests are created by Customer Service here, once the absence thresholds are met — not something you arrange directly.'},
 ],
},

];

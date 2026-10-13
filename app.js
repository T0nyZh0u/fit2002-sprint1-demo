'use strict';
const demoEvents = [{"id": "food", "name": "Community Food Drive", "short": "Food Drive", "date": "18 August 2026", "attendance": 85, "hours": 120, "beneficiaries": 240, "description": "A community food collection and distribution event involving volunteers and local participants.", "outcome": "In this fictional example, the event provided food assistance to 240 beneficiaries, with 85 attendances and 120 volunteer hours.", "category": "Community support"}, {"id": "youth", "name": "Youth Skills Workshop", "short": "Skills Workshop", "date": "12 September 2026", "attendance": 60, "hours": 90, "beneficiaries": 60, "description": "A practical skills workshop where volunteers supported young people through guided learning and group activities.", "outcome": "In this fictional example, the workshop supported 60 beneficiaries, with 60 attendances and 90 volunteer hours.", "category": "Learning and development"}, {"id": "festival", "name": "Community Cultural Festival", "short": "Cultural Festival", "date": "26 September 2026", "attendance": 120, "hours": 180, "beneficiaries": 180, "description": "A community festival celebrating cultural diversity through performances, activities and volunteer-supported engagement.", "outcome": "In this fictional example, the festival reached 180 beneficiaries, with 120 attendances and 180 volunteer hours.", "category": "Community connection"}];
const demoAccounts = {A:"food",B:"youth",C:"festival"};
let events = [];
let sponsor = '';
let requestVersion = 0;
let selected = 'all';
const main = document.querySelector('#main');
const period = '1 July – 30 September 2026';
const notes = 'Attendance counts event attendances, not unique individuals. Beneficiaries count distinct people; no cross-event overlap is assumed in this fictional dataset.';
const stat = (label,value,description,icon) => `<article class="stat"><div class="stat-top"><span>${label}</span><span class="stat-icon" aria-hidden="true">${icon}</span></div><strong>${value}</strong><p>${description}</p></article>`;
function stats(list,detail=false){return `<section class="stats ${detail?'three':''}" aria-label="Impact metrics">${detail?'':stat('Total events',list.length,'Events in this reporting period','▦')}${stat('Attendance',list.reduce((s,e)=>s+e.attendance,0),'Total event attendances','◎')}${stat('Volunteer hours',list.reduce((s,e)=>s+e.hours,0),'Hours contributed by volunteers','◷')}${stat('Beneficiaries reached',list.reduce((s,e)=>s+e.beneficiaries,0),'People supported in this period','♡')}</section>`;}
function attendanceChart(list){
 return `<section class="panel attendance-panel"><div class="panel-heading"><div><h2>Attendance by event</h2><p>Event attendances · fixed reporting period</p></div></div><div class="vertical-chart" role="img" aria-label="${list.map(e=>`${e.name}: ${e.attendance} attendances`).join('; ')}"><div class="y-ticks"><span>150</span><span>100</span><span>50</span><span>0</span></div><div class="columns">${list.map(e=>`<div class="column"><div class="column-track"><div class="column-bar" style="height:${e.attendance/150*100}%"><strong>${e.attendance}</strong></div></div><span class="column-label">${e.short}</span></div>`).join('')}</div></div></section>`;
}
function dashboard(focus=false){
 if(!sponsor){showLogin();return;}
 if(selected!=='all'&&!events.some(e=>e.id===selected))selected='all';
 document.body.classList.remove('signed-out');
 main.className='dashboard-page';
 const list=selected==='all'?events:events.filter(e=>e.id===selected);
 main.innerHTML=`<div class="page-heading"><div><p class="eyebrow">YOUR SUPPORT IN ACTION</p><h1>Sponsor impact dashboard</h1><p class="subtitle">See the reach and activity of the programs you support.</p></div><span class="quarter">Q3 <strong>2026</strong></span></div>
 <section class="filter-bar" aria-label="Reporting scope"><div><span class="label">REPORTING PERIOD</span><strong>${period}</strong></div><div class="filter"><label for="event-filter">Filter by event</label><select id="event-filter"><option value="all">All my events</option>${events.map(e=>`<option value="${e.id}" ${e.id===selected?'selected':''}>${e.name}</option>`).join('')}</select></div></section>
 <p class="scope"><span aria-hidden="true">◈</span> ${sponsor} · Only your authorised events are included in every figure and graph.</p>
 ${events.length?'':'<p class="empty-state" role="status">No authorised events in this reporting period. Contact the MLAI reporting team if you expect access.</p>'}${stats(list)}
 <div class="dashboard-lower">${attendanceChart(list)}<section class="panel"><div class="panel-heading"><div><h2>Event impact summary</h2><p>${list.length} ${list.length===1?'event':'events'} · ${selected==='all'?'All your authorised events':list[0]?.category||'No authorised events'}</p></div></div><div class="table-scroll"><table><thead><tr><th>Event</th><th>Date</th><th class="number">Attendance</th><th class="number">Volunteer hours</th><th><span class="sr-only">Action</span></th></tr></thead><tbody>${list.map(e=>`<tr><td><strong>${e.name}</strong><small>${e.category}</small></td><td>${e.date}</td><td class="number">${e.attendance}</td><td class="number">${e.hours}</td><td><button class="details-link" data-event="${e.id}">View details <span aria-hidden="true">↗</span><span class="sr-only"> for ${e.name}</span></button></td></tr>`).join('')}</tbody></table></div></section></div><p class="data-note"><strong>How to read these figures</strong> ${notes}</p><span class="sr-only" role="status">Showing ${selected==='all'?'all events':list[0].name}</span>`;
 document.querySelector('#event-filter').addEventListener('change',e=>{selected=e.target.value;history.replaceState({selected,detail:null},'');dashboard();document.querySelector('#event-filter').focus();});
 document.querySelectorAll('[data-event]').forEach(b=>b.addEventListener('click',()=>{history.pushState({selected,detail:b.dataset.event},'');details(b.dataset.event,true);}));
 if(focus){main.focus();window.scrollTo(0,0);}
}
function details(id,focus=false){
 const e=events.find(event=>event.id===id);
 if(!e){dashboard();return;}
 main.className='detail-page';
 main.innerHTML=`<button class="back" id="back">← Back to dashboard</button><div class="page-heading detail-heading"><div><p class="eyebrow">EVENT IMPACT DETAILS</p><h1>${e.name}</h1><p class="subtitle">${e.category}</p></div><span class="pill">Fictional event</span></div><section class="event-meta"><div><span class="label">EVENT DATE</span><strong>${e.date}</strong></div><div><span class="label">REPORTING PERIOD</span><strong>${period}</strong></div></section>${stats([e],true)}<div class="detail-content">${attendanceChart([e])}<div class="detail-grid"><section class="panel description"><p class="eyebrow">THE ACTIVITY</p><h2>Event description</h2><p>${e.description}</p></section><section class="outcome"><p class="eyebrow">THE REPORTED IMPACT</p><h2>Community outcome</h2><p>${e.outcome}</p></section></div></div><section class="panel privacy"><span class="privacy-symbol" aria-hidden="true">◈</span><div><h2>Aggregate information only</h2><p>This demonstration contains no names, emails or individual participant records. This prototype simulates sponsor-specific views using fictional data. Production access security is outside this hosted demo.</p></div></section><p class="data-note"><strong>How to read these figures</strong> ${notes}</p>`;
 document.querySelector('#back').addEventListener('click',()=>{history.back();});
 if(focus){main.focus();window.scrollTo(0,0);}
}
window.addEventListener('popstate',e=>{selected=e.state?.selected||'all';e.state?.detail?details(e.state.detail,true):dashboard(true);});
function reset(){++requestVersion;selected='all';history.replaceState({selected,detail:null},'');dashboard(true);}
document.querySelector('#reset').addEventListener('click',reset);
document.querySelector('#brand').addEventListener('click',e=>{e.preventDefault();history.replaceState({selected,detail:null},'');dashboard(true);});
document.querySelector('#dashboard-nav').addEventListener('click',()=>{history.replaceState({selected,detail:null},'');dashboard(true);});
history.replaceState({selected,detail:null},'');

function showLogin(message=''){
 ++requestVersion;events=[];sponsor='';selected='all';main.className='login-page';document.body.classList.add('signed-out');
 document.querySelector('#account').textContent='Sponsor sign in';
 document.querySelector('#logout').hidden=true;document.querySelector('#reset').hidden=true;
 main.innerHTML=`<div class="login-layout"><section class="login-intro"><a class="login-brand" href="#"><span class="brand-icon">M</span> MLAI <span>Sponsor portal</span></a><p class="eyebrow">COMMUNITY IMPACT, CLEARLY REPORTED</p><h1>Your support.<br>Your impact.</h1><p class="login-lead">See the difference your events make, with a clear view of participation and community outcomes.</p><p class="login-context">Sponsor Impact Dashboard<br><span>Team 0810 · Sprint 1 prototype</span></p></section><section class="login-card" aria-labelledby="login-title"><p class="eyebrow">WELCOME BACK</p><h2 id="login-title">Sign in to your workspace</h2><p>Use your sponsor account to view your events.</p><form id="login-form"><label for="username">Sponsor account</label><input id="username" name="username" autocomplete="username" autocapitalize="characters" spellcheck="false" placeholder="Enter A, B or C" required maxlength="40"><label for="password">Password</label><div class="password-field"><input id="password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required maxlength="128"><button type="button" id="toggle-password" aria-label="Show password" aria-pressed="false">Show</button></div><p id="login-error" role="alert" aria-live="polite"></p><button class="login-button" type="submit">Sign in to workspace <span aria-hidden="true">→</span></button></form><details class="demo-help"><summary>Classroom demo accounts</summary><p>A / A — Food Drive<br>B / B — Skills Workshop<br>C / C — Cultural Festival</p></details><p class="login-note">Classroom simulation · Public sample data</p></section></div>`;
 document.querySelector('#toggle-password').addEventListener('click',()=>{const input=document.querySelector('#password');const button=document.querySelector('#toggle-password');const show=input.type==='password';input.type=show?'text':'password';button.textContent=show?'Hide':'Show';button.setAttribute('aria-label',show?'Hide password':'Show password');button.setAttribute('aria-pressed',String(show));});
 document.querySelector('#login-form').addEventListener('input',()=>{document.querySelector('#login-error').textContent='';});
 document.querySelector('#login-error').textContent=message;
 document.querySelector('#login-form').addEventListener('submit',event=>{
 event.preventDefault();const form=new FormData(event.target);
 const user=String(form.get('username')).trim();const password=String(form.get('password'));
 if(!Object.hasOwn(demoAccounts,user)||password!==user){document.querySelector('#login-error').textContent='Account or password is incorrect. Please try again.';return;}
 sessionStorage.setItem('demoAccount',user);loadSession();
 });
}
function loadSession(){
 const user=sessionStorage.getItem('demoAccount');
 if(!Object.hasOwn(demoAccounts,user)){showLogin();return;}
 events=demoEvents.filter(e=>e.id===demoAccounts[user]);sponsor='Sponsor '+user;
 document.querySelector('#account').textContent=sponsor;
 document.querySelector('#logout').hidden=false;document.querySelector('#reset').hidden=false;reset();
}
document.querySelector('#logout').addEventListener('click',()=>{
 sessionStorage.removeItem('demoAccount');history.replaceState({},'');showLogin();
});
window.addEventListener('pageshow',event=>{if(event.persisted)loadSession();});

loadSession();

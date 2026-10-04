const S={approved:false,completed:173};
const acts=[
 {id:'PIP-2401',wbs:'PIP-24',d:'Piping',n:'Erect Line 24-XX',ps:25,pf:28,as:26,af:null,st:'Delayed',c:94},
 {id:'PIP-2402',wbs:'PIP-24',d:'Piping',n:'Weld Line 24-XX',ps:29,pf:33,as:null,af:null,st:'Not Started',c:null},
 {id:'PIP-2403',wbs:'PIP-24',d:'Piping',n:'Hydrotest Line 24-XX',ps:30,pf:33,as:30,af:null,st:'In Progress',c:96},
 {id:'CIV-1021',wbs:'CIV-10',d:'Civil',n:'Pump P-101 Excavation',ps:27,pf:29,as:27,af:29,st:'Completed',c:91},
 {id:'CIV-1022',wbs:'CIV-10',d:'Civil',n:'Foundation PCC for Pump P-101',ps:30,pf:32,as:null,af:null,st:'Not Started',c:null},
 {id:'ELE-301',wbs:'ELE-30',d:'Electrical',n:'Cable Tray Installation',ps:28,pf:32,as:29,af:null,st:'In Progress',c:67},
 {id:'ELE-302',wbs:'ELE-30',d:'Electrical',n:'Cable Pulling',ps:33,pf:36,as:null,af:null,st:'Not Started',c:null},
 {id:'INS-401',wbs:'INS-40',d:'Instrumentation',n:'Instrument Installation',ps:26,pf:30,as:27,af:null,st:'Delayed',c:88}];
const dt=d=>d==null?'—':(d>30?String(d-30).padStart(2,'0')+' Oct':d+' Sep');
const stPill=s=>({Completed:'p-green',Delayed:'p-amber','In Progress':'p-blue','Not Started':'p-gray'}[s]||'p-gray');
const confPill=c=>c==null?'<span class="text-slate-400">—</span>':`<span class="pill ${c>=85?'p-green':c>=60?'p-amber':'p-red'}">${c}%</span>`;

function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.remove('hidden');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.add('hidden'),3200)}

// Navigation
const titles={};let chartsBuilt={};
function go(v){document.querySelectorAll('.view').forEach(e=>e.classList.toggle('active',e.id==='v-'+v));
 const navKey=v==='extract'?'ingest':v;document.querySelectorAll('#nav .nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===navKey));
 window.scrollTo(0,0);if(v==='risk')buildRisk();if(v==='reports')buildReports();}
document.querySelectorAll('#nav .nav-btn').forEach(b=>b.onclick=()=>go(b.dataset.view));
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)go(g.dataset.go)});

// Role
document.getElementById('role').onchange=e=>{const r=e.target.value;let first=null;
 document.querySelectorAll('#nav .nav-btn').forEach(b=>{const ok=b.dataset.roles.includes(r);b.classList.toggle('hidden',!ok);if(ok&&!first)first=b.dataset.view});
 go(first);toast('Viewing as: '+e.target.selectedOptions[0].text)};

// KPIs
function spark(pts,col){const max=Math.max(...pts),min=Math.min(...pts);const p=pts.map((v,i)=>`${i*(100/(pts.length-1))},${28-((v-min)/(max-min||1))*24}`).join(' ');return `<svg viewBox="0 0 100 30" class="w-full h-7 mt-2" preserveAspectRatio="none"><polyline points="${p}" fill="none" stroke="${col}" stroke-width="2"/></svg>`}
function renderKpis(){const k=[
 ['Total Activities',250,'list-checks','#1d5fbf','Baseline v4',[250,250,250,250,250]],
 ['Started',198,'play-circle','#1d5fbf','+12 this week',[170,178,186,192,198]],
 ['Completed',S.completed,'check-circle-2','#0f9d8a',S.approved?'+8 this week':'+7 this week',[150,156,162,168,S.completed]],
 ['Delayed',37,'clock-alert','#d98a0b','+4 this week',[28,30,33,35,37]],
 ['Needs Review',S.approved?20:21,'clipboard-check','#6d4bd1','AI flagged',[14,18,16,22,21]],
 ['Unmatched',10,'unlink','#d23b3b','−3 this week',[16,14,13,12,10]]];
 document.getElementById('kpis').innerHTML=k.map(([l,v,ic,c,t,s])=>`<div class="card p-4"><div class="flex justify-between items-start"><p class="lbl">${l}</p><span class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:${c}15;color:${c}"><i data-lucide="${ic}" class="w-4 h-4"></i></span></div><p class="text-3xl font-extrabold mt-1">${v}</p><p class="text-xs font-semibold" style="color:${c}">${t}</p>${spark(s,c)}</div>`).join('');lucide.createIcons()}

document.getElementById('disc-bars').innerHTML=[['Civil',80,'#1d5fbf'],['Piping',90,'#0f9d8a'],['Electrical',70,'#1d5fbf'],['Instrumentation',60,'#d98a0b'],['HSE',85,'#0f9d8a']].map(([n,v,c])=>`<div><div class="flex justify-between text-sm mb-1"><span class="font-medium">${n}</span><b>${v}%</b></div><div class="bar"><i style="width:${v}%;background:${c}"></i></div></div>`).join('');

const feed=[
 ['check-circle-2','#0f9d8a','PIP-2401','Erect Line 24-XX','Actual Finish recorded','17:00',94,'Piping','Daily Report'],
 ['check-circle-2','#0f9d8a','CIV-1021','Foundation excavation for Pump P-101','Actual Start recorded','09:30',91,'Civil','Site Diary'],
 ['alert-triangle','#d98a0b','ELE-301','Cable Tray Installation','Needs planner review','11:15',67,'Electrical','Spreadsheet'],
 ['circle-dot','#1d5fbf','PIP-2403','Hydrotest Line 24-XX','Started','14:20',96,'Piping','AI Time Agent']];
document.querySelectorAll('.feed-list').forEach(ul=>ul.innerHTML=feed.map(f=>`<li class="py-3 flex items-center gap-3 flex-wrap"><i data-lucide="${f[0]}" class="w-5 h-5 shrink-0" style="color:${f[1]}"></i><span class="mono text-xs text-slate-500 w-12">${f[5]}</span><div class="flex-1 min-w-[180px]"><p class="text-sm"><span class="mono font-bold">${f[2]}</span> · ${f[3]}</p><p class="text-xs text-slate-500">${f[4]} · ${f[7]} · Source: ${f[8]}</p></div>${confPill(f[6])}<span class="ai-badge">AI</span><button class="btn btn-ghost btn-sm" onclick="openInfo('act','${f[2]}')">Details</button></li>`).join(''));

// Uploads
const uploads=[['daily_report_30_sep.txt','Daily Report','Piping','10:32 AM',18,'done'],['Piping_Progress_30Sep.xlsx','Spreadsheet','Piping','10:36 AM',42,'done'],['Civil_SiteDiary.pdf','Site Diary','Civil','10:41 AM',27,'proc'],['Project_Schedule.xlsx','Schedule Export','All','09:05 AM',250,'done']];
function renderUploads(){document.getElementById('uploads').innerHTML=uploads.map(u=>`<tr><td class="font-semibold flex items-center gap-2"><i data-lucide="file" class="w-4 h-4 text-slate-400"></i>${u[0]}</td><td>${u[1]}</td><td>${u[2]}</td><td>${u[3]}</td><td>${u[4]} records</td><td>${u[5]==='done'?'<span class="pill p-green">✓ Processed</span>':'<span class="pill p-blue"><i data-lucide="loader" class="w-3 h-3 spin"></i>Processing…</span>'}</td></tr>`).join('');lucide.createIcons()}
const drop=document.getElementById('drop'),fin=document.getElementById('file-in');
function addFiles(fs){[...fs].forEach(f=>{const ext=f.name.split('.').pop().toLowerCase();uploads.unshift([f.name,{xlsx:'Spreadsheet',csv:'Spreadsheet',pdf:'Site Diary',txt:'Daily Report',docx:'Daily Report'}[ext]||'Other','Auto-detect',new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),'—','proc'])});renderUploads();toast(fs.length+' file(s) queued. Click Upload & Analyze.')}
['dragover','dragenter'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('over')}));
['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('over')}));
drop.addEventListener('drop',e=>addFiles(e.dataTransfer.files));fin.onchange=()=>addFiles(fin.files);
document.getElementById('analyze').onclick=function(){const b=this;b.disabled=true;const wrap=document.getElementById('analyze-progress');wrap.classList.remove('hidden');
 const steps=['Parsing document…','Running NLP extraction…','Detecting activity events…','Scoring confidence…'];let p=0;
 const h=setInterval(()=>{p+=5;document.getElementById('an-bar').style.width=p+'%';document.getElementById('an-pct').textContent=p+'%';document.getElementById('an-step').textContent=steps[Math.min(3,Math.floor(p/26))];
  if(p>=100){clearInterval(h);uploads.forEach(u=>{if(u[5]==='proc'){u[5]='done';if(u[4]==='—')u[4]=12}});renderUploads();b.disabled=false;wrap.classList.add('hidden');toast('Analysis complete — 18 events extracted.');go('extract')}},70)};

// Factors
document.getElementById('factors').innerHTML=[['Semantic similarity',91],['Keyword similarity',87],['Line ID match',100],['Discipline match',100],['WBS context',95]].map(([n,v])=>`<div><div class="flex justify-between text-xs mb-0.5"><span>${n}</span><b>${v}%</b></div><div class="bar" style="height:6px"><i style="width:${v}%;background:#6d4bd1"></i></div></div>`).join('');

// Review
const review=[
 {id:'r0',in:'Spool erection completed for Line 24-XX',a:'PIP-2401',d:'Piping',c:94,r:'High confidence',src:'Daily Report · 10:32',st:'pending'},
 {id:'r1',in:'Cable tray work',a:'ELE-301',d:'Electrical',c:67,r:'Terminology mismatch',src:'Spreadsheet · 11:15',st:'pending'},
 {id:'r2',in:'Foundation work',a:'CIV-1021',d:'Civil',c:58,r:'Granularity mismatch',src:'Site Diary · 10:41',st:'pending'},
 {id:'r3',in:'Valve installation',a:'PIP-221',d:'Piping',c:92,r:'High confidence',src:'Daily Report · 10:32',st:'pending'},
 {id:'r4',in:'Transmitter mounting done at rack 3',a:'INS-401',d:'Instrumentation',c:74,r:'Location ambiguity',src:'Daily Report · 12:02',st:'pending'},
 {id:'r5',in:'Unknown piping activity',a:null,d:'Piping',c:32,r:'No suitable match',src:'Site Diary · 10:41',st:'pending'}];
let rf='all';
function renderReview(){const body=document.getElementById('rev-body');
 const vis=review.filter(x=>rf==='all'||(rf==='high'&&x.c>=85)||(rf==='medium'&&x.c>=60&&x.c<85)||(rf==='low'&&x.c<60&&x.a)||(rf==='unmatched'&&!x.a)||x.d===rf);
 body.innerHTML=vis.map(x=>`
    <tr data-id="${x.id}">
        <td class="font-semibold">“${x.in}”</td>
        <td class="mono">${x.a||'—'}</td>
        <td>${x.d}</td><td>${confPill(x.c)}</td>
        <td class="text-slate-600">${x.r}</td>
        <td class="text-xs text-slate-500">${x.src}</td>
        <td>${x.st==='approved'?'<span class="pill p-green">✓ Approved</span>':x.st==='rejected'?'<span class="pill p-red">Rejected</span>':`<div class="flex gap-1 flex-wrap">${x.a?`<button class="btn btn-teal btn-sm" data-act="approve">Approve</button>`:`<button class="btn btn-primary btn-sm" data-act="investigate">Investigate</button>`}<button class="btn btn-danger btn-sm" data-act="reject">Reject</button><button class="btn btn-ghost btn-sm" data-act="change">Change Mapping</button><button class="btn btn-ghost btn-sm" data-act="create">Create Activity</button></div>`}</td>
    </tr>`)
    .join('')||'<tr><td colspan="7" class="text-center text-slate-500 py-6">No items match this filter.</td></tr>';
 const pend = review.filter(x => x.st === 'pending').length;document.getElementById('review-count').textContent=pend+' items requiring review';document.getElementById('nav-review-count').textContent=pend}
document.getElementById('rev-filters').onclick=e=>{const c=e.target.closest('.chip');if(!c)return;rf=c.dataset.f;document.querySelectorAll('#rev-filters .chip').forEach(x=>x.classList.toggle('on',x===c));renderReview()};
document.getElementById('rev-body').onclick=e=>{const b=e.target.closest('[data-act]');if(!b)return;const x=review.find(r=>r.id===b.closest('tr').dataset.id);const a=b.dataset.act;
 if(a==='approve'){if(x.id==='r0'){openM('m-approve');return}x.st='approved';toast(x.a+' mapping approved.')}
 else if(a==='reject'){x.st='rejected';toast('Mapping rejected.')}
 else if(a==='change'){go('linking');return}
 else if(a==='create'){toast('New activity draft created for “'+x.in+'”.');return}
 else if(a==='investigate'){openInfo('act','—');return}renderReview()};

// Schedule + Gantt
function renderSchedule(){document.getElementById('sch-body').innerHTML=acts.map(a=>`<tr${a.id==='PIP-2401'&&S.approved?' style="background:#f0faf7"':''}><td class="mono font-bold"><button class="hover:underline" onclick="openInfo('act','${a.id}')">${a.id}</button></td><td>${a.wbs}</td><td>${a.d}</td><td>${a.n}</td><td>${dt(a.ps)}</td><td>${dt(a.pf)}</td><td>${dt(a.as)}</td><td>${a.id==='PIP-2401'&&S.approved?'<b class="text-[#0b7a6a]">30 Sep 17:00</b> <span class="pill p-green">Verified</span>':dt(a.af)}</td><td><span class="pill ${stPill(a.st)}">${a.st}</span></td></tr>`).join('');
 const s0=22,span=16,pc=d=>((d-s0)/span*100)+'%',w=(a,b)=>((b-a+1)/span*100)+'%';
 document.getElementById('g-axis').innerHTML=[22,25,28,31,34,37].map(d=>`<span>${dt(d)}</span>`).join('');
 document.getElementById('g-labels').innerHTML=acts.map(a=>`<div class="h-[30px] flex items-center mono font-bold">${a.id}</div>`).join('');
 document.getElementById('g-rows').innerHTML=`<div class="absolute top-0 bottom-0 w-px bg-[#d23b3b]" style="left:${pc(30.5)}" title="Data date"></div>`+acts.map(a=>{let h=`<div class="g-base" style="left:${pc(a.ps)};width:${w(a.ps,a.pf)}"></div>`;
  if(a.as){const end=a.af||30;const onT=Math.min(end,a.pf);h+=`<div class="g-act" style="left:${pc(a.as)};width:${w(a.as,onT)};background:${a.af?'#0f9d8a':'#1d5fbf'}"></div>`;if(end>a.pf)h+=`<div class="g-act" style="left:${pc(a.pf+1)};width:${w(a.pf+1,end)};background:#d98a0b"></div>`}
  return `<div class="gantt-row">${h}</div>`}).join('')}

// Approval flow
function openM(id){document.getElementById(id).classList.add('open')}
document.querySelectorAll('.close-m').forEach(b=>b.onclick=()=>b.closest('.modal-bg').classList.remove('open'));
document.querySelectorAll('.modal-bg').forEach(m=>m.onclick=e=>{if(e.target===m)m.classList.remove('open')});
document.getElementById('accept-match').onclick=()=>openM('m-approve');
document.getElementById('do-approve').onclick=function(){if(S.approved){document.getElementById('m-approve').classList.remove('open');return}
 const b=this;b.disabled=true;setTimeout(()=>{S.approved=true;S.completed=173;const p=acts[0];p.af=30;p.st='Completed';review[0].st='approved';
  audit.unshift(['30 Sep 2026 17:03','EVT-1201','PIP-2401','Actual Finish Updated','—','30 Sep 2026 17:00','Daily Report','AI + Planner',94]);
  renderKpis();renderSchedule();renderReview();renderAudit();document.getElementById('rep-updated').classList.remove('hidden');
  if(chartsBuilt.comp){chartsBuilt.comp.data.datasets[0].data[6]=173;chartsBuilt.comp.update()}
  b.disabled=false;document.getElementById('m-approve').classList.remove('open');toast('✓ Schedule updated · PIP-2401 Actual Finish 30 Sep 17:00 · Completed 172 → 173');go('schedule')},600)};

// Audit
const audit=[
 ['30 Sep 2026 14:21','EVT-1198','PIP-2403','Actual Start Updated','—','30 Sep 2026 14:20','AI Time Agent','AI Agent',96],
 ['30 Sep 2026 10:05','EVT-1188','PIP-2401','Actual Start Updated','—','26 Sep 2026 08:00','AI Time Agent','Suman Kumar',96],
 ['30 Sep 2026 09:34','EVT-1175','CIV-1021','Actual Finish Updated','—','29 Sep 2026 16:00','Site Diary','AI + Planner',91],
 ['29 Sep 2026 18:10','EVT-1150','ELE-301','Mapping Changed','ELE-302','ELE-301','Spreadsheet','Suman Kumar',67]];
function renderAudit(){const f={a:document.getElementById('af-act').value.trim().toLowerCase(),u:document.getElementById('af-user').value,s:document.getElementById('af-src').value,d:document.getElementById('af-date').value,x:document.getElementById('af-action').value};
 document.getElementById('aud-body').innerHTML=audit.filter(r=>(!f.a||r[2].toLowerCase().includes(f.a))&&(!f.u||r[7]===f.u)&&(!f.s||r[6]===f.s)&&(!f.d||r[0].startsWith(f.d))&&(!f.x||r[3]===f.x)).map(r=>`<tr${r[1]==='EVT-1201'?' style="background:#f0faf7"':''}><td class="whitespace-nowrap">${r[0]}</td><td class="mono">${r[1]}</td><td class="mono font-bold">${r[2]}</td><td>${r[3]}</td><td class="text-slate-400">${r[4]}</td><td class="font-semibold">${r[5]}</td><td>${r[6]}</td><td>${r[7]}</td><td>${confPill(r[8])}</td><td><button class="btn btn-ghost btn-sm" onclick="openInfo('audit','${r[2]}')">History</button></td></tr>`).join('')||'<tr><td colspan="10" class="text-center py-6 text-slate-500">No audit records match.</td></tr>'}
['af-act','af-user','af-src','af-date','af-action'].forEach(i=>document.getElementById(i).addEventListener('input',renderAudit));

// Info modal
function openInfo(type,id){const h=document.getElementById('mi-h'),b=document.getElementById('mi-body');
 if(type==='act'){const a=acts.find(x=>x.id===id);h.textContent='Activity Details';b.innerHTML=a?`<p><b class="mono">${a.id}</b> — ${a.n}</p><p>WBS ${a.wbs} · ${a.d}</p><p>Planned ${dt(a.ps)} → ${dt(a.pf)} · Actual ${dt(a.as)} → ${a.id==='PIP-2401'&&S.approved?'30 Sep 17:00':dt(a.af)}</p><p>Status: <span class="pill ${stPill(a.st)}">${a.st}</span> · AI confidence ${confPill(a.c)}</p>`:'<p>No schedule activity matched. Planner may create a new L6 activity or map manually.</p>'}
 else if(type==='confidence'){h.textContent='Confidence Explanation';b.innerHTML='<p>The 94% score is a weighted blend of five signals:</p><ul class="list-disc pl-5"><li>Semantic similarity (35%): 91%</li><li>Keyword similarity (15%): 87%</li><li>Line ID match (20%): 100%</li><li>Discipline match (10%): 100%</li><li>WBS context (20%): 95%</li></ul><p class="text-slate-500">≥85% auto-links; Actual Finish changes still require planner sign-off.</p>'}
 else if(type==='extract'){h.textContent='AI Extraction Details';b.innerHTML='<p><b>Entities detected:</b> crew=Piping, action=“completed spool erection”, object=Line 24-XX, time=“today at 5 PM” → 30 Sep 2026 17:00.</p><p><b>Event type:</b> COMPLETED (verb “completed”, past tense).</p><p><b>Location:</b> inferred Unit 24 from line numbering.</p><p class="text-slate-500">Source: daily_report_30_sep.txt · Extracted 10:32 · Confidence 96%</p>'}
 else {h.textContent='Audit History · '+id;b.innerHTML=audit.filter(r=>r[2]===id).map(r=>`<p class="border-l-2 border-[#1d5fbf] pl-3"><b>${r[0]}</b> — ${r[3]}: ${r[4]} → ${r[5]} <span class="text-slate-500">(${r[6]}, ${r[7]})</span></p>`).join('')}
 openM('m-info')}

// Search
const gs=document.getElementById('gsearch'),sdd=document.getElementById('search-dd');
gs.addEventListener('input',()=>{const q=gs.value.trim().toLowerCase();if(!q){sdd.classList.remove('open');return}
 const qq=q.replace('delayed activities','delayed').replace('line ','').replace('pump ','');
 const res=acts.filter(a=>[a.id,a.n,a.d,a.st,a.wbs].join(' ').toLowerCase().includes(qq));
 document.getElementById('search-body').innerHTML=res.map(a=>`<tr class="cursor-pointer" onclick="openInfo('act','${a.id}')"><td class="mono font-bold">${a.id}</td><td>${a.n}</td><td>${a.d}</td><td><span class="pill ${stPill(a.st)}">${a.st}</span></td><td>${dt(a.as)}</td><td>${a.id==='PIP-2401'&&S.approved?'30 Sep':dt(a.af)}</td><td>${confPill(a.c)}</td></tr>`).join('')||'<tr><td colspan="7" class="text-slate-500 py-3">No matches.</td></tr>';sdd.classList.add('open')});
const bell=document.getElementById('bell'),ndd=document.getElementById('notif-dd');
bell.onclick=e=>{e.stopPropagation();const o=ndd.classList.toggle('open');bell.setAttribute('aria-expanded',o)};
document.addEventListener('click',e=>{if(!ndd.contains(e.target)&&e.target!==bell)ndd.classList.remove('open');if(!sdd.contains(e.target)&&e.target!==gs)sdd.classList.remove('open')});

// Agent
document.getElementById('agent-confirm').onclick=()=>{document.getElementById('agent-actions').classList.add('hidden');document.getElementById('agent-done').classList.remove('hidden');
 if(!audit.find(r=>r[1]==='EVT-20260930-0012')){audit.unshift(['30 Sep 2026 10:05','EVT-20260930-0012','PIP-2401','Actual Start Updated','26 Sep 2026 08:00','30 Sep 2026 10:00','AI Time Agent','Suman Kumar',96]);renderAudit()}toast('Actual Start recorded · EVT-20260930-0012')};
document.getElementById('agent-form').onsubmit=e=>{e.preventDefault();const inp=document.getElementById('agent-input'),t=inp.value.trim();if(!t)return;const chat=document.getElementById('chat');
 const u=document.createElement('div');u.className='flex justify-end';u.innerHTML='<div class="max-w-[75%] bg-[#0b1f3a] text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm"></div>';u.firstChild.textContent='“'+t+'”';chat.appendChild(u);
 const l=t.toLowerCase();let m=acts.find(a=>l.includes(a.id.toLowerCase()))||(l.includes('hydro')?acts[2]:l.includes('excav')||l.includes('p-101')?acts[3]:l.includes('pull')?acts[6]:l.includes('tray')?acts[5]:l.includes('instrument')?acts[7]:l.includes('weld')?acts[1]:l.includes('24')||l.includes('pip')?acts[0]:null);
 const ev=/finish|complet|done|ended/.test(l)?'Actual Finish':/start|begun|began|commenc/.test(l)?'Actual Start':'Progress Update';
 const r=document.createElement('div');r.className='flex gap-2';r.innerHTML=`<div class="w-8 h-8 rounded-lg bg-[#efe9ff] flex items-center justify-center shrink-0 text-[#6d4bd1] font-bold text-xs">AI</div><div class="max-w-[80%] card p-4 text-sm">${m?`Detected <b class="mono">${m.id}</b> — ${m.n} (${m.d}) · Event: <b>${ev}</b> · Confidence ${confPill(m.c||82)}<br><span class="text-xs text-slate-500">Sent to Planner Review for verification.</span>`:'I could not match this to a schedule activity. It has been added to the Unmatched queue for planner investigation.'}</div>`;chat.appendChild(r);inp.value='';chat.scrollTop=chat.scrollHeight};

// Memory
document.getElementById('patterns').innerHTML=[['Material availability',32,'#d23b3b'],['Manpower shortage',24,'#d98a0b'],['Permit delay',18,'#1d5fbf'],['Equipment availability',15,'#6d4bd1'],['Other',11,'#94a3b8']].map(([n,v,c])=>`<div><div class="flex justify-between mb-1"><span>${n}</span><b>${v}%</b></div><div class="bar"><i style="width:${v*2.5}%;background:${c}"></i></div></div>`).join('');
function askKB(q){const l=q.toLowerCase();const a=l.includes('piping')||l.includes('how long')?'Across 14 historical projects, piping erection activities took an average of 5.6 days against 4.2 planned (+1.4 days). Variance is highest for lines with >6 spools.':l.includes('cause')?'Most common delay causes: Material availability (32%), Manpower shortage (24%), Permit delay (18%), Equipment availability (15%).':l.includes('exceed')?'Activities that most frequently exceed plan: Piping erection (68% of instances), Cable pulling (54%), Instrument loop checks (47%). Civil foundations exceed plan in only 21% of cases.':'Based on verified execution history, no strong pattern was found for this query. Try asking about durations, delay causes or variance by discipline.';
 document.getElementById('kb-text').textContent=a;document.getElementById('kb-answer').classList.remove('hidden')}
document.getElementById('kb-form').onsubmit=e=>{e.preventDefault();const v=document.getElementById('kb-input').value.trim();if(v)askKB(v)};
document.querySelectorAll('.kb-q').forEach(b=>b.onclick=()=>{document.getElementById('kb-input').value=b.textContent;askKB(b.textContent)});

// Charts
Chart.defaults.font.family="'DM Sans',sans-serif";Chart.defaults.color='#64748b';Chart.defaults.plugins.legend.labels.boxWidth=10;
const opt={responsive:true,maintainAspectRatio:false};
function buildRisk(){if(chartsBuilt.risk)return;chartsBuilt.risk=1;
 new Chart('c-disc',{type:'bar',data:{labels:['Civil','Piping','Static Eq.','Rotating Eq.','Electrical','Instr.','HSE'],datasets:[{data:[4,12,3,2,8,6,2],backgroundColor:'#1d5fbf',borderRadius:5}]},options:{...opt,plugins:{legend:{display:false}}}});
 new Chart('c-cause',{type:'doughnut',data:{labels:['Material Availability','Manpower Shortage','Permit Delay','Equipment Availability','Weather','Design Change'],datasets:[{data:[32,24,18,15,6,5],backgroundColor:['#d23b3b','#d98a0b','#1d5fbf','#6d4bd1','#0f9d8a','#94a3b8'],borderWidth:0}]},options:{...opt,cutout:'62%',plugins:{legend:{position:'right'}}}});
 new Chart('c-pva',{type:'bar',data:{labels:['PIP-2401','CIV-1021','ELE-301','INS-401','PIP-2403'],datasets:[{label:'Planned',data:[4,3,5,5,4],backgroundColor:'#b8c2cf',borderRadius:4},{label:'Actual',data:[5,3,6,6,4],backgroundColor:'#1d5fbf',borderRadius:4}]},options:opt});
 new Chart('c-trend',{type:'line',data:{labels:['W35','W36','W37','W38','W39','W40'],datasets:[{label:'Delayed',data:[22,25,29,31,33,37],borderColor:'#d98a0b',backgroundColor:'#d98a0b22',fill:true,tension:.35},{label:'Critical',data:[3,4,5,6,7,8],borderColor:'#d23b3b',tension:.35}]},options:opt})}
function buildReports(){if(chartsBuilt.rep)return;chartsBuilt.rep=1;const L=['24 Sep','25','26','27','28','29','30 Sep'];
 new Chart('c-prog',{type:'line',data:{labels:L,datasets:[{label:'Planned',data:[62,63.5,65,66.5,68,69.5,71],borderColor:'#94a3b8',borderDash:[5,4],tension:.3},{label:'Actual',data:[60,61.5,62.8,64,65.5,66.8,68],borderColor:'#1d5fbf',backgroundColor:'#1d5fbf18',fill:true,tension:.3}]},options:opt});
 chartsBuilt.comp=new Chart('c-comp',{type:'bar',data:{labels:L,datasets:[{label:'Cumulative completed',data:[158,161,164,166,169,171,S.completed],backgroundColor:'#0f9d8a',borderRadius:5}]},options:{...opt,scales:{y:{min:150}}}});
 new Chart('c-prod',{type:'bar',data:{labels:['Civil','Piping','Electrical','Instr.','HSE'],datasets:[{data:[6.2,8.4,4.1,3.3,2.0],backgroundColor:['#1d5fbf','#0f9d8a','#1d5fbf','#d98a0b','#0f9d8a'],borderRadius:5}]},options:{...opt,indexAxis:'y',plugins:{legend:{display:false}}}});
 new Chart('c-dist',{type:'bar',data:{labels:['−2d','−1d','0','+1d','+2d','+3d','+4d+'],datasets:[{label:'Activities',data:[6,14,120,28,16,8,5],backgroundColor:['#0f9d8a','#0f9d8a','#1d5fbf','#d98a0b','#d98a0b','#d23b3b','#d23b3b'],borderRadius:4}]},options:{...opt,plugins:{legend:{display:false}}}})}
document.getElementById('date-f').onchange=e=>toast('Period set: '+e.target.selectedOptions[0].text);

// Settings
document.getElementById('set-tabs').onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;document.querySelectorAll('#set-tabs .nav-btn').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.set-pane').forEach(p=>p.classList.toggle('hidden',p.dataset.p!==b.dataset.s))};
function bands(){let a=+document.getElementById('t-auto').value||85,r=+document.getElementById('t-rev').value||60;if(r>=a)r=a-1;
 document.getElementById('band-u').style.width=r+'%';document.getElementById('band-r').style.width=(a-r)+'%';document.getElementById('band-a').style.width=(100-a)+'%';
 document.getElementById('band-text').innerHTML=`<span class="pill p-green">Auto-link ≥ ${a}%</span><span class="pill p-amber">Planner Review ${r}–${a-1}%</span><span class="pill p-red">Unmatched &lt; ${r}%</span>`}
['t-auto','t-rev'].forEach(i=>document.getElementById(i).addEventListener('input',bands));

renderKpis();renderUploads();renderReview();renderSchedule();renderAudit();bands();lucide.createIcons();


document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const STORAGE_KEY = "plannerReviewData";

    const MAX_ITEMS = 30;
    const MIN_ITEMS = 15;


    /* =====================================================
       INITIAL DATA
    ===================================================== */

    const initialData = [
        {
            id: 1,
            input: "Spool erection completed for Line 24-XX",
            activity: "PIP-2401",
            discipline: "Piping",
            confidence: 94,
            reason: "High confidence",
            source: "Daily Report",
            time: "10:32",
            status: "pending"
        },

        {
            id: 2,
            input: "Cable tray work",
            activity: "ELE-301",
            discipline: "Electrical",
            confidence: 67,
            reason: "Terminology mismatch",
            source: "Spreadsheet",
            time: "11:15",
            status: "pending"
        },

        {
            id: 3,
            input: "Foundation excavation completed",
            activity: "CIV-102",
            discipline: "Civil",
            confidence: 88,
            reason: "High confidence",
            source: "Daily Report",
            time: "09:45",
            status: "pending"
        },

        {
            id: 4,
            input: "Instrument installation started",
            activity: "INS-210",
            discipline: "Instrumentation",
            confidence: 52,
            reason: "Low semantic similarity",
            source: "Daily Report",
            time: "12:20",
            status: "pending"
        },

        {
            id: 5,
            input: "Pipe support installation",
            activity: "PIP-350",
            discipline: "Piping",
            confidence: 91,
            reason: "High confidence",
            source: "Field Report",
            time: "13:10",
            status: "pending"
        },

        {
            id: 6,
            input: "Cable pulling completed",
            activity: "ELE-415",
            discipline: "Electrical",
            confidence: 73,
            reason: "Medium confidence",
            source: "Daily Report",
            time: "14:05",
            status: "pending"
        },

        {
            id: 7,
            input: "Concrete pouring for foundation",
            activity: "CIV-201",
            discipline: "Civil",
            confidence: 86,
            reason: "High confidence",
            source: "Daily Report",
            time: "14:40",
            status: "pending"
        },

        {
            id: 8,
            input: "Junction box installation",
            activity: "INS-305",
            discipline: "Instrumentation",
            confidence: 61,
            reason: "Terminology mismatch",
            source: "Spreadsheet",
            time: "15:05",
            status: "pending"
        },

        {
            id: 9,
            input: "Pipe welding completed",
            activity: "PIP-455",
            discipline: "Piping",
            confidence: 89,
            reason: "High confidence",
            source: "Daily Report",
            time: "15:30",
            status: "pending"
        },

        {
            id: 10,
            input: "Structural steel erection",
            activity: "CIV-310",
            discipline: "Civil",
            confidence: 78,
            reason: "Medium confidence",
            source: "Field Report",
            time: "16:00",
            status: "pending"
        },

        {
            id: 11,
            input: "Electrical panel installation",
            activity: "ELE-501",
            discipline: "Electrical",
            confidence: 84,
            reason: "High confidence",
            source: "Daily Report",
            time: "16:20",
            status: "pending"
        },

        {
            id: 12,
            input: "Pressure transmitter installation",
            activity: "INS-410",
            discipline: "Instrumentation",
            confidence: 48,
            reason: "Low confidence",
            source: "Spreadsheet",
            time: "16:45",
            status: "pending"
        },

        {
            id: 13,
            input: "Pipe rack fabrication",
            activity: "PIP-510",
            discipline: "Piping",
            confidence: 92,
            reason: "High confidence",
            source: "Daily Report",
            time: "17:10",
            status: "pending"
        },

        {
            id: 14,
            input: "Equipment foundation",
            activity: "CIV-420",
            discipline: "Civil",
            confidence: 68,
            reason: "Medium confidence",
            source: "Field Report",
            time: "17:25",
            status: "pending"
        },

        {
            id: 15,
            input: "Power cable termination",
            activity: "ELE-610",
            discipline: "Electrical",
            confidence: 58,
            reason: "Low confidence",
            source: "Daily Report",
            time: "17:40",
            status: "pending"
        },

        {
            id: 16,
            input: "Control valve installation",
            activity: "INS-520",
            discipline: "Instrumentation",
            confidence: 82,
            reason: "High confidence",
            source: "Daily Report",
            time: "18:00",
            status: "pending"
        },

        {
            id: 17,
            input: "Pipeline hydro testing",
            activity: "PIP-620",
            discipline: "Piping",
            confidence: 90,
            reason: "High confidence",
            source: "Field Report",
            time: "18:15",
            status: "pending"
        },

        {
            id: 18,
            input: "Road construction activity",
            activity: "CIV-550",
            discipline: "Civil",
            confidence: 55,
            reason: "Low confidence",
            source: "Daily Report",
            time: "18:30",
            status: "pending"
        },

        {
            id: 19,
            input: "Transformer installation",
            activity: "ELE-720",
            discipline: "Electrical",
            confidence: 81,
            reason: "High confidence",
            source: "Daily Report",
            time: "18:45",
            status: "pending"
        },

        {
            id: 20,
            input: "Temperature sensor installation",
            activity: "INS-650",
            discipline: "Instrumentation",
            confidence: 65,
            reason: "Terminology mismatch",
            source: "Spreadsheet",
            time: "19:00",
            status: "pending"
        },

        {
            id: 21,
            input: "Unknown activity from report",
            activity: "UNMATCHED",
            discipline: "Piping",
            confidence: 0,
            reason: "No matching activity found",
            source: "Daily Report",
            time: "19:15",
            status: "pending"
        }
    ];


    /* =====================================================
       LOAD DATA FROM LOCAL STORAGE
    ===================================================== */

    function loadData() {

        const savedData =
            localStorage.getItem(STORAGE_KEY);

        if (savedData) {

            try {

                return JSON.parse(savedData);

            } catch (error) {

                console.log("Storage data corrupted.");
            }
        }

        const data =
            JSON.parse(JSON.stringify(initialData));

        saveData(data);

        return data;
    }


    /* =====================================================
       SAVE DATA
    ===================================================== */

    function saveData(data) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );
    }


    let reviewData = loadData();


    /* =====================================================
       SIMULATE SMALL NEW UPDATE
       
       IMPORTANT:
       We DON'T randomly change everything.
       Only occasionally add one new item.
    ===================================================== */

    function simulateNewActivity() {

        if (reviewData.length >= MAX_ITEMS) {
            return;
        }

        // Only 30% chance of receiving new data
        const shouldAdd =
            Math.random() < 0.30;

        if (!shouldAdd) {
            return;
        }


        const activities = [
            {
                input: "Pipe spool installation completed",
                activity: "PIP-801",
                discipline: "Piping"
            },

            {
                input: "Cable termination completed",
                activity: "ELE-802",
                discipline: "Electrical"
            },

            {
                input: "Foundation work completed",
                activity: "CIV-803",
                discipline: "Civil"
            },

            {
                input: "Pressure sensor installation",
                activity: "INS-804",
                discipline: "Instrumentation"
            },

            {
                input: "Pipe support inspection completed",
                activity: "PIP-805",
                discipline: "Piping"
            }
        ];


        const randomActivity =
            activities[
                Math.floor(
                    Math.random() * activities.length
                )
            ];


        const confidence =
            Math.floor(
                Math.random() * 50
            ) + 50;


        let reason;


        if (confidence >= 80) {

            reason = "High confidence";

        } else if (confidence >= 60) {

            reason = "Terminology mismatch";

        } else {

            reason = "Low semantic similarity";
        }


        const newItem = {

            id:
                Date.now(),

            input:
                randomActivity.input,

            activity:
                randomActivity.activity,

            discipline:
                randomActivity.discipline,

            confidence:
                confidence,

            reason:
                reason,

            source:
                "Daily Report",

            time:
                new Date().toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                ),

            status:
                "pending"
        };


        reviewData.push(newItem);

        saveData(reviewData);


        console.log(
            "New activity received:",
            newItem
        );
    }


    /* =====================================================
       GET COUNTS
    ===================================================== */

    function calculateCounts() {

        const pending =
            reviewData.filter(
                item =>
                    item.status === "pending"
            );


        return {

            total:
                pending.length,

            high:
                pending.filter(
                    item =>
                        item.confidence >= 80
                ).length,

            medium:
                pending.filter(
                    item =>
                        item.confidence >= 60 &&
                        item.confidence < 80
                ).length,

            low:
                pending.filter(
                    item =>
                        item.confidence < 60
                ).length,

            unmatched:
                pending.filter(
                    item =>
                        item.activity === "UNMATCHED"
                ).length,

            piping:
                pending.filter(
                    item =>
                        item.discipline === "Piping"
                ).length,

            civil:
                pending.filter(
                    item =>
                        item.discipline === "Civil"
                ).length,

            electrical:
                pending.filter(
                    item =>
                        item.discipline === "Electrical"
                ).length,

            instrumentation:
                pending.filter(
                    item =>
                        item.discipline === "Instrumentation"
                ).length
        };
    }


    /* =====================================================
       HELPER
    ===================================================== */

    function updateElement(
        id,
        value
    ) {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                value;
        }
    }


    /* =====================================================
       RENDER TABLE
       
       This section works if your table has:
       #reviewTableBody
    ===================================================== */

    function renderTable() {

        const tableBody =
            document.getElementById(
                "reviewTableBody"
            );


        if (!tableBody) {

            console.log(
                "Table body not found."
            );

            return;
        }


        const pending =
            reviewData.filter(
                item =>
                    item.status === "pending"
            );


        tableBody.innerHTML = "";


        pending.forEach(item => {

            let confidenceClass;


            if (item.confidence >= 80) {

                confidenceClass =
                    "high";

            } else if (item.confidence >= 60) {

                confidenceClass =
                    "medium";

            } else {

                confidenceClass =
                    "low";
            }


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        "${item.input}"
                    </strong>
                </td>

                <td>
                    ${item.activity}
                </td>

                <td>
                    ${item.discipline}
                </td>

                <td>
                    <span
                        class="confidence ${confidenceClass}"
                    >
                        ${item.confidence}%
                    </span>
                </td>

                <td>
                    ${item.reason}
                </td>

                <td>
                    ${item.source}
                    ·
                    ${item.time}
                </td>

                <td>

                    <div class="actions">

                        <button
                            class="action-btn approve"
                            data-action="approve"
                            data-id="${item.id}"
                        >
                            Approve
                        </button>

                        <button
                            class="action-btn reject"
                            data-action="reject"
                            data-id="${item.id}"
                        >
                            Reject
                        </button>

                        <button
                            class="action-btn"
                            data-action="mapping"
                            data-id="${item.id}"
                        >
                            Change Mapping
                        </button>

                        <button
                            class="action-btn"
                            data-action="create"
                            data-id="${item.id}"
                        >
                            Create Activity
                        </button>

                    </div>

                </td>
            `;


            tableBody.appendChild(row);
        });
    }


    /* =====================================================
       BUTTON ACTIONS
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-action]"
                );


            if (!button) {
                return;
            }


            const id =
                Number(
                    button.dataset.id
                );


            const action =
                button.dataset.action;


            const item =
                reviewData.find(
                    item =>
                        item.id === id
                );


            if (!item) {
                return;
            }


            /* =========================
               APPROVE
            ========================= */

            if (action === "approve") {

                item.status =
                    "approved";

                saveData(reviewData);

                updateSidebar();

                renderTable();

                showMessage(
                    "Activity approved successfully."
                );
            }


            /* =========================
               REJECT
            ========================= */

            else if (action === "reject") {

                item.status =
                    "rejected";

                saveData(reviewData);

                updateSidebar();

                renderTable();

                showMessage(
                    "Activity rejected."
                );
            }


            /* =========================
               CHANGE MAPPING
            ========================= */

            else if (action === "mapping") {

                const newMapping =
                    prompt(
                        "Enter new activity ID:",
                        item.activity
                    );


                if (
                    newMapping &&
                    newMapping.trim()
                ) {

                    item.activity =
                        newMapping.trim();

                    item.reason =
                        "Manually mapped by planner";

                    saveData(reviewData);

                    renderTable();

                    showMessage(
                        "Mapping updated successfully."
                    );
                }
            }


            /* =========================
               CREATE ACTIVITY
            ========================= */

            else if (action === "create") {

                item.status =
                    "created";

                saveData(reviewData);

                updateSidebar();

                renderTable();

                showMessage(
                    "New activity created."
                );
            }

        }
    );


    /* =====================================================
       SIMPLE MESSAGE
    ===================================================== */

    function showMessage(message) {

        /*
         * Use alert for now.
         * You can replace this later with
         * your existing notification/toast.
         */

        alert(message);
    }


    /* =====================================================
       SEARCH
    ===================================================== */

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                const search =
                    this.value
                        .trim()
                        .toLowerCase();


                const rows =
                    document.querySelectorAll(
                        "#reviewTableBody tr"
                    );


                rows.forEach(row => {

                    const text =
                        row.textContent
                            .toLowerCase();


                    row.style.display =
                        text.includes(search)
                            ? ""
                            : "none";
                });

            }
        );
    }


    /* =====================================================
       SIMULATE NEW DATA
    ===================================================== */

    simulateNewActivity();


    /* =====================================================
       INITIAL UI
    ===================================================== */

    updateSidebar();

    renderTable();


    /* =====================================================
       DEBUG INFORMATION
    ===================================================== */

    console.log(
        "Planner Review System Loaded"
    );

    console.log(
        "Current review data:",
        reviewData
    );

});
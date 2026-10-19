
(() => {
"use strict";

const SUBJECT = {"name": "Statics", "skills": [["Force Components", "resolve vectors using geometry and trig"], ["Position / Unit Vectors", "endpoint minus start; normalize"], ["Particle Equilibrium", "sum of forces = 0"], ["Free-Body Diagrams", "isolate body and replace supports"], ["Support Reactions", "pin, roller, fixed, cable"], ["Moments", "M = r \u00d7 F or F d-perpendicular"], ["Rigid-Body Equilibrium", "\u03a3Fx = \u03a3Fy = \u03a3M = 0"], ["Distributed Loads", "area gives force; centroid gives location"], ["Centroids", "area-weighted coordinates"], ["Trusses", "method of joints / sections"], ["Zero-Force Members", "identify unloaded-joint patterns"], ["Frames and Machines", "separate rigid members and solve equilibrium"]]};

const KEY = "mastery_engine_" + SUBJECT.name.replace(/\W+/g,"_").toLowerCase();

let state;
try {
  state = JSON.parse(localStorage.getItem(KEY) || "{}");
} catch {
  state = {};
}

state.skills ??= {};
state.sessions ??= 0;
state.lastStudy ??= null;

for (const [name] of SUBJECT.skills) {
  state.skills[name] ??= {
    concept:0,
    recall:0,
    solve:0,
    transfer:0,
    attempts:0,
    mistakes:0
  };
}

function save(){
  localStorage.setItem(KEY, JSON.stringify(state));
}

function score(skill){
  const s = state.skills[skill];
  return Math.round(
    .15*s.concept +
    .20*s.recall +
    .40*s.solve +
    .25*s.transfer
  );
}

function weakest(){
  return [...SUBJECT.skills]
    .map(([name]) => [name, score(name)])
    .sort((a,b)=>a[1]-b[1])[0];
}

function readiness(){
  const scores=SUBJECT.skills.map(([name])=>score(name));
  return Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
}

const css=document.createElement("style");
css.textContent=`
#mastery-engine{
 max-width:1100px;margin:30px auto;padding:20px;
 font-family:system-ui,-apple-system,sans-serif
}
#mastery-engine .me-card{
 background:#111827;color:#f8fafc;border:1px solid #334155;
 border-radius:18px;padding:20px;margin:14px 0
}
#mastery-engine .me-grid{
 display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px
}
#mastery-engine .me-skill{
 background:#0b1220;border:1px solid #334155;border-radius:14px;padding:14px
}
#mastery-engine .me-bar{
 height:9px;background:#263247;border-radius:999px;overflow:hidden;margin:8px 0
}
#mastery-engine .me-bar div{height:100%;background:#4ade80}
#mastery-engine button{
 padding:9px 12px;border:0;border-radius:9px;margin:3px;
 font-weight:750;cursor:pointer
}
#mastery-engine .know{background:#4ade80;color:#052e16}
#mastery-engine .miss{background:#fb7185;color:#4c0519}
#mastery-engine .practice{background:#38bdf8;color:#082f49}
#mastery-engine .muted{color:#94a3b8}
`;
document.head.appendChild(css);

const root=document.createElement("section");
root.id="mastery-engine";

root.innerHTML=`
<div class="me-card">
 <div class="muted">MASTERY COACH</div>
 <h2>${SUBJECT.name} — Mastery Dashboard</h2>
 <div class="me-grid">
  <div>
   <div class="muted">Overall readiness</div>
   <div style="font-size:2.4rem;font-weight:900" id="me-ready"></div>
  </div>
  <div>
   <div class="muted">Weakest skill</div>
   <h3 id="me-weak"></h3>
  </div>
  <div>
   <div class="muted">Mastery standard</div>
   <b>Explain → Recall → Solve → Transfer</b>
  </div>
 </div>
</div>

<div class="me-card">
 <h2>How mastery is earned</h2>
 <p>
 Recognition alone does not count as mastery.
 A skill becomes exam-ready when you can:
 </p>
 <ol>
  <li>Explain what the concept means.</li>
  <li>Recall the governing equation without prompting.</li>
  <li>Solve a normal problem correctly.</li>
  <li>Solve a mixed or unfamiliar version.</li>
 </ol>
</div>

<div class="me-card">
 <h2>Skill Map</h2>
 <div id="me-skills" class="me-grid"></div>
</div>

<div class="me-card">
 <h2>Recommended study order</h2>
 <div id="me-plan"></div>
</div>
`;

document.body.appendChild(root);

function change(name,field,delta){
  const s=state.skills[name];
  s[field]=Math.max(0,Math.min(100,s[field]+delta));
  s.attempts++;
  if(delta<0)s.mistakes++;
  save();
  render();
}

function render(){
  document.getElementById("me-ready").textContent=readiness()+"%";

  const [weakName,weakScore]=weakest();
  document.getElementById("me-weak").textContent=
    weakName+" — "+weakScore+"%";

  document.getElementById("me-skills").innerHTML=
    SUBJECT.skills.map(([name,description])=>{
      const s=state.skills[name];
      const total=score(name);

      return `
      <div class="me-skill">
       <strong>${name}</strong>
       <div class="muted">${description}</div>

       <div class="me-bar">
        <div style="width:${total}%"></div>
       </div>

       <b>${total}%</b>

       <p class="muted">
        Concept ${s.concept}% · Recall ${s.recall}% ·
        Solve ${s.solve}% · Transfer ${s.transfer}%
       </p>

       <button class="know"
        onclick="window.masteryGrade('${name.replaceAll("'","")}','concept',10)">
        Explained it
       </button>

       <button class="know"
        onclick="window.masteryGrade('${name.replaceAll("'","")}','recall',10)">
        Recalled it
       </button>

       <button class="practice"
        onclick="window.masteryGrade('${name.replaceAll("'","")}','solve',12)">
        Solved one
       </button>

       <button class="practice"
        onclick="window.masteryGrade('${name.replaceAll("'","")}','transfer',15)">
        Solved hard one
       </button>

       <button class="miss"
        onclick="window.masteryGrade('${name.replaceAll("'","")}','solve',-8)">
        Missed it
       </button>
      </div>`;
    }).join("");

  const ranked=[...SUBJECT.skills]
    .map(([name])=>[name,score(name)])
    .sort((a,b)=>a[1]-b[1])
    .slice(0,4);

  document.getElementById("me-plan").innerHTML=`
   <ol>
    ${ranked.map(([name,s],i)=>`
      <li>
       <strong>${name}</strong> (${s}%)
       — ${i===0
         ? "Start here: concept review → 3 basic problems → 1 mixed problem."
         : "Review after the weaker skill above."}
      </li>
    `).join("")}
   </ol>
   <p>
    Do not spend equal time on everything.
    Your lowest-transfer and lowest-solving skills get priority.
   </p>
  `;
}

window.masteryGrade=change;
render();

})();

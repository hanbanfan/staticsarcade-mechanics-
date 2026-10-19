
(() => {
"use strict";

const CFG = {"name": "Statics", "color": "#a78bfa", "concepts": [{"name": "Force Components", "clue": "A force is given by magnitude and direction.", "principle": "Resolve into x and y before equilibrium.", "why": "Equilibrium equations operate on Cartesian components.", "mistake": "Using sin/cos from habit instead of checking which axis the angle comes from."}, {"name": "Free-Body Diagrams", "clue": "Any equilibrium problem involving supports, cables, or connected bodies.", "principle": "Isolate one body and replace every interaction with forces/moments.", "why": "Equations are only valid after the physical body is isolated correctly.", "mistake": "Leaving supports drawn instead of replacing them with reactions."}, {"name": "Moments", "clue": "A force acts some distance from the point of interest.", "principle": "M = r \u00d7 F or F d\u22a5", "why": "Moment measures rotational tendency.", "mistake": "Using the wrong distance instead of perpendicular distance."}, {"name": "Rigid-Body Equilibrium", "clue": "One rigid body is static under applied loads and reactions.", "principle": "\u03a3Fx=0, \u03a3Fy=0, \u03a3M=0", "why": "No linear acceleration and no angular acceleration.", "mistake": "Taking moments about a point that creates unnecessary unknowns."}, {"name": "Distributed Loads", "clue": "Load intensity is given in force per unit length.", "principle": "Resultant = area; location = centroid of load diagram.", "why": "The equivalent point force must preserve both total force and moment.", "mistake": "Putting the resultant at the geometric middle when the load is triangular."}, {"name": "Centroids", "clue": "The problem asks for geometric center of an area.", "principle": "x\u0304=\u03a3xA/\u03a3A, \u0233=\u03a3yA/\u03a3A", "why": "Centroid is an area-weighted average.", "mistake": "Forgetting holes use negative area."}, {"name": "Trusses", "clue": "Straight two-force members connected by idealized pins.", "principle": "Joints: \u03a3Fx=0 and \u03a3Fy=0", "why": "Each ideal truss joint behaves like a particle in equilibrium.", "mistake": "Forgetting member forces act along the member axis."}, {"name": "Frames & Machines", "clue": "Multiple connected rigid members carry loads.", "principle": "Separate members and write equilibrium for each.", "why": "Internal pin forces become visible only after members are isolated.", "mistake": "Trying to solve the entire assembly without separating members."}]};

const STORE =
  "mastery_accelerator_" +
  CFG.name.replace(/\W+/g,"_").toLowerCase();

let state;

try {
  state = JSON.parse(localStorage.getItem(STORE) || "{}");
} catch {
  state = {};
}

state.records ??= {};

for (const c of CFG.concepts) {
  state.records[c.name] ??= {
    recognized:0,
    principle:0,
    explain:0,
    solved:0,
    transferred:0,
    mistakes:0
  };
}

function save(){
  localStorage.setItem(STORE,JSON.stringify(state));
}

function mastery(name){
  const s=state.records[name];

  return Math.round(
    s.recognized*0.10 +
    s.principle*0.15 +
    s.explain*0.15 +
    s.solved*0.30 +
    s.transferred*0.30
  );
}

function overall(){
  const vals=CFG.concepts.map(c=>mastery(c.name));
  return Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
}

function weakest(){
  return CFG.concepts
    .map(c=>[c.name,mastery(c.name)])
    .sort((a,b)=>a[1]-b[1])[0];
}

const style=document.createElement("style");

style.textContent=`
#mastery-accelerator{
  max-width:1100px;
  margin:35px auto;
  padding:22px;
  border-radius:22px;
  background:#0f172a;
  color:#f8fafc;
  border:1px solid #475569;
  font-family:system-ui,-apple-system,sans-serif;
}

#mastery-accelerator *{
  box-sizing:border-box;
}

#mastery-accelerator .ma-eyebrow{
  color:${CFG.color};
  font-weight:900;
  letter-spacing:.12em;
  font-size:.75rem;
}

#mastery-accelerator .ma-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
  gap:12px;
}

#mastery-accelerator .ma-card{
  background:#111827;
  border:1px solid #334155;
  border-radius:16px;
  padding:17px;
  margin:12px 0;
}

#mastery-accelerator .ma-bar{
  height:10px;
  border-radius:999px;
  overflow:hidden;
  background:#334155;
  margin:8px 0;
}

#mastery-accelerator .ma-fill{
  height:100%;
  background:${CFG.color};
}

#mastery-accelerator button{
  padding:9px 11px;
  margin:3px;
  border:0;
  border-radius:9px;
  font:inherit;
  font-weight:800;
  cursor:pointer;
}

#mastery-accelerator .ma-good{
  background:#4ade80;
  color:#052e16;
}

#mastery-accelerator .ma-mid{
  background:#38bdf8;
  color:#082f49;
}

#mastery-accelerator .ma-hard{
  background:#a78bfa;
  color:#2e1065;
}

#mastery-accelerator .ma-bad{
  background:#fb7185;
  color:#4c0519;
}

#mastery-accelerator .ma-muted{
  color:#94a3b8;
}

#mastery-accelerator .ma-clinic{
  background:#020617;
  border-radius:12px;
  padding:14px;
  margin-top:10px;
}

#mastery-accelerator .ma-number{
  font-size:2.5rem;
  font-weight:950;
}

#ma-jump{
  position:fixed;
  bottom:16px;
  left:16px;
  z-index:9999;
  border:0;
  border-radius:999px;
  padding:11px 14px;
  background:${CFG.color};
  color:#06111f;
  font-weight:900;
  cursor:pointer;
}

@media(max-width:750px){
  #mastery-accelerator{
    margin:20px 10px;
  }
}
`;

document.head.appendChild(style);

const root=document.createElement("section");
root.id="mastery-accelerator";

root.innerHTML=`

<div class="ma-eyebrow">
  MASTERY ACCELERATOR
</div>

<h2>${CFG.name}: Learn Like an Engineer</h2>

<div class="ma-grid">

  <div class="ma-card">
    <div class="ma-muted">Overall mastery</div>
    <div class="ma-number" id="ma-overall"></div>
    <p class="ma-muted">
      Solving and transfer count far more than recognition.
    </p>
  </div>

  <div class="ma-card">
    <div class="ma-muted">Study next</div>
    <h3 id="ma-weak"></h3>
    <p id="ma-next"></p>
  </div>

</div>

<div class="ma-card">

  <h2>🧭 Problem Recognition Trainer</h2>

  <p>
    Before touching a formula, identify what kind of problem you are looking at.
  </p>

  <select id="ma-concept"></select>

  <div id="ma-concept-detail" class="ma-clinic"></div>

</div>

<div class="ma-card">

  <h2>🧠 Equation Decision Training</h2>

  <p>
    For each topic, answer these five questions:
  </p>

  <ol>
    <li>What clue tells me what kind of problem this is?</li>
    <li>What governing principle applies?</li>
    <li>Why does that principle physically make sense?</li>
    <li>What is the most likely mistake?</li>
    <li>How would I know my numerical answer is unreasonable?</li>
  </ol>

</div>

<div class="ma-card">

  <h2>🚑 Mistake Clinic</h2>

  <p>
    A wrong answer is classified instead of simply marked wrong.
  </p>

  <div class="ma-grid">

    <div class="ma-clinic">
      <b>TYPE A — Recognition error</b>
      <p>You solved the wrong kind of problem.</p>
    </div>

    <div class="ma-clinic">
      <b>TYPE B — Model error</b>
      <p>You chose an equation whose assumptions do not apply.</p>
    </div>

    <div class="ma-clinic">
      <b>TYPE C — Setup error</b>
      <p>The physics was correct but equations/signs/FBD were not.</p>
    </div>

    <div class="ma-clinic">
      <b>TYPE D — Math / units error</b>
      <p>The setup was correct but algebra, arithmetic, or units failed.</p>
    </div>

    <div class="ma-clinic">
      <b>TYPE E — Sanity-check error</b>
      <p>You accepted an answer that should have looked physically impossible.</p>
    </div>

  </div>

</div>

<div class="ma-card">

  <h2>📈 Skill Evidence</h2>

  <p class="ma-muted">
    Mark these only when you actually prove them.
  </p>

  <div id="ma-skills" class="ma-grid"></div>

</div>
`;

document.body.appendChild(root);

const jump=document.createElement("button");
jump.id="ma-jump";
jump.textContent="🧠 Mastery";

jump.onclick=()=>{
  root.scrollIntoView({
    behavior:"smooth",
    block:"start"
  });
};

document.body.appendChild(jump);

const select=root.querySelector("#ma-concept");

select.innerHTML=CFG.concepts
  .map((c,i)=>`<option value="${i}">${c.name}</option>`)
  .join("");

function showConcept(){

  const c=CFG.concepts[Number(select.value)];

  root.querySelector("#ma-concept-detail").innerHTML=`

    <p>
      <b>CLUE:</b><br>
      ${c.clue}
    </p>

    <p>
      <b>GOVERNING PRINCIPLE:</b><br>
      ${c.principle}
    </p>

    <p>
      <b>WHY IT WORKS:</b><br>
      ${c.why}
    </p>

    <p>
      <b>COMMON TRAP:</b><br>
      ${c.mistake}
    </p>
  `;
}

select.onchange=showConcept;

function grade(name,field,amount){

  const s=state.records[name];

  s[field]=Math.max(
    0,
    Math.min(100,s[field]+amount)
  );

  if(amount<0){
    s.mistakes++;
  }

  save();
  render();
}

window.masteryAcceleratorGrade=grade;

function render(){

  root.querySelector("#ma-overall").textContent=
    overall()+"%";

  const [name,score]=weakest();

  root.querySelector("#ma-weak").textContent=
    `${name} — ${score}%`;

  root.querySelector("#ma-next").textContent=
    score<30
      ? "Review the concept and governing principle, then solve 2 basic problems."
      : score<60
      ? "Stop rereading. Solve 3 normal problems without notes."
      : score<80
      ? "Use Exam / Curveball problems and explain every assumption."
      : "Maintain it with mixed cumulative practice.";

  root.querySelector("#ma-skills").innerHTML=
    CFG.concepts.map(c=>{

      const s=state.records[c.name];
      const m=mastery(c.name);
      const safe=c.name.replaceAll("'","");

      return `

      <div class="ma-card">

        <strong>${c.name}</strong>

        <div class="ma-bar">
          <div class="ma-fill"
               style="width:${m}%"></div>
        </div>

        <b>${m}%</b>

        <p class="ma-muted">
          Recognize ${s.recognized}% ·
          Principle ${s.principle}% ·
          Explain ${s.explain}% ·
          Solve ${s.solved}% ·
          Transfer ${s.transferred}%
        </p>

        <button
          class="ma-good"
          onclick="masteryAcceleratorGrade('${safe}','recognized',10)">
          Recognized
        </button>

        <button
          class="ma-good"
          onclick="masteryAcceleratorGrade('${safe}','principle',10)">
          Chose principle
        </button>

        <button
          class="ma-mid"
          onclick="masteryAcceleratorGrade('${safe}','explain',10)">
          Explained why
        </button>

        <button
          class="ma-mid"
          onclick="masteryAcceleratorGrade('${safe}','solved',12)">
          Solved alone
        </button>

        <button
          class="ma-hard"
          onclick="masteryAcceleratorGrade('${safe}','transferred',15)">
          Solved curveball
        </button>

        <button
          class="ma-bad"
          onclick="masteryAcceleratorGrade('${safe}','solved',-8)">
          Missed it
        </button>

      </div>
      `;

    }).join("");
}

showConcept();
render();

})();

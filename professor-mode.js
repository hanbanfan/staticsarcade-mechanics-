
(() => {
"use strict";

const CONFIG = {"name": "Statics", "questions": [{"topic": "Force Components", "type": "number", "q": "A 500 N force acts 30\u00b0 above +x. Find Fx in N.", "answer": 433.0127, "tol": 0.02, "solution": "Fx = F cos\u03b8 = 500 cos30\u00b0 = 433 N."}, {"topic": "Moments", "type": "number", "q": "A 400 N downward force acts 3 m to the right of O. Enter moment magnitude in N\u00b7m.", "answer": 1200, "tol": 0.02, "solution": "|M| = Fd = 400(3) = 1200 N\u00b7m. Direction is clockwise."}, {"topic": "Support Reactions", "type": "text", "q": "What reactions does a 2D pin support provide?", "keywords": ["x", "y"], "solution": "A pin provides two force components, Ax and Ay, but no moment reaction."}, {"topic": "Support Reactions", "type": "text", "q": "A frictionless roller reaction acts in what direction relative to the supporting surface?", "keywords": ["normal"], "solution": "The reaction is normal/perpendicular to the supporting surface."}, {"topic": "Rigid-Body Equilibrium", "type": "text", "q": "State the three independent 2D rigid-body equilibrium equations.", "keywords": ["fx", "fy", "m"], "solution": "\u03a3Fx=0, \u03a3Fy=0, and \u03a3M=0."}, {"topic": "Beam Reactions", "type": "number", "q": "A simply supported 8 m beam carries 1000 N downward at x=2 m from A. Find By.", "answer": 250, "tol": 0.02, "solution": "\u03a3MA=0: 8By - 1000(2)=0. By=250 N."}, {"topic": "Centroids", "type": "number", "q": "A rectangle is 10 cm wide. Find x-bar from its left edge.", "answer": 5, "tol": 0.02, "solution": "By symmetry the centroid is at b/2 = 5 cm."}, {"topic": "Distributed Loads", "type": "number", "q": "A uniform load of 300 N/m acts across 4 m. Find equivalent resultant force.", "answer": 1200, "tol": 0.02, "solution": "Resultant = area under load diagram = wL = 300(4)=1200 N."}, {"topic": "Trusses", "type": "text", "q": "What equilibrium equations are normally used at an ideal 2D truss joint?", "keywords": ["fx", "fy"], "solution": "Treat the joint as a particle: \u03a3Fx=0 and \u03a3Fy=0."}, {"topic": "Trusses", "type": "text", "q": "You assume a truss member is in tension and obtain a negative force. What does that mean?", "keywords": ["compression"], "solution": "The member is actually in compression."}, {"topic": "Frames & Machines", "type": "text", "q": "What is the first major step for solving a frame or machine?", "keywords": ["separate", "fbd"], "solution": "Separate the connected members and draw a free-body diagram for each."}]};

const STORE = "professor_mode_" + CONFIG.name.replace(/\W+/g,"_").toLowerCase();

let state;
try {
  state=JSON.parse(localStorage.getItem(STORE)||"{}");
} catch {
  state={};
}

state.history ??=[];
state.topicScores ??={};

let exam=[];
let submitted=false;

function shuffle(a){
  const x=[...a];
  for(let i=x.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [x[i],x[j]]=[x[j],x[i]];
  }
  return x;
}

function adaptiveState(){
  try{
    const key=CONFIG.name==="Advanced Composites"
      ? "adaptive_mastery_composites"
      : "adaptive_mastery_"+CONFIG.name.toLowerCase();

    return JSON.parse(localStorage.getItem(key)||"{}");
  }catch{
    return {};
  }
}

function makeExam(){

  submitted=false;

  const weak=[];

  const ad=adaptiveState();

  if(ad.skills){
    Object.entries(ad.skills)
      .sort((a,b)=>(a[1].level||0)-(b[1].level||0))
      .forEach(([name])=>{
        CONFIG.questions
          .filter(q=>q.topic.toLowerCase().includes(name.toLowerCase()) ||
                     name.toLowerCase().includes(q.topic.toLowerCase()))
          .forEach(q=>weak.push(q));
      });
  }

  const pool=[];
  const seen=new Set();

  [...weak,...shuffle(CONFIG.questions)].forEach(q=>{
    const key=q.topic+"|"+q.q;
    if(!seen.has(key)){
      seen.add(key);
      pool.push(q);
    }
  });

  exam=pool.slice(0,Math.min(10,pool.length));

  renderExam();
}

function escapeHTML(s){
  return String(s)
   .replaceAll("&","&amp;")
   .replaceAll("<","&lt;")
   .replaceAll(">","&gt;");
}

function renderExam(){

  const box=document.getElementById("pm-exam");

  box.innerHTML=`
    <div class="pm-banner">
      <strong>CLOSED-BOOK RULE:</strong>
      No hints, notes, solver, or solution reveal until you submit.
    </div>

    ${exam.map((q,i)=>`
      <div class="pm-question">
        <div class="pm-topic">${q.topic}</div>
        <h3>${i+1}. ${escapeHTML(q.q)}</h3>

        ${q.type==="number"
          ? `<input id="pm-a-${i}" type="number" step="any" placeholder="Numerical answer">`
          : `<textarea id="pm-a-${i}" rows="3" placeholder="Explain in your own words"></textarea>`
        }

        <div id="pm-r-${i}"></div>
      </div>
    `).join("")}

    <button class="pm-primary" id="pm-submit">
      Submit Professor Exam
    </button>
  `;

  document.getElementById("pm-submit").onclick=gradeExam;
}

function textCorrect(answer,q){

  const normalized=answer.toLowerCase();

  const found=q.keywords.filter(k=>
    normalized.includes(k.toLowerCase())
  );

  /*
  For one-keyword conceptual questions require that keyword.
  For multi-keyword questions require most of them.
  */
  const need=Math.max(1,Math.ceil(q.keywords.length*.6));

  return found.length>=need;
}

function gradeExam(){

  if(submitted)return;

  submitted=true;

  let correct=0;
  const topicResult={};
  const misses=[];

  exam.forEach((q,i)=>{

    const input=document.getElementById(`pm-a-${i}`);
    const raw=input.value.trim();

    let ok=false;

    if(q.type==="number"){

      const n=Number(raw);

      if(Number.isFinite(n)){
        const tolerance=Math.max(
          .005,
          Math.abs(q.answer)*(q.tol||.015)
        );

        ok=Math.abs(n-q.answer)<=tolerance;
      }

    }else{

      ok=textCorrect(raw,q);

    }

    topicResult[q.topic] ??={correct:0,total:0};
    topicResult[q.topic].total++;

    if(ok){
      correct++;
      topicResult[q.topic].correct++;
    }else{
      misses.push(q);
    }

    const result=document.getElementById(`pm-r-${i}`);

    result.className=ok ? "pm-result good" : "pm-result bad";

    result.innerHTML=ok
      ? `<strong>✓ Correct</strong>`
      : `
        <strong>✗ Needs correction</strong>
        <p><b>Expected reasoning:</b> ${escapeHTML(q.solution)}</p>
      `;
  });

  const percent=Math.round(100*correct/exam.length);

  state.history.push({
    date:new Date().toISOString(),
    score:percent
  });

  if(state.history.length>20) state.history.shift();

  Object.entries(topicResult).forEach(([topic,r])=>{
    const score=Math.round(100*r.correct/r.total);
    state.topicScores[topic]=score;
  });

  localStorage.setItem(STORE,JSON.stringify(state));

  const report=document.getElementById("pm-report");

  report.innerHTML=`
    <div class="pm-score ${percent>=80?"pass":"fail"}">
      ${percent}%
    </div>

    <h3>
      ${percent>=80
        ? "Exam passed — now check for weak topics."
        : "Not mastered yet — correction round required."}
    </h3>

    <p>
      Correct: ${correct}/${exam.length}
    </p>

    <h3>Topic breakdown</h3>

    ${Object.entries(topicResult)
      .map(([topic,r])=>{
        const s=Math.round(100*r.correct/r.total);
        return `
          <div class="pm-topic-row">
            <span>${topic}</span>
            <strong>${s}%</strong>
          </div>
        `;
      }).join("")}

    ${misses.length
      ? `
      <div class="pm-correction">
        <h3>Correction Prescription</h3>
        <p>Do these before taking another Professor Exam:</p>
        <ol>
        ${misses.map(q=>`
          <li>
            <b>${q.topic}</b><br>
            ${escapeHTML(q.solution)}
          </li>
        `).join("")}
        </ol>
      </div>
      `
      : `
      <div class="pm-correction">
        <h3>Perfect correction status</h3>
        <p>No missed questions this round.</p>
      </div>
      `}
  `;

  /*
   Transfer exam result into mastery engine if it exists.
  */
  if(typeof window.masteryGrade==="function"){

    Object.entries(topicResult).forEach(([topic,r])=>{

      const s=r.correct/r.total;

      if(s>=.8){
        try{
          window.masteryGrade(topic,"transfer",15);
        }catch{}
      }

    });
  }

  report.scrollIntoView({behavior:"smooth"});
}

const style=document.createElement("style");

style.textContent=`
#professor-mode{
 max-width:1100px;
 margin:35px auto;
 padding:22px;
 background:#111827;
 color:#f8fafc;
 border:1px solid #475569;
 border-radius:22px;
 font-family:system-ui,-apple-system,sans-serif;
}

#professor-mode *{box-sizing:border-box}

#professor-mode .pm-banner{
 background:#3b1922;
 border-left:5px solid #fb7185;
 padding:15px;
 border-radius:10px;
 margin:14px 0;
}

#professor-mode .pm-question{
 background:#0b1220;
 border:1px solid #334155;
 border-radius:15px;
 padding:18px;
 margin:14px 0;
}

#professor-mode .pm-topic{
 color:#7dd3fc;
 text-transform:uppercase;
 letter-spacing:.08em;
 font-size:.75rem;
 font-weight:900;
}

#professor-mode input,
#professor-mode textarea{
 width:100%;
 max-width:720px;
 padding:12px;
 border:1px solid #64748b;
 border-radius:10px;
 background:white;
 color:#111827;
 font:inherit;
}

#professor-mode .pm-primary{
 padding:13px 18px;
 border:0;
 border-radius:10px;
 background:#4ade80;
 color:#052e16;
 font-weight:900;
 font:inherit;
 cursor:pointer;
}

#professor-mode .pm-result{
 margin-top:12px;
 padding:12px;
 border-radius:10px;
}

#professor-mode .pm-result.good{
 background:#163a2d;
}

#professor-mode .pm-result.bad{
 background:#4a2029;
}

#professor-mode .pm-score{
 font-size:3rem;
 font-weight:950;
 margin-top:20px;
}

#professor-mode .pm-score.pass{color:#4ade80}
#professor-mode .pm-score.fail{color:#fb7185}

#professor-mode .pm-topic-row{
 display:flex;
 justify-content:space-between;
 gap:12px;
 padding:8px;
 border-bottom:1px solid #334155;
}

#professor-mode .pm-correction{
 margin-top:20px;
 background:#172033;
 padding:18px;
 border-radius:14px;
}
`;

document.head.appendChild(style);

const root=document.createElement("section");

root.id="professor-mode";

root.innerHTML=`
 <div class="pm-topic">PROFESSOR MODE</div>

 <h2>🎓 ${CONFIG.name} Closed-Book Exam</h2>

 <p>
 This is the mastery gate.
 No multiple choice and no solution reveal before submission.
 The exam prioritizes weak material when mastery data is available.
 </p>

 <button class="pm-primary" id="pm-new">
   Generate New Professor Exam
 </button>

 <div id="pm-exam"></div>

 <div id="pm-report"></div>
`;

document.body.appendChild(root);

document.getElementById("pm-new").onclick=makeExam;

makeExam();

})();

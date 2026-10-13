
(() => {
"use strict";

const title = document.title.toLowerCase();

let cfg;

if (title.includes("circuits")) {
  cfg = {
    key:"circuits",
    name:"Circuits Circus",
    topics:[
      "Ohm's Law",
      "Series / Parallel",
      "Voltage Divider",
      "Current Divider",
      "KCL",
      "KVL",
      "Nodal Analysis",
      "Mesh Analysis",
      "Thevenin",
      "Norton",
      "Power",
      "Equivalent Resistance"
    ],
    cards:[
      ["Ohm's Law","V = IR"],
      ["Solve Ohm's Law for current","I = V/R"],
      ["Solve Ohm's Law for resistance","R = V/I"],
      ["Series resistors","Req = R1 + R2 + ..."],
      ["Two resistors in parallel","Req = R1R2/(R1+R2)"],
      ["What stays the same in series?","Current"],
      ["What stays the same in parallel?","Voltage"],
      ["Voltage divider","Vout = Vs·R2/(R1+R2)"],
      ["KCL","Current entering a node = current leaving"],
      ["KVL","Sum of voltages around a closed loop = 0"],
      ["Turn off an ideal voltage source","Replace it with a short"],
      ["Turn off an ideal current source","Replace it with an open"],
      ["Thevenin voltage","Open-circuit voltage at the terminals"],
      ["Thevenin resistance","Resistance seen from output with sources off"],
      ["Norton current","Short-circuit output current"],
      ["Power","P = VI = I²R = V²/R"]
    ],
    videos:[
      ["Ohm's Law — under 5 min","https://www.youtube.com/watch?v=uZ-m91IEkjQ"],
      ["KCL, KVL, Thevenin & Norton overview","https://www.youtube.com/watch?v=50GeKrmfS8w"],
      ["DC circuits chaptered review","https://www.youtube.com/watch?v=sqxzQkAdJm0"]
    ]
  };
}

else if (title.includes("statics")) {
  cfg = {
    key:"statics",
    name:"Statics Arcade",
    topics:[
      "Vectors",
      "Force Components",
      "Free-Body Diagrams",
      "Support Reactions",
      "Moments",
      "Couples",
      "Rigid-Body Equilibrium",
      "Distributed Loads",
      "Centroids",
      "Trusses",
      "Method of Joints",
      "Frames & Machines"
    ],
    cards:[
      ["2D equilibrium equations","ΣFx = 0, ΣFy = 0, ΣM = 0"],
      ["Pin support reactions","Ax and Ay"],
      ["Roller support reaction","One force normal to surface"],
      ["Fixed support reactions","Ax, Ay, and reaction moment"],
      ["Cable force direction","Along the cable"],
      ["Moment magnitude","M = Fd⊥"],
      ["Vector moment","M = r × F"],
      ["Position vector A to B","rAB = rB - rA"],
      ["Unit vector","λ = r/|r|"],
      ["Force along a line","F = magnitude × unit vector"],
      ["Composite centroid x","x̄ = ΣxA/ΣA"],
      ["Hole in centroid table","Use negative area"],
      ["Distributed load magnitude","Area under load diagram"],
      ["Distributed load location","Centroid of load diagram"],
      ["Method of joints equations","ΣFx = 0 and ΣFy = 0"],
      ["Two-force member","Equal, opposite, collinear forces"]
    ],
    videos:[
      ["Trusses, Frames & Machines intro","https://www.youtube.com/watch?v=PftThd8ev0o"],
      ["Method of Joints","https://www.youtube.com/watch?v=BVCIQfFzguk"],
      ["Jeff Hanson — Moments search","https://www.youtube.com/results?search_query=Jeff+Hanson+Statics+moment+of+a+force"],
      ["Jeff Hanson — FBD search","https://www.youtube.com/results?search_query=Jeff+Hanson+Statics+free+body+diagram"],
      ["Jeff Hanson — Centroids search","https://www.youtube.com/results?search_query=Jeff+Hanson+Statics+centroids+composite+areas"]
    ]
  };
}

else if (title.includes("thermo")) {
  cfg = {
    key:"thermo",
    name:"ThermoQuest",
    topics:[
      "Systems & Boundaries",
      "Properties",
      "State Postulate",
      "Pure Substances",
      "Phase Diagrams",
      "Property Tables",
      "Quality",
      "Ideal Gas",
      "Boundary Work",
      "Closed-System First Law",
      "Mass Flow",
      "Steady-Flow Energy",
      "Turbines",
      "Compressors",
      "Pumps",
      "Nozzles / Diffusers",
      "Heat Exchangers",
      "Throttling"
    ],
    cards:[],
    videos:[
      ["Property tables / steam tables search","https://www.youtube.com/results?search_query=thermodynamics+steam+tables+property+tables+10+minutes"],
      ["Quality / saturated mixture search","https://www.youtube.com/results?search_query=thermodynamics+quality+saturated+mixture+10+minutes"],
      ["First Law — closed systems","https://www.youtube.com/watch?v=mzyHWvw1Oe0"],
      ["Steady-flow devices search","https://www.youtube.com/results?search_query=steady+flow+energy+equation+turbine+compressor+nozzle+10+minutes"]
    ]
  };
}

else if (title.includes("composite")) {
  cfg = {
    key:"composites",
    name:"Composite Quest Pro",
    topics:[
      "Fiber vs Matrix",
      "Carbon Fiber Types",
      "Glass / Aramid",
      "Anisotropy",
      "Orthotropy",
      "Volume Fraction",
      "Rule of Mixtures",
      "Longitudinal Loading",
      "Transverse Loading",
      "Critical Fiber Length",
      "Linear Density",
      "Filament Count",
      "Weibull Statistics",
      "Laminates",
      "Sandwich Structures",
      "Core Materials",
      "Impact Damage",
      "Damage Repair",
      "Prepreg",
      "Vacuum Bagging"
    ],
    cards:[],
    videos:[
      ["Rule of mixtures search","https://www.youtube.com/results?search_query=composite+materials+rule+of+mixtures+10+minutes"],
      ["Critical fiber length search","https://www.youtube.com/results?search_query=critical+fiber+length+composites+tutorial"],
      ["Weibull fiber strength search","https://www.youtube.com/results?search_query=Weibull+fiber+strength+composites+tutorial"],
      ["Sandwich structures search","https://www.youtube.com/results?search_query=composite+sandwich+structures+core+materials+tutorial"]
    ]
  };
}

if (!cfg) return;

const style = document.createElement("style");
style.textContent = `
#mastery-hub{
  display:block!important;
  max-width:1100px;
  margin:35px auto;
  padding:20px;
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
#mastery-hub .mh-card{
  display:block!important;
  background:#171b24;
  color:#f7f7f8;
  border:1px solid #3a4050;
  border-radius:18px;
  padding:20px;
  margin:14px 0;
}
#mastery-hub .mh-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
  gap:12px;
}
#mastery-hub button,
#mastery-hub a.mh-btn{
  display:inline-block;
  border:0;
  border-radius:10px;
  padding:11px 14px;
  margin:5px;
  background:#d9ddff;
  color:#11141a;
  font-weight:800;
  cursor:pointer;
  text-decoration:none;
}
#mastery-hub .mh-flash{
  min-height:190px;
  display:grid;
  place-items:center;
  text-align:center;
  font-size:1.35rem;
  padding:20px;
  background:#0f131b;
  border:2px dashed #596176;
  border-radius:15px;
  cursor:pointer;
}
#mastery-hub .mh-topic{
  display:flex;
  gap:9px;
  align-items:flex-start;
  padding:8px 0;
}
#mastery-hub .mh-video{
  padding:12px;
  background:#0f131b;
  border-radius:12px;
  margin:8px 0;
}
#mastery-jump{
  position:fixed;
  right:16px;
  bottom:16px;
  z-index:9999;
  padding:11px 14px;
  border-radius:999px;
  border:0;
  background:#d9ddff;
  color:#111;
  font-weight:900;
  cursor:pointer;
}
`;
document.head.appendChild(style);

const hub = document.createElement("div");
hub.id = "mastery-hub";

hub.innerHTML = `
<div class="mh-card">
  <div style="font-size:.8rem;font-weight:900;letter-spacing:.1em">
    MID-SEMESTER MASTERY MODE
  </div>
  <h2>${cfg.name}</h2>
  <p>
    Goal: move from “I recognize this” to “I can solve it without help.”
  </p>

  <div class="mh-grid">
    <div>
      <h3>20-minute rescue</h3>
      <ol>
        <li>5 min flashcards / recall</li>
        <li>5–10 min video on one weak concept</li>
        <li>10 min solving problems</li>
      </ol>
    </div>

    <div>
      <h3>60-minute mastery block</h3>
      <ol>
        <li>10 min recall</li>
        <li>10 min concept review</li>
        <li>25 min problems</li>
        <li>10 min mistake correction</li>
        <li>5 min formula recall</li>
      </ol>
    </div>
  </div>
</div>

<div class="mh-card">
  <h2>🎯 Half-Semester Mastery Checklist</h2>
  <p>Check something only when you can explain it AND solve a problem with it.</p>
  <div id="mh-topics"></div>
</div>

<div class="mh-card" id="mh-flash-card">
  <h2>🧠 Flashcards</h2>
  <div id="mh-flash-area"></div>
</div>

<div class="mh-card">
  <h2>▶ Video Rescue</h2>
  <p>Watch one short lesson, then immediately solve something. Do not binge videos.</p>
  <div id="mh-videos"></div>
</div>

<div class="mh-card">
  <h2>🏆 What “mastered” means</h2>
  <div class="mh-grid">
    <div><b>Level 1 — Recognize</b><br>You know what the term means.</div>
    <div><b>Level 2 — Recall</b><br>You can explain it without notes.</div>
    <div><b>Level 3 — Solve</b><br>You can solve a normal problem alone.</div>
    <div><b>Level 4 — Transfer</b><br>You can solve a mixed/unfamiliar problem.</div>
  </div>
  <p><strong>Exam-ready target:</strong> Level 3 or 4 on every major topic.</p>
</div>
`;

document.body.appendChild(hub);

const jump = document.createElement("button");
jump.id = "mastery-jump";
jump.textContent = "🎓 Mastery Hub";
jump.onclick = () => hub.scrollIntoView({behavior:"smooth"});
document.body.appendChild(jump);

const topicBox = document.getElementById("mh-topics");
const saved = JSON.parse(localStorage.getItem("mastery-"+cfg.key) || "{}");

cfg.topics.forEach((topic,i)=>{
  const row=document.createElement("label");
  row.className="mh-topic";

  const cb=document.createElement("input");
  cb.type="checkbox";
  cb.checked=!!saved[i];

  cb.onchange=()=>{
    saved[i]=cb.checked;
    localStorage.setItem("mastery-"+cfg.key,JSON.stringify(saved));
  };

  const span=document.createElement("span");
  span.textContent=topic;

  row.append(cb,span);
  topicBox.appendChild(row);
});

const videoBox=document.getElementById("mh-videos");

cfg.videos.forEach(([title,url])=>{
  const div=document.createElement("div");
  div.className="mh-video";
  div.innerHTML=`
    <strong>${title}</strong><br>
    <a class="mh-btn" href="${url}" target="_blank" rel="noopener">
      Watch / find lesson
    </a>
  `;
  videoBox.appendChild(div);
});

const flashArea=document.getElementById("mh-flash-area");

if(cfg.cards.length){
  let index=0;
  let flipped=false;
  let review=[];

  try{
    review=JSON.parse(localStorage.getItem("flash-review-"+cfg.key)||"[]");
  }catch{}

  function draw(){
    const card=cfg.cards[index];

    flashArea.innerHTML=`
      <div class="mh-flash" id="mh-card-inner">
        ${flipped ? card[1] : card[0]}
      </div>

      <div style="text-align:center;margin-top:10px">
        <button id="mh-again">× Review again</button>
        <button id="mh-flip">Flip</button>
        <button id="mh-know">✓ Know it</button>
        <button id="mh-next">Next</button>
      </div>

      <p style="text-align:center">
        Card ${index+1} of ${cfg.cards.length}
        · Review pile: ${review.length}
      </p>
    `;

    document.getElementById("mh-card-inner").onclick=()=>{
      flipped=!flipped;
      draw();
    };

    document.getElementById("mh-flip").onclick=()=>{
      flipped=!flipped;
      draw();
    };

    document.getElementById("mh-next").onclick=()=>{
      index=(index+1)%cfg.cards.length;
      flipped=false;
      draw();
    };

    document.getElementById("mh-again").onclick=()=>{
      if(!review.includes(index)) review.push(index);
      localStorage.setItem("flash-review-"+cfg.key,JSON.stringify(review));
      index=(index+1)%cfg.cards.length;
      flipped=false;
      draw();
    };

    document.getElementById("mh-know").onclick=()=>{
      review=review.filter(x=>x!==index);
      localStorage.setItem("flash-review-"+cfg.key,JSON.stringify(review));
      index=(index+1)%cfg.cards.length;
      flipped=false;
      draw();
    };
  }

  draw();
}else{
  flashArea.innerHTML=`
    <p>
      This app already has a built-in flashcard system.
      Use that deck first, then come back here for videos and the mastery checklist.
    </p>
  `;
}

})();

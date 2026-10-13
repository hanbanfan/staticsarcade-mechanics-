(() => {
"use strict";

document.title = "Statics Arcade — CET 2150";
const eyebrow=document.querySelector(".topbar .eyebrow");
if(eyebrow) eyebrow.textContent="CET 2150 · FULL COURSE MODE";

if(typeof topics !== "undefined"){
  topics.trusses="Trusses";
  topics.frames="Frames & Machines";
}

if(typeof QUESTIONS !== "undefined"){
  QUESTIONS.push(
    {
      id:"t1",topic:"trusses",
      q:"At a truss joint with no external load or support reaction, if only two non-collinear members meet, those members are:",
      a:["Both zero-force members","Both tension only","Both compression only","Always equal to the largest member force"],
      c:0,
      hint:["Think equilibrium of a joint with only two non-collinear unknown forces."],
      why:"Two non-collinear forces cannot balance each other unless both are zero."
    },
    {
      id:"t2",topic:"trusses",
      q:"The method of joints is based primarily on:",
      a:["Particle equilibrium at each joint","Centroid equations","Fluid pressure","Area moments of inertia only"],
      c:0,
      hint:["Isolate one pin joint at a time."],
      why:"Each ideal truss joint is treated as a particle, so ΣFx = 0 and ΣFy = 0."
    },
    {
      id:"t3",topic:"trusses",
      q:"When solving a truss joint, an assumed member force comes out negative. This means:",
      a:["Your entire solution is wrong","The actual force direction is opposite your assumption","The member has zero force","You must delete the FBD"],
      c:1,
      hint:["A sign can communicate direction."],
      why:"A negative result means the member acts opposite the direction you assumed."
    },
    {
      id:"fm1",topic:"frames",
      q:"For a frame or machine, the best first move is usually:",
      a:["Separate the connected members and draw FBDs","Use a centroid table","Ignore internal pins","Assume every member is a two-force member"],
      c:0,
      hint:["Frames and machines often require multiple FBDs."],
      why:"Separating members exposes internal pin forces and lets you apply equilibrium to each body."
    },
    {
      id:"fm2",topic:"frames",
      q:"A true two-force member has forces that are:",
      a:["Equal, opposite, and collinear","Perpendicular","Always vertical","Always moments"],
      c:0,
      hint:["Only two external forces act on the member."],
      why:"Equilibrium requires the two forces to be equal, opposite, and along the same line of action."
    }
  );
}

if(typeof MEMORY !== "undefined"){
  MEMORY.push(
    ["Truss joint","Use ΣFx = 0 and ΣFy = 0 at the isolated pin joint."],
    ["Zero-force member rule","Two non-collinear members at an unloaded joint → both are zero-force."],
    ["Two-force member","Forces are equal, opposite, and collinear."],
    ["Frames & machines","Separate members. Draw one FBD for each body. Show internal pin forces as action/reaction pairs."]
  );
}

if(typeof FORMULAS !== "undefined"){
  FORMULAS.push(
    {
      id:"truss",
      title:"Trusses — Method of Joints",
      text:"At each joint:\\nΣFx = 0\\nΣFy = 0\\n\\nAssume unknown member forces in tension. Negative answer → compression."
    },
    {
      id:"frames",
      title:"Frames & Machines",
      text:"1. Separate connected members.\\n2. Draw each FBD.\\n3. Internal pin forces appear equal/opposite.\\n4. Use ΣFx=0, ΣFy=0, ΣM=0 on each rigid body."
    }
  );
}

const menu=document.querySelector("#home .menu");
if(menu){
  const truss=document.createElement("button");
  truss.className="secondary";
  truss.textContent="🔺 Trusses";
  truss.onclick=()=>startTopic("trusses");

  const frames=document.createElement("button");
  frames.className="secondary";
  frames.textContent="🛠 Frames + Machines";
  frames.onclick=()=>startTopic("frames");

  const formulaButton=[...menu.querySelectorAll("button")]
    .find(b=>b.textContent.includes("Formula Sheet"));

  if(formulaButton){
    menu.insertBefore(truss,formulaButton);
    menu.insertBefore(frames,formulaButton);
  }else{
    menu.append(truss,frames);
  }
}

const home=document.getElementById("home");
if(home){
  const card=document.createElement("div");
  card.className="card brainBox";
  card.innerHTML=`
    <div class="eyebrow">FULL-COURSE SOLVING ORDER</div>
    <h2>What do I do first?</h2>
    <p><b>1.</b> Isolate the body or joint.</p>
    <p><b>2.</b> Draw the FBD before equations.</p>
    <p><b>3.</b> Resolve angled forces into components.</p>
    <p><b>4.</b> Pick a moment point that kills the most unknowns.</p>
    <p><b>5.</b> Use ΣFx = 0, ΣFy = 0, ΣM = 0.</p>
    <p><b>6.</b> Check signs, units, and one unused equilibrium equation.</p>
  `;
  home.appendChild(card);
}

if(typeof renderMastery==="function") renderMastery();
if(typeof renderStats==="function") renderStats();

})();

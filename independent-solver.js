(() => {
"use strict";

function fmt(n){
  if(!Number.isFinite(n)) return String(n);
  if(Math.abs(n)>=10000 || (Math.abs(n)>0 && Math.abs(n)<0.001))
    return n.toExponential(4);
  return Number(n.toFixed(5)).toString();
}

function steps(items){
  return items.map(([title,text])=>`
    <div class="is-step">
      <strong>${title}</strong>
      <div>${text}</div>
    </div>
  `).join("");
}

function mountSolver(title, problems){
  const css=document.createElement("style");
  css.textContent=`
  #independent-solver{
   max-width:1100px;margin:30px auto;padding:22px;
   background:#0f172a;color:#f8fafc;border:1px solid #475569;
   border-radius:20px;font-family:system-ui,-apple-system,sans-serif
  }
  #independent-solver .is-fields{
   display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));
   gap:10px
  }
  #independent-solver input,#independent-solver select{
   width:100%;padding:11px;border-radius:9px;border:1px solid #64748b;
   font:inherit;margin:4px 0 10px
  }
  #independent-solver label{display:block;font-weight:750}
  #independent-solver button{
   padding:12px 16px;border:0;border-radius:10px;background:#4ade80;
   color:#052e16;font-weight:850;cursor:pointer;margin-top:10px
  }
  #independent-solver .is-output{
   margin-top:18px;background:#020617;border-radius:14px;padding:16px
  }
  #independent-solver .is-step{
   padding:12px 0;border-bottom:1px solid #334155
  }
  #independent-solver .is-step strong{
   display:block;color:#7dd3fc;margin-bottom:5px
  }
  `;

  document.head.appendChild(css);

  const root=document.createElement("section");
  root.id="independent-solver";

  root.innerHTML=`
    <div style="color:#7dd3fc;font-weight:900">INDEPENDENT SOLVER LAB</div>
    <h2>${title}</h2>
    <p>
      This solver is separate from quizzes.
      It explains the logic, equation choice, algebra, substitution,
      answer, units, and a final sanity check.
    </p>

    <label>Problem type</label>
    <select id="is-type"></select>

    <div class="is-fields" id="is-fields"></div>

    <button id="is-go">Explain + Solve</button>

    <div class="is-output" id="is-output">
      Choose a problem type and enter the givens.
    </div>
  `;

  document.body.appendChild(root);

  const type=root.querySelector("#is-type");
  const fields=root.querySelector("#is-fields");
  const output=root.querySelector("#is-output");

  Object.entries(problems).forEach(([key,p])=>{
    const o=document.createElement("option");
    o.value=key;
    o.textContent=p.name;
    type.appendChild(o);
  });

  function render(){
    const p=problems[type.value];

    fields.innerHTML=p.fields.map(([key,label])=>`
      <div>
       <label>${label}</label>
       <input
        data-key="${key}"
        type="${key.endsWith("_list") ? "text" : "number"}"
        step="any">
      </div>
    `).join("");

    output.textContent="Enter all required givens.";
  }

  type.onchange=render;

  root.querySelector("#is-go").onclick=()=>{
    try{
      const data={};

      fields.querySelectorAll("input").forEach(input=>{
        const raw=input.value.trim();

        if(raw==="")
          throw Error("Missing: "+input.previousElementSibling.textContent);

        if(input.type==="number"){
          const n=Number(raw);
          if(!Number.isFinite(n)) throw Error("Invalid number.");
          data[input.dataset.key]=n;
        }else{
          data[input.dataset.key]=raw;
        }
      });

      output.innerHTML=steps(problems[type.value].solve(data));

    }catch(e){
      output.innerHTML=steps([
        ["INPUT CHECK",e.message]
      ]);
    }
  };

  render();
}

const P={
components:{
 name:"2D Force Components",
 fields:[["F","Force magnitude"],["theta","Angle from +x, degrees"]],
 solve:d=>{
  if(d.F<0)throw Error("Magnitude cannot be negative.");
  const r=d.theta*Math.PI/180;
  const fx=d.F*Math.cos(r);
  const fy=d.F*Math.sin(r);
  return [
   ["RECOGNIZE","A force magnitude and direction are given; resolve it into Cartesian components."],
   ["GEOMETRY","Angle is measured from +x, so x uses cosine and y uses sine."],
   ["EQUATIONS","Fx = F cosθ; Fy = F sinθ"],
   ["SUBSTITUTE",`Fx=${d.F}cos(${d.theta}°); Fy=${d.F}sin(${d.theta}°)`],
   ["ANSWER",`Fx=${fmt(fx)}, Fy=${fmt(fy)}`],
   ["CHECK",`√(Fx²+Fy²)=${fmt(Math.hypot(fx,fy))}, which should equal F=${fmt(d.F)}.`]
  ];
 }
},
moment:{
 name:"2D Moment About Point O",
 fields:[["x","Position x"],["y","Position y"],["Fx","Force Fx"],["Fy","Force Fy"]],
 solve:d=>{
  const M=d.x*d.Fy-d.y*d.Fx;
  return [
   ["RECOGNIZE","Force does not necessarily pass through O, so it creates a rotational tendency."],
   ["VECTOR LAW","MO = r × F."],
   ["2D FORM","MO = xFy - yFx."],
   ["SUBSTITUTE",`(${d.x})(${d.Fy}) - (${d.y})(${d.Fx})`],
   ["ANSWER",`MO = ${fmt(M)} force·length`],
   ["DIRECTION",M>0?"Positive → counterclockwise.":M<0?"Negative → clockwise.":"Zero moment."],
   ["CHECK","A force whose line of action passes through O must produce zero moment."]
  ];
 }
},
beam:{
 name:"Pin-Roller Beam — One Point Load",
 fields:[["L","Beam span"],["P","Downward load"],["a","Load distance from pin A"]],
 solve:d=>{
  if(d.L<=0||d.P<0||d.a<0||d.a>d.L)throw Error("Require L>0, P>=0, and 0<=a<=L.");
  const By=d.P*d.a/d.L;
  const Ay=d.P-By;
  return [
   ["MODEL","Pin A gives Ax, Ay. Roller B gives By. Vertical loading means Ax=0."],
   ["STRATEGY","Take moments about A first because Ax and Ay pass through A and vanish from that equation."],
   ["MOMENT EQUATION","ΣMA = 0: By·L - P·a = 0"],
   ["SOLVE By",`By = P a/L = (${d.P})(${d.a})/${d.L} = ${fmt(By)}`],
   ["VERTICAL EQUILIBRIUM","ΣFy=0: Ay + By - P = 0"],
   ["SOLVE Ay",`Ay = P - By = ${fmt(Ay)}`],
   ["CHECK",`Ay + By = ${fmt(Ay+By)} = P.`]
  ];
 }
},
centroid2:{
 name:"Composite Centroid — Two Rectangles",
 fields:[
  ["A1","Area 1"],["x1","x centroid 1"],["y1","y centroid 1"],
  ["A2","Area 2 (negative for hole)"],["x2","x centroid 2"],["y2","y centroid 2"]
 ],
 solve:d=>{
  const A=d.A1+d.A2;
  if(Math.abs(A)<1e-12)throw Error("Net area cannot be zero.");
  const x=(d.A1*d.x1+d.A2*d.x2)/A;
  const y=(d.A1*d.y1+d.A2*d.y2)/A;
  return [
   ["RECOGNIZE","This is an area-weighted-average problem."],
   ["RULE","Use negative area for a removed region or hole."],
   ["EQUATIONS","x̄=Σ(xA)/ΣA; ȳ=Σ(yA)/ΣA"],
   ["NET AREA",`ΣA = ${d.A1}+${d.A2} = ${fmt(A)}`],
   ["X CALCULATION",`x̄=[${d.A1}(${d.x1})+${d.A2}(${d.x2})]/${fmt(A)} = ${fmt(x)}`],
   ["Y CALCULATION",`ȳ=[${d.A1}(${d.y1})+${d.A2}(${d.y2})]/${fmt(A)} = ${fmt(y)}`],
   ["CHECK","The centroid should fall where the area distribution physically makes sense."]
  ];
 }
},
uniformload:{
 name:"Uniform Distributed Load → Equivalent Point Load",
 fields:[["w","Load intensity force/length"],["L","Loaded length"],["x0","Start position"]],
 solve:d=>{
  if(d.L<0)throw Error("Length cannot be negative.");
  const F=d.w*d.L;
  const x=d.x0+d.L/2;
  return [
   ["RECOGNIZE","Replace the distributed load by one statically equivalent resultant."],
   ["MAGNITUDE LOGIC","Resultant equals the AREA under the load diagram."],
   ["MAGNITUDE",`F = wL = ${d.w}(${d.L}) = ${fmt(F)}`],
   ["LOCATION LOGIC","A rectangle's centroid is at its midpoint."],
   ["LOCATION",`x = x0 + L/2 = ${d.x0}+${d.L}/2 = ${fmt(x)}`],
   ["CHECK","The replacement force must have the same total load and same moment as the distribution."]
  ];
 }
}
mountSolver("Statics — Explain the mechanics before doing algebra",P);

})();

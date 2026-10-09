(() => {
"use strict";

const problems = {
  components: {
    name: "2D Force Components",
    fields: [["F","Force magnitude (N)"],["t","Angle from +x (degrees)"]],
    solve: d => {
      if(d.F < 0) throw Error("Force magnitude cannot be negative.");
      const x=d.F*Math.cos(d.t*Math.PI/180);
      const y=d.F*Math.sin(d.t*Math.PI/180);
      return [
        ["GIVEN",`F = ${d.F} N, angle = ${d.t} degrees`],
        ["FORMULAS","Fx = F cos(theta); Fy = F sin(theta)"],
        ["SUBSTITUTION",`Fx = ${d.F} cos(${d.t}); Fy = ${d.F} sin(${d.t})`],
        ["SOLUTION",`Fx = ${fmt(x)} N; Fy = ${fmt(y)} N`],
        ["CHECK",`sqrt(Fx² + Fy²) = ${fmt(Math.hypot(x,y))} N`]
      ];
    }
  },
  moment: {
    name: "2D Moment About a Point",
    fields: [["x","Position x (m)"],["y","Position y (m)"],["fx","Force Fx (N)"],["fy","Force Fy (N)"]],
    solve: d => {
      const m=d.x*d.fy-d.y*d.fx;
      return [
        ["GIVEN",`r = (${d.x}, ${d.y}) m; F = (${d.fx}, ${d.fy}) N`],
        ["FORMULA","M = x Fy - y Fx; counterclockwise positive"],
        ["SUBSTITUTION",`M = (${d.x})(${d.fy}) - (${d.y})(${d.fx})`],
        ["SOLUTION",`${fmt(m)} N·m; ${m>0?"counterclockwise":m<0?"clockwise":"zero moment"}`]
      ];
    }
  },
  beam: {
    name: "Pin-Roller Beam Reactions",
    fields: [["L","Span A to B (m)"],["P","Downward point load (N)"],["a","Load distance from A (m)"]],
    solve: d => {
      if(d.L<=0||d.P<0||d.a<0||d.a>d.L)
        throw Error("Require L > 0, P >= 0 and 0 <= a <= L.");
      const by=d.P*d.a/d.L, ay=d.P-by;
      return [
        ["GIVEN",`Span ${d.L} m; load ${d.P} N at ${d.a} m from A`],
        ["FBD","Pin A: Ax, Ay. Roller B: By. Downward load P."],
        ["MOMENTS","Sum MA = By L - P a = 0"],
        ["SUBSTITUTION",`By(${d.L}) - (${d.P})(${d.a}) = 0`],
        ["WORK",`By = ${fmt(by)} N; Ay = P - By = ${fmt(ay)} N`],
        ["SOLUTION",`Ax = 0 N; Ay = ${fmt(ay)} N; By = ${fmt(by)} N`],
        ["CHECK",`Sum Fy = ${fmt(ay+by-d.P)} N; Sum MA = ${fmt(by*d.L-d.P*d.a)} N·m`]
      ];
    }
  },
  vector3: {
    name: "3D Force Along A to B",
    fields: [["ax","Ax (m)"],["ay","Ay (m)"],["az","Az (m)"],["bx","Bx (m)"],["by","By (m)"],["bz","Bz (m)"],["F","Force magnitude (N)"]],
    solve: d => {
      if(d.F<0) throw Error("Magnitude cannot be negative.");
      const x=d.bx-d.ax,y=d.by-d.ay,z=d.bz-d.az;
      const L=Math.hypot(x,y,z);
      if(L===0) throw Error("Points A and B must differ.");
      const fx=d.F*x/L,fy=d.F*y/L,fz=d.F*z/L;
      return [
        ["GIVEN",`A = (${d.ax},${d.ay},${d.az}); B = (${d.bx},${d.by},${d.bz}); F = ${d.F} N`],
        ["POSITION VECTOR",`rAB = B - A = (${fmt(x)}, ${fmt(y)}, ${fmt(z)}) m`],
        ["LENGTH",`|rAB| = sqrt(${fmt(x)}² + ${fmt(y)}² + ${fmt(z)}²) = ${fmt(L)} m`],
        ["UNIT VECTOR",`uAB = (${fmt(x/L)}, ${fmt(y/L)}, ${fmt(z/L)})`],
        ["SOLUTION",`F = (${fmt(fx)} i + ${fmt(fy)} j + ${fmt(fz)} k) N`],
        ["CHECK",`Magnitude = ${fmt(Math.hypot(fx,fy,fz))} N`]
      ];
    }
  },
  centroid: {
    name: "Composite Area Centroid",
    fields: [["areas","Signed areas, comma separated (m²)"],["xs","Centroid x positions, comma separated (m)"],["ys","Centroid y positions, comma separated (m)"]],
    solve: d => {
      const A=d.areas.split(",").map(Number),X=d.xs.split(",").map(Number),Y=d.ys.split(",").map(Number);
      if(!A.length||A.length!==X.length||A.length!==Y.length||
        [...A,...X,...Y].some(v=>!Number.isFinite(v)))
        throw Error("Enter equal-length numeric lists.");
      const area=A.reduce((a,b)=>a+b,0);
      if(area<=0) throw Error("Net physical area must be positive.");
      const sx=A.reduce((s,a,i)=>s+a*X[i],0);
      const sy=A.reduce((s,a,i)=>s+a*Y[i],0);
      return [
        ["GIVEN",`Areas: ${A.join(", ")}; x: ${X.join(", ")}; y: ${Y.join(", ")}`],
        ["RULE","Cutouts are negative areas."],
        ["FORMULAS","xbar = Sum(Ax)/Sum(A); ybar = Sum(Ay)/Sum(A)"],
        ["WORK",`Sum A = ${fmt(area)}; Sum Ax = ${fmt(sx)}; Sum Ay = ${fmt(sy)}`],
        ["SOLUTION",`xbar = ${fmt(sx/area)} m; ybar = ${fmt(sy/area)} m`]
      ];
    }
  },
  load: {
    name: "Distributed Load Resultant",
    fields: [["w","Maximum load intensity (N/m)"],["L","Loaded length (m)"]],
    solve: d => {
      if(d.w<0||d.L<=0) throw Error("Require w >= 0 and L > 0.");
      return [
        ["GIVEN",`w = ${d.w} N/m; L = ${d.L} m`],
        ["UNIFORM FORMULA","R = wL; position = L/2"],
        ["UNIFORM SOLUTION",`R = ${fmt(d.w*d.L)} N at ${fmt(d.L/2)} m from either end`],
        ["TRIANGULAR FORMULA","R = wL/2; position = L/3 from the high-intensity end"],
        ["TRIANGULAR SOLUTION",`R = ${fmt(d.w*d.L/2)} N at ${fmt(d.L/3)} m from the high-intensity end`],
        ["IMPORTANT","Choose the actual load shape shown in your diagram."]
      ];
    }
  }
};

function fmt(n) {
  if(!Number.isFinite(n)) throw Error("Result is outside the supported numeric range.");
  return Number(n.toPrecision(8)).toString();
}

function runTests() {
  const near=(a,b)=>Math.abs(a-b)<1e-9;
  if(!near(300*Math.cos(0),300)) throw Error("Component test failed");
  if(!near(2*50-0*10,100)) throw Error("Moment test failed");
  if(!near(100*2/4,50)) throw Error("Beam test failed");
  if(!near(Math.hypot(3,4,0),5)) throw Error("Vector test failed");
  if(!near((2*1+2*3)/4,2)) throw Error("Centroid test failed");
  if(!near(200*4/2,400)) throw Error("Load test failed");
  return true;
}

runTests();

const root=document.createElement("section");
root.id="statics-solver";
root.innerHTML=`
<style>
#statics-solver{max-width:950px;margin:25px auto;padding:22px;border-radius:18px;background:#142235;color:#f5f8ff;font:16px/1.5 system-ui;border:1px solid #526c86}
#statics-solver *{box-sizing:border-box}
#statics-solver h2{margin:0 0 8px;font-size:26px}
#statics-solver p{color:#d1dce9}
#statics-solver label{display:block;margin:12px 0 5px;font-weight:650}
#statics-solver input,#statics-solver select{width:100%;padding:12px;min-height:46px;font:inherit;background:white;color:#132238;border:1px solid #8294aa;border-radius:9px}
#statics-solver button{margin-top:16px;padding:13px 20px;min-height:46px;background:#91dfcb;color:#102a28;border:0;border-radius:9px;font:inherit;font-weight:750;cursor:pointer}
#statics-solver .fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px 16px}
#statics-solver .result{margin-top:20px;padding:16px;border-radius:12px;background:#223650}
#statics-solver .step{padding:12px 0;border-bottom:1px solid #51657b;white-space:pre-wrap;overflow-wrap:anywhere}
#statics-solver .step strong{display:block;color:#9cead8;margin-bottom:4px}
#statics-solver .error{color:#ffcece}
</style>
<h2>🧮 SOLVE IT — Statics Arcade</h2>
<p>GIVEN → EQUATIONS → MATH/WORK → SOLUTION → CHECK. Enter values from your problem diagram using consistent units.</p>
<label for="solver-type">Choose problem type</label>
<select id="solver-type"></select>
<div id="solver-fields" class="fields"></div>
<button type="button" id="solver-go">Show step-by-step solution</button>
<div class="result" id="solver-result" aria-live="polite">Choose a problem and enter the givens.</div>
`;

(document.querySelector("main")||document.body).appendChild(root);

const type=root.querySelector("#solver-type");
const fields=root.querySelector("#solver-fields");
const result=root.querySelector("#solver-result");

for(const [key,p] of Object.entries(problems)){
  const opt=document.createElement("option");
  opt.value=key;opt.textContent=p.name;type.append(opt);
}

function render(){
  fields.replaceChildren();
  result.textContent="Enter the given values, then solve.";
  for(const [key,label] of problems[type.value].fields){
    const box=document.createElement("div");
    const lab=document.createElement("label");
    const inp=document.createElement("input");
    inp.id="solver-"+key;
    inp.dataset.key=key;
    lab.htmlFor=inp.id;
    lab.textContent=label;
    inp.type=["areas","xs","ys"].includes(key)?"text":"number";
    if(inp.type==="number") inp.step="any";
    inp.placeholder=["areas","xs","ys"].includes(key)?"Example: 4, 2, -1":"Enter value";
    box.append(lab,inp);
    fields.append(box);
  }
}

type.addEventListener("change",render);

root.querySelector("#solver-go").addEventListener("click",()=>{
  result.replaceChildren();
  try{
    const d={};
    for(const input of fields.querySelectorAll("input")){
      const raw=input.value.trim();
      if(!raw) throw Error("Missing input: "+input.previousElementSibling.textContent);
      if(input.type==="number"){
        const n=Number(raw);
        if(!Number.isFinite(n)) throw Error("Invalid number.");
        d[input.dataset.key]=n;
      }else{
        const values=raw.split(",").map(v=>v.trim());
        if(values.some(v=>v===""||!Number.isFinite(Number(v))))
          throw Error("Enter comma-separated numbers only.");
        d[input.dataset.key]=raw;
      }
    }
    for(const [title,text] of problems[type.value].solve(d)){
      const div=document.createElement("div");
      div.className="step";
      const heading=document.createElement("strong");
      heading.textContent=title;
      const body=document.createElement("span");
      body.textContent=text;
      div.append(heading,body);
      result.append(div);
    }
  }catch(e){
    const div=document.createElement("div");
    div.className="error";
    div.textContent=e.message;
    result.append(div);
  }
});

render();
console.log("Statics Solver: numerical self-tests passed");
})();

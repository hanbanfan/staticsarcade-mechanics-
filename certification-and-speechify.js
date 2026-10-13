
(() => {
"use strict";

/* ============================================================
   MASTER CERTIFICATION + SPEECHIFY STORY LAB
   ============================================================ */

const title=document.title.toLowerCase();

let SUBJECT=null;

if(title.includes("circuit")) SUBJECT="circuits";
else if(title.includes("static")) SUBJECT="statics";
else if(title.includes("thermo")) SUBJECT="thermo";
else if(title.includes("composite")) SUBJECT="composites";
else if(title.includes("advanced composites")) SUBJECT="composites";

if(!SUBJECT) return;

/* ============================================================
   HELPERS
============================================================ */

const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];

function shuffle(a){
  const x=[...a];
  for(let i=x.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [x[i],x[j]]=[x[j],x[i]];
  }
  return x;
}

function fmt(n,d=4){
  if(!Number.isFinite(n)) return String(n);
  return Number(n.toFixed(d)).toString();
}

function esc(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}

function numericQuestion(topic,prompt,answer,unit,solution,tol=.02){
  return {
    topic,
    type:"number",
    prompt,
    answer,
    unit:unit||"",
    solution,
    tol
  };
}

function textQuestion(topic,prompt,keywords,solution){
  return {
    topic,
    type:"text",
    prompt,
    keywords,
    solution
  };
}

/* ============================================================
   QUESTION GENERATORS
============================================================ */

const BANK={

/* ------------------------------------------------------------
   CIRCUITS
------------------------------------------------------------ */

circuits:{

name:"Circuits",

generators:[

{
 topic:"Ohm's Law",
 make(){
   const R=pick([2,4,5,6,8,10,12,15,20]);
   const I=rand(1,8);
   const V=R*I;

   if(Math.random()<.5){
     return numericQuestion(
       "Ohm's Law",
       `A ${R} Ω resistor carries ${I} A. Find voltage.`,
       V,
       "V",
       `Use V = IR. V = (${I})(${R}) = ${V} V.`
     );
   }

   return numericQuestion(
     "Ohm's Law",
     `A ${R} Ω resistor has ${V} V across it. Find current.`,
     I,
     "A",
     `Use I = V/R. I = ${V}/${R} = ${I} A.`
   );
 }
},

{
 topic:"Series / Parallel",
 make(){
   const a=pick([2,3,4,6,8,10,12]);
   const b=pick([3,4,5,6,8,9,12]);

   if(Math.random()<.5){
     return numericQuestion(
       "Series / Parallel",
       `${a} Ω and ${b} Ω are in series. Find equivalent resistance.`,
       a+b,
       "Ω",
       `Series resistances add: Req = ${a}+${b} = ${a+b} Ω.`
     );
   }

   const req=a*b/(a+b);

   return numericQuestion(
     "Series / Parallel",
     `${a} Ω and ${b} Ω are in parallel. Find equivalent resistance.`,
     req,
     "Ω",
     `For two parallel resistors, Req = R1R2/(R1+R2) = (${a})(${b})/(${a}+${b}) = ${fmt(req)} Ω.`
   );
 }
},

{
 topic:"Voltage Divider",
 make(){
   const Vs=pick([12,18,24,30]);
   const R1=pick([2,3,4,6]);
   const R2=pick([4,6,8,10]);

   const Vout=Vs*R2/(R1+R2);

   return numericQuestion(
     "Voltage Divider",
     `Unloaded divider: Vs=${Vs} V, R1=${R1} kΩ, R2=${R2} kΩ. Find Vout across R2.`,
     Vout,
     "V",
     `Vout = Vs·R2/(R1+R2) = ${Vs}(${R2})/(${R1}+${R2}) = ${fmt(Vout)} V.`
   );
 }
},

{
 topic:"KCL / KVL",
 make(){

   if(Math.random()<.5){

     const a=rand(2,7);
     const b=rand(2,7);
     const c=rand(1,4);
     const x=a+b-c;

     return numericQuestion(
       "KCL / KVL",
       `${a} A and ${b} A enter a node. ${c} A leaves through one branch. Find the other leaving current.`,
       x,
       "A",
       `KCL: entering = leaving. ${a}+${b} = ${c}+I, so I=${x} A.`
     );
   }

   return textQuestion(
     "KCL / KVL",
     "State Kirchhoff's Voltage Law in words.",
     ["sum","voltage","loop","zero"],
     "The algebraic sum of voltage rises and drops around any closed loop is zero."
   );
 }
},

{
 topic:"Thevenin / Norton",
 make(){

   if(Math.random()<.35){
     return textQuestion(
       "Thevenin / Norton",
       "When finding Thevenin resistance, what happens to an independent ideal voltage source?",
       ["short"],
       "Deactivate the independent ideal voltage source by replacing it with a short circuit."
     );
   }

   const Vth=pick([8,10,12,15,18]);
   const Rth=pick([1,2,3,4]);
   const RL=pick([2,3,4,6,8]);

   const I=Vth/(Rth+RL);

   return numericQuestion(
     "Thevenin / Norton",
     `VTH=${Vth} V, RTH=${Rth} kΩ, RL=${RL} kΩ. Find load current in mA.`,
     I,
     "mA",
     `IL = VTH/(RTH+RL) = ${Vth}/(${Rth}+${RL}) = ${fmt(I)} mA.`
   );
 }
},

{
 topic:"Power",
 make(){
   const V=pick([6,10,12,20,24]);
   const I=pick([1,2,3,4]);

   return numericQuestion(
     "Power",
     `A circuit element has ${V} V across it and carries ${I} A. Find power magnitude.`,
     V*I,
     "W",
     `P = VI = ${V}(${I}) = ${V*I} W.`
   );
 }
}

],

stories:[

{
 title:"The Water Park Called Ohm",
 concept:"Ohm's Law",
 text:
`Picture a ridiculous water park called Ohm's World.

Voltage is the giant pump at the top of the hill. Current is the number of people flying through the water slide every second. Resistance is how narrow and annoying the slide is.

If the pump pressure goes up and the slide stays the same, more people shoot through. That is current increasing when voltage increases.

If the slide gets narrower while the pump stays the same, fewer people get through. That is current decreasing when resistance increases.

The entire park runs on one rule: V equals I times R.

When I see two known values out of voltage, current, and resistance, I should immediately think: this is Ohm's World. Which variable is missing?

Voltage pushes. Resistance fights. Current flows.

V equals I R.`
},

{
 title:"The One-Lane Road and the Parking Lot",
 concept:"Series vs Parallel",
 text:
`Imagine electricity driving through a city.

A series circuit is a one-lane road. Every car has to pass through every checkpoint. Because there is only one path, the same current passes through every resistor. Adding another resistor is like adding another toll booth. The total resistance increases.

A parallel circuit is a parking lot with several exits. Every exit begins at the same starting line and ends at the same destination, so every branch sees the same voltage. Current splits between the branches.

Series means one path, same current, resistances add.

Parallel means same two nodes, same voltage, current splits.

Before touching a formula, I ask: is this a one-lane road or a parking lot?`
},

{
 title:"Kirchhoff Runs a Tiny Bank",
 concept:"KCL and KVL",
 text:
`Kirchhoff runs the world's most obsessive bank.

At the front desk, he counts every dollar entering and every dollar leaving. Money cannot magically disappear at the desk. That is KCL. Current entering a node must balance current leaving.

Then Kirchhoff walks around the entire building and checks the books. Every gain and every expense around the full trip has to balance back to zero. That is KVL. Voltage rises and drops around a closed loop sum to zero.

Node means KCL.

Loop means KVL.

If the problem points at a junction, think bank teller.

If it points around a loop, think full accounting audit.`
},

{
 title:"Thevenin's Fake Storefront",
 concept:"Thevenin and Norton",
 text:
`Imagine a gigantic electronics store hiding behind one tiny wall outlet.

You do not care how many aisles, employees, registers, and wires are behind the wall. You only care how the store behaves from the two terminals you can touch.

Thevenin replaces the entire hidden store with one voltage source, VTH, and one series resistance, RTH.

VTH is the voltage you see when nothing is connected to the output.

RTH is the resistance looking back into the network after independent sources are deactivated.

Norton tells the same story using one current source and a parallel resistance.

The giant complicated network can wear a tiny disguise.

Two terminals. One equivalent.`
}

]

},

/* ------------------------------------------------------------
   STATICS
------------------------------------------------------------ */

statics:{

name:"Statics",

generators:[

{
 topic:"Force Components",
 make(){
   const F=pick([200,300,400,500,600,800]);
   const theta=pick([30,45,60]);

   const askX=Math.random()<.5;

   const ans=askX
     ? F*Math.cos(theta*Math.PI/180)
     : F*Math.sin(theta*Math.PI/180);

   return numericQuestion(
     "Force Components",
     `A ${F} N force acts ${theta}° above +x. Find ${askX?"Fx":"Fy"}.`,
     ans,
     "N",
     `${askX?"Fx=F cosθ":"Fy=F sinθ"} = ${fmt(ans)} N.`
   );
 }
},

{
 topic:"Moments",
 make(){
   const F=pick([200,300,400,500]);
   const d=pick([2,3,4,5]);

   return numericQuestion(
     "Moments",
     `A ${F} N force acts perpendicular to a lever arm ${d} m from O. Find moment magnitude.`,
     F*d,
     "N·m",
     `M = Fd⊥ = ${F}(${d}) = ${F*d} N·m.`
   );
 }
},

{
 topic:"Support Reactions",
 make(){

   if(Math.random()<.5){
     return textQuestion(
       "Support Reactions",
       "What reaction components does a 2D pin support provide?",
       ["x","y"],
       "A 2D pin provides two force components, usually Ax and Ay, and no reaction moment."
     );
   }

   return textQuestion(
     "Support Reactions",
     "What direction does a frictionless roller reaction act?",
     ["normal"],
     "A roller reaction acts normal, or perpendicular, to the supporting surface."
   );
 }
},

{
 topic:"Beam Equilibrium",
 make(){
   const L=pick([6,8,10]);
   const P=pick([600,800,1000,1200]);
   const a=pick([2,3,4]);

   const By=P*a/L;

   return numericQuestion(
     "Beam Equilibrium",
     `Pin A and roller B support a ${L} m beam. A ${P} N downward load acts ${a} m from A. Find By.`,
     By,
     "N",
     `Take moments about A: By(${L})-${P}(${a})=0. Therefore By=${fmt(By)} N.`
   );
 }
},

{
 topic:"Distributed Loads / Centroids",
 make(){

   if(Math.random()<.5){
     const w=pick([200,300,400,500]);
     const L=pick([2,3,4,5]);
     return numericQuestion(
       "Distributed Loads / Centroids",
       `A uniform distributed load of ${w} N/m acts over ${L} m. Find equivalent resultant force.`,
       w*L,
       "N",
       `Resultant equals area under load diagram: W=wL=${w}(${L})=${w*L} N.`
     );
   }

   const b=pick([6,8,10,12]);

   return numericQuestion(
     "Distributed Loads / Centroids",
     `A rectangle is ${b} cm wide. Find x-bar from the left edge.`,
     b/2,
     "cm",
     `By symmetry, x̄=b/2=${b/2} cm.`
   );
 }
},

{
 topic:"Trusses / Frames",
 make(){

   if(Math.random()<.5){

     return textQuestion(
       "Trusses / Frames",
       "At an unloaded truss joint, exactly two non-collinear members meet. What happens to those member forces?",
       ["zero"],
       "Both are zero-force members because two non-collinear forces cannot balance unless both are zero."
     );
   }

   return textQuestion(
     "Trusses / Frames",
     "What is the first major step when solving a frame or machine?",
     ["separate","fbd"],
     "Separate the connected members and draw an individual free-body diagram for each member."
   );
 }
}

],

stories:[

{
 title:"Statics Is a Crime Scene",
 concept:"Free-Body Diagrams",
 text:
`Imagine every statics problem is a crime scene.

The object you are solving is the suspect. Before questioning anyone, you isolate the suspect from everyone else.

Every support gets removed and replaced by what it can physically do.

A pin can push in x and y.

A roller can push only normal to its surface.

A cable can only pull along the cable.

A fixed support can push in x, push in y, and resist rotation with a moment.

Only after the suspect is isolated can you interview the forces.

That isolated sketch is the free-body diagram.

If the free-body diagram is wrong, the algebra is just a very organized way to get the wrong answer.`
},

{
 title:"The Lazy Moment Trick",
 concept:"Moments",
 text:
`Imagine you are trying to open a stubborn door.

Pushing right next to the hinge barely does anything.

Pushing far from the hinge rotates the door easily.

That is a moment.

Moment equals force times perpendicular distance.

Now imagine a statics exam. You have three unknown reactions and one nasty load. Instead of attacking every unknown at once, be lazy in the smartest possible way.

Take moments about the point where the most unknown forces pass through.

Those forces have zero lever arm about that point, so they disappear from the moment equation.

A good moment point is not random. It is chosen to erase unknowns.

Statics rewards strategic laziness.`
},

{
 title:"The Distributed Load Gets Compressed Into One Person",
 concept:"Distributed Loads",
 text:
`Imagine a hundred tiny people standing on a beam, each pushing downward.

Solving one hundred little forces would be ridiculous.

So statics compresses the entire crowd into one giant person.

How heavy is the giant person?

The area under the load diagram.

Where does the giant person stand?

At the centroid of the load diagram.

Rectangle load: the giant stands in the middle.

Triangle load: the giant stands one-third of the base from the heavy end.

The replacement force has to create the same total force and the same moment as the original crowd.`
},

{
 title:"The Truss Joint Argument",
 concept:"Trusses",
 text:
`Picture a truss joint as a tiny person being pulled by ropes in several directions.

The person refuses to move.

Every truss member can only push or pull along its own axis.

At one joint, I draw every member force pointing away first and assume tension. Then I use only two rules: sum of forces in x equals zero and sum of forces in y equals zero.

If a solved member force comes out negative, the math is telling me my assumed direction was backward. The member is actually in compression.

Negative does not mean wrong.

Negative means the truss corrected my assumption.`
}

]

},

/* ------------------------------------------------------------
   THERMO
------------------------------------------------------------ */

thermo:{

name:"Thermodynamics",

generators:[

{
 topic:"Ideal Gas / State",
 make(){
   const P=pick([100,150,200,250]);
   const T=pick([300,350,400,450]);
   const R=.287;

   const v=R*T/P;

   return numericQuestion(
     "Ideal Gas / State",
     `Air is at P=${P} kPa and T=${T} K. Use R=0.287 kJ/(kg·K). Find specific volume.`,
     v,
     "m³/kg",
     `Use Pv=RT. v=RT/P=.287(${T})/${P}=${fmt(v)} m³/kg.`
   );
 }
},

{
 topic:"Quality / Pure Substances",
 make(){

   if(Math.random()<.75){

     const yf=pick([400,500,600]);
     const yfg=pick([1600,1800,2000]);
     const x=pick([.2,.3,.4,.5,.6,.7]);

     const y=yf+x*yfg;

     return numericQuestion(
       "Quality / Pure Substances",
       `Saturated mixture: yf=${yf}, yfg=${yfg}, x=${x}. Find y.`,
       y,
       "",
       `Use y=yf+x yfg. y=${yf}+${x}(${yfg})=${fmt(y)}.`
     );
   }

   return textQuestion(
     "Quality / Pure Substances",
     "In what phase region is quality x physically defined?",
     ["saturated","mixture"],
     "Quality is defined only in the saturated liquid-vapor mixture region."
   );
 }
},

{
 topic:"Closed System Energy",
 make(){
   const Q=pick([500,700,900,1000]);
   const W=pick([100,200,250,300]);

   return numericQuestion(
     "Closed System Energy",
     `A closed system receives Q=${Q} kJ and does W=${W} kJ of work. Neglect KE and PE. Find ΔU.`,
     Q-W,
     "kJ",
     `Q-W=ΔU. Therefore ΔU=${Q}-${W}=${Q-W} kJ.`
   );
 }
},

{
 topic:"Mass Flow",
 make(){
   const rho=pick([1,1.2,2,4]);
   const A=pick([.1,.2,.25,.5]);
   const V=pick([2,4,6,8]);

   const mdot=rho*A*V;

   return numericQuestion(
     "Mass Flow",
     `ρ=${rho} kg/m³, A=${A} m², V=${V} m/s. Find mass flow rate.`,
     mdot,
     "kg/s",
     `ṁ=ρAV=${rho}(${A})(${V})=${fmt(mdot)} kg/s.`
   );
 }
},

{
 topic:"Steady Flow Devices",
 make(){

   if(Math.random()<.5){

     const h1=pick([3000,3200,3400]);
     const drop=pick([300,400,500]);
     const h2=h1-drop;

     return numericQuestion(
       "Steady Flow Devices",
       `Adiabatic turbine: h1=${h1}, h2=${h2} kJ/kg. Neglect KE and PE. Find work output.`,
       drop,
       "kJ/kg",
       `For this idealized turbine, wout=h1-h2=${drop} kJ/kg.`
     );
   }

   return textQuestion(
     "Steady Flow Devices",
     "What property is approximately constant across an ideal throttling valve?",
     ["enthalpy"],
     "Under common throttling assumptions, h1 approximately equals h2."
   );
 }
},

{
 topic:"Nozzles / Energy Conversion",
 make(){
   const h1=pick([3000,3100]);
   const h2=h1-200;
   const V1=50;

   const V2=Math.sqrt(
     V1*V1 + 2000*(h1-h2)
   );

   return numericQuestion(
     "Nozzles / Energy Conversion",
     `Adiabatic nozzle: h1=${h1}, h2=${h2} kJ/kg, V1=${V1} m/s. Neglect PE. Find V2.`,
     V2,
     "m/s",
     `h1+V1²/2000=h2+V2²/2000. V2=${fmt(V2)} m/s.`
   );
 }
}

],

stories:[

{
 title:"Thermo Is an Airport",
 concept:"Systems and Control Volumes",
 text:
`Imagine thermodynamics as an airport.

A closed system is a locked airplane sitting on the runway. The same passengers stay inside. Energy can enter or leave as heat or work, but no passengers cross the boundary.

A control volume is the airport terminal. People continuously enter and leave. Because mass crosses the boundary, every person carries energy with them.

That is why open-system problems naturally involve mass flow and enthalpy.

Before doing any math, I ask:

Am I tracking a fixed group of matter?

Or am I drawing an imaginary box around a device that mass flows through?

Closed system means fixed mass.

Control volume means flowing mass.`
},

{
 title:"The Steam Table Neighborhood",
 concept:"Property Tables",
 text:
`Imagine water lives in three neighborhoods.

On the left is compressed liquid town.

In the middle is Saturation Street, where liquid and vapor live together.

On the right is superheated vapor city.

The problem gives me clues like pressure, temperature, or quality. My first job is not solving an energy equation. My first job is figuring out which neighborhood the state lives in.

If the temperature equals saturation temperature at the given pressure, I am on Saturation Street.

If quality is given, I am definitely inside the mixture neighborhood.

If temperature is above saturation temperature at that pressure, I am probably in superheated vapor city.

Pick the neighborhood before opening the table.

Wrong neighborhood, wrong properties, wrong problem.`
},

{
 title:"Quality Is a Pizza",
 concept:"Quality",
 text:
`Imagine a box containing only liquid water and water vapor.

The entire box is one pizza.

Quality x tells me what fraction of the pizza's mass belongs to vapor.

x equals zero means all saturated liquid.

x equals one means all saturated vapor.

x equals 0.4 means forty percent of the mass is vapor and sixty percent is liquid.

Any mixture property sits between the saturated-liquid and saturated-vapor values.

That is why y equals yf plus x times yfg.

Quality is not a general gas percentage.

It only lives inside the saturated liquid-vapor dome.`
},

{
 title:"The Turbine and Compressor Are Opposite Gym Bros",
 concept:"Steady-Flow Devices",
 text:
`Picture a turbine and a compressor arguing at a gym.

The turbine says: I take high-energy fluid and make it do work for me.

The compressor says: I require work from you so I can push the fluid to a higher-energy state.

For an ideal adiabatic turbine with small velocity and elevation changes, the enthalpy drop becomes work output.

For an ideal compressor, the enthalpy rise represents work input.

A nozzle is their weird cousin. It does not care about shaft work. It turns enthalpy into speed.

A throttling valve is even stranger. Pressure drops hard, but enthalpy stays approximately constant.

Turbine: enthalpy down, work out.

Compressor: enthalpy up, work in.

Nozzle: enthalpy down, velocity up.

Throttle: h stays about the same.`
}

]

},

/* ------------------------------------------------------------
   ADVANCED COMPOSITES
------------------------------------------------------------ */

composites:{

name:"Advanced Composites",

generators:[

{
 topic:"Volume Fraction",
 make(){

   const Vf=pick([.4,.5,.55,.6,.65]);

   return numericQuestion(
     "Volume Fraction",
     `A two-phase fiber/matrix composite has Vf=${Vf}. Find Vm.`,
     1-Vf,
     "",
     `Vm=1-Vf=1-${Vf}=${fmt(1-Vf)}.`
   );
 }
},

{
 topic:"Longitudinal Mechanics",
 make(){

   const Ef=pick([70,140,200,230]);
   const Em=pick([3,4,5]);
   const Vf=pick([.5,.6,.65]);

   const E=Ef*Vf+Em*(1-Vf);

   return numericQuestion(
     "Longitudinal Mechanics",
     `Ef=${Ef} GPa, Em=${Em} GPa, Vf=${Vf}. Find longitudinal modulus E1.`,
     E,
     "GPa",
     `Vm=${fmt(1-Vf)}. E1=EfVf+EmVm=${Ef}(${Vf})+${Em}(${fmt(1-Vf)})=${fmt(E)} GPa.`
   );
 }
},

{
 topic:"Transverse Mechanics",
 make(){

   const Ef=200;
   const Em=5;
   const Vf=pick([.4,.5,.6]);

   const E=1/(Vf/Ef+(1-Vf)/Em);

   return numericQuestion(
     "Transverse Mechanics",
     `Use 1/E2=Vf/Ef+Vm/Em. Ef=200 GPa, Em=5 GPa, Vf=${Vf}. Find E2.`,
     E,
     "GPa",
     `Vm=${fmt(1-Vf)}. E2=1/[${Vf}/200+${fmt(1-Vf)}/5]=${fmt(E)} GPa.`
   );
 }
},

{
 topic:"Critical Fiber Length",
 make(){

   const sigma=pick([1000,1500,2000,2500]);
   const d=pick([.005,.01,.015]);
   const tau=pick([25,40,50]);

   const lc=sigma*d/(2*tau);

   return numericQuestion(
     "Critical Fiber Length",
     `σf=${sigma} MPa, d=${d} mm, τi=${tau} MPa. Find critical fiber length.`,
     lc,
     "mm",
     `lc=σf d/(2τi)=${sigma}(${d})/[2(${tau})]=${fmt(lc)} mm.`
   );
 }
},

{
 topic:"Weibull Statistics",
 make(){

   if(Math.random()<.4){

     return textQuestion(
       "Weibull Statistics",
       "Why can a longer brittle fiber specimen show lower measured strength?",
       ["flaw"],
       "Longer specimens sample more material and therefore have a greater chance of containing a critical flaw."
     );
   }

   const X=pick([.5,1,1.5,2]);

   const S=Math.exp(-X);

   return numericQuestion(
     "Weibull Statistics",
     `For survival model S=exp(-X), find S when X=${X}.`,
     S,
     "",
     `S=e^(-${X})=${fmt(S)}.`
   );
 }
},

{
 topic:"Tow / Filament Logic",
 make(){

   return textQuestion(
     "Tow / Filament Logic",
     "Conceptually, tow linear mass density equals filament count multiplied by what single-filament quantity?",
     ["mass","length"],
     "It equals filament count times single-filament mass per unit length. For a round filament that quantity is ρA."
   );
 }
},

{
 topic:"Damage / Repair",
 make(){

   if(Math.random()<.5){

     return textQuestion(
       "Damage / Repair",
       "Why can a small visible impact mark still represent serious composite damage?",
       ["internal"],
       "Composite impact can create internal delamination, matrix cracking, or fiber damage beneath a small surface indication."
     );
   }

   return textQuestion(
     "Damage / Repair",
     "What is the central structural purpose of a composite repair?",
     ["load","path"],
     "The repair must restore an acceptable structural load path and required performance."
   );
 }
},

{
 topic:"Sandwich Structures",
 make(){

   return textQuestion(
     "Sandwich Structures",
     "What are the main mechanical jobs of the face sheets and the lightweight core?",
     ["face","core","shear"],
     "Faces carry much of the bending tension/compression. The core separates and stabilizes the faces and carries substantial transverse shear."
   );
 }
}

],

stories:[

{
 title:"The Composite Is a Team Sport",
 concept:"Fiber, Matrix, and Interface",
 text:
`Imagine a composite as a two-person team trying to pull a broken-down truck.

The fiber is the ridiculously strong athlete. It can carry huge load, especially along its own direction.

The matrix is the organizer. It holds the fibers in place, protects them, keeps them aligned, and transfers force into them.

The interface is the handshake between the athlete and organizer.

If the handshake is weak, the strong athlete never receives the load properly.

That is the key idea: fibers do not magically become strong just because they are inside resin.

The matrix has to transfer load into the fibers through the interface.

Fiber carries.

Matrix supports and transfers.

Interface connects the two.`
},

{
 title:"The Hallway of Anisotropy",
 concept:"Anisotropy",
 text:
`Imagine a hallway filled with a thousand uncooked spaghetti noodles all pointing north.

If I pull along the noodles, the bundle is surprisingly stiff and strong.

If I push sideways across the noodles, the response is completely different.

That is anisotropy.

The material does not have one universal stiffness or strength.

Its properties depend on direction.

A unidirectional composite is not a metal with fancy fibers inside.

The fiber direction is part of the material definition.

Before using a modulus, I ask: modulus in which direction?

Before using a strength, I ask: strength in which direction?`
},

{
 title:"The Tug-of-War Rule of Mixtures",
 concept:"Longitudinal Rule of Mixtures",
 text:
`Imagine the fiber and matrix tied together in a perfectly aligned tug-of-war rope.

They are bonded so well that when the composite stretches longitudinally, both constituents stretch by approximately the same strain.

The fiber is much stiffer, so at that same strain it carries much more stress.

The composite stiffness becomes a volume-weighted combination:

E1 equals Ef times Vf plus Em times Vm.

More stiff fiber usually raises longitudinal stiffness.

But this rule is not magic.

It depends on aligned continuous fibers, good bonding, and longitudinal loading.

The equation remembers the physics: equal strain, different stresses, shared total load.`
},

{
 title:"The Fiber Has to Earn Its Strength",
 concept:"Critical Fiber Length",
 text:
`Imagine a short fiber buried in matrix like a person being pulled out of quicksand.

The matrix cannot instantly give the center of the fiber full tensile stress.

Load enters from the fiber ends through interfacial shear.

As you move inward from each end, fiber stress builds.

If the fiber is too short, there is not enough distance to develop its full tensile capability.

That special required distance is related to critical fiber length:

lc equals sigma-f times diameter divided by two tau-i.

Stronger fiber means more length is needed to develop its strength.

Larger diameter means more length is needed.

Stronger interface shear means less length is needed.

The fiber has to be long enough for the interface to hand it the load.`
},

{
 title:"Weibull's Bag of Invisible Cracks",
 concept:"Weibull Statistics",
 text:
`Imagine every carbon fiber contains a hidden bag of microscopic flaws.

You cannot see exactly where the worst flaw is.

A very short fiber samples only a small amount of material, so it has fewer chances to contain a terrible flaw.

A long fiber samples much more material, so it has more opportunities to contain one dangerous defect.

That is why brittle-fiber strength behaves statistically.

Strength is not one guaranteed number.

It is a survival probability.

Higher stress lowers survival.

Longer tested length lowers survival.

The Weibull modulus tells us about the amount of strength scatter.

The lesson is simple: brittle fiber strength is a probability story about flaws.`
},

{
 title:"The Sandwich Beam Is an I-Beam in Disguise",
 concept:"Sandwich Structures",
 text:
`Imagine two thin strong face sheets separated by a very light foam or honeycomb core.

The core looks weak, so it seems unimportant.

But the core performs a brilliant trick: it holds the strong faces far apart.

Bending stress becomes large far from the neutral axis.

So the face sheets carry much of the tension and compression.

The core keeps them separated, prevents them from collapsing together, and carries substantial shear.

It is like building an I-beam without using a giant block of heavy material.

Faces do the bending work.

Core creates depth and transfers shear.

That is why sandwich panels can be extremely stiff for their weight.`
},

{
 title:"The Damage You Cannot See",
 concept:"Impact and Repair",
 text:
`Imagine dropping a tool onto a composite aircraft panel.

The outside shows a tiny dent.

It looks almost harmless.

Inside, however, the laminate may have layers separating from each other. Matrix cracks can spread. Fibers may break. A sandwich core may crush.

Composite damage can hide.

That is why repair is not about making the surface pretty.

First identify the damage.

Then determine what structural load path was lost.

Then design a repair that transfers load back through sound material.

A good repair does not simply cover the wound.

It restores the structure's ability to carry load.`
}

]

}

};

/* ============================================================
   CERTIFICATION STATE
============================================================ */

const CFG=BANK[SUBJECT];

const STORE=
  "mastery_certification_" +
  SUBJECT;

let state;

try{
  state=JSON.parse(
    localStorage.getItem(STORE)||"{}"
  );
}catch{
  state={};
}

state.attempts ??= [];
state.certified ??= false;
state.certifiedDate ??= null;
state.best ??= 0;

let exam=[];
let submitted=false;
let lastMisses=[];

/* ============================================================
   BUILD 20-QUESTION EXAM
============================================================ */

function generateExam(){

  submitted=false;
  lastMisses=[];

  const gens=CFG.generators;

  exam=[];

  /* Guarantee at least one from each topic */
  gens.forEach(g=>{
    exam.push(g.make());
  });

  /* Fill to 20 randomly */
  while(exam.length<20){
    exam.push(
      pick(gens).make()
    );
  }

  exam=shuffle(exam);

  renderExam();
  renderStatus();
}

/* ============================================================
   GRADING
============================================================ */

function gradeText(raw,q){

  const t=raw.toLowerCase();

  const hit=q.keywords.filter(k=>
    t.includes(k.toLowerCase())
  ).length;

  const needed=Math.max(
    1,
    Math.ceil(q.keywords.length*.6)
  );

  return hit>=needed;
}

function gradeExam(){

  if(submitted) return;

  submitted=true;

  let correct=0;

  const topicStats={};
  const misses=[];

  exam.forEach((q,i)=>{

    topicStats[q.topic] ??={
      correct:0,
      total:0
    };

    topicStats[q.topic].total++;

    const input=document.getElementById(
      `cert-answer-${i}`
    );

    const raw=input?.value.trim()||"";

    let ok=false;

    if(q.type==="number"){

      const n=Number(raw);

      if(Number.isFinite(n)){

        const tolerance=Math.max(
          .005,
          Math.abs(q.answer)*(q.tol||.02)
        );

        ok=Math.abs(n-q.answer)<=tolerance;

      }

    }else{

      ok=gradeText(raw,q);

    }

    if(ok){
      correct++;
      topicStats[q.topic].correct++;
    }else{
      misses.push(q);
    }

    const result=document.getElementById(
      `cert-result-${i}`
    );

    result.className=
      "cert-result " + (ok?"good":"bad");

    result.innerHTML=ok
      ? `<strong>✓ Correct</strong>`
      : `
        <strong>✗ Correction needed</strong>
        <p>${esc(q.solution)}</p>
      `;

  });

  const overall=Math.round(
    100*correct/exam.length
  );

  const topicScores={};

  Object.entries(topicStats)
    .forEach(([topic,r])=>{

      topicScores[topic]=Math.round(
        100*r.correct/r.total
      );

    });

  const minimumTopic=
    Math.min(...Object.values(topicScores));

  const passed=
    overall>=85 &&
    minimumTopic>=70;

  state.best=Math.max(
    state.best,
    overall
  );

  state.attempts.push({
    date:new Date().toISOString(),
    overall,
    topicScores,
    passed
  });

  if(state.attempts.length>20){
    state.attempts.shift();
  }

  if(passed){
    state.certified=true;
    state.certifiedDate=
      new Date().toISOString();
  }

  localStorage.setItem(
    STORE,
    JSON.stringify(state)
  );

  lastMisses=misses;

  renderReport(
    overall,
    topicScores,
    passed,
    misses
  );

  renderStatus();
}

/* ============================================================
   REMEDIATION RETEST
============================================================ */

function remediationExam(){

  if(!lastMisses.length){
    generateExam();
    return;
  }

  const weakTopics=[
    ...new Set(
      lastMisses.map(q=>q.topic)
    )
  ];

  const weakGenerators=
    CFG.generators.filter(g=>
      weakTopics.includes(g.topic)
    );

  exam=[];

  while(exam.length<20){

    const source=
      weakGenerators.length
        ? weakGenerators
        : CFG.generators;

    exam.push(
      pick(source).make()
    );

  }

  exam=shuffle(exam);

  submitted=false;
  lastMisses=[];

  renderExam();
  renderStatus();
}

/* ============================================================
   UI
============================================================ */

const css=document.createElement("style");

css.textContent=`

#mastery-cert-overlay{
 position:fixed;
 inset:0;
 z-index:999999;
 background:rgba(2,6,23,.94);
 display:none;
 overflow:auto;
 padding:24px;
 color:#f8fafc;
 font-family:system-ui,-apple-system,sans-serif;
}

#mastery-cert-overlay.open{
 display:block;
}

#mastery-cert-shell{
 max-width:1000px;
 margin:auto;
}

.cert-card{
 background:#111827;
 border:1px solid #334155;
 border-radius:18px;
 padding:18px;
 margin:14px 0;
}

.cert-question{
 background:#0b1220;
 border:1px solid #334155;
 border-radius:14px;
 padding:16px;
 margin:12px 0;
}

.cert-topic{
 color:#7dd3fc;
 text-transform:uppercase;
 letter-spacing:.1em;
 font-size:.75rem;
 font-weight:900;
}

.cert-input,
.cert-textarea{
 width:100%;
 padding:12px;
 border-radius:10px;
 border:1px solid #64748b;
 background:white;
 color:#111827;
 font:inherit;
}

.cert-textarea{
 min-height:90px;
}

.cert-btn{
 padding:11px 15px;
 border:0;
 border-radius:10px;
 font:inherit;
 font-weight:850;
 cursor:pointer;
 margin:4px;
}

.cert-primary{
 background:#4ade80;
 color:#052e16;
}

.cert-secondary{
 background:#38bdf8;
 color:#082f49;
}

.cert-purple{
 background:#a78bfa;
 color:#2e1065;
}

.cert-danger{
 background:#fb7185;
 color:#4c0519;
}

.cert-result{
 padding:10px;
 margin-top:9px;
 border-radius:9px;
}

.cert-result.good{
 background:#163a2d;
}

.cert-result.bad{
 background:#4a2029;
}

.cert-score{
 font-size:3rem;
 font-weight:950;
}

.cert-pass{
 color:#4ade80;
}

.cert-fail{
 color:#fb7185;
}

.cert-topic-row{
 display:flex;
 justify-content:space-between;
 gap:10px;
 padding:8px;
 border-bottom:1px solid #334155;
}

#mastery-cert-launch{
 position:fixed;
 right:16px;
 bottom:16px;
 z-index:99998;
 border:0;
 border-radius:999px;
 padding:12px 15px;
 background:#4ade80;
 color:#052e16;
 font-weight:900;
 cursor:pointer;
}

.cert-close{
 position:sticky;
 top:8px;
 float:right;
 z-index:20;
}

.cert-tabbar{
 display:flex;
 gap:8px;
 flex-wrap:wrap;
 margin-bottom:12px;
}

.cert-tab{
 background:#1e293b;
 color:white;
}

.cert-tab.active{
 background:#38bdf8;
 color:#082f49;
}

.cert-pane{
 display:none;
}

.cert-pane.active{
 display:block;
}

.story-card{
 background:#0b1220;
 border:1px solid #334155;
 border-radius:15px;
 padding:17px;
 margin:13px 0;
}

.story-box{
 width:100%;
 min-height:270px;
 padding:14px;
 border-radius:10px;
 border:1px solid #64748b;
 background:#020617;
 color:#f8fafc;
 font:16px/1.6 system-ui;
}

.copy-status{
 color:#4ade80;
 font-weight:800;
 min-height:1.5em;
}

`;

document.head.appendChild(css);

const overlay=document.createElement("div");

overlay.id="mastery-cert-overlay";

overlay.innerHTML=`

<div id="mastery-cert-shell">

 <button
   class="cert-btn cert-danger cert-close"
   id="cert-close">
   Close
 </button>

 <h1>🏆 ${CFG.name} Mastery Lab</h1>

 <div class="cert-tabbar">

   <button
     class="cert-btn cert-tab active"
     data-pane="certification-pane">
     🧪 Certification
   </button>

   <button
     class="cert-btn cert-tab"
     data-pane="speechify-pane">
     🎧 Speechify Stories
   </button>

 </div>

 <div
   id="certification-pane"
   class="cert-pane active">

   <div class="cert-card">

     <h2>Mastery Certification</h2>

     <p>
       Passing requires:
       <strong>85% overall</strong>
       and
       <strong>70% or better in every tested topic.</strong>
     </p>

     <p>
       No hints. No solver. No solution reveal until submission.
     </p>

     <div id="cert-status"></div>

     <button
       class="cert-btn cert-primary"
       id="cert-new">
       Generate 20-Question Certification
     </button>

     <button
       class="cert-btn cert-purple"
       id="cert-remediate">
       Retest Weak Topics
     </button>

   </div>

   <div id="cert-exam"></div>

   <div id="cert-report"></div>

 </div>

 <div
   id="speechify-pane"
   class="cert-pane">

   <div class="cert-card">

     <h2>🎧 Speechify Story Lab</h2>

     <p>
       Pick a concept, copy the story, paste it directly into Speechify,
       and listen while walking, cleaning, driving, or reviewing before class.
     </p>

     <p>
       Best use: listen once, then explain the story back without looking.
       The goal is remembering the <em>logic</em>, not memorizing wording.
     </p>

   </div>

   <div id="speechify-stories"></div>

 </div>

</div>
`;

document.body.appendChild(overlay);

const launch=document.createElement("button");

launch.id="mastery-cert-launch";
launch.textContent="🏆 Mastery Lab";

document.body.appendChild(launch);

launch.onclick=()=>{
  overlay.classList.add("open");
};

document.getElementById("cert-close").onclick=()=>{
  overlay.classList.remove("open");
};

overlay.querySelectorAll(".cert-tab")
.forEach(btn=>{

  btn.onclick=()=>{

    overlay.querySelectorAll(".cert-tab")
      .forEach(b=>b.classList.remove("active"));

    overlay.querySelectorAll(".cert-pane")
      .forEach(p=>p.classList.remove("active"));

    btn.classList.add("active");

    document
      .getElementById(btn.dataset.pane)
      .classList.add("active");

  };

});

/* ============================================================
   CERTIFICATION RENDER
============================================================ */

function renderStatus(){

  const box=document.getElementById(
    "cert-status"
  );

  if(state.certified){

    const date=
      state.certifiedDate
        ? new Date(
            state.certifiedDate
          ).toLocaleDateString()
        : "";

    box.innerHTML=`

      <div class="cert-card">

        <div class="cert-score cert-pass">
          MASTERED ✓
        </div>

        <p>
          Certified ${date}
        </p>

        <p>
          Best certification score:
          <strong>${state.best}%</strong>
        </p>

      </div>
    `;

  }else{

    box.innerHTML=`

      <p>
        Current status:
        <strong>Not certified yet</strong>
        · Best score ${state.best||0}%
      </p>
    `;

  }

}

function renderExam(){

  const box=document.getElementById(
    "cert-exam"
  );

  box.innerHTML=`

  <div class="cert-card">

    <h2>Closed-Book Certification</h2>

    ${exam.map((q,i)=>`

      <div class="cert-question">

        <div class="cert-topic">
          ${q.topic}
        </div>

        <h3>
          ${i+1}. ${esc(q.prompt)}
        </h3>

        ${
          q.type==="number"
          ? `
            <input
              class="cert-input"
              id="cert-answer-${i}"
              type="number"
              step="any"
              placeholder="Numerical answer">
          `
          : `
            <textarea
              class="cert-textarea"
              id="cert-answer-${i}"
              placeholder="Explain in your own words"></textarea>
          `
        }

        <div
          id="cert-result-${i}">
        </div>

      </div>

    `).join("")}

    <button
      class="cert-btn cert-primary"
      id="cert-submit">

      Submit Certification

    </button>

  </div>
  `;

  document
    .getElementById("cert-submit")
    .onclick=gradeExam;

  document
    .getElementById("cert-report")
    .innerHTML="";

}

function renderReport(
  overall,
  topicScores,
  passed,
  misses
){

  const box=document.getElementById(
    "cert-report"
  );

  box.innerHTML=`

  <div class="cert-card">

    <div class="
      cert-score
      ${passed?"cert-pass":"cert-fail"}">

      ${overall}%

    </div>

    <h2>
      ${
        passed
        ? "MASTERED ✓"
        : "Not certified yet"
      }
    </h2>

    <p>
      Overall requirement:
      85%
    </p>

    <p>
      Every-topic requirement:
      70%
    </p>

    <h3>Topic Breakdown</h3>

    ${Object.entries(topicScores)
      .map(([topic,score])=>`

        <div class="cert-topic-row">

          <span>${topic}</span>

          <strong>
            ${score}%
            ${score>=70?"✓":"← FIX"}
          </strong>

        </div>

      `).join("")}

  </div>

  ${
    misses.length
    ? `

    <div class="cert-card">

      <h2>🚑 Automatic Correction Session</h2>

      <p>
        Do not just reread these.
        Rework them and explain why your original approach failed.
      </p>

      <ol>

      ${misses.map(q=>`

        <li style="margin-bottom:15px">

          <strong>${q.topic}</strong>

          <br>

          ${esc(q.solution)}

        </li>

      `).join("")}

      </ol>

      <button
        class="cert-btn cert-purple"
        onclick="window.runMasteryRemediation()">

        Generate Different Weak-Topic Retest

      </button>

    </div>

    `
    : `

    <div class="cert-card">

      <h2>🔥 Clean Run</h2>

      <p>
        You missed nothing on this certification attempt.
      </p>

    </div>

    `
  }

  `;

  box.scrollIntoView({
    behavior:"smooth"
  });

}

document
  .getElementById("cert-new")
  .onclick=generateExam;

document
  .getElementById("cert-remediate")
  .onclick=remediationExam;

window.runMasteryRemediation=
  remediationExam;

/* ============================================================
   SPEECHIFY STORIES
============================================================ */

function copyText(
  text,
  statusId
){

  const status=
    document.getElementById(statusId);

  if(
    navigator.clipboard &&
    navigator.clipboard.writeText
  ){

    navigator.clipboard
      .writeText(text)
      .then(()=>{
        status.textContent=
          "Copied — paste it into Speechify.";
      })
      .catch(()=>{
        fallbackCopy(text,status);
      });

  }else{

    fallbackCopy(text,status);

  }

}

function fallbackCopy(text,status){

  const area=
    document.createElement("textarea");

  area.value=text;

  document.body.appendChild(area);

  area.select();

  try{
    document.execCommand("copy");
    status.textContent=
      "Copied — paste it into Speechify.";
  }catch{
    status.textContent=
      "Select the story text and copy it manually.";
  }

  area.remove();

}

const storiesBox=
  document.getElementById(
    "speechify-stories"
  );

storiesBox.innerHTML=
  CFG.stories.map((s,i)=>{

    const text=
`TITLE: ${s.title}

CONCEPT: ${s.concept}

${s.text}

AFTER LISTENING:

Pause Speechify and explain the concept back in your own words.

Then answer:
1. What clue tells me this concept applies?
2. What governing rule or equation goes with it?
3. Why does that rule physically make sense?
4. What mistake am I most likely to make?
5. What would an unreasonable answer look like?`;

    return `

    <div class="story-card">

      <div class="cert-topic">
        ${s.concept}
      </div>

      <h2>
        ${s.title}
      </h2>

      <textarea
        class="story-box"
        id="story-${i}"
        readonly>${esc(text)}</textarea>

      <br>

      <button
        class="cert-btn cert-secondary"
        id="copy-story-${i}">

        Copy for Speechify

      </button>

      <div
        class="copy-status"
        id="copy-status-${i}">
      </div>

    </div>
    `;

  }).join("");

CFG.stories.forEach((s,i)=>{

  document
    .getElementById(
      `copy-story-${i}`
    )
    .onclick=()=>{

      copyText(
        document
          .getElementById(
            `story-${i}`
          ).value,

        `copy-status-${i}`
      );

    };

});

/* ============================================================
   START
============================================================ */

renderStatus();

console.log(
  CFG.name +
  " Mastery Certification + Speechify Lab loaded."
);

})();

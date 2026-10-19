(() => {
"use strict";

/* ============================================================
   ADAPTIVE PROBLEM ENGINE
   Easy -> Normal -> Exam -> Curveball
   ============================================================ */

const $R = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const pick = a => a[Math.floor(Math.random()*a.length)];
const round = (n,d=3) => Number(n.toFixed(d));

function subjectKey(){
  const t=document.title.toLowerCase();
  if(t.includes("circuit")) return "circuits";
  if(t.includes("static")) return "statics";
  if(t.includes("thermo")) return "thermo";
  if(t.includes("composite")) return "composites";
  return null;
}

const SUBJECT=subjectKey();
if(!SUBJECT) return;

/* ---------------------------
   PROBLEM GENERATORS
---------------------------- */

const BANK = {

/* ============================================================
   CIRCUITS
============================================================ */
circuits: {

"Ohm's Law":{
 easy(){
   const I=$R(1,10), R=$R(2,20);
   return {
    prompt:`A resistor is ${R} Ω and carries ${I} A. Find voltage.`,
    answer:I*R, unit:"V",
    hint:"Use V = IR.",
    logic:"Voltage is the electrical potential needed to push the stated current through the resistance.",
    work:`V = IR\nV = (${I})(${R})\nV = ${I*R} V`
   };
 },
 normal(){
   const V=$R(12,120), R=pick([4,6,8,10,12,15,20]);
   return {
    prompt:`A ${R} Ω resistor has ${V} V across it. Find current.`,
    answer:V/R, unit:"A",
    hint:"Rearrange V = IR for I.",
    logic:"Known voltage and resistance means Ohm's Law directly determines current.",
    work:`V = IR\nI = V/R\nI = ${V}/${R}\nI = ${round(V/R)} A`
   };
 },
 exam(){
   const I=$R(2,9)/10, V=$R(12,48);
   return {
    prompt:`A branch draws ${I} A from a ${V} V source. What resistance would produce that current?`,
    answer:V/I, unit:"Ω",
    hint:"Solve Ohm's Law for resistance.",
    logic:"Resistance is the opposition required to limit current to the given value.",
    work:`V = IR\nR = V/I\nR = ${V}/${I}\nR = ${round(V/I)} Ω`
   };
 },
 curveball(){
   const R=$R(2,12)*1000, V=$R(5,24);
   return {
    prompt:`A ${R/1000} kΩ resistor is connected across ${V} V. Find current in mA.`,
    answer:1000*V/R, unit:"mA",
    hint:"Watch the kΩ and mA relationship.",
    logic:"V/kΩ naturally gives mA. Unit recognition is part of solving.",
    work:`I = V/R\nI = ${V}/${R/1000} kΩ\nI = ${round(V/(R/1000))} mA`
   };
 }
},

"Series / Parallel":{
 easy(){
   const a=$R(2,10), b=$R(2,10);
   return {
    prompt:`Two resistors, ${a} Ω and ${b} Ω, are in series. Find Req.`,
    answer:a+b,unit:"Ω",
    hint:"Series resistances add.",
    logic:"Series elements share one current path.",
    work:`Req = R1 + R2\nReq = ${a}+${b}\nReq = ${a+b} Ω`
   };
 },
 normal(){
   const a=pick([4,6,8,10,12]), b=pick([4,6,8,10,12]);
   return {
    prompt:`${a} Ω and ${b} Ω are in parallel. Find Req.`,
    answer:a*b/(a+b),unit:"Ω",
    hint:"For two in parallel use R1R2/(R1+R2).",
    logic:"Parallel resistors share voltage and provide multiple current paths.",
    work:`Req = R1R2/(R1+R2)\n= (${a})(${b})/(${a}+${b})\n= ${round(a*b/(a+b))} Ω`
   };
 },
 exam(){
   const a=$R(2,8),b=$R(3,12),c=$R(2,10);
   const p=a*b/(a+b);
   return {
    prompt:`${a} Ω and ${b} Ω are parallel. That equivalent is in series with ${c} Ω. Find total Req.`,
    answer:p+c,unit:"Ω",
    hint:"Collapse the parallel pair first.",
    logic:"Reduce the circuit one recognizable block at a time.",
    work:`Rp = (${a})(${b})/(${a}+${b}) = ${round(p)} Ω\nReq = Rp + ${c}\nReq = ${round(p+c)} Ω`
   };
 },
 curveball(){
   const a=$R(4,12),b=$R(4,12),c=$R(4,12);
   const series=a+b;
   const eq=series*c/(series+c);
   return {
    prompt:`${a} Ω and ${b} Ω are in series. That branch is parallel with ${c} Ω. Find total Req.`,
    answer:eq,unit:"Ω",
    hint:"Make the series branch into one resistance first.",
    logic:"Topology matters more than memorizing formulas.",
    work:`Rseries=${a}+${b}=${series} Ω\nReq=(${series})(${c})/(${series}+${c})\nReq=${round(eq)} Ω`
   };
 }
},

"Voltage Divider":{
 easy(){
  const V=12,R1=2,R2=4;
  return {
   prompt:`A ${V} V source feeds ${R1} kΩ in series with ${R2} kΩ. Find voltage across the ${R2} kΩ resistor.`,
   answer:V*R2/(R1+R2),unit:"V",
   hint:"Vout = Vs R2/(R1+R2).",
   logic:"The series current is shared; the larger resistance receives the larger voltage drop.",
   work:`Vout=${V}(${R2})/(${R1}+${R2})=${round(V*R2/(R1+R2))} V`
  };
 },
 normal(){
  const V=$R(9,30),R1=$R(1,8),R2=$R(2,10);
  return {
   prompt:`Unloaded divider: Vs=${V} V, R1=${R1} kΩ, R2=${R2} kΩ. Find Vout across R2.`,
   answer:V*R2/(R1+R2),unit:"V",
   hint:"Output is measured from the junction to ground across R2.",
   logic:"For an unloaded divider, both resistors carry the same current.",
   work:`Vout=Vs·R2/(R1+R2)\n=${V}(${R2})/(${R1}+${R2})\n=${round(V*R2/(R1+R2))} V`
  };
 },
 exam(){
  const V=24,R1=4,R2=8,RL=8;
  const lower=R2*RL/(R2+RL);
  const vo=V*lower/(R1+lower);
  return {
   prompt:`A 24 V divider has R1=4 kΩ and R2=8 kΩ. An 8 kΩ load is connected across R2. Find loaded Vout.`,
   answer:vo,unit:"V",
   hint:"The load is parallel with R2 first.",
   logic:"A load changes the lower-leg resistance, so the simple unloaded divider formula cannot use R2 alone.",
   work:`Rlower=R2||RL=(8)(8)/(8+8)=4 kΩ\nVout=24(4)/(4+4)=12 V`
  };
 },
 curveball(){
  const V=$R(12,36),R1=$R(2,8),R2=$R(4,12),RL=$R(4,12);
  const lower=R2*RL/(R2+RL);
  const vo=V*lower/(R1+lower);
  return {
   prompt:`Loaded divider: Vs=${V} V, R1=${R1} kΩ, R2=${R2} kΩ, RL=${RL} kΩ across R2. Find Vout.`,
   answer:vo,unit:"V",
   hint:"R2 and RL are parallel.",
   logic:"Identify the topology after the load is attached, then reduce it.",
   work:`Rlower=R2||RL=${round(lower)} kΩ\nVout=${V}(${round(lower)})/(${R1}+${round(lower)})\n=${round(vo)} V`
  };
 }
},

"Thevenin":{
 easy(){
   const V=12,R1=2,R2=4;
   return {
    prompt:`For an unloaded ${V} V divider with R1=${R1} kΩ and R2=${R2} kΩ, find VTH at the divider node.`,
    answer:8,unit:"V",
    hint:"VTH is the open-circuit output voltage.",
    logic:"Remove the load first. The remaining divider gives open-circuit terminal voltage.",
    work:`VTH=12(4)/(2+4)=8 V`
   };
 },
 normal(){
   const V=18,R1=3,R2=6;
   const r=R1*R2/(R1+R2);
   return {
    prompt:`A ${V} V divider has R1=${R1} kΩ, R2=${R2} kΩ. Find RTH seen from the divider node after deactivating the ideal voltage source.`,
    answer:r,unit:"kΩ",
    hint:"Ideal voltage source becomes a short.",
    logic:"With the source shorted, R1 and R2 both connect from output to ground.",
    work:`RTH=R1||R2=(3)(6)/(3+6)=2 kΩ`
   };
 },
 exam(){
   const Vth=10,Rth=2,RL=3;
   return {
    prompt:`A network has VTH=${Vth} V and RTH=${Rth} kΩ. Attach RL=${RL} kΩ. Find load current in mA.`,
    answer:Vth/(Rth+RL),unit:"mA",
    hint:"The Thevenin source sees RTH and RL in series.",
    logic:"The original network is replaced by one source and one series resistance.",
    work:`IL=VTH/(RTH+RL)\n=10/(2+3)=2 mA`
   };
 },
 curveball(){
   const Vth=$R(8,20),Rth=$R(1,5),RL=$R(2,8);
   const p=(Vth/(Rth+RL))**2*RL;
   return {
    prompt:`VTH=${Vth} V, RTH=${Rth} kΩ, RL=${RL} kΩ. Find load power in mW.`,
    answer:p,unit:"mW",
    hint:"First find load current, then P=I²R. With mA and kΩ, result is mW.",
    logic:"Thevenin simplifies the network before power is calculated.",
    work:`IL=${Vth}/(${Rth}+${RL})=${round(Vth/(Rth+RL))} mA\nPL=IL²RL=${round(p)} mW`
   };
 }
}

},

/* ============================================================
   STATICS
============================================================ */
statics: {

"Force Components":{
 easy(){
  const F=100,t=60;
  return {
   prompt:`A ${F} N force is ${t}° above +x. Find Fx.`,
   answer:F*Math.cos(t*Math.PI/180),unit:"N",
   hint:"The angle is measured from x, so use cosine.",
   logic:"A force vector can be replaced by perpendicular x and y components.",
   work:`Fx=F cosθ=100 cos60°=50 N`
  };
 },
 normal(){
  const F=$R(2,8)*100,t=pick([20,30,35,40,45,50,60]);
  return {
   prompt:`A ${F} N force acts ${t}° above +x. Find Fy.`,
   answer:F*Math.sin(t*Math.PI/180),unit:"N",
   hint:"Angle from x means y uses sine.",
   logic:"The component opposite the angle is F sinθ.",
   work:`Fy=${F} sin(${t}°)=${round(F*Math.sin(t*Math.PI/180))} N`
  };
 },
 exam(){
  const x=$R(3,8)*100,y=$R(2,7)*100;
  return {
   prompt:`A force has Fx=${x} N and Fy=${y} N. Find its magnitude.`,
   answer:Math.hypot(x,y),unit:"N",
   hint:"Components form a right triangle.",
   logic:"Magnitude is the Euclidean length of the component vector.",
   work:`F=√(Fx²+Fy²)\n=√(${x}²+${y}²)\n=${round(Math.hypot(x,y))} N`
  };
 },
 curveball(){
  const F=$R(4,9)*100,t=pick([20,30,40,50]);
  return {
   prompt:`A ${F} N cable points ${t}° from the +y axis toward +x. Find Fx.`,
   answer:F*Math.sin(t*Math.PI/180),unit:"N",
   hint:"The angle is from y, not x.",
   logic:"Never memorize sine/cosine blindly; inspect which component is adjacent to the stated angle.",
   work:`Because θ is measured from y:\nFx=F sinθ\n=${F}sin${t}°\n=${round(F*Math.sin(t*Math.PI/180))} N`
  };
 }
},

"Moments":{
 easy(){
  const F=200,d=3;
  return {
   prompt:`A ${F} N force acts perpendicular to a lever ${d} m from O. Find moment magnitude.`,
   answer:F*d,unit:"N·m",
   hint:"M=Fd perpendicular.",
   logic:"Moment measures rotational tendency about a point.",
   work:`M=Fd=200(3)=600 N·m`
  };
 },
 normal(){
  const x=$R(1,5),Fy=$R(1,6)*100;
  return {
   prompt:`A vertical upward ${Fy} N force acts at x=${x} m to the right of O. Take CCW positive. Find MO.`,
   answer:x*Fy,unit:"N·m",
   hint:"MO=xFy for this geometry.",
   logic:"An upward force to the right tends to rotate counterclockwise.",
   work:`MO=xFy=${x}(${Fy})=${x*Fy} N·m`
  };
 },
 exam(){
  const x=$R(1,4),y=$R(1,3),Fx=$R(1,5)*100,Fy=$R(1,5)*100;
  return {
   prompt:`r=(${x}i+${y}j) m and F=(${Fx}i+${Fy}j) N. Find scalar moment Mz=xFy-yFx.`,
   answer:x*Fy-y*Fx,unit:"N·m",
   hint:"Use the 2D cross-product form.",
   logic:"Both force components may contribute to rotation.",
   work:`Mz=(${x})(${Fy})-(${y})(${Fx})=${x*Fy-y*Fx} N·m`
  };
 },
 curveball(){
  const x=3,y=2,Fx=-200,Fy=400;
  return {
   prompt:`At r=(3i+2j) m, F=(-200i+400j) N. Find Mz and keep the sign.`,
   answer:1600,unit:"N·m",
   hint:"Negative Fx makes the -yFx term positive.",
   logic:"Signed components matter. A formula without correct signs gives the wrong rotational direction.",
   work:`Mz=xFy-yFx\n=3(400)-2(-200)\n=1200+400\n=1600 N·m`
  };
 }
},

"Beam Reactions":{
 easy(){
  return {
   prompt:"A simply supported 6 m beam carries a 600 N point load at midspan. Find the vertical reaction at A.",
   answer:300,unit:"N",
   hint:"Symmetry splits the load evenly.",
   logic:"Symmetric geometry and loading produce equal vertical reactions.",
   work:"Ay=By\nAy+By=600\n2Ay=600\nAy=300 N"
  };
 },
 normal(){
  const L=6,P=900,a=2;
  return {
   prompt:`Pin A and roller B support a ${L} m beam. A ${P} N downward load is ${a} m from A. Find By.`,
   answer:P*a/L,unit:"N",
   hint:"Take moments about A.",
   logic:"Choosing A as the moment center eliminates both pin reactions.",
   work:`ΣMA=0\nBy(${L})-${P}(${a})=0\nBy=${P*a/L} N`
  };
 },
 exam(){
  const L=8,P1=600,a1=2,P2=1000,a2=6;
  const By=(P1*a1+P2*a2)/L;
  return {
   prompt:`An 8 m pin-roller beam has 600 N downward at x=2 m and 1000 N downward at x=6 m. Find By.`,
   answer:By,unit:"N",
   hint:"Sum moments about A.",
   logic:"Each load contributes its own moment about A.",
   work:`ΣMA=0\n8By-600(2)-1000(6)=0\nBy=${By} N`
  };
 },
 curveball(){
  const L=10,w=400;
  const F=w*L;
  return {
   prompt:`A ${L} m simply supported beam carries a uniform downward load of ${w} N/m over the full span. Find Ay.`,
   answer:F/2,unit:"N",
   hint:"Replace the distributed load with its resultant first.",
   logic:"A uniform load becomes one force equal to the area of the load diagram at its centroid.",
   work:`W=wL=${w}(${L})=${F} N\nIt acts at midspan.\nBy=${F/2} N, Ay=${F/2} N`
  };
 }
},

"Centroids":{
 easy(){
  return {
   prompt:"A rectangle is 8 cm wide and 4 cm high. Measured from its lower-left corner, find x̄.",
   answer:4,unit:"cm",
   hint:"Rectangle centroid is at its geometric center.",
   logic:"Uniform area distributes equally about the midpoint.",
   work:"x̄=b/2=8/2=4 cm"
  };
 },
 normal(){
  const A1=20,x1=2,A2=10,x2=7;
  const x=(A1*x1+A2*x2)/(A1+A2);
  return {
   prompt:`Composite area: A1=${A1} at x1=${x1}; A2=${A2} at x2=${x2}. Find x̄.`,
   answer:x,unit:"length units",
   hint:"Use area-weighted average.",
   logic:"Larger areas influence the centroid more strongly.",
   work:`x̄=ΣxA/ΣA\n=[${x1}(${A1})+${x2}(${A2})]/(${A1}+${A2})\n=${round(x)}`
  };
 },
 exam(){
  const A1=60,x1=4,A2=-12,x2=6;
  const x=(A1*x1+A2*x2)/(A1+A2);
  return {
   prompt:`A main area A1=60 has centroid x1=4. A hole of area 12 is centered at x=6. Find x̄.`,
   answer:x,unit:"length units",
   hint:"A hole is negative area.",
   logic:"Removing area pulls the centroid away from the removed material.",
   work:`x̄=[60(4)+(-12)(6)]/[60-12]\n=${round(x)}`
  };
 },
 curveball(){
  return {
   prompt:"A shape is perfectly symmetric about x=5. Without doing an area table, what is x̄?",
   answer:5,unit:"length units",
   hint:"Use symmetry before arithmetic.",
   logic:"Symmetry is an engineering shortcut and a powerful error check.",
   work:"Axis of symmetry: x=5\nTherefore x̄=5."
  };
 }
},

"Trusses":{
 easy(){
  return {
   prompt:"At an unloaded joint, exactly two non-collinear members meet. How many of those members are zero-force members?",
   answer:2,unit:"members",
   hint:"Two non-collinear forces alone cannot balance unless both are zero.",
   logic:"Particle equilibrium requires zero resultant in both x and y.",
   work:"ΣFx=0 and ΣFy=0 with only two non-collinear member forces ⇒ both forces = 0."
  };
 },
 normal(){
  const P=1000,t=45;
  const F=P/(2*Math.sin(t*Math.PI/180));
  return {
   prompt:`At a symmetric truss joint, two identical members angle ${t}° above horizontal and support a ${P} N downward load. Find the magnitude in EACH member.`,
   answer:F,unit:"N",
   hint:"Horizontal components cancel; vertical components support P.",
   logic:"Use joint equilibrium. Symmetry makes the two member forces equal.",
   work:`ΣFy=0\n2F sin45°-${P}=0\nF=${P}/[2sin45°]\n=${round(F)} N`
  };
 },
 exam(){
  const F=800,t=30;
  return {
   prompt:`A truss member carries ${F} N tension at ${t}° above +x. Find its vertical component at the joint.`,
   answer:F*Math.sin(t*Math.PI/180),unit:"N",
   hint:"Member forces act along the members.",
   logic:"Method of joints is just force-vector equilibrium at a pin.",
   work:`Fy=Fsinθ=${F}sin${t}°=${round(F*Math.sin(t*Math.PI/180))} N`
  };
 },
 curveball(){
  return {
   prompt:"You assume a truss member is in tension and solve its force as -425 N. Enter the compression magnitude.",
   answer:425,unit:"N",
   hint:"Negative means the actual direction is opposite your assumption.",
   logic:"The algebraic sign tells whether the member is actually tension or compression.",
   work:"Assumed tension → negative result\nTherefore member is in compression.\nMagnitude = 425 N."
  };
 }
}

},

/* ============================================================
   THERMODYNAMICS
============================================================ */
thermo: {

"Ideal Gas":{
 easy(){
  const P=100,v=1,R=.287;
  return {
   prompt:`Air: P=${P} kPa, v=${v} m³/kg, R=${R} kJ/(kg·K). Find T.`,
   answer:P*v/R,unit:"K",
   hint:"Use Pv=RT.",
   logic:"Pressure, specific volume, and temperature describe an ideal-gas state.",
   work:`T=Pv/R=(${P})(${v})/${R}=${round(P*v/R)} K`
  };
 },
 normal(){
  const P=300,T=400,R=.287;
  return {
   prompt:`Air: P=${P} kPa, T=${T} K, R=${R}. Find specific volume v.`,
   answer:R*T/P,unit:"m³/kg",
   hint:"Rearrange Pv=RT.",
   logic:"Always use absolute temperature in the ideal-gas relation.",
   work:`v=RT/P=(${R})(${T})/${P}=${round(R*T/P)} m³/kg`
  };
 },
 exam(){
  const P=200,V=1.5,m=2,R=.287;
  const v=V/m;
  return {
   prompt:`${m} kg of air occupies ${V} m³ at ${P} kPa. R=.287. Find T.`,
   answer:P*v/R,unit:"K",
   hint:"Convert total volume to specific volume first.",
   logic:"The ideal-gas equation using lowercase v requires volume per unit mass.",
   work:`v=V/m=${V}/${m}=${v}\nT=Pv/R=${P}(${v})/.287=${round(P*v/R)} K`
  };
 },
 curveball(){
  return {
   prompt:"Air is at 100 kPa and 27°C with R=.287 kJ/(kg·K). Find v.",
   answer:.287*(27+273.15)/100,unit:"m³/kg",
   hint:"Convert °C to K before using ideal gas law.",
   logic:"Thermodynamic temperature must be absolute.",
   work:`T=27+273.15=300.15 K\nv=RT/P=.287(300.15)/100=${round(.287*300.15/100)} m³/kg`
  };
 }
},

"Quality":{
 easy(){
  return {
   prompt:"For a saturated mixture with x=0.25, hf=500 kJ/kg and hfg=2000 kJ/kg, find h.",
   answer:1000,unit:"kJ/kg",
   hint:"h=hf+xhfg.",
   logic:"Quality is vapor mass fraction inside the saturation dome.",
   work:"h=500+0.25(2000)=1000 kJ/kg"
  };
 },
 normal(){
  const yf=400,yg=2400,x=.6;
  return {
   prompt:`Saturated mixture: yf=${yf}, yg=${yg}, x=${x}. Find y.`,
   answer:yf+x*(yg-yf),unit:"property units",
   hint:"First find yfg=yg-yf.",
   logic:"Any mixture property can be interpolated by mass quality between saturated liquid and vapor values.",
   work:`yfg=${yg}-${yf}=2000\ny=${yf}+${x}(2000)=${yf+x*2000}`
  };
 },
 exam(){
  const hf=600,hfg=1800,h=1410;
  return {
   prompt:`At saturation, hf=${hf}, hfg=${hfg}, and mixture h=${h}. Find quality x.`,
   answer:(h-hf)/hfg,unit:"decimal",
   hint:"Rearrange h=hf+xhfg.",
   logic:"If mixture enthalpy is known, quality tells what fraction of mass is vapor.",
   work:`x=(h-hf)/hfg\n=(${h}-${hf})/${hfg}\n=${round((h-hf)/hfg)}`
  };
 },
 curveball(){
  return {
   prompt:"A reported saturated-mixture quality is x=1.15. Is this physically valid? Enter 0 for NO, 1 for YES.",
   answer:0,unit:"",
   hint:"Quality is a mass fraction.",
   logic:"Quality only ranges from 0 to 1 in a saturated liquid-vapor mixture.",
   work:"x must satisfy 0 ≤ x ≤ 1.\n1.15 is invalid."
  };
 }
},

"Closed-System First Law":{
 easy(){
  return {
   prompt:"A closed system receives 500 kJ of heat and does 200 kJ of work. Neglect KE and PE. Find ΔU.",
   answer:300,unit:"kJ",
   hint:"Q-W=ΔU.",
   logic:"For a fixed mass, energy crosses the boundary as heat or work.",
   work:"ΔU=Q-W=500-200=300 kJ"
  };
 },
 normal(){
  const dU=450,W=150;
  return {
   prompt:`A closed system has ΔU=${dU} kJ and does ${W} kJ of boundary work. Neglect KE/PE. Find Q into the system.`,
   answer:dU+W,unit:"kJ",
   hint:"Q-W=ΔU.",
   logic:"Heat supplied must cover both the energy stored and the work leaving.",
   work:`Q=ΔU+W=${dU}+${W}=${dU+W} kJ`
  };
 },
 exam(){
  const Q=1000,W=400,dKE=50,dPE=20;
  return {
   prompt:`Closed system: Q=${Q} kJ in, W=${W} kJ out, ΔKE=${dKE} kJ, ΔPE=${dPE} kJ. Find ΔU.`,
   answer:Q-W-dKE-dPE,unit:"kJ",
   hint:"Keep all energy-storage terms.",
   logic:"The full closed-system energy change includes internal, kinetic, and potential energy.",
   work:`Q-W=ΔU+ΔKE+ΔPE\nΔU=${Q}-${W}-${dKE}-${dPE}=${Q-W-dKE-dPE} kJ`
  };
 },
 curveball(){
  return {
   prompt:"A closed system loses 300 kJ of heat (Q=-300 kJ) and has 100 kJ of work done ON it (so W_by=-100 kJ). Neglect KE/PE. Find ΔU.",
   answer:-200,unit:"kJ",
   hint:"Use the signs exactly as stated in Q-W=ΔU.",
   logic:"Sign convention is part of the physics, not bookkeeping trivia.",
   work:"ΔU=Q-W=(-300)-(-100)=-200 kJ"
  };
 }
},

"Steady Flow":{
 easy(){
  return {
   prompt:"A turbine has h1=3200 kJ/kg and h2=2700 kJ/kg. Adiabatic; neglect KE/PE. Find specific work output.",
   answer:500,unit:"kJ/kg",
   hint:"For this idealized turbine, wout=h1-h2.",
   logic:"A turbine converts fluid enthalpy into shaft work.",
   work:"wout=3200-2700=500 kJ/kg"
  };
 },
 normal(){
  return {
   prompt:"An adiabatic compressor has h1=300 kJ/kg and h2=500 kJ/kg. Neglect KE/PE. Find work input magnitude.",
   answer:200,unit:"kJ/kg",
   hint:"Compressor work input raises enthalpy.",
   logic:"A compressor requires shaft work to increase fluid energy.",
   work:"win=h2-h1=500-300=200 kJ/kg"
  };
 },
 exam(){
  const h1=3000,h2=2800,V1=50;
  const V2=Math.sqrt(V1*V1+2000*(h1-h2));
  return {
   prompt:`Adiabatic nozzle: h1=${h1}, h2=${h2} kJ/kg, V1=${V1} m/s. Find V2. Neglect PE.`,
   answer:V2,unit:"m/s",
   hint:"h1+V1²/2000=h2+V2²/2000.",
   logic:"A nozzle converts enthalpy into kinetic energy.",
   work:`V2²=${V1}²+2000(${h1}-${h2})\nV2=${round(V2)} m/s`
  };
 },
 curveball(){
  return {
   prompt:"A throttling valve has h1=280 kJ/kg. Under the usual steady adiabatic throttling assumptions, find h2.",
   answer:280,unit:"kJ/kg",
   hint:"Throttling is approximately isenthalpic.",
   logic:"With no shaft work and negligible KE/PE, the steady-flow energy equation reduces to h1≈h2.",
   work:"h2≈h1=280 kJ/kg"
  };
 }
},

"Mass Flow":{
 easy(){
  return {
   prompt:"Water density is 1000 kg/m³, area is 0.01 m², velocity is 2 m/s. Find mass flow rate.",
   answer:20,unit:"kg/s",
   hint:"ṁ=ρAV.",
   logic:"Volume per time through the area multiplied by density gives mass per time.",
   work:"ṁ=1000(0.01)(2)=20 kg/s"
  };
 },
 normal(){
  const rho=1.2,A=.25,V=8;
  return {
   prompt:`Air: ρ=${rho} kg/m³, A=${A} m², V=${V} m/s. Find ṁ.`,
   answer:rho*A*V,unit:"kg/s",
   hint:"ṁ=ρAV.",
   logic:"Mass conservation starts with understanding flow rate.",
   work:`ṁ=${rho}(${A})(${V})=${rho*A*V} kg/s`
  };
 },
 exam(){
  const mdot=4,rho=2,A=.1;
  return {
   prompt:`ṁ=${mdot} kg/s, ρ=${rho} kg/m³, A=${A} m². Find average velocity.`,
   answer:mdot/(rho*A),unit:"m/s",
   hint:"Rearrange ṁ=ρAV.",
   logic:"The same mass flow can occur through different combinations of density, area, and velocity.",
   work:`V=ṁ/(ρA)=${mdot}/[${rho}(${A})]=${mdot/(rho*A)} m/s`
  };
 },
 curveball(){
  return {
   prompt:"A pipe diameter is 0.20 m and average velocity is 3 m/s. Water density is 1000 kg/m³. Find mass flow rate.",
   answer:1000*Math.PI*(.2**2)/4*3,unit:"kg/s",
   hint:"First convert diameter to circular area A=πd²/4.",
   logic:"Real problems often hide the area behind geometry.",
   work:`A=π(0.20²)/4=${round(Math.PI*.2**2/4,5)} m²\nṁ=ρAV=${round(1000*Math.PI*.2**2/4*3)} kg/s`
  };
 }
}

},

/* ============================================================
   COMPOSITES
============================================================ */
composites: {

"Volume Fractions":{
 easy(){
  return {
   prompt:"A two-phase composite has Vf=0.65. Find Vm.",
   answer:.35,unit:"",
   hint:"For only fiber and matrix, Vf+Vm=1.",
   logic:"Volume fractions must account for the whole composite volume.",
   work:"Vm=1-Vf=1-0.65=0.35"
  };
 },
 normal(){
  return {
   prompt:"Fiber volume is 45 cm³ and total composite volume is 75 cm³. Find Vf as a decimal.",
   answer:.6,unit:"",
   hint:"Vf=Vfiber/Vtotal.",
   logic:"Fiber volume fraction measures what portion of composite volume is reinforcement.",
   work:"Vf=45/75=0.60"
  };
 },
 exam(){
  return {
   prompt:"A 200 cm³ composite has Vf=0.58. Find matrix volume in cm³, assuming only fiber and matrix.",
   answer:84,unit:"cm³",
   hint:"Find Vm first, then multiply by total volume.",
   logic:"Volume fraction becomes actual volume when multiplied by total composite volume.",
   work:"Vm=1-0.58=0.42\nVm,total=0.42(200)=84 cm³"
  };
 },
 curveball(){
  return {
   prompt:"A laminate contains 60 cm³ fiber, 35 cm³ matrix, and 5 cm³ voids. Find fiber volume fraction based on TOTAL specimen volume.",
   answer:.6,unit:"",
   hint:"Total includes void volume.",
   logic:"When voids exist, Vf+Vm does not equal one unless voids are excluded by definition.",
   work:"Vtotal=60+35+5=100 cm³\nVf=60/100=0.60"
  };
 }
},

"Longitudinal ROM":{
 easy(){
  return {
   prompt:"Ef=70 GPa, Em=3 GPa, Vf=0.50. Find E1 using rule of mixtures.",
   answer:36.5,unit:"GPa",
   hint:"Vm=1-Vf; E1=EfVf+EmVm.",
   logic:"Longitudinal loading approximates equal strain in fiber and matrix.",
   work:"Vm=.50\nE1=70(.5)+3(.5)=36.5 GPa"
  };
 },
 normal(){
  const Ef=230,Em=3.5,Vf=.6,Vm=.4;
  return {
   prompt:`Carbon/epoxy: Ef=${Ef} GPa, Em=${Em} GPa, Vf=${Vf}. Find E1.`,
   answer:Ef*Vf+Em*Vm,unit:"GPa",
   hint:"Longitudinal iso-strain rule of mixtures.",
   logic:"Stiff fibers dominate longitudinal modulus when aligned with the load.",
   work:`E1=${Ef}(.6)+${Em}(.4)=${round(Ef*.6+Em*.4)} GPa`
  };
 },
 exam(){
  return {
   prompt:"A UD composite has E1=100 GPa, Ef=160 GPa, Em=4 GPa. Find Vf from E1=EfVf+Em(1-Vf).",
   answer:(100-4)/(160-4),unit:"",
   hint:"Collect the Vf terms.",
   logic:"Rule of mixtures can be rearranged to infer required fiber fraction.",
   work:"100=160Vf+4(1-Vf)\n96=156Vf\nVf=0.61538"
  };
 },
 curveball(){
  return {
   prompt:"Ef=200 GPa, Em=5 GPa, Vf=55%. Find E1.",
   answer:200*.55+5*.45,unit:"GPa",
   hint:"Convert 55% to 0.55 first.",
   logic:"Percent and decimal mistakes can ruin an otherwise correct mechanics setup.",
   work:"Vf=.55, Vm=.45\nE1=200(.55)+5(.45)=112.25 GPa"
  };
 }
},

"Critical Fiber Length":{
 easy(){
  return {
   prompt:"σf=1000 MPa, d=0.010 mm, τi=50 MPa. Find critical length lc in mm.",
   answer:.1,unit:"mm",
   hint:"lc=σf d/(2τi).",
   logic:"Interfacial shear transfers load into the fiber from its ends.",
   work:"lc=1000(.010)/[2(50)]=0.10 mm"
  };
 },
 normal(){
  const s=2500,d=.007,t=40;
  return {
   prompt:`σf=${s} MPa, d=${d} mm, τi=${t} MPa. Find lc.`,
   answer:s*d/(2*t),unit:"mm",
   hint:"Keep stress units consistent; result follows the diameter length unit.",
   logic:"Stronger fibers require more length to develop their full strength if interface shear strength is unchanged.",
   work:`lc=${s}(${d})/[2(${t})]=${round(s*d/(2*t),5)} mm`
  };
 },
 exam(){
  return {
   prompt:"A fiber has lc=0.50 mm, σf=2000 MPa, d=0.020 mm. Find interfacial shear strength τi.",
   answer:40,unit:"MPa",
   hint:"Rearrange lc=σf d/(2τi).",
   logic:"Critical length can be used to infer the effectiveness of load transfer at the interface.",
   work:"τi=σf d/(2lc)=2000(.020)/(2(.50))=40 MPa"
  };
 },
 curveball(){
  return {
   prompt:"Fiber A has the same σf and d as Fiber B, but twice the interface shear strength. If Fiber B has lc=1.2 mm, find Fiber A lc.",
   answer:.6,unit:"mm",
   hint:"lc is inversely proportional to τi.",
   logic:"Better interfacial load transfer means the fiber needs less embedded length to develop stress.",
   work:"τ doubles ⇒ lc halves\nlc,A=1.2/2=0.6 mm"
  };
 }
},

"Weibull":{
 easy(){
  return {
   prompt:"A fiber population has survival probability S=0.80. Find failure probability Pf.",
   answer:.2,unit:"",
   hint:"Pf=1-S.",
   logic:"Survival and failure are complementary probabilities.",
   work:"Pf=1-0.80=0.20"
  };
 },
 normal(){
  const e=1;
  return {
   prompt:"For a Weibull model S=exp(-X), find S when X=1.",
   answer:Math.exp(-1),unit:"",
   hint:"Evaluate e^-1.",
   logic:"The exponential survival form converts accumulated flaw risk into probability.",
   work:`S=e^-1=${round(Math.exp(-1),5)}`
  };
 },
 exam(){
  const L=2,L0=1,s=.8,s0=1,m=5;
  const S=Math.exp(-(L/L0)*Math.pow(s/s0,m));
  return {
   prompt:`Use S=exp[-(L/L0)(σ/σ0)^m]. L/L0=2, σ/σ0=0.8, m=5. Find survival probability.`,
   answer:S,unit:"",
   hint:"Calculate the exponent first.",
   logic:"Longer lengths and higher stress increase the chance of encountering a critical flaw.",
   work:`X=2(0.8^5)=${round(2*.8**5,5)}\nS=e^-X=${round(S,5)}`
  };
 },
 curveball(){
  const S1=Math.exp(-1);
  const S2=Math.exp(-2);
  return {
   prompt:"If all else is unchanged and specimen length doubles, a sample had S=e^-1 originally. Under the same Weibull size model, what is new S?",
   answer:S2,unit:"",
   hint:"The Weibull exponent scales linearly with length.",
   logic:"Longer specimens sample more material and therefore more possible critical flaws.",
   work:`Original exponent=1.\nDouble length ⇒ exponent=2.\nS=e^-2=${round(S2,5)}`
  };
 }
},

"Sandwich Structures":{
 easy(){
  return {
   prompt:"In a sandwich beam, enter 1 if the lightweight core's main structural role is to separate the face sheets, 0 otherwise.",
   answer:1,unit:"",
   hint:"Think of the core like the web/depth provider in a beam.",
   logic:"Separating strong faces greatly increases bending stiffness without a large mass penalty.",
   work:"Correct: the core maintains face separation and transfers shear."
  };
 },
 normal(){
  return {
   prompt:"A sandwich panel thickness increases from 10 mm to 20 mm while using similar thin faces. Approximately by what factor does geometric bending leverage increase if treated qualitatively with depth squared?",
   answer:4,unit:"×",
   hint:"Use the simplified proportionality with depth².",
   logic:"Moving face material farther from the neutral axis dramatically improves bending efficiency.",
   work:"(20/10)²=2²=4"
  };
 },
 exam(){
  return {
   prompt:"Enter 1 if face sheets primarily carry tensile/compressive bending stresses while the core carries much of the transverse shear; otherwise enter 0.",
   answer:1,unit:"",
   hint:"Separate bending-face role from core-shear role.",
   logic:"This division of structural roles is why sandwich construction can be extremely weight efficient.",
   work:"Correct: faces dominate bending normal stress; core stabilizes/separates faces and transmits shear."
  };
 },
 curveball(){
  return {
   prompt:"A sandwich core is crushed locally under a concentrated load. Enter 1 if global face material alone guarantees the panel is undamaged, 0 if local core damage still matters.",
   answer:0,unit:"",
   hint:"Local load paths matter.",
   logic:"Core crushing can reduce support between faces, alter load transfer, and initiate further damage.",
   work:"Core damage matters even when face sheets remain visibly intact."
  };
 }
}

}

};

/* ---------------------------
   STATE / PROMOTION
---------------------------- */

const LEVELS=["easy","normal","exam","curveball"];
const LABELS={
 easy:"1 · Easy",
 normal:"2 · Normal",
 exam:"3 · Exam",
 curveball:"4 · Curveball"
};

const STORE="adaptive_mastery_"+SUBJECT;

let state;
try{state=JSON.parse(localStorage.getItem(STORE)||"{}");}
catch{state={};}

state.skills ??= {};

const subjectBank=BANK[SUBJECT];

for(const topic of Object.keys(subjectBank)){
 state.skills[topic] ??={
   level:0,
   correctAtLevel:0,
   totalCorrect:0,
   attempts:0,
   hints:0,
   revealed:0
 };
}

let currentTopic=Object.keys(subjectBank)[0];
let current=null;
let currentHints=0;
let solutionShown=false;

function save(){
 localStorage.setItem(STORE,JSON.stringify(state));
}

function needed(level){
 return level===0 ? 2 :
        level===1 ? 3 :
        level===2 ? 3 : 4;
}

function tolerance(answer){
 return Math.max(.005,Math.abs(answer)*.015);
}

function generate(){
 const s=state.skills[currentTopic];
 const lvl=LEVELS[s.level];
 current=subjectBank[currentTopic][lvl]();
 currentHints=0;
 solutionShown=false;
 renderProblem();
}

function correctAnswer(user){
 return Math.abs(user-current.answer)<=tolerance(current.answer);
}

function reward(){
 const s=state.skills[currentTopic];

 s.attempts++;
 s.totalCorrect++;

 /* If solution was shown, this problem teaches but does not count. */
 if(solutionShown){
   return "Solution viewed — good learning, but this attempt does not count toward promotion.";
 }

 /* Heavy hint use prevents promotion credit. */
 if(currentHints>=2){
   return "Correct, but heavy hint use means this attempt does not count toward promotion.";
 }

 s.correctAtLevel++;

 let promoted=false;

 if(s.correctAtLevel>=needed(s.level) && s.level<LEVELS.length-1){
   s.level++;
   s.correctAtLevel=0;
   promoted=true;
 }

 save();

 /* Feed existing mastery engine when present */
 if(typeof window.masteryGrade==="function"){
   if(s.level>=2)
     window.masteryGrade(currentTopic,"transfer",15);
   else
     window.masteryGrade(currentTopic,"solve",12);
 }

 return promoted
   ? `LEVEL UP → ${LABELS[LEVELS[s.level]]}`
   : `Progress: ${s.correctAtLevel}/${needed(s.level)} correct at this level`;
}

/* ---------------------------
   UI
---------------------------- */

const css=document.createElement("style");
css.textContent=`
#adaptive-lab{
 max-width:1100px;margin:35px auto;padding:22px;
 background:#111827;color:#f8fafc;
 border:1px solid #475569;border-radius:22px;
 font-family:system-ui,-apple-system,sans-serif
}
#adaptive-lab *{box-sizing:border-box}
#adaptive-lab .am-grid{
 display:grid;grid-template-columns:260px 1fr;gap:16px
}
#adaptive-lab .am-panel{
 background:#0b1220;border:1px solid #334155;
 border-radius:16px;padding:16px
}
#adaptive-lab button{
 width:100%;padding:11px;margin:4px 0;
 border:1px solid #475569;border-radius:10px;
 background:#172033;color:white;font:inherit;
 font-weight:700;cursor:pointer;text-align:left
}
#adaptive-lab button.active{background:#2563eb}
#adaptive-lab .action{
 width:auto;background:#38bdf8;color:#082f49;
 border:0;text-align:center;margin-right:5px
}
#adaptive-lab .hintbtn{background:#facc15;color:#422006}
#adaptive-lab .solutionbtn{background:#a78bfa;color:#2e1065}
#adaptive-lab input{
 width:100%;max-width:400px;padding:13px;
 border-radius:10px;border:1px solid #64748b;
 font:inherit;margin:8px 0;background:white;color:#111827
}
#adaptive-lab .problem{
 font-size:1.3rem;line-height:1.5
}
#adaptive-lab .feedback{
 padding:14px;border-radius:12px;margin-top:12px;
 background:#020617;white-space:pre-wrap
}
#adaptive-lab .good{border-left:5px solid #4ade80}
#adaptive-lab .bad{border-left:5px solid #fb7185}
#adaptive-lab .teach{border-left:5px solid #38bdf8}
#adaptive-lab .progressbar{
 height:10px;background:#334155;border-radius:999px;overflow:hidden
}
#adaptive-lab .progressbar div{
 height:100%;background:#4ade80
}
#adaptive-lab .badge{
 display:inline-block;padding:5px 9px;border-radius:999px;
 background:#1e293b;margin:3px;font-size:.8rem
}
@media(max-width:750px){
 #adaptive-lab .am-grid{grid-template-columns:1fr}
}
`;
document.head.appendChild(css);

const root=document.createElement("section");
root.id="adaptive-lab";

root.innerHTML=`
<div class="badge">ADAPTIVE MASTERY</div>
<h2>🎯 Prove You Can Solve It</h2>

<p>
No multiple choice. Problems get harder automatically.
You advance only by solving without excessive hints.
</p>

<div class="am-grid">

 <div class="am-panel">
  <h3>Skills</h3>
  <div id="am-topics"></div>
 </div>

 <div class="am-panel">

  <div id="am-level"></div>

  <div class="progressbar">
   <div id="am-progress"></div>
  </div>

  <h3 id="am-topic"></h3>

  <div class="problem" id="am-problem"></div>

  <label>Your numerical answer</label>
  <input id="am-answer" type="number" step="any">

  <div>
   <button class="action" id="am-check">Check answer</button>
   <button class="action hintbtn" id="am-hint">Hint</button>
   <button class="action solutionbtn" id="am-solution">Teach me</button>
  </div>

  <div id="am-feedback"></div>

 </div>

</div>
`;

document.body.appendChild(root);

const topicsBox=root.querySelector("#am-topics");
const levelBox=root.querySelector("#am-level");
const progress=root.querySelector("#am-progress");
const topicName=root.querySelector("#am-topic");
const problem=root.querySelector("#am-problem");
const answer=root.querySelector("#am-answer");
const feedback=root.querySelector("#am-feedback");

function renderTopics(){

 topicsBox.innerHTML=Object.keys(subjectBank).map(topic=>{
   const s=state.skills[topic];

   return `
   <button
     class="${topic===currentTopic?"active":""}"
     data-topic="${topic}">
     ${topic}
     <br>
     <small>${LABELS[LEVELS[s.level]]}
     · ${s.correctAtLevel}/${needed(s.level)}</small>
   </button>`;
 }).join("");

 topicsBox.querySelectorAll("button").forEach(btn=>{
   btn.onclick=()=>{
     currentTopic=btn.dataset.topic;
     renderTopics();
     generate();
   };
 });
}

function renderProblem(){

 const s=state.skills[currentTopic];

 levelBox.innerHTML=`
  <span class="badge">${LABELS[LEVELS[s.level]]}</span>
  <span class="badge">
   ${s.correctAtLevel}/${needed(s.level)} to ${
    s.level===3 ? "master this tier" : "level up"
   }
  </span>
 `;

 progress.style.width=
   `${Math.min(100,100*s.correctAtLevel/needed(s.level))}%`;

 topicName.textContent=currentTopic;
 problem.textContent=current.prompt;
 answer.value="";
 feedback.className="";
 feedback.textContent="";
 answer.focus();

 renderTopics();
}

root.querySelector("#am-hint").onclick=()=>{
 currentHints++;
 state.skills[currentTopic].hints++;
 save();

 feedback.className="feedback teach";
 feedback.textContent=
 `HINT ${currentHints}: ${current.hint}

Try the problem again before viewing the full solution.`;
};

root.querySelector("#am-solution").onclick=()=>{
 solutionShown=true;
 state.skills[currentTopic].revealed++;
 save();

 feedback.className="feedback teach";
 feedback.textContent=
 `WHY THIS METHOD?

${current.logic}

WORK:

${current.work}

ANSWER:
${current.answer} ${current.unit}

This attempt will not count toward promotion.
Generate another version and solve it yourself.`;
};

root.querySelector("#am-check").onclick=()=>{

 const raw=answer.value.trim();

 if(raw===""){
   feedback.className="feedback bad";
   feedback.textContent="Enter an answer first.";
   return;
 }

 const n=Number(raw);

 if(!Number.isFinite(n)){
   feedback.className="feedback bad";
   feedback.textContent="Enter a valid number.";
   return;
 }

 const s=state.skills[currentTopic];
 s.attempts++;

 if(correctAnswer(n)){

   /* undo double count from reward's attempt */
   s.attempts--;

   const message=reward();

   feedback.className="feedback good";
   feedback.textContent=
`CORRECT ✓

${current.logic}

${current.work}

${message}`;

   save();
   renderTopics();

   setTimeout(generate,1800);

 }else{

   save();

   feedback.className="feedback bad";
   feedback.textContent=
`NOT YET.

Do not change formulas randomly.

1. Identify what is given.
2. Identify what is being asked.
3. Decide what physical law connects them.
4. Check units and signs.

You stay at this difficulty until the pattern becomes automatic.`;
 }
};

answer.addEventListener("keydown",e=>{
 if(e.key==="Enter")
   root.querySelector("#am-check").click();
});

renderTopics();
generate();

})();

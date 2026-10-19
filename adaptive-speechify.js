
(() => {
"use strict";

/* ============================================================
   ADAPTIVE SPEECHIFY RESCUE COACH
   Watches for repeated misses and recommends the right story.
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
   STORY BANK
============================================================ */

const STORIES={

circuits:{

"Ohm's Law":{
 title:"The Water Park Called Ohm",
 text:`Picture a ridiculous water park called Ohm's World.

Voltage is the giant pump at the top of the hill.

Current is how much water shoots through the slide.

Resistance is how narrow and restrictive the slide is.

If pump pressure rises while resistance stays the same, current increases.

If resistance increases while voltage stays the same, current decreases.

The rule connecting all three is:

V equals I times R.

Before doing algebra, ask which two quantities I know and which one is missing.

Voltage pushes.
Resistance fights.
Current flows.

V = IR.`
},

"Series / Parallel":{
 title:"The One-Lane Road and the Parking Lot",
 text:`Imagine electric current driving through a city.

A series circuit is one single-lane road.

Every car must pass every checkpoint, so the same current flows through every series element.

Adding another resistor is like adding another toll booth. Total resistance increases.

A parallel circuit is a parking lot with several exits.

Every branch starts and ends at the same two nodes, so each branch has the same voltage.

Current divides among the branches.

Series means one path and same current.

Parallel means same two nodes and same voltage.

Before choosing a formula, ask:

Is this a one-lane road or a parking lot?`
},

"Voltage Divider":{
 title:"The Voltage Allowance",
 text:`Imagine two resistors splitting a fixed allowance.

They are in series, so the same current passes through both.

The larger resistor receives the larger share of the total voltage drop.

For an unloaded divider:

Vout equals Vs times R2 divided by R1 plus R2.

But if a load is attached across R2, the lower part of the divider changes.

The load is parallel with R2.

So first replace R2 and the load with their parallel equivalent.

Then use the divider equation.

The lesson:

Before using the voltage-divider formula, look at what is actually connected across the output.`
},

"KCL / KVL":{
 title:"Kirchhoff Runs a Tiny Bank",
 text:`Kirchhoff runs an obsessive electrical bank.

At a node, he counts every current entering and every current leaving.

Charge cannot mysteriously disappear.

That is Kirchhoff's Current Law.

Current entering equals current leaving.

Then Kirchhoff walks around an entire closed loop and audits voltage.

Every voltage rise and voltage drop must balance.

That is Kirchhoff's Voltage Law.

The algebraic sum of voltages around a closed loop is zero.

Node means KCL.

Loop means KVL.

If I see a junction, think current accounting.

If I see a loop, think voltage accounting.`
},

"Thevenin / Norton":{
 title:"Thevenin's Fake Storefront",
 text:`Imagine a giant complicated electrical store hidden behind one wall outlet.

You do not care what is happening inside the building.

You only care how the network behaves from the two terminals you can touch.

Thevenin replaces the entire network with one voltage source, VTH, in series with one resistance, RTH.

VTH is the open-circuit voltage.

RTH is the resistance seen looking back into the circuit after independent sources are deactivated.

An ideal voltage source becomes a short.

An ideal current source becomes an open.

Norton represents the same network using a current source in parallel with resistance.

Complicated network.

Two terminals.

Simple equivalent.`
},

"Power":{
 title:"Electricity Pays Rent",
 text:`Imagine every electrical component has to pay rent for using energy.

Power tells how quickly electrical energy is being transferred.

The basic equation is:

P equals V times I.

Using Ohm's Law, that can also become:

P equals I squared R.

Or:

P equals V squared divided by R.

If both voltage and current are known, use VI.

If current and resistance are known, I squared R is convenient.

If voltage and resistance are known, V squared over R is convenient.

Power is energy transfer rate.

Watts are joules per second.`
}

},

statics:{

"Force Components":{
 title:"The Force Gets Split Into Two Jobs",
 text:`Imagine one diagonal force shows up for work.

The boss says: you cannot work diagonally here. You need one employee working in x and one working in y.

So the force splits into components.

If the angle is measured from the x axis:

Fx equals F cosine theta.

Fy equals F sine theta.

But cosine is not automatically x.

The important question is which component is adjacent to the given angle.

Draw the triangle.

Identify adjacent and opposite.

Then choose sine or cosine.

The geometry decides the equation, not memorization.`
},

"Moments":{
 title:"The Lazy Moment Trick",
 text:`Imagine opening a stubborn door.

Pushing at the hinge barely rotates it.

Pushing far from the hinge works much better.

That is moment.

Moment equals force times perpendicular distance.

In a statics problem, choose the moment point strategically.

Take moments about a point where several unknown reactions pass through.

Those forces have zero moment about that point.

They disappear from the equation.

Statics rewards smart laziness.

Choose the moment center that eliminates the most unknowns.

Also remember the sign convention.

Counterclockwise is usually positive.

Clockwise is usually negative.`
},

"Support Reactions":{
 title:"The Support Costume Party",
 text:`Imagine every support wears a costume showing exactly what motions it prevents.

A pin prevents horizontal and vertical translation, so it creates Ax and Ay.

A roller prevents motion normal to its surface, so it creates one reaction normal to that surface.

A cable can only pull along itself.

A fixed support prevents translation and rotation, so it creates Ax, Ay, and a reaction moment.

When drawing a free-body diagram, remove the support picture.

Replace it with the reactions that support can physically provide.

Never give a support a reaction it cannot create.`
},

"Beam Equilibrium":{
 title:"The Beam Balance Game",
 text:`Imagine a beam as a giant playground balance.

If it is static, it cannot accelerate left or right, move up or down, or rotate.

That gives three equilibrium conditions:

Sum Fx equals zero.

Sum Fy equals zero.

Sum moments equals zero.

For a pin-and-roller beam, taking moments about the pin is often the smartest first move.

The pin reactions pass directly through that point, so they produce zero moment there.

That lets me solve the roller reaction first.

Then vertical force equilibrium gives the remaining vertical reaction.

Pick the equation order that eliminates unknowns.`
},

"Distributed Loads / Centroids":{
 title:"The Crowd Becomes One Giant",
 text:`Imagine hundreds of tiny people standing on a beam.

Each person pushes down a little bit.

Instead of solving hundreds of forces, statics compresses the entire crowd into one equivalent giant person.

How strong is the giant?

The area under the distributed-load diagram.

Where does the giant stand?

At the centroid of the load diagram.

Uniform rectangle: midpoint.

Triangle: one-third of the base from the heavy end.

The equivalent point force must create the same total force and the same moment as the original distribution.`
},

"Trusses / Frames":{
 title:"The Truss Joint Argument",
 text:`Imagine a truss joint as a tiny person being pulled by several ropes.

Every ideal truss member can only push or pull along its own axis.

At a joint, I usually assume unknown member forces are tension and point them away from the joint.

Then I use:

Sum Fx equals zero.

Sum Fy equals zero.

If the answer is negative, I did not fail.

The member is simply acting opposite my assumed tension direction.

That means compression.

For frames and machines, the key is different.

Separate the connected rigid members first.

Then draw a free-body diagram for each member.

Internal pin forces become visible only after separation.`
}

},

thermo:{

"Ideal Gas / State":{
 title:"The Thermo State Detective",
 text:`Imagine every thermodynamic problem is a detective case.

Before solving anything, I identify the state.

What substance is this?

What pressure?

What temperature?

What specific volume?

What phase?

If it is a gas behaving ideally, I may use:

P v equals R T.

But that equation is not automatic.

I first ask whether the ideal-gas model makes sense.

Temperature must be absolute.

Lowercase v means specific volume, not total volume.

The biggest lesson is:

Do not grab equations before identifying the state and model.`
},

"Quality / Pure Substances":{
 title:"Quality Is a Pizza",
 text:`Imagine a container holding only saturated liquid and saturated vapor.

The whole mixture is a pizza.

Quality x tells what fraction of the mass is vapor.

x equals zero means saturated liquid.

x equals one means saturated vapor.

x equals point four means forty percent of the mass is vapor.

For a mixture property:

y equals yf plus x times yfg.

Quality only exists inside the saturated liquid-vapor mixture region.

If the state is compressed liquid or superheated vapor, quality is not defined.

Before using x, confirm that the state is actually in the saturation dome.`
},

"Closed System Energy":{
 title:"The Locked Thermo Box",
 text:`Imagine a locked box containing a fixed amount of matter.

No mass enters.

No mass leaves.

That is a closed system.

Energy can still cross the boundary as heat or work.

Using the common convention:

Q into the system is positive.

W done by the system is positive.

Then:

Q minus W equals change in total system energy.

That total can include internal energy, kinetic energy, and potential energy.

The sign convention is part of the physics.

Write the equation symbolically before substituting numbers.`
},

"Mass Flow":{
 title:"The Thermo Turnstile",
 text:`Imagine molecules walking through a turnstile.

Mass flow rate tells how much mass crosses the boundary each second.

Volume flow through an opening depends on area times velocity.

Multiplying that volume flow by density gives mass flow:

m dot equals rho A V.

Density tells mass per volume.

Area times velocity gives volume per time.

Together:

kilograms per cubic meter times square meters times meters per second gives kilograms per second.

If the geometry gives diameter instead of area, calculate the area first.`
},

"Steady Flow Devices":{
 title:"The Turbine and Compressor Gym Fight",
 text:`Imagine a turbine and compressor arguing at a gym.

The turbine says:

I take high-energy fluid and make it do work for me.

The compressor says:

I require work from outside so I can increase the fluid's energy.

For a simplified adiabatic turbine, enthalpy falls as shaft work comes out.

For a compressor, enthalpy rises because work goes in.

A throttling valve is different.

Pressure can drop dramatically while enthalpy remains approximately constant.

Turbine: enthalpy down, work out.

Compressor: enthalpy up, work in.

Throttle: h stays approximately constant.`
},

"Nozzles / Energy Conversion":{
 title:"The Nozzle Launch Ramp",
 text:`Imagine a nozzle as a launch ramp for fluid.

The fluid enters with stored flow energy represented by enthalpy.

As it moves through the nozzle, some of that enthalpy turns into kinetic energy.

The fluid speeds up.

For a steady adiabatic nozzle with negligible potential energy and no shaft work:

h1 plus V1 squared over two equals h2 plus V2 squared over two.

When enthalpy falls, velocity can rise.

And when using h in kilojoules per kilogram and velocity in meters per second, remember the thousand-joule conversion.

A nozzle trades enthalpy for speed.`
}

},

composites:{

"Volume Fraction":{
 title:"The Composite Recipe",
 text:`Imagine a composite as a recipe made mostly from fiber and matrix.

Fiber volume fraction tells what fraction of the total composite volume is fiber.

Matrix volume fraction tells what fraction is matrix.

For an ideal two-phase composite:

Vf plus Vm equals one.

If Vf is point six, Vm is point four.

But do not confuse volume fraction with weight fraction.

A dense material can contribute a large weight fraction without occupying the same volume fraction.

Before using rule-of-mixtures equations, make sure the fractions are the correct type.`
},

"Longitudinal Mechanics":{
 title:"The Tug-of-War Rule of Mixtures",
 text:`Imagine fiber and matrix tied together perfectly while being stretched along the fiber direction.

Because they are bonded, they experience approximately the same longitudinal strain.

The fiber is much stiffer, so at the same strain it carries much more stress.

The effective longitudinal modulus becomes:

E1 equals Ef Vf plus Em Vm.

This is a volume-weighted stiffness relationship.

But the equation depends on its assumptions.

Continuous aligned fibers.

Good bonding.

Load parallel to the fibers.

This is the longitudinal iso-strain model.`
},

"Transverse Mechanics":{
 title:"The Sideways Spaghetti Problem",
 text:`Imagine a bundle of stiff spaghetti embedded in soft resin.

Pull along the spaghetti and the fibers dominate.

Push sideways across the spaghetti and the resin and fiber-matrix interface matter much more.

That is why transverse modulus E2 is usually far below longitudinal modulus E1.

A simple transverse approximation is:

One over E2 equals Vf over Ef plus Vm over Em.

Do not use the longitudinal rule of mixtures simply because you see Ef, Em, and Vf.

First ask which direction the load acts relative to the fibers.`
},

"Critical Fiber Length":{
 title:"The Fiber Has to Earn Its Strength",
 text:`Imagine a short fiber buried inside matrix.

The matrix transfers load into the fiber through interfacial shear.

Fiber stress does not instantly jump to maximum at the end.

It builds gradually from the ends toward the middle.

If the fiber is too short, there is not enough distance for it to develop its full tensile strength.

The critical length is:

lc equals sigma f times diameter divided by two tau i.

Higher fiber strength increases critical length.

Larger diameter increases critical length.

Higher interfacial shear strength decreases critical length.

The interface needs enough distance to hand the load to the fiber.`
},

"Weibull Statistics":{
 title:"Weibull's Bag of Invisible Cracks",
 text:`Imagine every brittle carbon fiber contains invisible microscopic flaws.

A short specimen samples a small amount of material.

A long specimen samples much more material.

The longer specimen has more opportunities to contain one dangerous flaw.

That is why brittle fiber strength is statistical.

It is not one perfect deterministic number.

Weibull analysis describes survival probability.

Higher stress lowers survival.

Greater tested length lowers survival.

A larger Weibull modulus generally means less scatter in strength.

The big idea is simple:

Fiber failure is a probability story controlled by flaws.`
},

"Tow / Filament Logic":{
 title:"Counting Invisible Hairs",
 text:`Imagine a carbon-fiber tow as thousands of microscopic hairs bundled together.

You cannot realistically count them one by one.

Instead, weigh how much tow exists per unit length.

Then calculate how much one filament should weigh per unit length.

For one circular filament:

Area equals pi d squared over four.

Mass per unit length equals density times area.

Tow linear density equals N times rho A.

Therefore:

N equals tow linear density divided by rho A.

The dangerous part is units.

Micrometers, millimeters, meters, grams, kilograms, tex, and density units must all agree before the number means anything.`
},

"Damage / Repair":{
 title:"The Damage You Cannot See",
 text:`Imagine dropping a tool on a composite aircraft panel.

The surface shows only a tiny mark.

Inside, however, layers may have separated.

Matrix cracks may have spread.

Fibers may have broken.

A sandwich core may have crushed.

Composite impact damage can hide below the surface.

That is why a repair is not about making the part look pretty.

First identify the damage.

Then understand what load path was lost.

Then create a repair that transfers load back into sound structure.

The goal of repair is restored structural performance and load path.`
},

"Sandwich Structures":{
 title:"The Sandwich Beam Is an I-Beam in Disguise",
 text:`Imagine two thin strong face sheets separated by a very light core.

The core may look weak, but it performs a powerful structural job.

It holds the face sheets far apart.

That increases bending efficiency dramatically.

The face sheets carry much of the tensile and compressive bending stress.

The core stabilizes the faces, maintains separation, and carries substantial transverse shear.

This is similar to the logic of an I-beam.

Put strong material far from the neutral axis and use lightweight material to keep it there.

Faces handle bending.

Core creates depth and transfers shear.`
}

}

};


/* ============================================================
   STATE
============================================================ */

const STORE="adaptive_speechify_"+SUBJECT;

let state;

try{
  state=JSON.parse(localStorage.getItem(STORE)||"{}");
}catch{
  state={};
}

state.misses ??={};
state.rescues ??={};

function save(){
  localStorage.setItem(STORE,JSON.stringify(state));
}


/* ============================================================
   TOPIC NORMALIZATION
============================================================ */

function storyForTopic(topic){

  const bank=STORIES[SUBJECT];

  if(bank[topic]) return [topic,bank[topic]];

  const lower=topic.toLowerCase();

  for(const [key,val] of Object.entries(bank)){

    const k=key.toLowerCase();

    if(
      lower.includes(k) ||
      k.includes(lower)
    ){
      return [key,val];
    }

  }

  /*
    Useful aliases caused by slightly different names
    across the separate learning modules.
  */

  const aliases={

    circuits:{
      "series":"Series / Parallel",
      "parallel":"Series / Parallel",
      "kcl":"KCL / KVL",
      "kvl":"KCL / KVL",
      "thevenin":"Thevenin / Norton",
      "norton":"Thevenin / Norton"
    },

    statics:{
      "moment":"Moments",
      "beam":"Beam Equilibrium",
      "distributed":"Distributed Loads / Centroids",
      "centroid":"Distributed Loads / Centroids",
      "truss":"Trusses / Frames",
      "frame":"Trusses / Frames",
      "reaction":"Support Reactions"
    },

    thermo:{
      "ideal":"Ideal Gas / State",
      "quality":"Quality / Pure Substances",
      "pure":"Quality / Pure Substances",
      "closed":"Closed System Energy",
      "mass":"Mass Flow",
      "turbine":"Steady Flow Devices",
      "compressor":"Steady Flow Devices",
      "throttle":"Steady Flow Devices",
      "nozzle":"Nozzles / Energy Conversion"
    },

    composites:{
      "volume":"Volume Fraction",
      "longitudinal":"Longitudinal Mechanics",
      "rule of mixtures":"Longitudinal Mechanics",
      "transverse":"Transverse Mechanics",
      "critical":"Critical Fiber Length",
      "weibull":"Weibull Statistics",
      "filament":"Tow / Filament Logic",
      "tow":"Tow / Filament Logic",
      "damage":"Damage / Repair",
      "repair":"Damage / Repair",
      "sandwich":"Sandwich Structures"
    }

  };

  for(const [needle,key] of Object.entries(aliases[SUBJECT]||{})){

    if(lower.includes(needle) && bank[key]){
      return [key,bank[key]];
    }

  }

  return null;
}


/* ============================================================
   UI
============================================================ */

const style=document.createElement("style");

style.textContent=`

#speechify-rescue{
 position:fixed;
 inset:0;
 z-index:1000000;
 background:rgba(2,6,23,.95);
 color:#f8fafc;
 display:none;
 overflow:auto;
 padding:24px;
 font-family:system-ui,-apple-system,sans-serif;
}

#speechify-rescue.open{
 display:block;
}

#speechify-rescue-shell{
 max-width:820px;
 margin:auto;
 background:#111827;
 border:1px solid #475569;
 border-radius:20px;
 padding:22px;
}

#speechify-rescue textarea{
 width:100%;
 min-height:340px;
 padding:15px;
 border-radius:12px;
 background:#020617;
 color:#f8fafc;
 border:1px solid #64748b;
 font:16px/1.65 system-ui;
}

#speechify-rescue button{
 padding:11px 15px;
 border:0;
 border-radius:10px;
 margin:5px;
 font:inherit;
 font-weight:850;
 cursor:pointer;
}

.sr-copy{
 background:#38bdf8;
 color:#082f49;
}

.sr-done{
 background:#4ade80;
 color:#052e16;
}

.sr-close{
 background:#fb7185;
 color:#4c0519;
}

.sr-badge{
 display:inline-block;
 padding:5px 9px;
 border-radius:999px;
 background:#312e81;
 color:#c7d2fe;
 font-size:.8rem;
 font-weight:900;
}

#speechify-rescue-status{
 color:#4ade80;
 font-weight:800;
 min-height:24px;
}

#speechify-rescue-nudge{
 display:none;
 padding:12px;
 margin:10px 0;
 border-left:5px solid #facc15;
 background:#422006;
 border-radius:10px;
}

#speechify-rescue-nudge.show{
 display:block;
}

`;

document.head.appendChild(style);

const rescue=document.createElement("div");

rescue.id="speechify-rescue";

rescue.innerHTML=`

<div id="speechify-rescue-shell">

  <span class="sr-badge">
    MEMORY RESCUE
  </span>

  <h1 id="sr-title">
    Speechify Rescue
  </h1>

  <p id="sr-why"></p>

  <div id="speechify-rescue-nudge">
    You have missed this concept multiple times.
    Stop brute-forcing it for a minute.
    Listen to the story, then explain the concept back.
  </div>

  <textarea
    id="sr-text"
    readonly>
  </textarea>

  <br>

  <button
    class="sr-copy"
    id="sr-copy">
    Copy for Speechify
  </button>

  <button
    class="sr-done"
    id="sr-understood">
    I listened / reviewed it
  </button>

  <button
    class="sr-close"
    id="sr-close">
    Close
  </button>

  <div id="speechify-rescue-status"></div>

  <hr style="border-color:#334155;margin:22px 0">

  <h3>Say it back before returning</h3>

  <p>
    Without reading the story, answer these out loud:
  </p>

  <ol>
    <li>What clue tells me this concept applies?</li>
    <li>What law, equation, or physical rule goes with it?</li>
    <li>Why does that rule make physical sense?</li>
    <li>What mistake was I probably making?</li>
  </ol>

</div>
`;

document.body.appendChild(rescue);

let currentRescueTopic=null;


/* ============================================================
   COPY
============================================================ */

function copyStory(text){

  const status=
    document.getElementById(
      "speechify-rescue-status"
    );

  if(
    navigator.clipboard &&
    navigator.clipboard.writeText
  ){

    navigator.clipboard
      .writeText(text)
      .then(()=>{
        status.textContent=
          "Copied. Paste it into Speechify.";
      })
      .catch(()=>{
        fallback(text,status);
      });

  }else{
    fallback(text,status);
  }

}

function fallback(text,status){

  const t=document.createElement("textarea");

  t.value=text;
  document.body.appendChild(t);
  t.select();

  try{
    document.execCommand("copy");

    status.textContent=
      "Copied. Paste it into Speechify.";

  }catch{

    status.textContent=
      "Select the text and copy it manually.";

  }

  t.remove();

}


/* ============================================================
   OPEN RESCUE
============================================================ */

function showRescue(topic,force=false){

  const match=storyForTopic(topic);

  if(!match) return;

  const [canonical,story]=match;

  currentRescueTopic=canonical;

  const misses=
    state.misses[canonical]||0;

  document.getElementById(
    "sr-title"
  ).textContent=
    story.title;

  document.getElementById(
    "sr-why"
  ).innerHTML=
    `<strong>${canonical}</strong><br>` +
    `Misses tracked: ${misses}. ` +
    `This story is designed to rebuild the mental model before more calculation.`;

  const fullText=
`TITLE: ${story.title}

TOPIC: ${canonical}

${story.text}

NOW PAUSE SPEECHIFY.

Explain the idea back without looking.

Answer out loud:

1. What clue tells me this concept applies?
2. What equation or principle belongs to it?
3. Why does that equation physically make sense?
4. What mistake was I making?
5. What should I check before accepting an answer?`;

  document.getElementById(
    "sr-text"
  ).value=fullText;

  document.getElementById(
    "speechify-rescue-status"
  ).textContent="";

  document.getElementById(
    "speechify-rescue-nudge"
  ).classList.toggle(
    "show",
    misses>=3 || force
  );

  rescue.classList.add("open");

}

document.getElementById(
  "sr-copy"
).onclick=()=>{

  copyStory(
    document.getElementById(
      "sr-text"
    ).value
  );

};

document.getElementById(
  "sr-close"
).onclick=()=>{

  rescue.classList.remove("open");

};

document.getElementById(
  "sr-understood"
).onclick=()=>{

  if(currentRescueTopic){

    state.rescues[currentRescueTopic]=
      (state.rescues[currentRescueTopic]||0)+1;

    /*
      Do not erase all evidence of difficulty.
      Reduce miss count so repeated problems can trigger again
      if the concept is still not sticking.
    */

    state.misses[currentRescueTopic]=
      Math.max(
        0,
        (state.misses[currentRescueTopic]||0)-2
      );

    save();

  }

  rescue.classList.remove("open");

};


/* ============================================================
   REGISTER MISS
============================================================ */

const lastSeen={};

function registerMiss(topic,source){

  const match=storyForTopic(topic);

  if(!match) return;

  const [canonical]=match;

  /*
    Prevent MutationObserver from counting the exact same
    DOM update repeatedly.
  */

  const now=Date.now();

  const signature=
    canonical+"|"+source;

  if(
    lastSeen[signature] &&
    now-lastSeen[signature]<1200
  ){
    return;
  }

  lastSeen[signature]=now;

  state.misses[canonical]=
    (state.misses[canonical]||0)+1;

  save();

  const count=
    state.misses[canonical];

  /*
    Trigger rescue on miss 3, 5, 7...
  */

  if(
    count>=3 &&
    (count===3 || count%2===1)
  ){
    showRescue(canonical);
  }

}


/* ============================================================
   ADAPTIVE PROBLEM WATCHER
============================================================ */

function watchAdaptive(){

  const feedback=
    document.getElementById(
      "am-feedback"
    );

  const topic=
    document.getElementById(
      "am-topic"
    );

  if(!feedback || !topic) return;

  const observer=
    new MutationObserver(()=>{

      const txt=
        feedback.textContent||"";

      if(
        txt.includes("NOT YET")
      ){

        registerMiss(
          topic.textContent.trim(),
          "adaptive"
        );

      }

      /*
        Successful independent recovery gradually clears misses.
      */

      if(
        txt.includes("CORRECT")
      ){

        const match=
          storyForTopic(
            topic.textContent.trim()
          );

        if(match){

          const [canonical]=match;

          state.misses[canonical]=
            Math.max(
              0,
              (state.misses[canonical]||0)-1
            );

          save();

        }

      }

    });

  observer.observe(
    feedback,
    {
      childList:true,
      subtree:true,
      characterData:true
    }
  );

}


/* ============================================================
   CERTIFICATION WATCHER
============================================================ */

function watchCertification(){

  const report=
    document.getElementById(
      "cert-report"
    );

  if(!report) return;

  const observer=
    new MutationObserver(()=>{

      document
        .querySelectorAll(
          "#cert-exam .cert-question"
        )
        .forEach(card=>{

          const result=
            card.querySelector(
              ".cert-result.bad"
            );

          if(!result) return;

          if(card.dataset.rescueCounted==="1")
            return;

          const topic=
            card.querySelector(
              ".cert-topic"
            )?.textContent.trim();

          if(!topic) return;

          card.dataset.rescueCounted="1";

          registerMiss(
            topic,
            "certification"
          );

        });

    });

  observer.observe(
    report,
    {
      childList:true,
      subtree:true
    }
  );

}


/* ============================================================
   PROFESSOR MODE WATCHER
============================================================ */

function watchProfessor(){

  const exam=
    document.getElementById(
      "pm-exam"
    );

  if(!exam) return;

  const observer=
    new MutationObserver(()=>{

      exam
        .querySelectorAll(
          ".pm-question"
        )
        .forEach(card=>{

          const result=
            card.querySelector(
              ".pm-result.bad"
            );

          if(!result) return;

          if(card.dataset.rescueCounted==="1")
            return;

          const topic=
            card.querySelector(
              ".pm-topic"
            )?.textContent.trim();

          if(!topic) return;

          card.dataset.rescueCounted="1";

          registerMiss(
            topic,
            "professor"
          );

        });

    });

  observer.observe(
    exam,
    {
      childList:true,
      subtree:true
    }
  );

}


/* ============================================================
   ADD STORY RECOMMENDATION TO MASTERY LAB
============================================================ */

function addRecommendationPanel(){

  const masteryLab=
    document.getElementById(
      "mastery-cert-shell"
    );

  if(!masteryLab) return;

  if(
    document.getElementById(
      "adaptive-story-recommendation"
    )
  ) return;

  const panel=
    document.createElement("div");

  panel.id=
    "adaptive-story-recommendation";

  panel.className="cert-card";

  masteryLab.prepend(panel);

  function render(){

    const bank=STORIES[SUBJECT];

    const ranked=
      Object.keys(bank)
        .map(topic=>[
          topic,
          state.misses[topic]||0
        ])
        .sort((a,b)=>b[1]-a[1]);

    const [topic,count]=
      ranked[0]||[null,0];

    if(!topic || count===0){

      panel.innerHTML=`
        <h3>🎧 Adaptive Story Recommendation</h3>
        <p>
          No repeated weak concept detected yet.
          Keep studying normally.
        </p>
      `;

      return;

    }

    const story=bank[topic];

    panel.innerHTML=`

      <h3>
        🎧 Recommended next:
        ${story.title}
      </h3>

      <p>
        <strong>${topic}</strong>
        has ${count}
        tracked miss${count===1?"":"es"}.
      </p>

      <p>
        Listen to this story before doing
        another heavy round of the same concept.
      </p>

      <button
        class="cert-btn cert-secondary"
        id="adaptive-story-open">

        Open Rescue Story

      </button>
    `;

    document.getElementById(
      "adaptive-story-open"
    ).onclick=()=>showRescue(
      topic,
      true
    );

  }

  render();

  /*
    Refresh whenever user opens the Mastery Lab.
  */

  const launch=
    document.getElementById(
      "mastery-cert-launch"
    );

  if(launch){

    launch.addEventListener(
      "click",
      ()=>setTimeout(render,20)
    );

  }

}


/* ============================================================
   MANUAL RESCUE BUTTON
============================================================ */

const manual=
  document.createElement("button");

manual.textContent=
  "🎧 Rescue Story";

manual.style.cssText=`
 position:fixed;
 right:16px;
 bottom:68px;
 z-index:99997;
 padding:10px 13px;
 border:0;
 border-radius:999px;
 background:#a78bfa;
 color:#2e1065;
 font-weight:900;
 cursor:pointer;
`;

manual.onclick=()=>{

  const bank=STORIES[SUBJECT];

  const ranked=
    Object.keys(bank)
      .map(topic=>[
        topic,
        state.misses[topic]||0
      ])
      .sort((a,b)=>b[1]-a[1]);

  const topic=
    ranked[0]?.[1]>0
      ? ranked[0][0]
      : Object.keys(bank)[0];

  showRescue(
    topic,
    true
  );

};

document.body.appendChild(manual);


/* ============================================================
   START AFTER OTHER MODULES LOAD
============================================================ */

function start(){

  watchAdaptive();
  watchCertification();
  watchProfessor();
  addRecommendationPanel();

}

if(document.readyState==="loading"){

  document.addEventListener(
    "DOMContentLoaded",
    ()=>setTimeout(start,150)
  );

}else{

  setTimeout(start,150);

}

console.log(
  "Adaptive Speechify Rescue loaded for",
  SUBJECT
);

})();

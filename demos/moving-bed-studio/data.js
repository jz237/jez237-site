export const SOURCES={
 media:'https://evolutionaqua.com/k1-media/',
 air:'https://support.evolutionaqua.com/hc/en-gb/articles/30268358171025-Do-I-need-an-airpump-for-NexusPlus',
 manual:'https://evolutionaqua.com/nexus-instruction-manuals',
 nitrogen:'https://ask.ifas.ufl.edu/publication/fa031',
 pump:'https://www.hiblow-usa.com/2025/02/05/how-does-a-linear-diaphragm-air-pump-work/',
 biology:'https://extension.okstate.edu/fact-sheets/principles-of-small-scale-aquaponics'
};
export const PARTS=[
 ['vessel','Reactor vessel','Containment','The flooded chamber gives carriers room to circulate. The front and right walls disappear in cutaway view.','This original demonstration is a gravity-fed sump section, not a measured Nexus or a rated aquarium filter.'],
 ['lid','Vented access cover','Access','The removable cover limits splash while allowing gas exchange. Handles and captive fasteners make its separation visible.','Keep access to screens, diffusers and plumbing. Exploded positions are explanatory offsets, not servicing instructions.'],
 ['inlet','Gravity inlet','Water circuit','Water arrives from an upstream aquarium or pond and enters the mechanical bay.','The off-screen system supplies the water. Mint arrows identify water transport; amber arrows identify air.'],
 ['basket','Solids basket','Mechanical stage','A perforated basket holds the coarse pad before the biological chamber.','Captured solids must eventually be removed. Biological filtration does not make trapped debris vanish.'],
 ['pad','Coarse mechanical pad','Mechanical stage','An open-cell pad intercepts larger particles before they reach the moving bed.','This generic prefilter is separate from the carrier bed. Its cleaning method would depend on the actual equipment.'],
 ['inlet-screen','Inlet retaining screen','Media retention','Narrow slots admit water while keeping the illustrated carriers inside their chamber.','Slots are deliberately smaller than the carrier envelope. Screens need inspection even when the bed is moving well.'],
 ['media','Moving carrier bed','Biological stage','Individual hollow carriers roll, tumble and change neighbors in the bubble-driven circulation.','Air input, the amount of media and chamber geometry all affect movement. The displayed population represents the bed; it is not a literal media-volume measurement.'],
 ['carrier','One carrier, enlarged','Protected surfaces','Open internal webs and the inner wall provide sheltered attachment surfaces for biofilm. Outer ribs receive more contact during tumbling.','The shape is an original wheel-like carrier. Film thickness and transport markers are exaggerated in the close-up; they are not microscope imagery.'],
 ['diffusers','Twin diffuser rails','Aeration','Two porous rails release many bubbles near the center of the chamber. Their rising plumes drive the circulation.','Visible bubbles are gas. Dissolved oxygen reaches the biofilm through the surrounding water; bubbles do not need to enter each carrier.'],
 ['manifold','Air manifold','Air distribution','A tee divides the airline between two diffuser rails. Compression collars and removable joints remain visible.','The airflow control changes the demonstration, not a measured liters-per-minute rating.'],
 ['airline','Airline & check valve','Air supply','The line carries air from the elevated pump to the submerged manifold. A directional check valve is shown in the line.','Actual pump placement, backflow protection and electrical protection must follow the manufacturer instructions.'],
 ['airpump','Diaphragm air pump','Air supply','The external air pump supplies aeration independently of the water pump. In the close-up, electromagnets drive a permanent-magnet rod back and forth, flexing opposed diaphragms. One-way valves direct the air.','The coil windings, moving rod, rubber diaphragms and valve ports are exposed. Motion is slowed and travel exaggerated. This generic linear-pump section follows the HIBLOW operating principle, not measured product CAD.'],
 ['outlet-screen','Outlet retaining screen','Media retention','The outlet screen passes water into the pump bay while retaining the carriers.','A crowded or obstructed screen can restrict the route. This model does not calculate pressure losses or a real blockage threshold.'],
 ['baffle','Bubble separation baffle','Hydraulics','Water passes under this baffle before reaching the return pump. The quieter bay gives entrained bubbles time to rise.','Some bubbles may still escape in a real installation. Separation here is a visual teaching approximation.'],
 ['waterpump','Return pump','Water circuit','A submerged impeller moves water onward to the aquarium or pond. This is a different motor from the air pump.','Stopping this pump halts through-flow; aeration may continue mixing the local chamber. Fixed levels in this exhibit do not model full-system drain-down.'],
 ['return','Return riser & union','Water circuit','The union and riser connect the return pump to the rest of the system.','The pipe ends indicate connections beyond the exhibit. No tank size, turnover rate or head curve is implied.'],
 ['drain','Service drain','Maintenance','A closed low-point valve provides an illustrated maintenance outlet.','It remains closed in operation. This exhibit never demonstrates draining a live, powered chamber.'],
 ['feet','Base & isolation feet','Support','The plinth supports the reactor; rubber feet separate it from the display surface.','A real water-filled filter requires a suitably supported level base.']
].map(([id,name,group,text,detail],i)=>({id,name,group,text,detail,number:String(i+1).padStart(2,'0')}));

export const LESSONS=[
 {title:'Two pumps. Two different jobs.',part:'vessel',mode:'cutaway',text:'Water passes from left to right. Air rises from below. One moves water through the system; the other creates the rolling biological bed.',observe:'Trace both paths, then switch each pump off separately in the Experiment lab.',source:'air'},
 {title:'Remove solids before the bed.',part:'pad',mode:'cutaway',center:[-2.55,1.9,0],radius:1.5,text:'The upstream basket and pad intercept larger particles. The moving chamber is primarily a biological stage, not a substitute for solids removal.',observe:'Lift the assemblies in Exploded view to see the pad, basket and retaining screen.',source:'manual'},
 {title:'A rising plume makes a rolling cell.',part:'diffusers',mode:'flow',center:[0,1.7,0],radius:2.3,text:'Bubbles rise near the center, carrying surrounding water upward. Water spreads outward near the surface and returns downward along the walls.',observe:'Watch one highlighted carrier. It changes depth and orientation instead of repeating a fixed orbit.',source:'air'},
 {title:'The surface inside the surface.',part:'carrier',mode:'macro',text:'The hollow carrier provides open water passages and protected inner attachment surfaces. The enlarged film is a visual guide to where biofilm can establish.',observe:'Toggle the outer shell and rotate the carrier to inspect its internal webs.',source:'media'},
 {title:'Transformation, not disappearance.',part:'carrier',mode:'macro',biology:true,text:'Nitrification converts ammonia to nitrite and then nitrate. It requires oxygen and consumes alkalinity; nitrate still needs an export route in the wider system.',observe:'Open the three reaction cards. The colored dots identify substances; they are not to-scale molecules.',source:'nitrogen'},
 {title:'Movement needs room.',part:'media',mode:'cutaway',preset:'crowded',text:'More carriers do not automatically mean a better operating filter. Crowding changes circulation and increases the air needed to move the bed.',observe:'Compare the crowded setting with normal operation. Then keep the load fixed and change only the air input.',source:'air'},
 {title:'Air failure is a separate failure.',part:'media',mode:'flow',preset:'air-off',text:'With air off, bubble production stops and the rolling motion decays. These floating carriers accumulate near the surface while the water pump still operates.',observe:'The amber status means aeration is off; it is not a measurement of dissolved oxygen or immediate bacterial death.',source:'media'},
 {title:'A moving bed is not instantly mature.',part:'carrier',mode:'macro',preset:'new',text:'New plastic and established biofilm are different states. Colonization takes time and depends on conditions; visible motion alone cannot confirm biological readiness.',observe:'Use the biofilm stage control to compare appearance and explanation. It is not a cycling timer or a capacity prediction.',source:'nitrogen'},
 {title:'Keep the whole system working.',part:'vessel',mode:'cutaway',preset:'normal',text:'Inspect the solids stage, retaining screens, diffuser output and pumps. Preserve established biological media and follow the actual equipment instructions.',observe:'Use the maintenance checklist, then return to the lab and predict each scenario before running it.',source:'manual'}
];
export const SCENARIOS=[
 {id:'normal',name:'Normal operation',air:70,load:40,water:65,maturity:75,airOn:true,waterOn:true,note:'A rolling bed, open passages and separate air and water routes.'},
 {id:'weak',name:'Weak aeration',air:14,load:40,water:65,maturity:75,airOn:true,waterOn:true,note:'The same media load with a weaker plume. Watch for a surface raft and slower exchange.'},
 {id:'crowded',name:'Crowded chamber',air:70,load:80,water:65,maturity:75,airOn:true,waterOn:true,note:'More representative carriers share the chamber. Neighbor contacts and crowding resist movement.'},
 {id:'air-off',name:'Air pump off',air:70,load:40,water:65,maturity:75,airOn:false,waterOn:true,note:'Through-flow continues. Aeration and the rolling current decay independently.'},
 {id:'water-off',name:'Water pump off',air:70,load:40,water:65,maturity:75,airOn:true,waterOn:false,note:'The local bed still rolls, but the illustrated system is no longer bringing in new water.'},
 {id:'new',name:'Fresh media',air:70,load:40,water:65,maturity:0,airOn:true,waterOn:true,note:'Movement is visible before a mature biofilm exists. Do not infer biological capacity from appearance.'}
];
export const REACTIONS=[
 {name:'Ammonia → nitrite',tag:'01 / FIRST OXIDATION',text:'Microorganisms oxidize ammonia to nitrite. This process uses oxygen and contributes acidity. Nitrite remains a substance to monitor.',equation:'NH₄⁺ + 1½ O₂ → NO₂⁻ + 2 H⁺ + H₂O'},
 {name:'Nitrite → nitrate',tag:'02 / SECOND OXIDATION',text:'Nitrite is oxidized to nitrate using more oxygen. Different organisms and pathways can contribute; this diagram simplifies the process into two steps.',equation:'NO₂⁻ + ½ O₂ → NO₃⁻'},
 {name:'Nitrate needs a destination',tag:'03 / THE WIDER SYSTEM',text:'This aerobic moving bed does not remove nitrogen as gas. Water changes, plant or algae uptake, or a separate denitrification process can provide export or further treatment.',equation:'NO₃⁻ → managed export / further treatment'}
];
export const CARE=[
 ['Observe first','Look for a rolling bed, even aeration and clear screen passages. Check measured water quality; movement and water clarity do not establish biological performance.'],
 ['Isolate safely','Disconnect the relevant power and follow the actual filter and pump manuals before servicing. This view stops all operating animation and separates the access parts.'],
 ['Remove captured solids','Service the mechanical stage and inspect retaining screens. Do not indiscriminately sterilize established biological media.'],
 ['Restore and verify','Reassemble, restore water and air safely, check for leaks and verify circulation and water quality. The demonstration is not a substitute for equipment instructions.']
];
export function conditions(s){
 const air=s.airOn?s.air/100:0,water=s.waterOn?s.water/100:0,load=s.load/100;
 const mixing=air/(.55+load*1.5),count=Math.round(150+load*510);
 return {air,water,load,mixing,count,stress:!s.airOn||!s.waterOn?'attention':mixing<.30?'weak':load>.65?'crowded':'normal'};
}

export const STORE = 'https://www.thehiddenreef.com/oase-3-rd-gen-filtoclear-pressure-flo-filter-5200.html';
export const OASE = 'https://www.oase.com/en-US/pond-and-water-garden/filtoclear-5200';
export const MANUAL = 'https://www.thepondguy.com/content/pdp/docs/oase-filtoclear-gen3-product-manual.pdf';
export const GROUPS = {shell:'Housing & seals',media:'Foam & supports',uv:'UV clarification',plumbing:'Connections & valve',cleaning:'Cleaning mechanism'};
const part=(id,name,group,description,detail,number='')=>({id,name,group,description,detail,number});
export const PARTS = [
 part('vessel','Pressure vessel','shell','The tapered container holds the filter assembly and its water.','Its closed shape contains the pumped flow. This reconstruction opens a section of the wall so you can see inside.','89003'),
 part('lid','Filter lid & manifold','shell','The lid carries the hose connections, UV assembly and cleaning controls.','Water passages are simplified in this educational model; the real lid contains molded internal channels.','74381'),
 part('clamp','Metal clamping ring','shell','The clamp secures the lid around the rim of the vessel.','Opening the filter is a service operation: stop the pump, isolate electricity and release pressure as the manual directs.','77754'),
 part('seal','Lid O-ring','shell','A continuous flexible seal sits between the lid and vessel.','A seal depends on a clean seating surface and even closure. The blue color follows the listed replacement ring.','77773'),
 part('foam-top','Upper blue foam · coarse','media','An open-pore foam ring provides water passages and surfaces for a biofilm.','Two blue rings belong to the 5200 foam set. Foams provide both physical filtration and habitat for beneficial bacteria.','91647 · set'),
 part('foam-red','Red foam · fine','media','The finer pore structure catches smaller suspended particles.','Different pore densities balance filtration with resistance to flow. A colored ring is not a separate chemical treatment.','91647 · set'),
 part('foam-blue','Lower blue foam · coarse','media','The second blue ring adds filtration area within the stack.','Captured material must eventually leave the filter during cleaning; it does not disappear inside the foam.','91647 · set'),
 part('foam-purple','Purple foam · medium','media','The purple ring completes the four-ring foam package.','The manufacturer identifies blue as 10 ppi, purple as 20 ppi and red as 30 ppi. Ppi means pores per inch.','91647 · set'),
 part('spacer-top','Upper spacer plate','media','A ribbed plate supports the top of the foam package.','Its openings allow water to move while its ribs distribute load.','77732'),
 part('spacer-red','Spacer plate · upper middle','media','This open plate separates neighboring foam rings.','Separating the rings exposes a support that is normally hidden within the foam stack.','77732'),
 part('spacer-blue','Spacer plate · lower middle','media','Another support maintains the foam package geometry.','The radial ribs shown here are reconstructed from the manufacturer’s exploded diagram.','77732'),
 part('spacer-purple','Spacer plate · lower','media','The lower spacer supports the last foam layer.','Small spacer links hold the support plates apart in the assembled filter.','77732'),
 part('base-plate','Closing plate','cleaning','The bottom plate is connected to the cleaning rods.','Pulling the handle lifts this plate and compresses the foam package.','77734'),
 part('lip-seal','Lower lip seal','shell','A flexible sealing ring fits around the lower closing plate.','This seal is distinct from the large lid O-ring.','77735'),
 part('mesh','Meshed support tube','media','The perforated tube maintains space around the central UV water casing.','Its open lattice supports the foam rings without forming a solid wall through them.','21654'),
 part('handle','Easy-Clean handle & rods','cleaning','The blue handle links to the bottom plate through two long rods.','Watch Cleaning to see the rods raise the plate and squeeze the foam while the lid stays shut.','83890'),
 part('uv-head','UVC head & ballast cover','uv','The dark top enclosure contains the lamp’s electrical head.','The real housing protects electrical parts. This model shows the enclosure, not unverified electronics.','92949'),
 part('lamp','42 W UVC lamp','uv','A twin-tube lamp sits inside the protective quartz sleeve.','UV-C is invisible. The violet flow cue in this lesson is symbolic; never operate a real lamp outside its protective casing.','91649'),
 part('quartz','Quartz sleeve','uv','The transparent sleeve separates the lamp from the circulating water.','Deposits on its surface can obstruct UV transmission. The sleeve is a real physical barrier, not an empty air gap.','74378'),
 part('quartz-seal','Quartz sealing O-ring','uv','A small O-ring seals the quartz sleeve connection.','Correct seal condition and placement keep water away from the lamp assembly.','73486'),
 part('uv-lock','UVC retaining collar','uv','The locking collar holds the UV head and sleeve assembly in place.','For service, follow the manufacturer’s electrical isolation and removal instructions.','74380'),
 part('rotor','Quartz cleaning rotor','uv','A rotating cage surrounds the quartz sleeve.','The 5200 includes a water-driven rotor to help keep the quartz surface clean. Rotation here is illustrative.','90685'),
 part('uv-casing','UVC water casing','uv','A long casing surrounds the quartz and guides water through the UV area.','Cutaway mode opens this casing to reveal the nested parts.','86941'),
 part('uv-cap','UVC lower end cap','uv','The end cap closes the bottom of the UV water casing.','The removable cap is shown separately in the exploded view.','77750'),
 part('valve','Filter / clean selector','plumbing','The blue rotary control selects the normal return or the waste outlet.','Cleaning directs dirty water away from the pond. It does not simply circulate the released dirt back to the fish.','74368'),
 part('inlet','Pond-water inlet adapter','plumbing','The black adapter receives water from a separate pond pump.','The filter has no built-in pond pump. Hose size, pipe length and lift all affect delivered flow.'),
 part('outlet','Clean-water return adapter','plumbing','The transparent adapter connects the normal return to the pond.','A pressure filter can feed a raised return within the manufacturer’s installation limits.'),
 part('waste','Waste-water adapter','plumbing','The second transparent adapter routes cleaning water away from the pond.','The waste connection is closed or secured in normal use. Arrange disposal according to local requirements.'),
 part('waste-cap','Waste outlet cap','plumbing','A threaded cap closes the unused dirt-water connection.','It moves aside in the Cleaning animation to reveal the waste route.'),
 part('inlet-nut','Inlet union nut & seal','plumbing','The union holds the inlet fitting against its seal.','The thread secures the joint; the gasket provides the watertight interface.'),
 part('outlet-nut','Return union nut & seal','plumbing','The return fitting uses its own retaining nut and gasket.','The visible union can be disconnected without treating the hose as a handle.'),
 part('waste-nut','Waste union nut & seal','plumbing','A third union connects the cleaning-water outlet.','The separate waste route is part of the filter’s maintenance system.'),
];
export const LESSONS = [
 {title:'One filter. Three jobs.',tag:'01 / THE BIG PICTURE',mode:'exploded',part:'vessel',body:'A separate pump sends pond water through a sealed filter. Foams retain debris and support a living biofilm; the enclosed UVC unit helps control suspended green-water algae. Explore each assembly, then follow the water.'},
 {title:'First, keep the water contained.',tag:'02 / HOUSING & SEALS',mode:'exploded',part:'seal',body:'The pressure vessel, lid, clamp and O-ring form the outer assembly. A small seal has a large job: maintaining a watertight joint around the entire opening.'},
 {title:'Four foams, three pore densities.',tag:'03 / MECHANICAL FILTRATION',mode:'exploded',part:'foam-purple',body:'The 5200 uses two blue rings, one red and one purple. Pores create many flow paths and a large internal surface. The support plates and meshed tube preserve the shape of the package.'},
 {title:'A filter becomes a habitat.',tag:'04 / BIOLOGICAL FILTRATION',mode:'cutaway',part:'foam-blue',body:'Beneficial microorganisms grow on wet filter surfaces. Nitrification transforms ammonia into nitrite and then nitrate. Establishing that community takes time; clear-looking water still needs testing.'},
 {title:'Light in a protected chamber.',tag:'05 / UV CLARIFICATION',mode:'exploded',part:'quartz',body:'The lamp, quartz sleeve, rotor and water casing fit inside one another. The quartz separates water from the lamp. UV clarification complements filtration; it does not replace ammonia testing or a healthy biofilter.'},
 {title:'Follow the flow.',tag:'06 / THE WATER CIRCUIT',mode:'flow',part:'inlet',body:'Trace the inlet, foam area, central UV path and return. The manufacturer includes a bypass around the UV exposure path. These moving traces explain the connections; they are not a simulation of the exact internal hydraulics.'},
 {title:'Send the dirt out.',tag:'07 / EASY-CLEAN',mode:'cleaning',part:'handle',body:'The selector changes the destination to waste. Raising the handle lifts the lower plate, squeezing the foam package. The animation illustrates the mechanism with the wall cut away; the real lid remains closed during routine Easy-Clean operation.'},
 {title:'Size for the fish, not the name.',tag:'08 / PLANNING A REAL POND',mode:'assembled',part:'vessel',body:'The Hidden Reef lists different volume limits for light, medium and heavy fish loads. The 5200 name is not its heavy-load koi capacity. Match the complete system to your pond, fish, feeding, plumbing and maintenance.'},
];
export const smooth = t => {t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const explosionOffset = (vector, amount, delay=0) => vector.map(v=>v*smooth((amount-delay)/(1-delay)));

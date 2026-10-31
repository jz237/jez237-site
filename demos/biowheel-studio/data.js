export const PARTS=[
 ['wheel','01','Pleated biological wheel','A folded, fibrous surface supports attached biofilm. Water turns the freely mounted wheel; the exposed arc remains moist while meeting air. The brown mottling in this model represents an established surface, not a disposable dirt cartridge.'],
 ['axle','02','Axle & bearing seats','The wheel turns on small end bearings. These contact points are separate from the pleated media. In the obstruction experiment the flow continues but the wheel stops; the bearing-service study shows the distinction.'],
 ['cartridge','03','Mechanical filter cartridge','The upstream blue pad intercepts suspended debris. Its ribbed frame supports the fabric. Select the loaded-cartridge experiment to see less water reach the return, then animate a cartridge change.'],
 ['carbon','04','Activated-carbon compartment','The cartridge includes carbon granules for chemical adsorption. The section reveals individual granules behind the pad. Adsorption and biological conversion are different processes; this model does not calculate chemical capacity.'],
 ['intake','05','Intake tube & extension','A submerged intake carries aquarium water up and into the pump well. The striped arrows trace the route. A transparent teaching section makes the interior visible; it is not an air line.'],
 ['strainer','06','Intake strainer','Slots admit water while screening out large objects. Intake restriction reduces the modeled circulation even with a clean cartridge. A strainer is not a fine mechanical filter.'],
 ['impeller','07','Magnetic impeller','A rotating magnet and vanes drive water through the filter. The cutaway exposes the rotor, shaft and volute. The rotation is slowed for inspection; it is independent of the passive biological wheel.'],
 ['motor','08','Sealed motor housing','The electrical motor drives the impeller, not the Bio-Wheel. The explanatory section shows their separate motions. Disconnect power before real maintenance and follow the unit’s own instructions.'],
 ['spillway','09','Wheel trough & spillway','Returning water contacts the lower pleats, then spreads into a sheet over the lip. Gravity carries the return into the aquarium. Lower aquarium water makes a longer fall and more visible splash in this study.'],
 ['housing','10','Filter box & cartridge guides','The molded box hangs behind the aquarium. Internal rails locate the cartridge and separate the incoming region from the return. Section view removes selected walls and the lid to expose the layout.'],
 ['lid','11','Vented cover','The removable lid shields the rear chamber. Its ribs, vent slots and underside locating tabs are visible in the exploded view. Maintenance lifts the lid before removing the cartridge.'],
 ['bypass','12','High-level bypass','When the pad is heavily obstructed, a higher route permits some water to return without crossing the media. Amber arrows identify this reduced-filtration route in the experiment.'],
 ['mount','13','Aquarium rim & support','The hanging support sits across the rim and holds the filter box outside the aquarium. Rubber contact points and a leveling foot make the relationship visible. This geometry is illustrative rather than a dimensional installation guide.'],
 ['aquarium','14','Aquarium & receiving water','A small section of the aquarium makes the circulation loop visible. Surface ripples, entrained bubbles and return eddies react to the pump and water-level controls. No stocking or treatment rating is implied.']
];
export const LESSONS=[
 ['Two rotations. Two causes.','Watch the impeller and wheel together: electricity drives the pump rotor; the returning water drives the biological wheel. Switch the pump off and both settle.','impeller'],
 ['Screen, then capture','Trace water up the slotted intake and toward the blue pad. The cartridge collects suspended material before the return reaches the wheel.','cartridge'],
 ['Adsorption has its own role','The black granules behind the pad provide chemical media. This section separates their role from mechanical capture and the living wheel.','carbon'],
 ['A folded living surface','Zoom into the wheel. Closely spaced pleats provide more colonizable surface than a smooth cylinder in the same space. Fibers, wet sheen and patchy biofilm are shown at different scales.','wheel'],
 ['Wet/dry does not mean dried out','The marked pleat alternates between water contact and air exposure. It retains a film of moisture outside the stream. The demo does not dry each pleat on every turn.','wheel'],
 ['A biological transformation','In the microscope, colored markers represent dissolved nitrogen moving through a simplified ammonia → nitrite → nitrate sequence. Oxygen reaches the moist film. These are conceptual markers, not literal molecule colors or sizes.','macro'],
 ['A stopped wheel needs diagnosis','Compare intake restriction with a blocked axle. One reduces water delivery; the other stops rotation despite continuing water flow. The controls deliberately isolate these causes.','axle'],
 ['Service the consumable, preserve the culture','Compare the two service animations. A cartridge is exchanged. The wheel is retained during axle care, kept moist and re-seated. No automatic disposal of mature biological media is shown.','cartridge'],
 ['Nitrification is not nitrogen export','Conversion to nitrate leaves nitrogen in the water. Water changes, plant uptake or a separate suitable process manage accumulation. A spinning wheel alone cannot prove an aquarium is cycled.','macro']
];
export const SCENARIOS=[
 ['normal','Normal operation','A clean flow path feeds a freely turning, established wheel.',{}],
 ['loaded','Loaded cartridge','Higher pad resistance reduces circulation. At heavy loading the amber bypass route becomes active.',{loading:96}],
 ['intake','Restricted intake','A restricted intake lowers delivery to both cartridge and wheel.',{restriction:88}],
 ['axle','Blocked axle','Water still returns, but the wheel cannot turn. Service the bearing seats.',{jammed:true}],
 ['low','Low aquarium water','The return falls farther. Watch the water sheet and bubbles below the spillway.',{water:14}],
 ['new','New biological wheel','Pale pleats and sparse microscope colonies represent an unestablished surface. This is a comparison, not an instant cycling treatment.',{maturity:5}],
 ['power','Power interruption','The wheel coasts down and the moving water settles. Retained moisture persists.',{pump:false}],
 ['dry','Unprimed filter','The teaching interlock prevents dry running. Use Fill filter box before starting.',{primed:false}]
];
export const QUIZ=[
 ['Does the Bio-Wheel have its own drive motor?',false,'The returning water rotates it; the motor drives the impeller.'],
 ['Should a normally brown wheel be discarded during every cartridge change?',false,'Brown coloration can be normal on an established biological surface.'],
 ['Does nitrification remove all nitrogen from the aquarium?',false,'It converts reduced nitrogen toward nitrate; nitrogen still needs a separate export route.'],
 ['Can a blocked bearing stop the wheel while water still returns?',true,'That is why the axle and the water path are separate diagnostic checks.']
];

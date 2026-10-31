export const PARTS=[
 ['supply','01','Clean fleece roll','A long strip of unused nonwoven fleece waits above the water. It unwinds only when the drive advances the web. The shrinking roll and growing waste roll conserve the same strip.'],
 ['takeup','02','Used-fleece take-up','The motor winds the loaded fleece out of the water. Captured solids leave the circulating water with it. This roll is disposed of during servicing; it is not washed back into the aquarium.'],
 ['web','03','Nonwoven filter web','Water passes through a random network of fibers. Suspended particles collect on and within the web. A loading layer increases resistance. White is unused fleece; amber and brown indicate captured material.'],
 ['basket','04','Perforated support basket','Rigid ribs and open slots support the wet fleece against the pressure difference. The textile does the fine filtration; the basket prevents collapse and provides a path into the sump.'],
 ['inlet','05','Drain inlet & diffuser','Water from the aquarium overflow enters the dirty side of the filter. A flexible hose and diffuser spread incoming flow. The motor moves fleece; it does not pump the aquarium water.'],
 ['sensor','06','Internal level sensor','As fleece clogs, the upstream water level rises. A wet level sensor requests a short advance. Fresh fleece reduces resistance, so the level falls again. The timing and thresholds here are illustrative.'],
 ['drive','07','Geared drive & coupling','A compact geared motor applies slow, controlled torque to the take-up spindle. The exposed gears are an explanatory section, not a reproduction of the proprietary drive internals.'],
 ['guides','08','Guide rollers','Guide rollers keep the strip aligned and supported as it turns beneath the chamber. Smooth travel and a correctly threaded roll are essential; a jam prevents fresh material reaching the water.'],
 ['housing','09','Housing & mounting frame','The frame carries the spindles, chamber and mounting feet. Cutaway mode removes the front plate so the web route is visible; assembled mode restores it.'],
 ['guard','10','External high-water protection','A high sump can submerge the sensing region without fleece actually being clogged. In this teaching model, high external water inhibits the drive so it cannot consume a whole roll chasing the sump level.'],
 ['bypass','11','Emergency bypass','An elevated overflow path lets incoming water escape when the web cannot pass enough flow. This protects the flow path at the expense of filtration: bypassing water has not crossed the fleece.'],
 ['media','12','Optional media basket','A separate downstream basket can hold appropriate chemical media. That is a different treatment process from trapping solids. This model shows an empty basket; media choice and use follow its own instructions.'],
 ['sump','13','Receiving sump','Filtered water rejoins the sump. The rest of the aquarium system still needs circulation and suitable biological filtration. Water levels inside and outside the fleece are shown separately.'],
 ['controller','14','Drive controller','A local status indicator makes the automatic cycle visible. Observe the sensor, motor and water level together. This educational display is not a connected ReefBeat app or a real equipment controller.']
];
export const LESSONS=[
 ['The aquarium supplies the flow','Trace the inlet hose into the dirty chamber. Water arrives from the aquarium drain; the little roller motor only handles fabric.','inlet'],
 ['A web, not a solid wall','Look through the enlarged fiber study. The pores let water pass while many suspended particles are intercepted. This is a nonwoven network, not a woven square mesh.','web'],
 ['Loading creates a level difference','Debris builds up on the upstream face. Increased resistance raises the dirty-side level relative to the sump. Try the Heavy feeding experiment.','sensor'],
 ['A short advance restores flow','The sensor starts a brief motor pulse. Fresh fabric enters the active path, the waste roll grows, and the upstream water falls. The controller then waits before reconsidering the level.','drive'],
 ['Capture becomes export','Particles captured underwater are still in contact with circulating water. Winding that loaded fleece onto the dry take-up roll removes the retained material from the main water path.','takeup'],
 ['High water is not always a dirty roll','A high sump can raise both levels. The external high-water guard inhibits wasteful advancing. Fix the cause of high sump water; advancing more fleece is not the answer.','guard'],
 ['Faults need attention','A jam or empty roll cannot restore fresh filter area. The bypass becomes visible if water rises high enough. Bypass preserves a flow path, but filtration is reduced.','bypass'],
 ['Replace the consumable, keep the machine','The used roll lifts out, a fresh roll arrives, and the web is restored. Automatic service here represents a person doing this; real units do not replace their own rolls.','supply']
];
export const SCENARIOS=[
 ['normal','Normal cycle','Watch the water level rise, trigger a short advance and settle.',{flow:55,load:45,sump:20,jammed:false,pump:true},{loading:.5,level:2.65,remaining:.82}],
 ['heavy','Heavy feeding','More suspended debris loads the web faster. Collection is accelerated for study.',{flow:75,load:100,sump:20,jammed:false,pump:true},{loading:.62,level:2.8,remaining:.65}],
 ['jam','Jammed drive','The strip cannot move. Watch the upstream level and emergency bypass.',{flow:85,load:90,sump:20,jammed:true,pump:true},{loading:.9,level:3.1,remaining:.6}],
 ['high','High sump','Both sides rise. The external guard inhibits the motor.',{flow:55,load:55,sump:100,jammed:false,pump:true},{loading:.7,level:3.2,remaining:.65}],
 ['end','End of roll','Automatic care changes the roll. Turn automatic care off to study exhaustion.',{flow:70,load:75,sump:20,jammed:false,pump:true},{loading:.8,level:3,remaining:.025}],
 ['power','Inflow stopped','The chamber drains toward the sump level; the drive stops.',{flow:55,load:45,sump:20,jammed:false,pump:false},{loading:.6,level:2.8,remaining:.65}]
];

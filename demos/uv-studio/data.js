export const PARTS=[
 ['body','01','Opaque reaction chamber','The housing contains water and shields people from the lamp. The cutaway is a teaching view: a real UV lamp must remain enclosed whenever powered.'],
 ['inlet','02','Inlet & stepped hose barb','A separate pump or filter supplies prefiltered water. A matching hose, clamp, gasket and threaded union form the connection. The UV unit does not create its own flow.'],
 ['outlet','03','Outlet & return','Water leaves the chamber and returns to the system. Passing through UV does not physically remove particles or guarantee that every organism in an aquarium has been treated.'],
 ['baffles','04','Illustrative flow guides','Baffling extends the route and changes mixing. These schematic openings explain that principle; their number and shape are not Aquatop factory dimensions.'],
 ['sleeve','05','Quartz isolation sleeve','Water contacts the outside of this closed-end sleeve. The lamp occupies the dry interior. Deposits on the wet surface reduce transmitted UV even when the lamp still lights.'],
 ['lamp','06','Compact UV lamp','A compact ultraviolet lamp supplies germicidal radiation. The violet glow is a teaching overlay: UV-C is invisible. Electrical wattage is not the dose received by a passing organism.'],
 ['socket','07','Lamp socket & pins','The lamp connects to a dry socket. During service, align its pins and withdraw or insert it straight; the glass and electrical contacts are not bending handles.'],
 ['seal','08','Seal & threaded collar','Seals keep water out of the dry lamp region. Inspect seating surfaces during service; an incorrectly seated or damaged seal can leak.'],
 ['cap','09','Service cap & cable gland','The removable cap protects the lamp connection and leads to the external ballast. Disconnect power before opening the housing.'],
 ['ballast','10','External ballast','The ballast provides the electrical conditions the lamp requires. It is a separate dry electrical component, not a water pump. Keep connections dry and follow the manual.'],
 ['mounts','11','Mounting brackets','Two saddles support the cylindrical body. Install the actual unit securely in the location and orientation allowed by its instructions.'],
 ['pump','12','External supply pump','Shown for system context, not included with the UV unit. Its delivery sets how much water passes the chamber per unit time. Mechanical prefiltration should precede the UV.'],
 ['water','13','Water & exposure paths','Cyan arrows indicate water motion. Amber, mint and pink tracers sample different illustrative paths. Their relative accumulated exposure can differ within the same chamber.'],
 ['deposit','14','Sleeve deposits','The mottled film represents mineral or organic deposits. It reduces transmission independently of water clarity and lamp output; the three are separate experiment controls.']
];
export const LESSONS=[
 ['An extra treatment stage','An inline UV unit complements filtration. A separate pump supplies prefiltered water; the lamp does not trap debris or remove ammonia.','pump'],
 ['Two spaces, one clear barrier','The quartz sleeve separates the dry electrical lamp from the wet chamber. Trace the water around the sleeve, never through the lamp socket.','sleeve'],
 ['An invisible source','Violet makes the invisible UV field readable in this model. It does not mean a real lamp can safely be observed through an open housing.','lamp'],
 ['Follow the water','The flow guides and three colored paths show why organisms do not all take one identical route. These paths are illustrative, not a measured hydraulic model.','water'],
 ['Exposure takes time','For an unchanged chamber and lamp, a faster flow generally gives each pass less exposure time. Slower flow also treats less volume per hour. Neither maximum speed nor minimum speed is universally correct.','outlet'],
 ['The sleeve is an optical surface','Fouling attenuates radiation before it reaches the water. The lamp can appear to work while sleeve deposits reduce delivered exposure.','deposit'],
 ['Clear-looking is not a UV test','UV transmittance depends on the water at the relevant wavelength. Visible clarity alone cannot certify it. Suspended particles may also shield organisms.','baffles'],
 ['Damage, not a disappearing act','The enlarged cell study depicts UV-induced lesions in genetic material that can prevent replication. An exposed organism and any debris remain in the water.','micro'],
 ['Power is not performance','The 36 W reference is electrical lamp power, not a dose rating. Validated performance also depends on flow, water, geometry, lamp condition and the target organism.','ballast'],
 ['Care closes the loop','Disconnect power and water before service. Restore water and check the closed assembly before energizing UV. Use the manufacturer’s current instructions for the real unit.','cap']
];
export const SCENARIOS=[
 ['baseline','Clean running system','A reference condition for comparing relative exposure.',{}],
 ['fast','High delivery','More volume moves through per unit time, but exposure per pass falls.',{flow:100}],
 ['slow','Longer contact','A slower pass accumulates more exposure in this model. Throughput falls; this is not a treatment recommendation.',{flow:25}],
 ['dirty','Fouled sleeve','Water can be clear while deposits block UV at the sleeve.',{fouling:85}],
 ['water','Low UV transmission','The water attenuates the field. Visual clarity and measured UV transmission are not interchangeable.',{clarity:20}],
 ['age','Aged lamp','A lamp can remain lit while germicidal output declines.',{output:25}],
 ['off','Lamp disconnected','The water continues moving. No UV exposure accumulates.',{lamp:false}],
 ['stop','Supply stopped','This teaching model holds the lamp off when flow stops. It does not claim a real E-36 has a flow interlock.',{pump:false}]
];
export const QUIZ=[
 ['Does a 36 W label state the dose received by every organism?',false,'Wattage describes electrical power. Delivered exposure depends on the optical and hydraulic conditions.'],
 ['Can a dirty sleeve reduce exposure even with a working lamp?',true,'Deposits reduce transmission across the sleeve.'],
 ['Does UV remove ammonia or catch dead algae?',false,'UV does not replace biological or mechanical filtration.'],
 ['Can organisms on fish or surfaces avoid this chamber?',true,'Only material carried through the unit is directly exposed there. This is not a guaranteed cure for an aquarium disease.'],
 ['Is it safe to open a powered lamp because UV-C is invisible?',false,'Invisible radiation can injure eyes and skin. Disconnect power before service.']
];

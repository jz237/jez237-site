export const PARTS=[
 ['body','01','Reaction chamber','A cloud of fine air bubbles meets seawater inside the clear body. Surface-active organic compounds can collect at the air–water interface.'],
 ['cone','02','Tapered transition','The cone brings the rising bubble mixture toward the narrower neck. Its shape is shown as an original teaching design.'],
 ['neck','03','Foam neck','Water drains back as foam rises. The increasingly concentrated foam crosses the neck lip into the cup.'],
 ['cup','04','Collection cup','Collapsed foam becomes skimmate. Wet skimming carries more water into this cup; a darker cup is not by itself a measure of total removal.'],
 ['lid','05','Vented cup lid','A removable cover contains splashes while allowing air to leave. The exploded view separates the cover and cup for inspection.'],
 ['pump','06','Needle-wheel pump','The rotating pin wheel disperses air into the incoming water. Its clear teaching section exposes the rotor.'],
 ['venturi','07','Air-injection inlet','The moving water draws air through the injection fitting. The airline connects this inlet to the silencer above the sump.'],
 ['silencer','08','Air silencer','Air enters through a muffled intake. A restricted airline reduces bubble delivery even while the water pump runs.'],
 ['plate','09','Bubble diffuser plate','A perforated plate spreads the pump discharge into the chamber. Its openings are actual geometry in this model.'],
 ['outlet','10','Outlet level control','Restricting the water outlet raises the internal level in this illustrative design. Excessive restriction can flood the neck.'],
 ['drain','11','Cup drain','Collected liquid can leave through the cup drain during service. Empty cup clears the simulated collection without changing the settings.'],
 ['sump','12','Sump & support','The skimmer sits in an open sump. External depth influences its internal operating level; a stable installation matters.']
];
export const LESSONS=[
 ['Three paths, one separator','Cyan arrows trace water, amber arrows trace air, and the tea-colored cup shows exported waste. Water returns to the sump while foam reaches the cup.','body'],
 ['Bring air into water','Follow the airline from the silencer to the injection inlet. The pump’s pin wheel disperses the mixture into a fine bubble cloud.','pump'],
 ['Spread the bubble cloud','The diffuser plate distributes the incoming mixture across the body. Open the pump close-up to inspect the pins and perforations.','plate'],
 ['A surface does the collecting','Open the bubble microscope. The illustrated molecule attaches at the air–water interface; its water-avoiding end points toward the air.','macro'],
 ['Let the foam drain','In the neck, liquid drains down while the foam rises. This separates the wet bubble mixture from a drier foam head.','neck'],
 ['Compare wet and dry','Wet and dry presets change operating conditions. Watch both cup volume and color; neither alone tells you the mass of waste exported.','cup'],
 ['Keep the operating level steady','Raise the sump depth or restrict the outlet too much and the water line rises. The flood preset demonstrates the consequence.','outlet'],
 ['A skimmer is one stage','Foam fractionation exports some organic material. It does not replace biological filtration, mechanical solids removal or all nutrient management.','body']
];
export const SCENARIOS=[
 ['balanced','Balanced foam','A stable foam head crosses the neck lip gradually.',{...{air:65,outlet:45,depth:50,organics:60,pump:true,blocked:false}}],
 ['dry','Drier skimming','A lower water line leaves more neck length for drainage. Collection is slower and more concentrated in this model.',{air:78,outlet:27,depth:50,organics:60,pump:true,blocked:false}],
 ['wet','Wetter skimming','A higher operating level sends wetter foam into the cup. Watch the faster, paler collection.',{air:65,outlet:65,depth:50,organics:60,pump:true,blocked:false}],
 ['flood','Level too high','Excessive restriction and a deep sump drive liquid into the neck. The cup can fill and overflow.',{air:65,outlet:100,depth:85,organics:60,pump:true,blocked:false}],
 ['air','Restricted air','The water pump still runs, but the restricted intake reduces bubbles and foam.',{air:65,outlet:45,depth:50,organics:60,pump:true,blocked:true}],
 ['lean','Low organic load','Air alone does not guarantee a persistent collecting foam head.',{air:65,outlet:45,depth:50,organics:5,pump:true,blocked:false}],
 ['off','Power failure','The bubble cloud fades, foam drains and the internal level approaches the sump level.',{air:65,outlet:45,depth:50,organics:60,pump:false,blocked:false}]
];
export const JOURNEY=[
 {title:'Make a bubble',seconds:5,focus:'pump',text:'Air joins the moving water at the injection inlet and is dispersed by the needle wheel.',points:[[-1.55,4.2,-.6],[-1.55,3.64,-.6],[-2.25,3.48,-.58],[-2.6,2.3,-.25],[-2.5,1.13,.28],[-2.5,.8,.28],[-1.8,.8,.2],[0,1.24,0]]},
 {title:'Collect at the surface',seconds:7,focus:'body',text:'The enlarged marker follows a rising bubble through the contact chamber. Some surface-active compounds can associate with its interface.',points:[[0,1.24,0],[.4,1.8,.4],[.1,2.6,.65],[-.4,3.2,.5],[0,4.2,.2]]},
 {title:'Drain and concentrate',seconds:6,focus:'neck',text:'Foam narrows into the neck. Liquid drains back as the head moves toward the collection lip.',points:[[0,4.2,.2],[.2,4.7,.15],[0,5.2,.2],[.1,5.77,.1]]},
 {title:'Export to the cup',seconds:6,focus:'cup',text:'Foam spills over the lip and collapses into skimmate. The collected material is removed when the cup is serviced.',points:[[.1,5.77,.1],[.48,5.83,.1],[.7,5.65,.15],[.75,5.32,.15]]}
];

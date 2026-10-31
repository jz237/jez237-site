export const PARTS=[
 ['vessel','01','Clear reactor','The vertical column keeps the upward flow distributed through the sand. The front is opened in Cutaway so you can inspect the bed.','An original open-return teaching design; not a pressure-vessel specification.'],
 ['media','02','Silica sand bed','Fine mineral grains offer a large colonizable surface. Upward water drag supports their submerged weight once the bed fluidizes.','Sand grains are enlarged for visibility. The animation illustrates mixing, not individual particle trajectories.'],
 ['distributor','03','Inlet distributor','Water enters the bottom plenum and spreads through the distributor before rising through the media.','Uniform distribution matters. Obstruction can create dead zones and uneven lifting. The hole pattern here is illustrative.'],
 ['plenum','04','Bottom plenum','This space below the bed lets incoming water spread before it reaches the sand.','A real distributor must also prevent media from migrating into the plumbing.'],
 ['pump','05','Feed pump','A water pump supplies the upward flow and must overcome the system resistance, including the settled bed at restart.','A percentage setting is used here; it does not represent a pump curve or a recommended flow rate.'],
 ['valve','06','Flow control','Small flow adjustments can substantially change bed height. Watch the free space above the media as you adjust it.','Maximum pump output is not necessarily the correct operating point.'],
 ['check','07','Non-return valve','The feed line includes a non-return valve to illustrate protection against reverse flow toward the pump when power stops.','Actual safeguards and servicing depend on the equipment. This model assumes the valve works.'],
 ['outlet','08','Gravity return','Water leaves near the top and falls through the open return into a receiving basin.','The freeboard below this outlet gives moving sand space to settle back. Excessive flow can carry fines out.'],
 ['lid','09','Vented service cover','A removable splash cover leaves the reactor vented. The outlet remains open to gravity return.','This is not a sealed, pressurized canister. The exploded view is an inspection diagram with operation paused.'],
 ['stand','10','Support & unions','The mounting frame holds the column upright. Unions and bolts make the assembly serviceable.','A filled reactor is heavy. The support and dimensions are illustrative rather than construction instructions.'],
 ['receiver','11','Return basin','Filtered water continues to the rest of the aquarium system. In the excessive-flow experiment, escaping sand becomes visible here.','A biological stage does not replace upstream solids removal, gas exchange or nitrate management.'],
 ['gauge','12','Bed-height scale','The dashed reference records the settled height; the live marker follows the expanded bed.','Expansion is a visual teaching ratio. Actual acceptable bed height depends on media and manufacturer instructions.']
];
export const LESSONS=[
 ['Water does the lifting','Follow the cyan arrows from the feed pump into the bottom plenum. There is no air lift: the pump pushes water upward through the grains.','distributor'],
 ['A force balance','At low flow the grains stay packed. As upward drag grows, it supports their submerged weight and opens spaces between grains. Try the Packed bed experiment.','media'],
 ['An expanded, moving bed','Once suspended, grains continually exchange positions. More flow expands the bed; finer or biofilm-coated media can respond differently.','media'],
 ['Leave room at the top','Freeboard is the clear space above the sand. If the bed reaches the return, fine grains can escape. More flow is not automatically better.','outlet'],
 ['A living surface','Open Grain microscope. Attached microorganisms form a biofilm; water brings dissolved nutrients and oxygen to the surface.','biofilm'],
 ['Two steps, not disappearance','Aerobic nitrification converts ammonia/ammonium to nitrite, then nitrate. It consumes oxygen and alkalinity. Nitrate remains in the water unless another process removes it.','biofilm'],
 ['Power stops. Sand settles.','Turn the pump off. The bed contracts as grains settle. Restart gently in the model and watch the bed lift; real equipment may need extra restart head or a specific procedure.','pump'],
 ['A stage in a larger system','Remove suspended waste upstream, maintain oxygen supply, and monitor the biological filter as it establishes. Clear-looking water alone cannot demonstrate ammonia control.','receiver']
];
export const SCENARIOS=[
 ['balanced','Working bed','A gently expanded bed with useful freeboard.',{flow:58,size:50,maturity:75,oxygen:85,pump:true,blocked:false}],
 ['low','Packed bed','Water passes through, but the low upward velocity cannot suspend this media.',{flow:22,size:50,pump:true,blocked:false}],
 ['high','Too much flow','The bed expands toward the outlet. Watch individual fine grains escape into the return.',{flow:100,size:30,pump:true,blocked:false}],
 ['off','Power failure','Flow decays and the sand settles. The modeled non-return valve prevents reverse flow.',{pump:false,blocked:false}],
 ['blocked','Restricted feed','Reduced delivery produces a poorly lifted bed. Check actual pump and distributor instructions.',{flow:58,size:50,pump:true,blocked:true}],
 ['new','New biofilter','The sand can move normally before the biofilm is established. Motion is not proof of biological capacity.',{flow:58,size:50,maturity:5,oxygen:85,pump:true,blocked:false}]
];

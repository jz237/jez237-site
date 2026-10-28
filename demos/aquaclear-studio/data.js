// Manufacturer references and lesson content are deliberately separate from the renderer.
export const REFERENCES = {
  product: 'https://fluvalaquatics.com/us/shop/product/aquaclear-ac70-power-filter-40-70-us-gal-152-265-l',
  manual: 'https://fluvalaquatics.com/manuals/AC20_30_50_70_Manual_English.pdf',
  faq: 'https://fluvalaquatics.com/us/faqs/aquaclear'
};
export const PARTS = [
  ['case','Filter case','Structure','The chamber behind the aquarium holds water and supports the media basket. The open front in cutaway mode is a teaching window.','The real case is closed. Its inlet compartment delivers water to the space underneath the foam.'],
  ['lid','Acoustic cover','Structure','A removable cover caps the filter. Lift it to reach the basket and intake assembly.','The current AC Series uses a redesigned cover. Here its ribs, grip and inset branding are reconstructed, not manufacturer CAD.'],
  ['basket','Media basket','Structure','One carrier holds the foam below, carbon at the upper rear and BIOMAX at the upper front.','The front compartment faces the aquarium. This is the current AC70 layout, not the older AquaClear 70 stack.'],
  ['foam','Bio-Foam','Mechanical + biological','Open-cell foam intercepts suspended particles before water reaches the upper media. Its surfaces also support biofilm.','Collected waste stays in the filter until it is removed during maintenance. Clear-looking water does not mean waste has disappeared.'],
  ['carbon','Activated carbon','Chemical','Carbon in the rear upper compartment adsorbs certain dissolved substances. The granules have a large internal surface area.','The visible beads are enlarged for clarity. Carbon is not a substitute for the biological filter or regular aquarium care.'],
  ['biomax','BIOMAX ceramic media','Biological','Porous ceramic pieces in the front upper compartment provide surfaces for beneficial bacteria.','In an established, oxygenated filter, nitrifying microbes process ammonia into nitrite and then nitrate. This model does not simulate cycling or water chemistry.'],
  ['utube','Intake U-tube & lever','Hydraulics','The curved tube brings aquarium water over the rim to the impeller well. The lever adjusts the output.','At minimum flow, Fluval describes up to 50% refiltration inside the filter. The orange route illustrates this, not an exact hidden passage.'],
  ['extension','Extension tube','Hydraulics','The extension reaches farther down into the aquarium. It is included with the AC70.','Use a length that suits the actual aquarium. The small glass section here is context, not a correctly sized stocking example.'],
  ['stem','Intake stem','Hydraulics','The slotted stem admits water while supporting the intake sponge.','Its ribs and openings are modeled individually so the intake can be explored in isolation.'],
  ['prefilter','Intake sponge','Mechanical','The sponge around the intake intercepts debris before it reaches the pump.','A blocked intake can reduce delivery. Its dark pores are real surface detail in this model, not missing pieces.'],
  ['impeller','Magnetic impeller','Pump','The motor drives a magnetic rotor and bladed impeller, moving water into the filter chamber.','Rotation is slowed for teaching. The illustrated speed is not motor RPM. The rotor stops whenever the model is separated or in care mode.'],
  ['motor','Motor unit','Pump','The external motor sits below the impeller well. Its magnetic field drives the rotor inside.','Electrical components stay outside the aquarium. Real disassembly requires disconnecting power and following the manual.'],
  ['seal','Motor seal ring','Structure','An O-ring seals the joint where the motor meets the filter case.','It is shown in copper for identification; this color is a teaching convention, not a replacement-part specification.'],
  ['impeller-cover','Impeller cover','Pump','This cover locates the intake above the impeller well and separates the pump chamber from the inlet space.','The internal volute and water channels are simplified. Use the manufacturer’s parts diagram for ordering or service.'],
  ['leveler','Leveling device','Structure','The adjustable support bears against the aquarium and keeps the filter level.','The real manual specifies leveling the mounted filter. The glass and rim in this scene are illustrative.']
].map(([id,name,group,description,detail],i)=>({id,name,group,description,detail,number:String(i+1).padStart(2,'0')}));
export const LESSONS = [
  {title:'A filter on the rim',tag:'01 / THE WHOLE MACHINE',part:'case',mode:'assembled',text:'The motor and media live behind the aquarium. Only the intake enters the water. A broad spillway returns the filtered water across the rim.',tip:'Orbit the model to see the difference between the aquarium side and the filter chamber.'},
  {title:'Lift, then push',tag:'02 / INTAKE & IMPELLER',part:'impeller',mode:'flow',text:'Water reaches the impeller along its axis and leaves toward the chamber around its perimeter. This open section reveals the shaft, magnetic rotor and moving blades. The surrounding motor drives the rotor magnetically.',tip:'Rotation is slowed for study; the open housing and internal channel are an approximate teaching section. Return to Follow water to see this pump in the full circuit.'},
  {title:'Catch the particles',tag:'03 / MECHANICAL FILTRATION',part:'foam',mode:'cutaway',text:'Water rises through the foam. Its pores trap debris while providing room for water and biofilm. A loaded sponge adds resistance and needs attention.',tip:'The camera looks beneath the foam: enlarged brown particles approach its upstream face and remain trapped. Compare loaded foam in the Flow lab to see more deposits, reduced delivery and bypass.'},
  {title:'Two jobs above the foam',tag:'04 / CHEMISTRY & BIOLOGY',part:'biomax',mode:'exploded',text:'The current AC70 separates carbon at the rear from BIOMAX at the front, both above the foam. Their jobs differ: adsorption and habitat for nitrifying bacteria.',tip:'The close-up separates both compartments above the foam. Ceramic pieces have open bores; carbon is granular. Their surface detail is illustrative, not microscopic imagery.'},
  {title:'Some water takes another lap',tag:'05 / REFILTRATION',part:'utube',mode:'flow',flow:0,text:'At the minimum lever setting, up to half the water can circulate through the filter again. The amber loop represents this internal refiltration.',tip:'Move the flow lever in the Flow lab. Intermediate animation values are illustrative, not calibrated output measurements.'},
  {title:'Return to the aquarium',tag:'06 / THE SPILLWAY',part:'case',mode:'flow',flow:100,text:'Water leaves across the wide lip and disturbs the aquarium surface. Filtration moves and processes water; it does not eliminate the need for testing or water changes.',tip:'The AC70 manual calls for a water surface no more than 1.5 inches / 38 mm below the bottom of the output.'}
];
export const CARE = [
  {title:'Disconnect before handling',part:'motor',text:'Disconnect aquarium appliances before putting hands in the water or removing parts. The demo stops the pump and water animation in every care step.',pose:0},
  {title:'Lift the cover & basket',part:'basket',text:'The removable basket gives access to the media. The manufacturer’s manual governs rinsing and replacement intervals. Do not use soap or detergent.',pose:1},
  {title:'Inspect the pump & intake',part:'impeller',text:'With power disconnected and the case emptied, the manual describes removing the motor with a quarter-turn and cleaning the impeller well and intake. The exploded positions are explanatory, not a removal trajectory.',pose:2},
  {title:'Reassemble, fill & prime',part:'utube',text:'Reassemble and fill the case completely with water. The manual specifies minimum flow for initial priming, then adjustment after priming. Never run the filter dry. The demonstration stays unpowered until you leave Care.',pose:0}
];
export function flowModel(value, restricted=false) {
  const setting=Math.min(100,Math.max(0,Number(value)||0))/100;
  return {setting,recirculation:(1-setting)*.5,delivery:(.5+.5*setting)*(restricted?.45:1)};
}

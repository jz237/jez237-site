// Plain-language explanations for the rules of thumb and terms that appear in an answer. The app underlines
// each phrase where it first appears (chart label, result card or message) and shows the text on hover, focus
// or tap. A phrase must be written exactly as the calculator prints it; scripts/aquarium-toolbox/terms.test.mjs
// fails when an entry no longer matches anything, or when a number here drifts from the calculator.
import {flowGuide} from './calculators.mjs';

const usual=(us,a)=>{const [lo,hi]=flowGuide[a.kind]||flowGuide.community;
  const who={community:'Filter makers suggest it for community and planted tanks.',messy:'Goldfish, cichlids and other messy fish need more filtering than a community tank.',softreef:'Reef suppliers suggest it so soft corals and LPS sway without being blasted.',sps:'SPS corals come from surf zones and need strong, changing flow.',return:'This counts the return pump only; powerheads supply the rest of a reef’s flow.'}[a.kind]||'';
  return `The usual range for this kind of tank is ${lo}–${hi} times its water volume every hour. ${who} It is a common starting point, not a requirement.`;};
const goldfish='The usual fancy-goldfish guideline: 20 US gallons (75 L) for the first fish and 10 US gallons (38 L) for each one after. Goldfish are heavy, messy fish, so the inch rules are not used for them.';
const limit=(us,a)=>a.kind==='marine'?'For saltwater fish this is the 5-gallon rule alone. 100% means the tank is fully stocked by that rule.':'The stricter of the gallon rule and the surface rule. 100% means the tank is fully stocked by those rules; they are rough guides for small community fish, not exact limits.';
const allowed=(us,a)=>`The ${a.kind==='marine'?'5-gallon rule':'stricter of the two rules'}, divided by the adult length you entered and rounded down to whole fish.`;
const degree='One degree (dKH or dGH) is 17.85 ppm counted as calcium carbonate, or 0.357 meq/L. On most drop test kits each drop is one degree.';
const dilution='Changing water dilutes whatever is dissolved in it: the reading moves toward the new water’s reading by the share of water you change. Half the water halves the gap.';

export const glossary={
  tank:[
    ['Brim-full, empty tank','The bare tank filled to the very top with nothing in it. Tank sizes on the box are close to this figure, and the real water volume is always less.'],
    ['Taken up by gravel & décor','Water pushed out by what is in the tank, from the percentage you entered. Gravel still holds water between its grains, so this is an estimate.']],
  substrate:[
    ['Substrate needed','The volume of the bed: tank length × width × the average of the front and back depth. A bed of 2–3 in (5–8 cm) suits most planted and community tanks.'],
    ['Estimated dry weight',(us)=>us?'Bed volume × a typical dry weight for the material: about 12.5 lb per US gallon for gravel and sand, 7.5 for planted-tank soil. Brands differ.':'Bed volume × a typical dry weight for the material: about 1.5 kg per litre for gravel and sand, 0.9 for planted-tank soil. Brands differ.']],
  stocking:[
    ['Gallon rule',(us)=>us?'A classic rule of thumb: 1 inch of adult fish for every US gallon of water. It was made for small, slim community fish under about 4 inches.':'A classic rule of thumb: 1 inch of adult fish for every US gallon of water, which is about 1 cm of fish for every 1.5 litres. It was made for small, slim community fish under about 10 cm.'],
    ['Surface rule',(us)=>us?'1 inch of adult fish for every 12 square inches of water surface (tank length × width). Oxygen gets in through the surface, so a tall, narrow tank holds fewer fish than a long, shallow one with the same gallons.':'1 inch of adult fish for every 12 square inches of water surface, which is about 1 cm of fish for every 30 cm² (tank length × width). Oxygen gets in through the surface, so a tall, narrow tank holds fewer fish than a long, shallow one with the same litres.'],
    ['5-gallon rule','A cautious saltwater rule of thumb: 1 inch of adult fish for every 5 US gallons, about 1 cm for every 7.5 litres. There is no agreed saltwater rule; this is the careful end of common advice.'],
    ['rule-of-thumb limit',limit],
    ['Fish this size the rules allow',allowed],['Fish this size the rule allows',allowed],
    ['Your fish, nose to tail','The number of fish × the adult length you entered. The rules count full-grown fish, not the size they are in the store.'],
    ['Tank the guideline asks for',goldfish],['Fancy goldfish this tank suits',goldfish]],
  weight:[
    ['Load on the floor under the stand','Total weight ÷ the area the stand covers. House floors are commonly designed for about 40 lb per square foot (195 kg/m²) averaged over a whole room, which is not a limit for one spot, so this number cannot simply be compared with it. Put heavy tanks across the joists near a supporting wall, and ask a builder about large ones.']],
  sump:[
    ['Water draining back','When the pump stops, the water above the overflow and in the pipes runs down into the sump: display floor area × the level drop, plus the water in the plumbing.'],
    ['Drain-back','When the pump stops, the water above the overflow and in the pipes runs down into the sump: display floor area × the level drop, plus the water in the plumbing.'],
    ['Space needed with margin','The drain-back plus your safety margin, to cover siphoning and overfilling you did not measure.'],
    ['With margin','The drain-back plus your safety margin, to cover siphoning and overfilling you did not measure.']],
  change:[['After the change',dilution]],
  target:[['Water to change',dilution]],
  series:[['Reading at the end','Each change only removes its share of what is left, and some of the new water from the change before. That is why several small changes lower a reading less than one change of the same total size.']],
  nitrate:[
    ['Highest it will settle at','With the same water change every time, nitrate stops climbing where each change removes exactly what built up since the last one: new-water nitrate + the rise between changes ÷ the share of water changed.'],
    ['Lowest, right after a change','The settled peak minus what one water change removes. The tank swings between this number and the highest one.']],
  mix:[['Blend reading','A blend lands between the two waters’ readings, in proportion to how much of each you use: half and half lands exactly in the middle.']],
  ro:[
    ['Removed by the unit','Called rejection: the share of dissolved solids the membrane takes out, worked out from your two TDS readings. Most membranes are rated to remove 96–99%.'],
    ['Waste water','An RO membrane flushes the minerals it rejects down the drain. Standard units send about 4 parts to waste for each part of RO water; water-saver units about 2, high-efficiency membranes about 1.']],
  label:[['Dose for your water','The label’s own dose, scaled in proportion: your water ÷ the water on the label × the label dose.']],
  ammonia:[
    ['Toxic free ammonia (NH₃)','A test kit reads total ammonia: toxic NH₃ plus far less toxic ammonium (NH₄⁺). pH and temperature decide the split. The hobby scale for free ammonia: under 0.02 ppm is low, 0.05 stresses fish over time, 0.2 is dangerous.'],
    ['Share that is toxic','The part of your reading that is NH₃ at your pH and temperature. Each full point of pH multiplies it by nearly ten, and warmer water raises it too.'],
    ['Free ammonia as nitrogen','The same free ammonia counted by its nitrogen alone (NH₃ × 0.82), the way laboratories and scientific papers report it.'],
    ['Toxic part','The part of your reading that is toxic NH₃ at your pH and temperature. The rest is ammonium, which is far less harmful.']],
  hardness:[['Degrees',degree],['As calcium carbonate','Hardness and alkalinity are reported as if all of it were calcium carbonate, in ppm, so different kits can be compared. 17.85 ppm equals one degree.'],['Alkalinity','The water’s acid-buffering capacity in milliequivalents per litre, the unit many reef test kits use. 1 meq/L is 2.8 dKH, or 50 ppm as calcium carbonate.']],
  stock:[['Stock solution','Dilution keeps the amount of dissolved material the same: stock strength × stock volume = final strength × final volume.']],
  salt:[['Roughly, by the cup','A level US cup of dry salt mix weighs about 285 g (10 oz), but 270–300 g depending on the brand and how it has settled. A scale is more reliable.']],
  adjust:[['Water to swap','Swapping water moves the tank’s salinity toward the salinity of the water you add, by the share of the tank you swap. The closer the added water is to your target, the more of it you need.']],
  salinity:[['Salinity of the mix','A weighted average: each water’s salinity counts in proportion to its volume.']],
  sg:[
    ['Specific gravity','How heavy the water is compared with pure water, which is what a hydrometer or refractometer reads. Natural seawater is about 1.026. This tool uses 1 + 0.000754 × salinity (ppt) at 77 °F (25 °C).'],
    ['Salinity','Grams of dissolved salt in each kilogram of water, written in parts per thousand (ppt). Natural seawater is about 35 ppt.']],
  ato:[['Salinity with no top-off','Only water evaporates; the salt stays behind. The same salt in less water reads higher, which is why the top-off is always fresh water.']],
  supplement:[['Rise per day','How much the reading goes up each day when the total dose is spread over the days you chose. Many reef keepers limit alkalinity to about 1 dKH a day; for calcium and magnesium follow the product’s own daily limit.']],
  consumption:[['Used per day','The drop between your two tests, scaled to 24 hours. Corals and coralline algae use alkalinity, calcium and magnesium as they grow; this is the amount to replace.']],
  turnover:[
    ['Your tank turns over',(us)=>us?'Turnover is how many times an hour your filter or pumps move the tank’s whole volume: flow ÷ water in the tank. A 200 GPH filter on 40 gallons is 5 times an hour.':'Turnover is how many times an hour your filter or pumps move the tank’s whole volume: flow ÷ water in the tank. A 750 L/h filter on 150 litres is 5 times an hour.'],
    ['Usual low end for this tank',usual],['Usual high end for this tank',usual],['Usual low',usual],['Usual high',usual]],
  head:[
    ['Total head height','Head is everything the pump has to push against, written as a height of water: the lift from the sump to the outlet plus the friction in the pipe and fittings. A pump’s chart shows the flow it gives at each head height.'],
    ['From the pipe itself','Friction along the pipe wall, from the Darcy–Weisbach equation. It rises steeply with flow and falls sharply with wider pipe.'],
    ['From elbows & valves','Each fitting stirs the water and costs a little pressure. Counted here: 0.9 velocity heads per 90° elbow, 0.4 per 45° elbow, 0.2 per open valve, 2 per check valve, and 1.5 for the pipe inlet and outlet.'],
    ['Lift','The vertical distance from the water in the sump up to where the pipe empties into the tank.']],
  pump:[['Flow you can expect','A straight line between the two chart points on either side of your head height. A pump’s real curve bends a little, so treat this as an estimate.']],
  pipe:[['Water speed','Flow ÷ the area of the pipe’s opening. Many plumbers keep pumped aquarium lines under about 6 ft/s (2 m/s): faster water is noisier and wastes pump power.']],
  heater:[
    ['Estimated heat needed','A rule of thumb fitted to heater makers’ sizing charts for covered glass tanks: watts ≈ 0.85 × (US gallons)^⅔ × the °F the water must stay above the coldest room temperature.'],
    ['Suggested heater size','The next common heater size at or above the estimate: 25, 50, 75, 100, 150, 200, 250 or 300 W. Above 300 W the load is split between several heaters.'],
    ['Suggested','The next common heater size at or above the estimate: 25, 50, 75, 100, 150, 200, 250 or 300 W. Above 300 W the load is split between several heaters.'],
    ['That works out to',(us)=>us?'The estimate divided by your water volume. A common shortcut is 3–5 watts per gallon, but small tanks need more per gallon than large ones because they lose heat faster for their size.':'The estimate divided by your water volume. A common shortcut is about 1 watt per litre, but small tanks need more per litre than large ones because they lose heat faster for their size.']],
  energy:[['Electricity per day','A kilowatt-hour (kWh) is 1,000 watts running for one hour, and it is the unit your bill charges for. Watts ÷ 1,000 × hours on.']],
  heatup:[['Electricity used','It takes about 0.00245 kWh to warm one US gallon by 1 °F (1.16 Wh per litre per °C), divided by the share of the heat that stays in the water.']],
  watercost:[['Tap water used per month','Your water changes plus top-off, plus the waste water an RO unit sends down the drain for each part it makes. A month is counted as 30.44 days.']],
  co2:[
    ['Estimated CO₂','From the link between KH, pH and dissolved CO₂: ppm = 3 × KH (dKH) × 10^(7 − pH). It only holds when carbonate is the main buffer. Most planted-tank keepers aim for 20–30 ppm with fish in the tank.'],
    ['pH +0.3','The estimate if your pH reading were 0.3 higher. pH kits are easily off by that much, and it halves the answer.'],
    ['pH −0.3','The estimate if your pH reading were 0.3 lower. pH kits are easily off by that much, and it doubles the answer.']],
  co2cylinder:[
    ['Time left','The CO₂ left, minus the reserve you chose to keep, ÷ what you use each day.'],
    ['CO₂ left in the cylinder','The cylinder’s weight now minus its empty (tare) weight. CO₂ is a liquid under pressure, so only weight shows how much is left.']],
  fertilizer:[['Nutrient added','The amount of the nutrient itself, not of the fertilizer: the rise you asked for × your water volume. The dry dose is this ÷ the nutrient’s share of the fertilizer.']],
  doser:[['Pump speed','What your pump really delivers, from your calibration test: liquid collected ÷ the time the test ran.']],
  dli:[['Daily light (DLI)','Daily light integral: all the plant-usable light that lands on a spot in a day. PAR × the seconds the light is on ÷ 1,000,000, in moles of light per square metre per day.']]
};
// Longest phrase first, so "Usual low end for this tank" wins over "Usual low".
export function termsFor(id,us=true,inputs={}){
  return (glossary[id]||[]).map(([phrase,text])=>[phrase,typeof text==='function'?text(us,inputs):text]).sort((a,b)=>b[0].length-a[0].length);
}
